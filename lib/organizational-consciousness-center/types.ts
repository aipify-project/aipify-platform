import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type ConsciousnessSectionKey =
  | "organizational_awareness"
  | "strategic_awareness"
  | "operational_awareness"
  | "cultural_awareness"
  | "organizational_alignment"
  | "long_term_trends"
  | "emerging_signals";

export type ConsciousnessSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: ConsciousnessSectionKey;
  itemType: "section";
};

export type ConsciousnessSettings = {
  consciousnessEnabled: boolean;
  humanControlRequired: boolean;
};

export type AwarenessItem = {
  id: string;
  awarenessArea: string;
  areaName: string;
  evaluationLabel: string;
  signalLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "awareness";
};

export type AlignmentItem = {
  id: string;
  alignmentType: string;
  title: string;
  summary: string;
  evidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "alignment";
};

export type StrategicItem = {
  id: string;
  strategicType: string;
  title: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "strategic";
};

export type NarrativeItem = {
  id: string;
  narrativeType: string;
  title: string;
  narrative: string;
  statusKey: OperationsStatusKey;
  itemType: "narrative";
};

export type EmergingSignalItem = {
  id: string;
  signalType: string;
  title: string;
  summary: string;
  evidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "emerging_signal";
};

export type CoherenceItem = {
  id: string;
  coherenceDimension: string;
  dimensionName: string;
  alignmentScoreLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "coherence";
};

export type ExecutiveAwarenessMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "executive";
};

export type CompanionAdvisorItem = {
  id: string;
  advisorType: string;
  question: string;
  insight: string;
  evidenceLabel: string;
  status: string;
  itemType: "companion";
};

export type LongTermItem = {
  id: string;
  horizonKey: string;
  horizonLabel: string;
  trendSummary: string;
  statusKey: OperationsStatusKey;
  itemType: "long_term";
};

export type ReflectionItem = {
  id: string;
  reflectionType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "reflection";
};

export type OrganizationalConsciousnessCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  consciousnessSettings: ConsciousnessSettings;
  awarenessEngine: AwarenessItem[];
  organizationalAlignmentAnalysis: AlignmentItem[];
  strategicAwarenessLayer: StrategicItem[];
  organizationalNarrativeEngine: NarrativeItem[];
  emergingSignalDetection: EmergingSignalItem[];
  organizationalCoherenceEngine: CoherenceItem[];
  executiveAwarenessDashboard: ExecutiveAwarenessMetric[];
  companionStrategicAdvisor: CompanionAdvisorItem[];
  longTermIntelligenceLayer: LongTermItem[];
  reflectionEngine: ReflectionItem[];
  sections: Record<ConsciousnessSectionKey, ConsciousnessSectionItem[]>;
  statistics: {
    awarenessCount: number;
    alignmentCount: number;
    signalCount: number;
    reflectionCount: number;
    companionCount: number;
  };
};
