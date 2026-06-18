import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type BrainSectionKey =
  | "organizational_memory"
  | "business_knowledge"
  | "historical_decisions"
  | "lessons_learned"
  | "institutional_knowledge"
  | "knowledge_timeline"
  | "corporate_intelligence";

export type BrainSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: BrainSectionKey;
  itemType: "section";
};

export type BrainSettings = {
  brainEnabled: boolean;
  knowledgePreservationEnabled: boolean;
};

export type MemoryEntity = {
  id: string;
  entityType: string;
  entityName: string;
  connectionLabel: string;
  recordCountLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "memory_entity";
};

export type TimelineItem = {
  id: string;
  timelineYear: string;
  timelineMonth: string;
  eventTitle: string;
  decisionLabel: string;
  outcomeLabel: string;
  impactLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "timeline";
};

export type DecisionMemoryItem = {
  id: string;
  decisionTitle: string;
  reasonLabel: string;
  alternativesLabel: string;
  expectedOutcomeLabel: string;
  actualOutcomeLabel: string;
  lessonsLabel: string;
  ownerName: string;
  sourceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "decision";
};

export type KnowledgeGraphNode = {
  id: string;
  nodeType: string;
  nodeName: string;
  connectionCountLabel: string;
  relationshipLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "graph_node";
};

export type LessonItem = {
  id: string;
  lessonType: string;
  title: string;
  summary: string;
  lessonLabel: string;
  ownerName: string;
  statusKey: OperationsStatusKey;
  itemType: "lesson";
};

export type HistoricalSearchItem = {
  id: string;
  questionType: string;
  question: string;
  answer: string;
  sourceLabel: string;
  status: string;
  itemType: "historical_search";
};

export type ExecutiveMemoryMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionHistorianItem = {
  id: string;
  historianType: string;
  question: string;
  historicalContext: string;
  evidenceLabel: string;
  status: string;
  itemType: "companion";
};

export type IntelligenceItem = {
  id: string;
  intelType: string;
  title: string;
  summary: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "intelligence";
};

export type PreservationItem = {
  id: string;
  preservationType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "preservation";
};

export type CorporateBrainCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  brainSettings: BrainSettings;
  memoryEngine: MemoryEntity[];
  organizationalTimeline: TimelineItem[];
  decisionMemory: DecisionMemoryItem[];
  corporateKnowledgeGraph: KnowledgeGraphNode[];
  lessonsLearnedEngine: LessonItem[];
  historicalSearch: HistoricalSearchItem[];
  executiveMemoryDashboard: ExecutiveMemoryMetric[];
  companionCorporateHistorian: CompanionHistorianItem[];
  corporateIntelligenceLayer: IntelligenceItem[];
  knowledgePreservation: PreservationItem[];
  sections: Record<BrainSectionKey, BrainSectionItem[]>;
  statistics: {
    entityCount: number;
    timelineCount: number;
    decisionCount: number;
    graphCount: number;
    lessonCount: number;
    companionCount: number;
  };
};
