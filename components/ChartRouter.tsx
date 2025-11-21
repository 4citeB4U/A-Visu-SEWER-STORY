
import React from "react";
import { SlideDefinition, DataSources } from "../types";
import { 
  CctvChart, 
  ProjectCostsChart, 
  ScheduleChart, 
  GrowthBridgeChart, 
  AcquisitionsMap, 
  CovenantVisual,
  TimelineVisual,
  TechStackVisual,
  EcosystemVisual,
  DossierVisual,
  ClosingVisual,
  EvolutionVisual,
  EvidenceVisual,
  DefaultVisual 
} from "./Charts";

interface ChartRouterProps {
  slide: SlideDefinition;
  dataSources: DataSources;
  isSpeaking: boolean;
}

export const ChartRouter: React.FC<ChartRouterProps> = ({ slide, dataSources, isSpeaking }) => {
  switch (slide.chartKind) {
    case "CCTV":
      return <CctvChart data={dataSources.cctvInspections} isSpeaking={isSpeaking} />;
    case "ProjectCosts":
      return <ProjectCostsChart data={dataSources.projectCosts} isSpeaking={isSpeaking} />;
    case "ContractorSchedule":
      return <ScheduleChart data={dataSources.operationalVelocity} isSpeaking={isSpeaking} />;
    case "GrowthBridge":
        return <GrowthBridgeChart data={dataSources.financials} isSpeaking={isSpeaking} />;
    case "AcquisitionMap":
        return <AcquisitionsMap data={dataSources.acquisitions} />;
    case "BidAmounts":
        return <ProjectCostsChart data={dataSources.projectCosts} isSpeaking={isSpeaking} />; 
    case "Covenant":
        return <CovenantVisual />;
    case "Timeline":
        return <TimelineVisual data={dataSources.historicalGrowth} isSpeaking={isSpeaking} />;
    case "TechStack":
        return <TechStackVisual data={dataSources.techMetrics} isSpeaking={isSpeaking} />;
    case "Ecosystem":
        return <EcosystemVisual data={dataSources.ecosystemMetrics} />;
    case "Evolution":
        return <EvolutionVisual />;
    case "Evidence":
        return <EvidenceVisual data={dataSources.evidenceItems} caseStudies={dataSources.caseStudies} />;
    case "Dossier":
        return <DossierVisual />;
    case "Closing":
        return <ClosingVisual />;
    case "None":
    default:
      return <DefaultVisual title={slide.visualNotes?.[0] || "Visual Content"} />;
  }
};
