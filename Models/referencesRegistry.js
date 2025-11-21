/*
  Lightweight Reference Registry

  This mirrors the structured references used by the `References` slide/component.
  Fill these lists from your canonical `References.tsx` or maintain them manually.

  The structures are intentionally small and serializable so they can be
  loaded in the browser and used directly by the RAG layer.
*/

export const claimEvidence = [
  // Example entries. Replace/extend with the real data from your References component.
  {
    pageNumber: 1,
    pageTitle: 'Service Stack',
    claim: 'Visu-Sewer focuses on Inspect → Maintain → Rehabilitate to reduce lifecycle costs.',
    visibility: 'Public',
    sources: [
      'Visu-Sewer Services page',
      'Visu-Sewer Projects page',
      'project_costs.csv'
    ],
    filePaths: [
      'data/project_costs.csv',
      'data/bid_amounts.csv'
    ]
  },
  {
    pageNumber: 3,
    pageTitle: 'Evidence Map',
    claim: 'CCTV inspection frequency and failure modes are recorded in our inspection logs.',
    visibility: 'Public',
    sources: ['CCTV Inspection CSV', 'Visu-Sewer Projects page'],
    filePaths: ['data/cctv_inspection.csv']
  }
];

export const webSources = [
  { category: 'Visu-Sewer', url: 'https://visu-sewer.com', topicTags: ['overview','services','company'], name: 'Visu-Sewer homepage' },
  { category: 'Visu-Sewer', url: 'https://visu-sewer.com/projects', topicTags: ['projects','case_study','municipal'], name: 'Visu-Sewer projects' },
  { category: 'Municipal', url: 'https://hvmsd.org/interceptor-rehabilitation-project', topicTags: ['contract_award','hvmsd','interceptor'], name: 'HVMSD interceptor rehabilitation' },
  { category: 'Municipal', url: 'https://example.com/hovmsd-contract.pdf', topicTags: ['contract_award','pdf'], name: 'HOVMSD Contract Award PDF' },
  { category: 'Industry', url: 'https://trenchlesstechnology.com', topicTags: ['cipp','trenchless'], name: 'Trenchless Technology' }
];

// Helper: map a human-readable source name to a webSource entry (if available)
export function matchWebSourceFromName(name) {
  if (!name) return null;
  const lower = name.toLowerCase();
  for (const s of webSources) {
    if (s.name && s.name.toLowerCase().includes(lower)) return s;
    if (s.url && s.url.toLowerCase().includes(lower)) return s;
  }
  // Try simple substring match against url or name
  return webSources.find(s => (s.name && s.name.toLowerCase().includes(lower)) || (s.url && s.url.toLowerCase().includes(lower))) || null;
}

export default {
  claimEvidence,
  webSources,
  matchWebSourceFromName
};
