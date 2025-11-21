
import { MOCK_DATA, STORY_CONFIG } from "./constants";

export const GENERATE_KNOWLEDGE_BASE = (): string => {
  // Create a mapping for the AI to know where content is located
  const navigationMap = STORY_CONFIG.slides.map((s, i) => 
    `Slide ${i + 1}: "${s.title}" (ID: ${s.id}) - Topics: ${s.chartKind}, ${s.navItem}`
  ).join("\n");

  const slidesContext = STORY_CONFIG.slides.map(s => 
    `SLIDE [${s.title}]: ${s.narration.paragraphs.join(" ")} Key points: ${s.narration.bullets.join("; ")}`
  ).join("\n\n");

  const evidenceContext = MOCK_DATA.evidenceItems.map(e => 
    `EVIDENCE [${e.tag}] ${e.title}: ${e.url || "Internal Data"} (${e.date})`
  ).join("\n");

  const financialContext = MOCK_DATA.financials.map(f => 
    `FINANCIAL: ${f.category} = ${f.value}M (${f.type})`
  ).join("\n");

  const acquisitionContext = MOCK_DATA.acquisitions.map(a => 
    `ACQUISITION: ${a.name} in ${a.region} (${a.year}). Coordinates: ${a.coordinates.x}, ${a.coordinates.y}`
  ).join("\n");

  const caseStudyContext = MOCK_DATA.caseStudies.map(c => 
    `CASE STUDY: ${c.study} reduced cost from $${c.costPerFootBefore} to $${c.costPerFootAfter}/ft (${c.savingsPercent}% savings).`
  ).join("\n");

  const velocityContext = `OPERATIONAL VELOCITY (2020-2050): Growing from ${MOCK_DATA.operationalVelocity[0].crewCount} crews to ${MOCK_DATA.operationalVelocity[MOCK_DATA.operationalVelocity.length-1].crewCount} crews.`;

  return `
  *** STRICT KNOWLEDGE BASE ***
  You must answer based on the following verified facts. Do not hallucinate outside of this context regarding Visu-Sewer's specific data.

  === NAVIGATION MAP (Use this to change slides) ===
  ${navigationMap}

  === EVIDENCE LOCKER ===
  ${evidenceContext}

  === ACQUISITIONS & FOOTPRINT ===
  ${acquisitionContext}

  === FINANCIALS ===
  ${financialContext}

  === CASE STUDIES ===
  ${caseStudyContext}

  === OPERATIONAL TRAJECTORY ===
  ${velocityContext}

  === PRESENTATION NARRATIVE ===
  ${slidesContext}
  `;
};
