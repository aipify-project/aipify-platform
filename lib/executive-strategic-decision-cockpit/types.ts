import type { RiskLevel } from "@/lib/aipify/execution/types";

export type DecisionUrgency = "critical" | "high_priority" | "medium_priority" | "informational";

export type OrgHealthStatus = "excellent" | "healthy" | "monitor_closely" | "needs_attention" | "critical";

export type ConfidenceLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export type OpportunityType =
  | "revenue"
  | "cost_optimization"
  | "partnership"
  | "process_improvement"
  | "expansion"
  | "innovation";

export type CockpitMode =
  | "overview"
  | "decisions"
  | "health"
  | "alerts"
  | "opportunities"
  | "meeting"
  | "insights";

export type DecisionQueueItem = {
  id: string;
  title: string;
  description?: string;
  urgency: DecisionUrgency;
  owner?: string;
  required_approvers?: string[];
  strategic_impact?: string;
  risk_level?: RiskLevel;
  status?: string;
  deadline?: string;
  recommended_next_step?: string;
  confidence_score?: number;
  category?: string;
};

export type ExecutiveOverview = {
  initiatives_on_track: number;
  initiatives_at_risk: number;
  critical_decisions_pending: number;
  high_impact_opportunities: number;
  escalated_approvals: number;
  organization_health_score: number;
  organization_health_status: OrgHealthStatus;
  executive_action_queue_count: number;
};

export type HealthIndicator = {
  score: number;
  status: OrgHealthStatus;
};

export type StrategicOpportunity = {
  id: string;
  title: string;
  type: OpportunityType;
  expected_benefit: string;
  estimated_effort: string;
  risk_assessment: string;
  confidence_level: ConfidenceLevel;
  confidence_score: number;
};

export type ExecutiveAlert = {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  action_id?: string;
};

export type ExecutiveBriefing = {
  situation: string;
  context: string;
  recommendation: string;
  benefits: string;
  risks: string;
  alternatives: string[];
  recommended_actions: string[];
  confidence_score: number;
  confidence_level: ConfidenceLevel;
  decision_urgency: DecisionUrgency;
};

export type MeetingMode = {
  topics_for_discussion: Array<{ title: string; reason: string }>;
  pending_approvals: Array<{ id: string; title: string }>;
  blocked_initiatives: Array<{ id: string; title: string }>;
  recent_achievements: Array<{ id: string; title: string; completed_at?: string }>;
  critical_risks: Array<{ title: string; risk_level: string }>;
  suggested_agenda: string[];
  follow_ups: Array<{ title: string; created_at?: string }>;
};

export type CrossOrganizationalInsights = {
  departments: Array<{ department: string; active_count: number; at_risk_count: number }>;
  strategic_initiatives: { on_track: number; at_risk: number };
  trends: Array<{ label: string; direction: string }>;
  emerging_issues: Array<{ title: string; issue: string }>;
};

export type DecisionHistoryEntry = {
  id: string;
  action_id?: string;
  event_type: string;
  description: string;
  performed_by?: string;
  created_at: string;
  outcome?: string;
};

export type LearningInsights = {
  decision_accuracy_estimate: number;
  bottleneck_patterns: string[];
  intervention_effectiveness: string;
  success_patterns: string[];
};

export type ExecutiveStrategicDecisionCockpit = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  overview?: ExecutiveOverview;
  decision_queue?: Record<DecisionUrgency, DecisionQueueItem[]>;
  organization_health?: Record<string, HealthIndicator>;
  executive_alerts?: ExecutiveAlert[];
  opportunities?: StrategicOpportunity[];
  meeting_mode?: MeetingMode;
  cross_organizational?: CrossOrganizationalInsights;
  decision_history?: DecisionHistoryEntry[];
  learning_insights?: LearningInsights;
  principle?: string;
};

export type ExecutiveBriefingDetail = {
  found: boolean;
  action_id?: string;
  title?: string;
  briefing?: ExecutiveBriefing;
  principle?: string;
};

export type ExecutiveStrategicDecisionCockpitLabels = {
  title: string;
  subtitle: string;
  loading: string;
  humanOversight: string;
  principle: string;
  executiveLink: string;
  actionCenterLink: string;
  portfolioLink: string;
  earlyWarningLink: string;
  tabs: Record<CockpitMode, string>;
  overview: {
    title: string;
    onTrack: string;
    atRisk: string;
    criticalDecisions: string;
    highImpactOpportunities: string;
    escalatedApprovals: string;
    orgHealth: string;
    actionQueue: string;
  };
  decisions: {
    title: string;
    critical: string;
    highPriority: string;
    mediumPriority: string;
    informational: string;
    owner: string;
    approvers: string;
    strategicImpact: string;
    riskLevel: string;
    deadline: string;
    nextStep: string;
    viewBriefing: string;
    empty: string;
  };
  health: {
    title: string;
    operationalEfficiency: string;
    employeeEngagement: string;
    customerSatisfaction: string;
    revenueMomentum: string;
    riskExposure: string;
    complianceStatus: string;
    strategicExecution: string;
    statuses: Record<OrgHealthStatus, string>;
  };
  alerts: { title: string; empty: string; viewAction: string };
  opportunities: {
    title: string;
    expectedBenefit: string;
    estimatedEffort: string;
    riskAssessment: string;
    confidence: string;
    types: Record<OpportunityType, string>;
    empty: string;
  };
  briefing: {
    title: string;
    situation: string;
    context: string;
    recommendation: string;
    benefits: string;
    risks: string;
    alternatives: string;
    recommendedActions: string;
    confidence: string;
    urgency: string;
    disclaimer: string;
    back: string;
    urgencies: Record<DecisionUrgency, string>;
  };
  meeting: {
    title: string;
    topics: string;
    pendingApprovals: string;
    blocked: string;
    achievements: string;
    criticalRisks: string;
    agenda: string;
    followUps: string;
  };
  insights: {
    title: string;
    departments: string;
    strategicInitiatives: string;
    trends: string;
    emergingIssues: string;
    decisionHistory: string;
    learningTitle: string;
    decisionAccuracy: string;
    bottlenecks: string;
    interventionEffectiveness: string;
    successPatterns: string;
  };
  faq: {
    title: string;
    whatIsCockpit: string;
    whatIsCockpitAnswer: string;
    howPrioritize: string;
    howPrioritizeAnswer: string;
    howOpportunities: string;
    howOpportunitiesAnswer: string;
    canAipifyDecide: string;
    canAipifyDecideAnswer: string;
    confidenceScores: string;
    confidenceScoresAnswer: string;
  };
  empty: string;
  upgradeTitle: string;
  upgradeBody: string;
  upgradeCta: string;
};
