import { agentTeam } from './agentTeam.js';
import { claimEvidence, matchWebSourceFromName, webSources } from './referencesRegistry.js';
import { suggestWebSources } from './webSources.js';

/**
 * answerWithEvidence
 * - Runs the existing local retrieval (agentTeam.retrieveLocalData)
 * - Matches claimEvidence entries relevant to the question
 * - Calls agentTeam.answer with an augmented context that includes local data
 * - Returns the model answer plus structured evidence (matched claims, filePaths, urls)
 */
export async function answerWithEvidence(question, context = '') {
  // 1) get local data preview (this returns preview text for files)
  let localData = '';
  try {
    localData = await agentTeam.retrieveLocalData(question, context);
  } catch (e) {
    localData = `(Failed to retrieve local data: ${String(e)})`;
  }

  // 2) match claims (simple matching heuristics: title/claim substring or token overlap)
  const q = (question || '').toLowerCase();
  function tokens(s){ return (s||'').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean); }
  const qTokens = new Set(tokens(q));

  const scored = claimEvidence.map(claim => {
    const combined = `${claim.pageTitle} ${claim.claim}`.toLowerCase();
    // substring fast-path
    let score = 0;
    if (combined.includes(q)) score += 20;
    // token overlap
    const cTokens = tokens(combined);
    let overlap = 0;
    for (const t of cTokens) if (qTokens.has(t)) overlap++;
    score += overlap;
    return { claim, score };
  }).filter(s => s.score > 0)
    .sort((a,b) => b.score - a.score);

  const relevantClaims = scored.slice(0,5).map(s => s.claim);

  // 3) build augmented context for the models
  const evidenceTextParts = [];
  if (localData) evidenceTextParts.push(`LOCAL_DATA_PREVIEW:\n${localData}`);
  if (relevantClaims.length) {
    evidenceTextParts.push('MATCHED_CLAIMS:');
    for (const c of relevantClaims) {
      evidenceTextParts.push(`- Page ${c.pageNumber} \"${c.pageTitle}\": ${c.claim}`);
      if (c.sources && c.sources.length) evidenceTextParts.push(`  Sources: ${c.sources.join('; ')}`);
      if (c.filePaths && c.filePaths.length) evidenceTextParts.push(`  Files: ${c.filePaths.join('; ')}`);
    }
  }

  const augmentedContext = `${context}\n\n---- EVIDENCE START ----\n${evidenceTextParts.join('\n')}
\n---- EVIDENCE END ----`;

  // 4) call the agent ensemble
  const result = await agentTeam.answer(question, augmentedContext);

  // 5) collect URLs mapped from claim sources
  const urls = new Set();
  for (const c of relevantClaims) {
    if (!c.sources) continue;
    for (const s of c.sources) {
      const m = matchWebSourceFromName(s);
      if (m && m.url) urls.add(m.url);
    }
  }

  // Also include any webSources whose topic tags overlap question tokens
  for (const w of webSources) {
    const tags = (w.topicTags || []).map(t => t.toLowerCase());
    for (const t of tags) if (qTokens.has(t)) urls.add(w.url);
  }

  // Also suggest curated web sources based on the question
  let suggested = [];
  try {
    suggested = suggestWebSources(question, 6);
    for (const s of suggested) if (s && s.url) urls.add(s.url);
  } catch (e) { /* non-critical */ }

  return {
    answer: result.best,
    all: result.all,
    evidence: {
      localDataPreview: localData,
      matchedClaims: relevantClaims,
      urls: Array.from(urls),
      webSources: suggested
    }
  };
}

// Optional helper: fetch a whitelisted webSource and return cleaned text for indexing
export async function fetchAndCleanWebSource(source) {
  // source: {url, name, category}
  if (!source || !source.url) throw new Error('Invalid source');
  // Basic same-origin / CORS consideration: browser may block some hosts.
  const res = await fetch(source.url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  let html = await res.text();
  // Strip scripts/styles and tags
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text;
}

export default {
  answerWithEvidence,
  fetchAndCleanWebSource
};
