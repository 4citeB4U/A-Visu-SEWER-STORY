/* LEEWAY HEADER
TAG: AI.AGENT.TEAM
COLOR_ONION_HEX: NEON=#39FF14 FLUO=#0DFF94 PASTEL=#C7FFD8
ICON_FAMILY: lucide
ICON_GLYPH: users
ICON_SIG: CD534113
5WH: WHAT=Orchestrates Gemma, Llama, PHI-3 models in parallel;
WHY=Ensemble Q&A, context embedding, consensus logic;
WHO=LeeWay Industries + VisuSewer;
WHERE=b:/Visu-Sewer Strategic Asset & Growth Deck/models/agentTeam.js;
WHEN=2025-11-09;
HOW=Parallel model calls, embedding, aggregation
AGENTS: GEMMA, CLAUDE, GPT4, LLAMA, PHI3
SPDX-License-Identifier: MIT
*/

import { search as docSearch } from './docStore.js';
import { embedderLLM } from './embedder.js';
import { gemmaLLM } from './gemma.js';
import { llamaLLM } from './llama.js';
import { phi3LLM } from './phi3.js';

// Simple embedding using text vectorization (can be replaced with more advanced embedding)
function embedText(text) {
    // Basic: split words, map to char codes, sum
    return text.split(' ').map(w => w.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
}

export class AgentTeam {
    constructor() {
        this.models = [gemmaLLM, llamaLLM, phi3LLM];
        this.isLoaded = false;
    }

    async initialize() {
        await Promise.all(this.models.map(m => m.initialize()));
        this.isLoaded = true;
    }

    async embedContext(context) {
        // Embed context for each model
        return this.models.map(model => ({
            model: model.getStatus().model,
            embedding: embedText(context)
        }));
    }

    async askAllModels(question, context = '') {
        if (!this.isLoaded) await this.initialize();
        // Embed context
        const contextEmbedding = await this.embedContext(context);
        // Retrieve relevant local data (RAG) to augment context
        const localData = await this.retrieveLocalData(question, context);
        const augmentedContext = `${context}\n\n---LOCAL_DATA_START---\n${localData}\n---LOCAL_DATA_END---`;

        // Run all models in parallel
        const results = await Promise.all([
            gemmaLLM.chat(question, [{ role: 'system', content: augmentedContext }]),
            llamaLLM.chat(question, [{ role: 'system', content: augmentedContext }]),
            phi3LLM.chat(question, [{ role: 'system', content: augmentedContext }])
        ]);
        // Aggregate responses
        return {
            responses: results,
            embeddings: contextEmbedding
        };
    }

    // Local retriever that delegates to the front-end docStore vector search.
    // Falls back to the legacy CSV-preview behavior if no docStore hits are found.
    async retrieveLocalData(question, context = '') {
        try {
            const query = `${question} ${context}`.trim();
            const hits = await docSearch(query, 6);
            if (hits && hits.length) {
                // Build a compact preview from top hits
                return hits.map((h, i) => `Chunk ${i + 1} (doc=${h.docId}, score=${(h.score||0).toFixed(3)}):\n${h.text.slice(0, 800)}`).join('\n\n');
            }
        } catch (e) {
            console.warn('docStore search failed, falling back to file previews', e);
        }

        // Fallback: legacy CSV preview behavior
        let base = '/';
        try { base = import.meta.env.BASE_URL || '/'; } catch (e) { base = (window && window.BASE_URL) || '/'; }

        const fileMap = {
            'cctv': 'cctv_inspection.csv',
            'inspection': 'cctv_inspection.csv',
            'project': 'project_costs.csv',
            'cost': 'project_costs.csv',
            'bid': 'bid_amounts.csv',
            'schedule': 'contractor_schedule.csv',
            'evidence': 'Evidence_Log.xlsx'
        };

        const qLower = (question || '').toLowerCase() + ' ' + (context || '').toLowerCase();
        const hits = new Set();
        for (const key of Object.keys(fileMap)) {
            if (qLower.includes(key)) hits.add(fileMap[key]);
        }
        if (hits.size === 0) {
            hits.add('project_costs.csv');
            hits.add('cctv_inspection.csv');
        }

        const summaries = [];
        for (const fname of hits) {
            const url = `${base}data/${fname}`;
            try {
                const res = await fetch(url);
                if (!res.ok) {
                    summaries.push(`(Could not fetch ${fname}: HTTP ${res.status})`);
                    continue;
                }
                const text = await res.text();
                const lines = text.split(/\r?\n/).filter(Boolean);
                const preview = lines.slice(0, Math.min(6, lines.length)).join('\n');
                summaries.push(`File: ${fname}\n${preview}`);
            } catch (e) {
                summaries.push(`(Error fetching ${fname}: ${String(e)})`);
            }
        }

        try {
            const refUrl = `${base}data/references.json`;
            const r = await fetch(refUrl);
            if (r.ok) {
                const j = await r.json();
                const topRefs = (j.pageReferences || []).slice(0, 5).map(p => `${p.pageNumber}: ${p.pageTitle}`).join('; ');
                if (topRefs) summaries.push(`References (top pages): ${topRefs}`);
            }
        } catch (e) { /* optional */ }

        return summaries.join('\n\n');
    }

    async answer(question, context = '') {
        const { responses } = await this.askAllModels(question, context);
        // Consensus strategy: use embedder to select the most "central" response
        // (the one with highest average semantic similarity to the other responses).
        let best = null;
        try {
            // Ensure embedder initialized
            await embedderLLM.initialize();
            const texts = responses.map(r => (r && r.text) ? r.text : String(r));
            const embObjs = await embedderLLM.embedBatch(texts);
            const embs = embObjs.map(e => e.embedding || []);
            const n = embs.length;
            const scores = new Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i === j) continue;
                    try {
                        const sim = embedderLLM.cosineSimilarity(embs[i], embs[j]);
                        scores[i] += sim;
                    } catch (e) { /* ignore */ }
                }
                // normalize by count
                scores[i] = scores[i] / (n - 1 || 1);
            }
            // pick index with max score
            let maxIdx = 0;
            for (let i = 1; i < scores.length; i++) if (scores[i] > scores[maxIdx]) maxIdx = i;
            best = responses[maxIdx];
        } catch (e) {
            // Fallback: pick the longest response
            best = responses.reduce((a, b) => (a.text && b.text && a.text.length > b.text.length ? a : b));
        }
        return {
            best,
            all: responses
        };
    }

    /**
     * Explain a chart or dataset. Accepts a short identifier or natural language
     * describing which chart to explain. The method will retrieve local data,
     * craft an analyst prompt, and return the models' best answer.
     */
    async explainChart(selector, question = '') {
        const localData = await this.retrieveLocalData(selector, question);
        const prompt = `You are a data analyst. The user requests: ${question || selector}.\n\nUse the following local data as context:\n${localData}\n\nProvide: 1) A short summary of what the chart likely shows. 2) Three actionable insights. 3) One suggested visualization improvement or follow-up analysis.`;
        return await this.answer(prompt, `Chart explanation context for selector: ${selector}`);
    }
}

export const agentTeam = new AgentTeam();
window.agentTeam = agentTeam;
