import { addDocument } from './docStore.js';

// Tiny CSV -> plain text helper (no external deps)
function csvToText(csv, options) {
  const rows = csv.split(/\r?\n/).filter(r => r.trim().length > 0);
  if (rows.length === 0) return '';

  const header = rows[0].split(',').map(h => h.trim());
  const maxRows = (options && options.maxRows) || 50;
  const bodyRows = rows.slice(1, 1 + maxRows).map(r => r.split(','));

  const lines = [];
  lines.push(`Columns: ${header.join(', ')}`);

  bodyRows.forEach((cols, idx) => {
    const pairs = header.map((h, i) => `${h}=${(cols[i] || '').trim()}`);
    lines.push(`Row ${idx + 1}: ${pairs.join('; ')}`);
  });

  if (rows.length - 1 > maxRows) {
    lines.push(`… truncated; total rows ≈ ${rows.length - 1}`);
  }

  return lines.join('\n');
}

async function loadCsvAndIndex(docId, url, meta) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`[docStoreBootstrap] Failed to fetch ${url}:`, res.status);
      return;
    }
    const csvText = await res.text();
    const plainText = csvToText(csvText, { maxRows: 200 });

    await addDocument(docId, plainText, meta);
    console.info(`[docStoreBootstrap] Indexed ${docId} from ${url}`);
  } catch (err) {
    console.error(`[docStoreBootstrap] Error indexing ${url}:`, err);
  }
}

/**
 * Initialize the docStore by indexing core files (CSV) into IndexedDB.
 * This runs in the background and the app should not block on it.
 */
export async function initDocStore() {
  try {
    // In dev you may wish to clear the store occasionally; keep commented out here
    // await clearStore();

    // Use Vite base URL so the bootstrap works when the app is deployed under a subpath
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';

    await Promise.all([
      loadCsvAndIndex('bid_amounts', `${base}data/bid_amounts.csv`, {
        type: 'csv', topic: 'bids', description: 'Bid amounts and competitors for Visu-Sewer projects'
      }),
      loadCsvAndIndex('cctv_inspection', `${base}data/cctv_inspection.csv`, {
        type: 'csv', topic: 'cctv', description: 'Defect types, severity, and affected length by segment'
      }),
      loadCsvAndIndex('contractor_schedule', `${base}data/contractor_schedule.csv`, {
        type: 'csv', topic: 'schedule', description: 'Task schedule, start/end dates, and % complete over time'
      }),
      loadCsvAndIndex('project_costs', `${base}data/project_costs.csv`, {
        type: 'csv', topic: 'costs', description: 'Yearly budgeted vs actual spend and variance'
      })
    ]);

    console.info('[docStoreBootstrap] Core CSV documents indexed.');
  } catch (err) {
    console.error('[docStoreBootstrap] Unexpected error:', err);
  }
}

export default { initDocStore };
