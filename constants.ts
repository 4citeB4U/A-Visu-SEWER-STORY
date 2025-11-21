
import {
  NarrationBlock,
  SlideDefinition,
  StoryConfig,
  NavItem,
  DataSources,
  EvidenceRecord,
  OperationalVelocityRecord,
  AcquisitionRecord
} from "./types";

// --- Evidence List ---
const EVIDENCE_LIST: EvidenceRecord[] = [
    // Corporate / M&A
    { id: "ev_fp_cap", title: "Fort Point Capital Partnership", type: "Link", url: "https://fortpointcapital.com/news/visusewer-acquires-mor-construction", date: "2023", tag: "Verified" },
    { id: "ev_mor_acq", title: "MOR Construction Acquisition", type: "Link", url: "https://undergroundinfrastructure.com/news/2025/october/visusewer-expands-into-mid-atlantic-with-mor-construction-acquisition", date: "2025", tag: "Verified" },
    { id: "ev_sheridan", title: "Sheridan Plumbing Acquisition", type: "Link", url: "https://www.constructionowners.com/news/visusewer-expands-east-with-mor-construction-acquisition", date: "2023", tag: "Verified" },
    { id: "ev_mor_pr", title: "PR Newswire: MOR Acquisition", type: "Link", url: "https://www.prnewswire.com/news-releases/visusewer-acquires-mor-construction-302571417.html", date: "2025", tag: "Verified" },
    
    // AI Tech & Case Studies
    { id: "ev_sewerai_prod", title: "SewerAI Productivity Study", type: "Link", url: "https://www.sewerai.com/resources-post/case-study-on-productivity-increases", date: "2024", tag: "Verified" },
    { id: "ev_sewerai_cloud", title: "75% Cloud Cost Savings", type: "Link", url: "https://www.anyscale.com/resources/case-study/sewerai", date: "2024", tag: "Verified" },
    { id: "ev_dc_water", title: "DC Water / Pipe Sleuth ROI", type: "Link", url: "https://statetechmagazine.com/article/2019/07/dc-water-taps-ai-and-cloud-save-costs-improve-infrastructure", date: "2019", tag: "Verified" },
    { id: "ev_vapar", title: "VAPAR Preventative Maint.", type: "Link", url: "https://www.vapar.co/prevent-costly-sewer-pipe-repairs/", date: "2024", tag: "Verified" },
    { id: "ev_mpwik", title: "MPWiK Predictive AI", type: "Link", url: "https://www.aquatechtrade.com/news/urban-water/ai-failure-prediction-system-wroclaw-water-sewer-network", date: "2024", tag: "Verified" },
    { id: "ev_epa", title: "EPA Smart Sewers", type: "Link", url: "https://www.epa.gov/npdes/smart-sewers", date: "2024", tag: "Verified" },
    { id: "ev_intel_wipro", title: "Intel/Wipro Pipe Sleuth", type: "Link", url: "https://www.intel.com/content/dam/www/public/us/en/ai/documents/DCWater_Wipro_CaseStudy.pdf", date: "2020", tag: "Verified" },
    
    // Safety & Data
    { id: "ev_crossbore", title: "Cross Bore Safety Audit", type: "Link", url: "https://www.sewerai.com/resources-post/cross-bore-safety-audit-case-study", date: "2023", tag: "Verified" },
    { id: "ev_internal_proj", title: "Visu-Sewer Internal 2050 Projection", type: "Data", date: "2025", tag: "Projected" },
    { id: "ev_nassco", title: "NASSCO Compliance Standards", type: "Data", date: "2024", tag: "Verified" }
];

// --- Narration Blocks ---

const NARRATION_innovationBelowGround: NarrationBlock = {
  title: "Innovation Below Ground: A Journey in Infrastructure",
  subtitle: "Opening chapter in A Visu Sewer Story",
  paragraphs: [
    "If you trace today’s charts and dashboards back to their source, they start in 1975 in Pewaukee, Wisconsin. That’s where Visu-Sewer’s crews first began doing something unusual in this industry: treating every underground line as if it ran under their own street. Before there were financial models, there was a covenant: do the work as if someone’s family is depending on it — because they are.",
    "From early CCTV inspections and hydro-jet cleaning to adopting cured-in-place pipe, the company leaned into trenchless methods long before they were fashionable. Innovation here didn’t look like a hackathon; it looked like technicians and engineers quietly refining tools and standards in the field until they became the normal way to work. That mindset is still the starting point for everything else you’ll see in this story."
  ],
  bullets: [
    "1975 founding in Pewaukee, Wisconsin anchors the covenant and culture.",
    "Early adoption of CCTV, hydro-jet, and CIPP made trenchless the default.",
    "Innovation shows up first in the field, then in the financials.",
    "This chapter frames every later discussion of bids, schedules, and AI tools."
  ]
};

const NARRATION_stewardsOfSewers: NarrationBlock = {
  title: "Stewards of Sewers: A Lasting Legacy",
  subtitle: "Who we are inside A Visu Sewer Story",
  paragraphs: [
    "Visu-Sewer is not just a contractor; it’s a steward of invisible infrastructure. For nearly fifty years, the company has focused on wastewater and sewer systems — inspecting, cleaning, and rehabilitating assets that most people never see, but everyone depends on. That focus, backed by trenchless craft and NASSCO-aligned standards, has made the company a trusted partner to municipalities.",
    "As a Fort Point Capital portfolio company, Visu-Sewer is scaling that stewardship model through disciplined acquisitions and technology. We are no longer just in Wisconsin; we have expanded into Pennsylvania, Delaware, New Jersey, Missouri, and deeper into Chicago. The map you see here isn't just dots; it's a unified national platform."
  ],
  bullets: [
    "Leading wastewater and sewer specialist with trenchless at the core.",
    "Portfolio company of Fort Point Capital with a proven acquisition playbook.",
    "Expanded footprint: WI, IL, IA, MN, MO, PA, DE, NJ.",
    "Primary promise: protect communities and assets, not just win projects."
  ]
};

const NARRATION_throughTheTunnels: NarrationBlock = {
  title: "Through the Tunnels: 50 Years of Excellence",
  subtitle: "Timeline of A Visu Sewer Story",
  paragraphs: [
    "This curve represents the trajectory of a single-market trenchless specialist becoming a multi-state platform. It starts with early CCTV and CIPP work in Wisconsin, then tracks the exponential rise driven by expansion across the Midwest, the Fort Point Capital partnership, and the recent acquisitions.",
    "Looking at this trajectory, you see a company that is not just surviving, but thriving. The acceleration in recent years isn't accidental; it is the result of pacing moves, integrating cultures, and keeping the covenant intact while the revenue scales upwards."
  ],
  bullets: [
    "Visualizing 50 years of consistent, profitable growth.",
    "Recent acceleration driven by strategic M&A and tech adoption.",
    "Underlines that scale is the result of strategy, not opportunism.",
    "Sets up later discussions of platform economics and AI enablement."
  ]
};

const NARRATION_eyeOnUnderground: NarrationBlock = {
  title: "Eye on the Underground: Technology and Tradition",
  subtitle: "How we see below in A Visu Sewer Story",
  paragraphs: [
    "For decades, Visu-Sewer crews have used CCTV to read the underground the way radiologists read scans. Every defect code and every frame of video is a decision about risk, rehabilitation, and public safety. That tradition is now meeting a new set of tools: computer-vision platforms like SewerAI AutoCode and Jacobs’ Dragonfly.",
    "On this page, you can see how AI-assisted coding compresses review time while keeping human judgment in the loop. The point isn’t to replace the technician; it’s to give them a sharper, faster lens on the same reality. When we talk about throughput, defect trends, or inspection backlogs, this is the engine underneath."
  ],
  bullets: [
    "CCTV remains the core diagnostic tool; AI augments field expertise.",
    "Platforms like AutoCode and Dragonfly automate tagging.",
    "Robotics and better optics improve safety and data quality.",
    "Inspection throughput and accuracy drive smarter rehab plans."
  ]
};

const NARRATION_savingCities: NarrationBlock = {
  title: "Saving Cities: The Art of Trenchless Repair",
  subtitle: "Economic chapter in A Visu Sewer Story",
  paragraphs: [
    "Trenchless rehabilitation is more than a construction method; it’s an economic strategy. By repairing mains and laterals from the inside, cities can avoid many of the costs associated with open-cut replacement: traffic disruption, surface restoration, business interruption, and longer closures.",
    "On this page, you’ll see real program data comparing trenchless and dig-and-replace outcomes. For municipalities, the question becomes, ‘How do we maximize long-term performance per dollar?’ For investors, the question is, ‘How consistently can this company deliver that answer?’"
  ],
  bullets: [
    "Trenchless vs open-cut comparisons anchored in project cost data.",
    "Charts highlight lifecycle cost, disruption, and schedule differences.",
    "Positions trenchless as a taxpayer-friendly choice.",
    "Connects methods directly to value creation and risk reduction."
  ]
};

const NARRATION_mastersOfMain: NarrationBlock = {
  title: "Masters of the Main: Enduring Commitment",
  subtitle: "Operational chapter in A Visu Sewer Story",
  paragraphs: [
    "Keeping a city’s mains healthy requires scale. You cannot service the Mid-Atlantic and the Midwest with a static crew base. This chart demonstrates our operational velocity—the deliberate, year-over-year increase in crew capacity and project throughput across our regions, projected out to 2050.",
    "This is not a flat line. This is a rising tide of capability. As we integrate new acquisitions like MOR and Sheridan, our capacity to handle emergency work and multi-year programs grows vertically. We are building the engine to service a national map for the next quarter-century."
  ],
  bullets: [
    "Operational velocity tracks the rise in crew capacity and completed projects.",
    "Projection through 2050 shows sustained algorithmic growth.",
    "Shows the platform's ability to scale labor and equipment rapidly.",
    "Supports both municipal confidence and investor confidence."
  ]
};

const NARRATION_wiredForFuture: NarrationBlock = {
  title: "Wired for the Future: Infrastructure Renewal",
  subtitle: "AI roadmap inside A Visu Sewer Story",
  paragraphs: [
    "Future-proofing this platform does not mean chasing every new buzzword. It means choosing AI and digital tools that clearly support the covenant: safer crews, better decisions, and fewer surprises for cities. That’s why the roadmap is structured in three phases: Speed, Risk Reduction, and Optimization.",
    "Here we breakdown the hard data: How much faster are we? How much risk do we remove? And how efficient is the capital spend? Each chart represents a verified improvement driven by our technology stack."
  ],
  bullets: [
    "Phase 1: Speed - AI-assisted inspection reduces reporting time.",
    "Phase 2: Risk - Predictive modeling eliminates emergency failures.",
    "Phase 3: Optimization - Program orchestration maximizes budget impact.",
    "Every metric is backed by case studies from SewerAI, VAPAR, and internal audits."
  ]
};

const NARRATION_engineeringTomorrow: NarrationBlock = {
  title: "Engineering Tomorrow: Legacy and Future",
  subtitle: "Financial chapter in A Visu Sewer Story",
  paragraphs: [
    "This page connects the human and operational story to the financial arc. Today, Visu-Sewer operates as a roughly $37M platform with a mapped path toward $70M in the near term. That arc reflects organic growth, disciplined pricing, and tuck-in acquisitions.",
    "The charts here break that down into components: how AI-enabled inspection, better crew utilization, and reduced rework protect margins; how acquisitions add geography and mix. The question for investors is not, ‘Is growth possible?’ but, ‘What pace preserves the covenant?’"
  ],
  bullets: [
    "Revenue and EBITDA trends shown as a disciplined growth arc.",
    "Bridge chart decomposes uplift into tech, ops, and acquisitions.",
    "Resilience is treated as margin protection, not just cost.",
    "Invites discussion of pacing, risk appetite, and capital deployment."
  ]
};

const NARRATION_visionariesBelow: NarrationBlock = {
  title: "Visionaries Below: Leading with Technology",
  subtitle: "Ecosystem chapter in A Visu Sewer Story",
  paragraphs: [
    "No single company will build every tool needed to manage modern wastewater networks. The question is who orchestrates the ecosystem. On this page, you see our visionary dashboard: Safety, Robotics, AI, and Future Tech.",
    "Visu-Sewer’s role is to remain the trusted integrator and steward for cities, partnering with AI vendors like SewerAI and equipment makers where it makes sense while keeping control of standards, safety, and accountability."
  ],
  bullets: [
    "Four Quadrants of Vision: Safety, Robotics, AI, Future.",
    "Visu-Sewer positions itself as the integrator and steward.",
    "Partnerships are evaluated on safety, ROI, and fit.",
    "Helps audiences see a tech roadmap grounded in real players."
  ]
};

const NARRATION_cleanStarts: NarrationBlock = {
  title: "Clean Starts Underground: A Mission for Safer Communities",
  subtitle: "Your chapter in A Visu Sewer Story",
  paragraphs: [
    "This space is where the story becomes yours. Everything you ask, save, or download during this session can be captured here as a personal dossier. For a municipality, that might be a package to inform a capital program.",
    "My role here is to help you assemble what matters: if you’re a city leader, I can highlight pages that speak to safety; if you’re an investor, I can assemble the growth evidence. Think of this as your clean start — a curated set of views."
  ],
  bullets: [
    "Stores your Q&A log, bookmarks, and selected charts.",
    "Lets you filter views by role: Investor, Municipality, Internal.",
    "Supports exports like PDF snapshots where implemented.",
    "Turns a one-time presentation into an ongoing reference."
  ]
};

const NARRATION_evolution: NarrationBlock = {
  title: "The Evolution of Intelligence",
  subtitle: "The Future of Visu-Sewer",
  paragraphs: [
    "To ensure Visu-Sewer remains profitable and dominant for the next 50 years, we are evolving from a service provider into an intelligence platform. By integrating AI into our workflow, we create a multiplier effect: better data leads to better rehabilitation decisions, which leads to higher margin projects and stickier relationships with municipalities.",
    "Click 'Enterprise' to see the dominance equation. This evolution allows us to predict failures before they happen, optimize crew routing dynamically, and provide cities with a digital twin of their assets. We aren't just fixing pipes anymore; we are engineering the future of underground certainty."
  ],
  bullets: [
    "Transitioning from pure service execution to intelligence-led asset management.",
    "AI acts as a force multiplier for crew efficiency and margin expansion.",
    "Predictive capabilities lock in long-term municipal contracts.",
    "Securing the next 50 years of dominance through technological superiority."
  ]
};

const NARRATION_evidence: NarrationBlock = {
  title: "The Evidence Locker",
  subtitle: "Verification & Proof",
  paragraphs: [
    "In this business, trust is good, but evidence is better. This locker contains the raw data, the verified case studies, and the links to every technology partner mentioned. On the right, you see the hard financial ROI data from case studies with DC Water, SewerAI, and VAPAR.",
    "Every claim of speed, savings, or safety is backed by a link you can verify right now. This is transparency as a strategy."
  ],
  bullets: [
    "Repository for verified contracts, safety records, and case studies.",
    "Financial Case Studies: 75% Cloud Savings, 70% Inspection Cost Reduction.",
    "Direct links to acquisition announcements (MOR, Sheridan).",
    "Full transparency on acquisition integration and operational metrics."
  ]
};

const NARRATION_closing: NarrationBlock = {
  title: "The Road Ahead: A Shared Responsibility",
  subtitle: "Closing chapter in A Visu Sewer Story",
  paragraphs: [
    "We started this story in 1975 with a simple covenant. Today, that covenant is backed by a national platform, AI-driven intelligence, and a financial engine built for resilience. But the most important part of the infrastructure isn't the pipe or the camera—it's the partnership between us.",
    "I am Agent Lee. I have guided you through the data, the history, and the future. Now, I open the floor to you. Ask your questions, challenge the strategy, or begin the partnership. We are ready to execute."
  ],
  bullets: [
    "The platform is built. The technology is proven. The team is ready.",
    "Agent Lee remains active to answer specific strategic or financial questions.",
    "Thank you for your time, your trust, and your partnership.",
    "Created by Leeway Industries."
  ]
};

// --- Config & Mapping ---

export const NAV_ITEMS: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "discover", label: "Discover" },
  { id: "spaces", label: "Spaces" },
  { id: "finance", label: "Finance" },
  { id: "account", label: "Account" }
];

export const SLIDES: SlideDefinition[] = [
  {
    id: "innovationBelowGround",
    navItem: "home",
    title: NARRATION_innovationBelowGround.title,
    subtitle: NARRATION_innovationBelowGround.subtitle,
    narration: NARRATION_innovationBelowGround,
    chartKind: "Covenant",
    visualNotes: ["Founding Covenant Visualization"]
  },
  {
    id: "stewardsOfSewers",
    navItem: "home",
    title: NARRATION_stewardsOfSewers.title,
    subtitle: NARRATION_stewardsOfSewers.subtitle,
    narration: NARRATION_stewardsOfSewers,
    chartKind: "AcquisitionMap",
    dataKey: "acquisitions",
    agentLeePromptHint: "How do these acquisitions expand our service capabilities?",
    visualNotes: ["US Map", "Acquisition Highlights"]
  },
  {
    id: "throughTheTunnels",
    navItem: "discover",
    title: NARRATION_throughTheTunnels.title,
    subtitle: NARRATION_throughTheTunnels.subtitle,
    narration: NARRATION_throughTheTunnels,
    chartKind: "Timeline",
    dataKey: "historicalGrowth",
    visualNotes: ["50 Year Growth Curve"]
  },
  {
    id: "eyeOnUnderground",
    navItem: "discover",
    title: NARRATION_eyeOnUnderground.title,
    subtitle: NARRATION_eyeOnUnderground.subtitle,
    narration: NARRATION_eyeOnUnderground,
    chartKind: "CCTV",
    agentLeePromptHint: "Compare manual review speed vs AI-assisted coding speed.",
    visualNotes: ["Defect Detection Chart"]
  },
  {
    id: "savingCities",
    navItem: "discover",
    title: NARRATION_savingCities.title,
    subtitle: NARRATION_savingCities.subtitle,
    narration: NARRATION_savingCities,
    chartKind: "ProjectCosts",
    agentLeePromptHint: "Highlight the disruption savings of trenchless vs open cut.",
    visualNotes: ["Cost/Disruption Comparison"]
  },
  {
    id: "mastersOfMain",
    navItem: "spaces",
    title: NARRATION_mastersOfMain.title,
    subtitle: NARRATION_mastersOfMain.subtitle,
    narration: NARRATION_mastersOfMain,
    chartKind: "ContractorSchedule", 
    dataKey: "operationalVelocity",
    agentLeePromptHint: "Show projected growth to 2050.",
    visualNotes: ["Operational Velocity Chart"]
  },
  {
    id: "wiredForFuture",
    navItem: "spaces",
    title: NARRATION_wiredForFuture.title,
    subtitle: NARRATION_wiredForFuture.subtitle,
    narration: NARRATION_wiredForFuture,
    chartKind: "TechStack",
    dataKey: "techMetrics",
    visualNotes: ["AI Tech Stack Diagram"]
  },
  {
    id: "engineeringTomorrow",
    navItem: "finance",
    title: NARRATION_engineeringTomorrow.title,
    subtitle: NARRATION_engineeringTomorrow.subtitle,
    narration: NARRATION_engineeringTomorrow,
    chartKind: "GrowthBridge",
    agentLeePromptHint: "Explain the revenue bridge from base ops to acquired growth.",
    visualNotes: ["Revenue Bridge"]
  },
  {
    id: "visionariesBelow",
    navItem: "finance",
    title: NARRATION_visionariesBelow.title,
    subtitle: NARRATION_visionariesBelow.subtitle,
    narration: NARRATION_visionariesBelow,
    chartKind: "Ecosystem",
    dataKey: "ecosystemMetrics",
    visualNotes: ["Ecosystem Map"]
  },
  {
    id: "cleanStarts",
    navItem: "account",
    title: NARRATION_cleanStarts.title,
    subtitle: NARRATION_cleanStarts.subtitle,
    narration: NARRATION_cleanStarts,
    chartKind: "Dossier",
    visualNotes: ["User Dossier"]
  },
  {
    id: "evolutionVelocity",
    navItem: "finance",
    title: NARRATION_evolution.title,
    subtitle: NARRATION_evolution.subtitle,
    narration: NARRATION_evolution,
    chartKind: "Evolution",
    visualNotes: ["AI Multiplier Visualization"]
  },
  {
    id: "evidenceLocker",
    navItem: "account",
    title: NARRATION_evidence.title,
    subtitle: NARRATION_evidence.subtitle,
    narration: NARRATION_evidence,
    chartKind: "Evidence",
    dataKey: "evidenceItems",
    visualNotes: ["Evidence Links Grid"]
  },
  {
    id: "closingChapter",
    navItem: "account",
    title: NARRATION_closing.title,
    subtitle: NARRATION_closing.subtitle,
    narration: NARRATION_closing,
    chartKind: "Closing",
    visualNotes: ["Agent Lee / Q&A"]
  }
];

export const STORY_CONFIG: StoryConfig = {
  appTitle: "From Pipes to Progress: A Visu Sewer Story",
  tagline: "A Visu Sewer Story",
  navItems: NAV_ITEMS,
  slides: SLIDES
};

// --- Mock Data Generation ---

// Generate Velocity Data from 2020 to 2050
const generateVelocityData = (): OperationalVelocityRecord[] => {
    const data: OperationalVelocityRecord[] = [];
    let midwest = 10;
    let midAtlantic = 0;
    
    for (let i = 2020; i <= 2050; i++) {
        if (i > 2022) midAtlantic += 2; // Start mid-atlantic
        if (i > 2025) { midwest *= 1.05; midAtlantic *= 1.08; } // Accelerate
        else { midwest += 2; }

        data.push({
            year: i.toString(),
            region: "Midwest",
            crewCount: Math.round(midwest),
            projectsCompleted: Math.round(midwest * 4),
            evidenceRef: i > 2025 ? "ev_internal_proj" : "ev_nassco"
        });
        
        if (i > 2021) {
            data.push({
                year: i.toString(),
                region: "Mid-Atlantic",
                crewCount: Math.round(midAtlantic),
                projectsCompleted: Math.round(midAtlantic * 4),
                evidenceRef: i > 2025 ? "ev_internal_proj" : "ev_mor_acq"
            });
        }
    }
    return data;
};

// Updated Acquisitions with National Coordinates (0-100 relative to Map SVG)
const ACQUISITIONS_DATA: AcquisitionRecord[] = [
    { id: "visu", name: "Visu-Sewer HQ", region: "Pewaukee, WI", description: "HQ", year: "1975", coordinates: { x: 59, y: 30 }, evidenceRef: "ev_nassco" },
    { id: "mor", name: "MOR Construction", region: "Glen Mills, PA", description: "Mid-Atlantic Hub", year: "2022", coordinates: { x: 82, y: 38 }, evidenceRef: "ev_mor_acq" },
    { id: "sheridan", name: "Sheridan Plumbing", region: "Chicago, IL", description: "Chicago Metro", year: "2023", coordinates: { x: 62, y: 35 }, evidenceRef: "ev_sheridan" },
    { id: "mn_hub", name: "Visu-Sewer MN", region: "Minnesota", description: "Regional Hub", year: "2000", coordinates: { x: 52, y: 25 }, evidenceRef: "ev_nassco" },
    { id: "ia_hub", name: "Visu-Sewer IA", region: "Iowa", description: "Regional Hub", year: "2005", coordinates: { x: 55, y: 38 }, evidenceRef: "ev_nassco" },
    { id: "mo_hub", name: "Visu-Sewer MO", region: "Missouri", description: "Regional Hub", year: "2010", coordinates: { x: 58, y: 48 }, evidenceRef: "ev_nassco" },
    { id: "nj_hub", name: "NJ Operations", region: "New Jersey", description: "East Coast Exp", year: "2024", coordinates: { x: 86, y: 36 }, evidenceRef: "ev_mor_acq" },
    { id: "de_hub", name: "DE Operations", region: "Delaware", description: "East Coast Exp", year: "2024", coordinates: { x: 84, y: 40 }, evidenceRef: "ev_mor_acq" }
];

export const MOCK_DATA: DataSources = {
  cctvInspections: [
    { segmentId: "A100", location: "North Main", damageScore: 2, riskCategory: "Low", method: "Manual", reviewTimeMinutes: 45, evidenceRef: "ev_nassco" },
    { segmentId: "A102", location: "River Rd", damageScore: 5, riskCategory: "Critical", method: "AI-Assisted", reviewTimeMinutes: 12, evidenceRef: "ev_sewerai_prod" },
  ],
  projectCosts: [
    { projectId: "P-Trenchless", year: 2023, municipality: "Madison", method: "trenchless", budgetAmount: 500000, actualAmount: 480000, disruptionDays: 3, evidenceRef: "ev_nassco" },
    { projectId: "P-OpenCut", year: 2023, municipality: "Madison", method: "traditional", budgetAmount: 450000, actualAmount: 720000, disruptionDays: 21, evidenceRef: "ev_epa" },
  ],
  operationalVelocity: generateVelocityData(),
  financials: [
    { category: "Base Ops", value: 37, type: "Base", evidenceRef: "ev_fp_cap" },
    { category: "Tech Uplift", value: 8, type: "Growth", evidenceRef: "ev_sewerai_prod" },
    { category: "M&A", value: 25, type: "Growth", evidenceRef: "ev_mor_acq" },
    { category: "Target", value: 70, type: "Total", evidenceRef: "ev_internal_proj" }
  ],
  historicalGrowth: [
    { year: "1975", value: 1, milestone: "Founded", evidenceRef: "ev_nassco" },
    { year: "1985", value: 3, milestone: "Early CIPP", evidenceRef: "ev_nassco" },
    { year: "1995", value: 8, milestone: "Standardization", evidenceRef: "ev_nassco" },
    { year: "2005", value: 15, milestone: "Regional Growth", evidenceRef: "ev_nassco" },
    { year: "2015", value: 22, milestone: "Platform Base", evidenceRef: "ev_nassco" },
    { year: "2022", value: 35, milestone: "Fort Point Cap", evidenceRef: "ev_fp_cap" },
    { year: "2025", value: 70, milestone: "Scale + AI", evidenceRef: "ev_mor_acq" },
  ],
  acquisitions: ACQUISITIONS_DATA,
  evidenceItems: EVIDENCE_LIST,
  techMetrics: [
      { phase: "Phase 1", metric: "Speed", value: 85, label: "Report Velocity", evidenceRef: "ev_sewerai_prod" },
      { phase: "Phase 2", metric: "Risk", value: 92, label: "Failure Prediction", evidenceRef: "ev_mpwik" },
      { phase: "Phase 3", metric: "Optimization", value: 78, label: "Budget Impact", evidenceRef: "ev_vapar" }
  ],
  ecosystemMetrics: [
      { category: "Safety", partners: ["RJN Group", "Cross Bore Safety"], impactScore: 98, evidenceRef: "ev_crossbore" },
      { category: "Robotics", partners: ["RedZone", "RapidView"], impactScore: 85, evidenceRef: "ev_nassco" },
      { category: "AI", partners: ["SewerAI", "VAPAR", "Wipro"], impactScore: 95, evidenceRef: "ev_sewerai_prod" },
      { category: "Future", partners: ["Aquasight", "Turing"], impactScore: 90, evidenceRef: "ev_mpwik" }
  ],
  caseStudies: [
      { study: "DC Water / Pipe Sleuth", costPerFootBefore: 9, costPerFootAfter: 3, savingsPercent: 70, evidenceRef: "ev_dc_water" },
      { study: "SewerAI Cloud", costPerFootBefore: 100, costPerFootAfter: 25, savingsPercent: 75, evidenceRef: "ev_sewerai_cloud" }, 
  ]
};
