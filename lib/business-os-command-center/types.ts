import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type CommandSectionKey =
  | "executive_overview"
  | "operational_overview"
  | "financial_overview"
  | "customer_overview"
  | "workforce_overview"
  | "intelligence_overview"
  | "companion_recommendations";

export type RadarTier = "healthy" | "emerging_risk" | "critical" | "information";

export type PulsePeriod = "today" | "this_week" | "this_month";

export type ReadinessModeKey = "board_meeting" | "investor_meeting" | "management_review";

export type CommandSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: CommandSectionKey;
  itemType: "section";
};

export type MissionMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "mission";
};

export type RadarItem = {
  id: string;
  radarTier: RadarTier;
  title: string;
  summary: string;
  impactLevel: string;
  statusKey: OperationsStatusKey;
  itemType: "radar";
};

export type PulseMetric = {
  id: string;
  periodKey: PulsePeriod;
  metricCategory: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "pulse";
};

export type EventStreamItem = {
  id: string;
  eventSource: string;
  eventType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  createdAt?: string;
  itemType: "event";
};

export type BriefingHighlight = { text: string; statusKey: OperationsStatusKey };
export type BriefingAction = { rank: number; action: string; reason: string };

export type MorningBriefing = {
  id?: string;
  greeting: string;
  sinceLoginSummary: string;
  highlights: BriefingHighlight[];
  recommendedActions: BriefingAction[];
  statusKey: OperationsStatusKey;
  itemType: "briefing";
};

export type WidgetItem = {
  id: string;
  widgetKey: string;
  isPinned: boolean;
  isHidden: boolean;
  sortOrder: number;
  size: string;
  itemType: "widget";
};

export type CrossIntelligenceItem = {
  id: string;
  correlationTitle: string;
  observation: string;
  suggestedAction: string;
  statusKey: OperationsStatusKey;
  itemType: "cross_intel";
};

export type CompanionItem = {
  id: string;
  capabilityType: string;
  recommendation: string;
  reason: string;
  status: string;
  itemType: "companion";
};

export type ReadinessItem = {
  id: string;
  modeKey: ReadinessModeKey;
  title: string;
  keyMetrics: string;
  risks: string;
  achievements: string;
  priorities: string;
  statusKey: OperationsStatusKey;
  itemType: "readiness";
};

export type BusinessOsCommandCenter = {
  found: boolean;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  readinessMode: string;
  executiveMissionControl: MissionMetric[];
  organizationRadar: RadarItem[];
  liveBusinessPulse: PulseMetric[];
  unifiedEventStream: EventStreamItem[];
  morningBriefing: MorningBriefing;
  widgets: WidgetItem[];
  crossSystemIntelligence: CrossIntelligenceItem[];
  companionAdvisor: CompanionItem[];
  executiveReadiness: ReadinessItem[];
  sections: {
    executiveOverview: CommandSectionItem[];
    operationalOverview: CommandSectionItem[];
    financialOverview: CommandSectionItem[];
    customerOverview: CommandSectionItem[];
    workforceOverview: CommandSectionItem[];
    intelligenceOverview: CommandSectionItem[];
    companionRecommendations: CommandSectionItem[];
  };
  statistics: {
    missionCount: number;
    radarCount: number;
    eventCount: number;
    widgetCount: number;
    companionCount: number;
  };
  links?: {
    presenceFeed?: string;
    desktopConnect?: string;
    legacyMissionControl?: string;
  };
  error?: string;
};
