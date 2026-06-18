import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";

export type BoardSectionKey =
  | "board_overview"
  | "strategic_risks"
  | "strategic_opportunities"
  | "executive_recommendations"
  | "board_reviews"
  | "long_term_planning"
  | "scenario_analysis";

export type BoardSectionItem = {
  id: string;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  statusKey: OperationsStatusKey;
  sectionKey: BoardSectionKey;
  itemType: "section";
};

export type BoardSettings = {
  boardEnabled: boolean;
  humanControlRequired: boolean;
};

export type DashboardMetric = {
  id: string;
  metricKey: string;
  metricValue: string;
  trendLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "dashboard";
};

export type StrategicOpportunity = {
  id: string;
  opportunityType: string;
  title: string;
  summary: string;
  suggestedAction: string;
  evidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "opportunity";
};

export type StrategicRisk = {
  id: string;
  riskType: string;
  title: string;
  summary: string;
  severityLabel: string;
  evidenceLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "risk";
};

export type BoardRecommendation = {
  id: string;
  recommendedAction: string;
  reasoning: string;
  potentialOutcome: string;
  riskLevel: string;
  estimatedImpact: string;
  statusKey: OperationsStatusKey;
  itemType: "recommendation";
};

export type ScenarioPlan = {
  id: string;
  scenarioTopic: string;
  scenarioName: string;
  bestCaseLabel: string;
  expectedCaseLabel: string;
  worstCaseLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "scenario";
};

export type MeetingPrepItem = {
  id: string;
  prepType: string;
  title: string;
  summary: string;
  statusKey: OperationsStatusKey;
  itemType: "meeting_prep";
};

export type TimelineItem = {
  id: string;
  timelineType: string;
  title: string;
  summary: string;
  milestoneLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "timeline";
};

export type LongTermPlan = {
  id: string;
  planHorizon: string;
  planTitle: string;
  summary: string;
  progressLabel: string;
  statusKey: OperationsStatusKey;
  itemType: "long_term_plan";
};

export type CompanionExecutiveItem = {
  id: string;
  questionType: string;
  question: string;
  answer: string;
  evidenceLabel: string;
  status: string;
  itemType: "companion";
};

export type ExecutiveDigitalBoardCenter = {
  found: boolean;
  error?: string;
  philosophy?: string;
  canExecutive?: boolean;
  canManage?: boolean;
  governanceNote?: string;
  privacyNote?: string;
  boardSettings: BoardSettings;
  executiveBoardDashboard: DashboardMetric[];
  strategicOpportunityEngine: StrategicOpportunity[];
  strategicRiskEngine: StrategicRisk[];
  boardRecommendations: BoardRecommendation[];
  scenarioPlanning: ScenarioPlan[];
  boardMeetingPreparation: MeetingPrepItem[];
  strategicTimeline: TimelineItem[];
  longTermPlanningEngine: LongTermPlan[];
  companionExecutiveAdvisor: CompanionExecutiveItem[];
  sections: Record<BoardSectionKey, BoardSectionItem[]>;
  statistics: {
    dashboardCount: number;
    opportunityCount: number;
    riskCount: number;
    recommendationCount: number;
    scenarioCount: number;
    meetingPrepCount: number;
    companionCount: number;
  };
};
