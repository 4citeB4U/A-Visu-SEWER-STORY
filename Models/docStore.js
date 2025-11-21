/*
  Front-end docStore: chunking, embedding, and vector search stored in IndexedDB.

  - addDocument(docId, text, metadata)
  - search(query, topK)

  Embedding: attempts to use a local Xenova embedding pipeline (dynamic import).
  If unavailable, falls back to a lightweight char-code embedding (best-effort).

  Note: for production use, consider swapping in a small sentence-transformer
  model via Xenova and caching the pipeline outside this module.
*/

// Basic IndexedDB helper
function openDb() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('agentlee_rag', 1);
    req.onupgradeneeded = (ev) => {
      const db = req.result;
      if (!db.objectStoreNames.contains('chunks')) {
        db.createObjectStore('chunks', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function chunkText(text, approxWords = 300) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  for (let i = 0; i < words.length; i += approxWords) {
    chunks.push(words.slice(i, i + approxWords).join(' '));
  }
  if (chunks.length === 0) chunks.push(text.slice(0, 1000));
  return chunks;
}

async function getEmbeddingPipeline() {
  // Try to load Xenova transformers dynamically if present in the bundle/runtime.
  try {
    // eslint-disable-next-line no-undef
    if (typeof window !== 'undefined' && window.__XENOVA_EMBED_PIPELINE) {
      return window.__XENOVA_EMBED_PIPELINE;
    }
  } catch (e) { /* ignore */ }

  try {
    const mod = await import('@xenova/transformers');
    // Try to create a feature-extraction pipeline for embeddings.
    if (mod && typeof mod.pipeline === 'function') {
      const p = await mod.pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      // store globally for reuse
  try { window.__XENOVA_EMBED_PIPELINE = p; } catch (e) {}
      return p;
    }
  } catch (e) {
    console.warn('Xenova embedding pipeline not available, falling back to lightweight embed');
  }
  return null;
}

function charCodeEmbed(text) {
  // fallback: produce a small vector of summed char codes by buckets
  const buckets = 64;
  const vec = new Array(buckets).fill(0);
  for (let i = 0; i < text.length; i++) {
    const b = i % buckets;
    vec[b] += text.charCodeAt(i);
  }
  // normalize
  const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
  return vec.map(v => v / norm);
}

function cosine(a, b) {
  if (!a || !b || a.length !== b.length) return -1;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  const denom = Math.sqrt(na) * Math.sqrt(nb) || 1;
  return dot / denom;
}

async function embedText(text) {
  const pipeline = await getEmbeddingPipeline();
  if (pipeline) {
    try {
      // pipeline(text) may return nested arrays; flatten to 1D
      const out = await pipeline(text);
      // Some pipelines return [[...]] or { data: [...] }
      let vec = out;
      if (vec && vec.data) vec = vec.data;
      if (Array.isArray(vec) && Array.isArray(vec[0])) vec = vec[0];
      // normalize
      const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
      return vec.map(v => v / norm);
    } catch (e) {
      console.warn('Embedding pipeline failed, falling back', e);
      return charCodeEmbed(text);
    }
  }
  return charCodeEmbed(text);
}

export async function addDocument(docId, text, metadata = {}) {
  const chunks = chunkText(text, 300);
  const embeddings = await Promise.all(chunks.map(c => embedText(c)));
  const db = await openDb();
  const tx = db.transaction('chunks', 'readwrite');
  const store = tx.objectStore('chunks');
  const now = Date.now();
  for (let i = 0; i < chunks.length; i++) {
    const id = `${docId}__${i}`;
    store.put({ id, docId, text: chunks[i], embedding: embeddings[i], metadata, createdAt: now });
  }
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error('tx error'));
  });
}

/**
 * Index an uploaded spreadsheet (ArrayBuffer) by parsing sheets and adding each
 * sheet as a separate document into the chunk store. Uses SheetJS (xlsx).
 * Returns list of { docId, sheetName, chunksIndexed } records.
 */
export async function addSpreadsheetFromBuffer(docId, arrayBuffer, metadata = {}) {
  try {
    const XLSX = await import('xlsx');
    const wb = XLSX.read(arrayBuffer, { type: 'array' });
    const results = [];
    for (const sheetName of wb.SheetNames) {
      const sheet = wb.Sheets[sheetName];
      // Convert sheet to CSV for lightweight text indexing
      const csv = XLSX.utils.sheet_to_csv(sheet);
      const childDocId = `${docId}::${sheetName}`;
      await addDocument(childDocId, csv, { ...metadata, sheetName, sourceDoc: docId });
      results.push({ docId: childDocId, sheetName, chunksIndexed: true });
    }
    return results;
  } catch (e) {
    console.error('[docStore] addSpreadsheetFromBuffer failed', e);
    throw e;
  }
}

/**
 * Helper: index a file from a Notepad-like FS adapter.
 * fsAdapter is expected to expose `getFile(path)` which returns either string or ArrayBuffer/Uint8Array.
 */
export async function indexFileFromNotepad(path, fsAdapter, options = {}) {
  if (!fsAdapter || typeof fsAdapter.getFile !== 'function') {
    throw new Error('fsAdapter with getFile(path) is required');
  }
  const file = await fsAdapter.getFile(path);
  if (!file) throw new Error(`File not found: ${path}`);
  // Detect simple spreadsheet by extension
  const lower = (path || '').toLowerCase();
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    // file may be ArrayBuffer or a base64/string; normalize
    let ab;
    if (file instanceof ArrayBuffer) ab = file;
    else if (file.buffer && file.buffer instanceof ArrayBuffer) ab = file.buffer;
    else if (typeof file === 'string') {
      // assume base64 or CSV text; try to decode base64 if starts with data: or contains non-newline chars
      try {
        // If it looks like CSV text, index directly
        if (file.indexOf('\n') !== -1 && file.split('\n').length > 1) {
          await addSpreadsheetFromBuffer(path, new TextEncoder().encode(file).buffer, { originalPath: path });
          return { indexed: true };
        }
        const b64 = file.replace(/^data:.*;base64,/, '');
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        ab = bytes.buffer;
      } catch (e) {
        throw new Error('Failed to parse spreadsheet string content');
      }
    }
    if (!ab) throw new Error('Could not obtain ArrayBuffer for spreadsheet');
    return await addSpreadsheetFromBuffer(path, ab, { originalPath: path });
  }

  // For other file types (csv, txt) treat as text
  let text;
  if (typeof file === 'string') text = file;
  else if (file instanceof ArrayBuffer) text = new TextDecoder().decode(file);
  else if (file.buffer) text = new TextDecoder().decode(file.buffer);
  else text = String(file);

  await addDocument(path, text, { originalPath: path });
  return { indexed: true };
}

export async function search(query, topK = 5) {
  const qEmb = await embedText(query);
  const db = await openDb();
  const tx = db.transaction('chunks', 'readonly');
  const store = tx.objectStore('chunks');
  return new Promise((resolve, reject) => {
    const req = store.getAll();
    req.onsuccess = () => {
      const all = req.result || [];
      const scored = all.map(chunk => ({ ...chunk, score: cosine(qEmb, chunk.embedding) }));
      scored.sort((a, b) => b.score - a.score);
      resolve(scored.slice(0, topK));
    };
    req.onerror = () => reject(req.error || new Error('getAll failed'));
  });
}

export async function clearStore() {
  const db = await openDb();
  const tx = db.transaction('chunks', 'readwrite');
  tx.objectStore('chunks').clear();
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error || new Error('clear failed'));
  });
}

export default {
  addDocument,
  search,
  clearStore
};
