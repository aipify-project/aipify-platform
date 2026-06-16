export type WarningCategory =
  | "operational_risk"
  | "financial_risk"
  | "customer_risk"
  | "employee_risk"
  | "compliance_risk"
  | "strategic_execution_risk"
  | "partner_risk"
  | "capacity_risk";

export type WarningSeverity =
  | "informational"
  | "monitor"
  | "elevated_concern"
  | "high_risk"
  | "critical_attention_required";

export type ConfidenceLevel = "very_low" | "low" | "moderate" | "high" | "very_high";

export type EarlyWarningMode =
  | "dashboard"
  | "warnings"
  | "trends"
  | "forecasts"
  | "opportunities"
  | "escalation"
  | "queue"
  | "learning";

export type WarningSignal = {
  id: string;
  title: string;
  description?: string;
  signal_type?: string;
  category: WarningCategory;
  severity: WarningSeverity;
  severity_explanation: string;
  reasoning: string;
  suggested_actions: string[];
  confidence_score: number;
  confidence_level: ConfidenceLevel;
  risk_level?: string;
  status?: string;
  created_at?: string;
};

export type DashboardSummary = {
  emerging_risks: number;
  escalating_bottlenecks: number;
  losing_momentum: number;
  team_overload_signals: number;
  customer_deterioration_signals: number;
  compliance_warnings: number;
  revenue_trend_warnings: number;
};

export type PredictiveTrend = {
  trend: string;
  detected: boolean;
  count: number;
  direction: string;
};

export type HealthForecast = {
  days: number;
  health_score_estimate: number;
  risk_level: string;
};

export type PositiveOpportunity = {
  id: string;
  title: string;
  type: string;
  description: string;
  confidence_score: number;
};

export type EscalationRule = {
  rule: string;
  threshold: number;
  enabled: boolean;
  description: string;
};

export type AttentionQueueItem = {
  id: string;
  title: string;
  urgency: string;
  impact: string;
  confidence_score: number;
  confidence_level: string;
  review_timeline: string;
  stakeholder: string;
};

export type SignalBriefing = {
  what_changed: string;
  why_important: string;
  what_may_happen_next: string;
  response_options: string[];
  urgency_level: string;
  confidence_score: number;
  confidence_level: ConfidenceLevel;
};

export type OrganizationalEarlyWarningCenter = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  dashboard?: DashboardSummary;
  warnings?: WarningSignal[];
  predictive_trends?: PredictiveTrend[];
  forecasts?: {
    disclaimer: string;
    periods: HealthForecast[];
    factors: string[];
  };
  opportunities?: PositiveOpportunity[];
  escalation_rules?: EscalationRule[];
  attention_queue?: AttentionQueueItem[];
  learning_insights?: {
    accuracy_estimate: number;
    false_positive_rate_estimate: number;
    response_effectiveness: string;
    forecast_reliability: string;
  };
  principle?: string;
};

export type SignalBriefingDetail = {
  found: boolean;
  signal_id?: string;
  title?: string;
  briefing?: SignalBriefing;
  principle?: string;
};

export type OrganizationalEarlyWarningLabels = {
  title: string;
  subtitle: string;
  loading: string;
  humanOversight: string;
  principle: string;
  executiveLink: string;
  cockpitLink: string;
  boardInvestorIntelligenceLink: string;
  transformationChangeCenterLink: string;
  actionCenterLink: string;
  tabs: Record<EarlyWarningMode, string>;
  dashboard: {
    title: string;
    emergingRisks: string;
    escalatingBottlenecks: string;
    losingMomentum: string;
    teamOverload: string;
    customerDeterioration: string;
    complianceWarnings: string;
    revenueWarnings: string;
  };
  warnings: {
    title: string;
    category: string;
    severity: string;
    explanation: string;
    reasoning: string;
    suggestedActions: string;
    confidence: string;
    disclaimer: string;
    viewBriefing: string;
    acknowledge: string;
    dismiss: string;
    escalate: string;
    empty: string;
    categories: Record<WarningCategory, string>;
    severities: Record<WarningSeverity, string>;
  };
  trends: { title: string; detected: string; notDetected: string; count: string };
  forecasts: {
    title: string;
    disclaimer: string;
    days30: string;
    days60: string;
    days90: string;
    days180: string;
    estimate: string;
    factors: string;
  };
  opportunities: {
    title: string;
    empty: string;
    types: Record<string, string>;
  };
  escalation: {
    title: string;
    threshold: string;
    enabled: string;
  };
  queue: {
    title: string;
    urgency: string;
    impact: string;
    confidence: string;
    reviewTimeline: string;
    stakeholder: string;
    empty: string;
  };
  briefing: {
    title: string;
    whatChanged: string;
    whyImportant: string;
    whatNext: string;
    responseOptions: string;
    urgency: string;
    back: string;
  };
  learning: {
    title: string;
    accuracy: string;
    falsePositives: string;
    responseEffectiveness: string;
    forecastReliability: string;
  };
  faq: {
    title: string;
    whatAreSignals: string;
    whatAreSignalsAnswer: string;
    canPredict: string;
    canPredictAnswer: string;
    howGenerated: string;
    howGeneratedAnswer: string;
    howRespond: string;
    howRespondAnswer: string;
    confidenceLevels: string;
    confidenceLevelsAnswer: string;
  };
  empty: string;
  upgradeTitle: string;
  upgradeBody: string;
  upgradeCta: string;
};
