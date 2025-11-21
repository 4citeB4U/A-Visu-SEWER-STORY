/* Central registry of external evidence URLs for Agent Lee */

export const WEB_SOURCES = [
  { id: 'visu_root', label: 'Visu-Sewer – Home', url: 'https://visu-sewer.com', category: 'Visu-Sewer', tags: ['company','overview'] },
  { id: 'visu_projects', label: 'Visu-Sewer – Projects', url: 'https://visu-sewer.com/projects', category: 'Visu-Sewer', tags: ['projects','case_studies'] },
  { id: 'visu_overview', label: 'Visu-Sewer – Overview', url: 'https://visu-sewer.com/overview', category: 'Visu-Sewer', tags: ['overview'] },
  { id: 'visu_muni', label: 'Visu-Sewer – Serving Municipalities', url: 'https://visu-sewer.com/serving-municipalities', category: 'Visu-Sewer', tags: ['municipal','service_model'] },

  { id: 'hov_root', label: 'HOVMSD – Home', url: 'https://hvmsd.org', category: 'HOVMSD', tags: ['district'] },
  { id: 'hov_project', label: 'HOVMSD – Interceptor Rehabilitation Project', url: 'https://hvmsd.org/interceptor-rehabilitation-project', category: 'HOVMSD', tags: ['project','interceptor','hovmsd'] },
  { id: 'hov_award', label: 'HOVMSD Contract Award PDF', url: 'https://hvmsd.org/wp-content/uploads/2023/08/HOV_Contract_Award.pdf', category: 'HOVMSD', tags: ['contract','award','pdf','hovmsd'] },

  { id: 'fox_root', label: 'Village of Fox Point – Home', url: 'https://villageoffoxpoint.com', category: 'Municipal', tags: ['fox_point'] },
  { id: 'fox_public_works', label: 'Fox Point – Public Works', url: 'https://villageoffoxpoint.com/213/Public-Works', category: 'Municipal', tags: ['fox_point','public_works'] },
  { id: 'fox_sewer_lining_2025', label: 'Fox Point – 2025 Sewer Lining Project PDF', url: 'https://villageoffoxpoint.com/DocumentCenter/View/6052/2025-Sewer-Lining-Project', category: 'Municipal', tags: ['fox_point','sewer_lining','project_doc','pdf'] },

  { id: 'schaumburg_root', label: 'Village of Schaumburg – Home', url: 'https://schaumburg.com', category: 'Municipal', tags: ['schaumburg'] },
  { id: 'schaumburg_agenda', label: 'Schaumburg – Project Agenda PDF', url: 'https://schaumburg.novusagenda.com/agendapublic/Blobs/857364.pdf', category: 'Municipal', tags: ['schaumburg','agenda','project_doc','pdf'] },

  { id: 'wauwatosa_root', label: 'City of Wauwatosa – Home', url: 'https://wauwatosa.net', category: 'Municipal', tags: ['wauwatosa'] },
  { id: 'wauwatosa_sewer', label: 'Wauwatosa – Sewers & Stormwater', url: 'https://wauwatosa.net/services/public-works/sewers-stormwater', category: 'Municipal', tags: ['wauwatosa','sewer','stormwater'] },

  { id: 'mtvernon_projects', label: 'Mt. Vernon – Projects', url: 'https://mtvernon.com/projects', category: 'Municipal', tags: ['mt_vernon','projects'] },
  { id: 'mtvernon_sewer', label: 'Mt. Vernon – Public Works Sewer', url: 'https://mtvernon.com/publicworks/sewer', category: 'Municipal', tags: ['mt_vernon','sewer'] },

  { id: 'combined_locks', label: 'Combined Locks – Home', url: 'https://combinedlocks.wi.gov', category: 'Municipal', tags: ['combined_locks'] },

  { id: 'trenchless_tech', label: 'Trenchless Technology', url: 'https://trenchlesstechnology.com', category: 'Industry', tags: ['trenchless','cipp'] },
  { id: 'nationalliner', label: 'National Liner', url: 'https://nationalliner.com', category: 'Industry', tags: ['cipp','liner'] },
  { id: 'pipelinerpros', label: 'Pipeliner Pros', url: 'https://pipelinerpros.com', category: 'Industry', tags: ['cipp'] },
  { id: 'patriotic_cipp', label: 'Patriotic Plumbing – CIPP Overview', url: 'https://patrioticplumbingandrooter.com/cured-in-place-pipe-cipp/', category: 'Industry', tags: ['cipp','explainer'] },
  { id: 'wwdmag', label: 'Water & Wastes Digest', url: 'https://wwdmag.com', category: 'Industry', tags: ['water','wastewater'] },
  { id: 'bluefield', label: 'Bluefield Research', url: 'https://bluefieldresearch.com', category: 'Industry', tags: ['market_research','water'] },

  { id: 'madsewer', label: 'Madison Metropolitan Sewerage District', url: 'https://madsewer.org', category: 'Regulatory', tags: ['sewer_district'] },
  { id: 'faribault_pdf', label: 'Faribault – Sanitary Sewer Rehabilitation Project 2020 PDF', url: 'https://ci.faribault.mn.us/documentcenter/view/11990/Sanitary-Sewer-Rehabilitation-Project-2020.pdf', category: 'Municipal', tags: ['faribault','rehab','project_doc','pdf'] },
  { id: 'shorewood_alert', label: 'Village of Shorewood – Sewer Rehab Announcement', url: 'https://villageofshorewood.org/CivicAlerts.aspx?AID=122', category: 'Municipal', tags: ['shorewood','announcement','rehab'] },

  { id: 'fox11_hov', label: 'Fox11 – Heart of the Valley Contract Award', url: 'https://fox11online.com/news/local/heart-of-the-valley-awards-contract-for-sewerage-rehabilitation-project', category: 'News', tags: ['hovmsd','news','award'] },
  { id: 'businessnews_hov', label: 'The Business News – HOVMSD Project Update', url: 'https://thebusinessnews.com/another-step-forward-for-hovmsd-project', category: 'News', tags: ['hovmsd','news','project'] },

  { id: 'metrocouncil_interceptors', label: 'Metropolitan Council – Interceptor Rehabilitation Program', url: 'https://metrocouncil.org/wastewater/interceptors/interceptor-rehabilitation-program.aspx', category: 'Program', tags: ['interceptor','program'] },
  { id: 'vokimberly', label: 'Village of Kimberly – Home', url: 'https://vokimberlywi.gov', category: 'Municipal', tags: ['kimberly'] },
  { id: 'msdbc', label: 'MSDBC – Regional Stakeholders', url: 'https://msdbc.org', category: 'Stakeholder', tags: ['regional','stakeholder'] },
];

export function suggestWebSources(query, max = 5) {
  const q = (query || '').toLowerCase();
  const scored = WEB_SOURCES.map(src => {
    let score = 0;
    if (src.label.toLowerCase().includes(q)) score += 3;
    if (src.category.toLowerCase().includes(q)) score += 2;
    for (const tag of src.tags) if (q.includes(tag.toLowerCase())) score += 1;
    return { src, score };
  });
  return scored.filter(x => x.score > 0).sort((a,b) => b.score - a.score).slice(0, max).map(x => x.src);
}

export default { WEB_SOURCES, suggestWebSources };
