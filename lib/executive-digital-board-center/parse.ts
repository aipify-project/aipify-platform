import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BoardRecommendation,
  BoardSectionItem,
  BoardSectionKey,
  BoardSettings,
  CompanionExecutiveItem,
  DashboardMetric,
  ExecutiveDigitalBoardCenter,
  LongTermPlan,
  MeetingPrepItem,
  ScenarioPlan,
  StrategicOpportunity,
  StrategicRisk,
  TimelineItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}
function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}
function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseSection(raw: unknown): BoardSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "board_overview") as BoardSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): BoardSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): BoardSettings {
  const d = asRecord(raw);
  return {
    boardEnabled: asBool(d.board_enabled, true),
    humanControlRequired: asBool(d.human_control_required, true),
  };
}

function parseDashboard(raw: unknown): DashboardMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "dashboard",
  };
}

function parseOpportunity(raw: unknown): StrategicOpportunity {
  const d = asRecord(raw);
  return {
    id: asString(d.id), opportunityType: asString(d.opportunity_type), title: asString(d.title),
    summary: asString(d.summary), suggestedAction: asString(d.suggested_action),
    evidenceLabel: asString(d.evidence_label), statusKey: asStatus(d.status_key), itemType: "opportunity",
  };
}

function parseRisk(raw: unknown): StrategicRisk {
  const d = asRecord(raw);
  return {
    id: asString(d.id), riskType: asString(d.risk_type), title: asString(d.title),
    summary: asString(d.summary), severityLabel: asString(d.severity_label),
    evidenceLabel: asString(d.evidence_label), statusKey: asStatus(d.status_key), itemType: "risk",
  };
}

function parseRecommendation(raw: unknown): BoardRecommendation {
  const d = asRecord(raw);
  return {
    id: asString(d.id), recommendedAction: asString(d.recommended_action),
    reasoning: asString(d.reasoning), potentialOutcome: asString(d.potential_outcome),
    riskLevel: asString(d.risk_level), estimatedImpact: asString(d.estimated_impact),
    statusKey: asStatus(d.status_key), itemType: "recommendation",
  };
}

function parseScenario(raw: unknown): ScenarioPlan {
  const d = asRecord(raw);
  return {
    id: asString(d.id), scenarioTopic: asString(d.scenario_topic), scenarioName: asString(d.scenario_name),
    bestCaseLabel: asString(d.best_case_label), expectedCaseLabel: asString(d.expected_case_label),
    worstCaseLabel: asString(d.worst_case_label), statusKey: asStatus(d.status_key), itemType: "scenario",
  };
}

function parseMeetingPrep(raw: unknown): MeetingPrepItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), prepType: asString(d.prep_type), title: asString(d.title),
    summary: asString(d.summary), statusKey: asStatus(d.status_key), itemType: "meeting_prep",
  };
}

function parseTimeline(raw: unknown): TimelineItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), timelineType: asString(d.timeline_type), title: asString(d.title),
    summary: asString(d.summary), milestoneLabel: asString(d.milestone_label),
    statusKey: asStatus(d.status_key), itemType: "timeline",
  };
}

function parseLongTerm(raw: unknown): LongTermPlan {
  const d = asRecord(raw);
  return {
    id: asString(d.id), planHorizon: asString(d.plan_horizon), planTitle: asString(d.plan_title),
    summary: asString(d.summary), progressLabel: asString(d.progress_label),
    statusKey: asStatus(d.status_key), itemType: "long_term_plan",
  };
}

function parseCompanion(raw: unknown): CompanionExecutiveItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), questionType: asString(d.question_type), question: asString(d.question),
    answer: asString(d.answer), evidenceLabel: asString(d.evidence_label),
    status: asString(d.status), itemType: "companion",
  };
}

const emptyCenter: ExecutiveDigitalBoardCenter = {
  found: false,
  boardSettings: { boardEnabled: true, humanControlRequired: true },
  executiveBoardDashboard: [],
  strategicOpportunityEngine: [],
  strategicRiskEngine: [],
  boardRecommendations: [],
  scenarioPlanning: [],
  boardMeetingPreparation: [],
  strategicTimeline: [],
  longTermPlanningEngine: [],
  companionExecutiveAdvisor: [],
  sections: {
    board_overview: [], strategic_risks: [], strategic_opportunities: [],
    executive_recommendations: [], board_reviews: [], long_term_planning: [], scenario_analysis: [],
  },
  statistics: {
    dashboardCount: 0, opportunityCount: 0, riskCount: 0, recommendationCount: 0,
    scenarioCount: 0, meetingPrepCount: 0, companionCount: 0,
  },
};

export function parseExecutiveDigitalBoardCenter(raw: unknown): ExecutiveDigitalBoardCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...emptyCenter, error: asString(d.error) || undefined };

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    boardSettings: parseSettings(d.board_settings),
    executiveBoardDashboard: Array.isArray(d.executive_board_dashboard) ? d.executive_board_dashboard.map(parseDashboard) : [],
    strategicOpportunityEngine: Array.isArray(d.strategic_opportunity_engine) ? d.strategic_opportunity_engine.map(parseOpportunity) : [],
    strategicRiskEngine: Array.isArray(d.strategic_risk_engine) ? d.strategic_risk_engine.map(parseRisk) : [],
    boardRecommendations: Array.isArray(d.board_recommendations) ? d.board_recommendations.map(parseRecommendation) : [],
    scenarioPlanning: Array.isArray(d.scenario_planning) ? d.scenario_planning.map(parseScenario) : [],
    boardMeetingPreparation: Array.isArray(d.board_meeting_preparation) ? d.board_meeting_preparation.map(parseMeetingPrep) : [],
    strategicTimeline: Array.isArray(d.strategic_timeline) ? d.strategic_timeline.map(parseTimeline) : [],
    longTermPlanningEngine: Array.isArray(d.long_term_planning_engine) ? d.long_term_planning_engine.map(parseLongTerm) : [],
    companionExecutiveAdvisor: Array.isArray(d.companion_executive_advisor) ? d.companion_executive_advisor.map(parseCompanion) : [],
    sections: {
      board_overview: parseSections(sections.board_overview),
      strategic_risks: parseSections(sections.strategic_risks),
      strategic_opportunities: parseSections(sections.strategic_opportunities),
      executive_recommendations: parseSections(sections.executive_recommendations),
      board_reviews: parseSections(sections.board_reviews),
      long_term_planning: parseSections(sections.long_term_planning),
      scenario_analysis: parseSections(sections.scenario_analysis),
    },
    statistics: {
      dashboardCount: asNumber(stats.dashboard_count),
      opportunityCount: asNumber(stats.opportunity_count),
      riskCount: asNumber(stats.risk_count),
      recommendationCount: asNumber(stats.recommendation_count),
      scenarioCount: asNumber(stats.scenario_count),
      meetingPrepCount: asNumber(stats.meeting_prep_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseExecutiveDigitalBoardAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
