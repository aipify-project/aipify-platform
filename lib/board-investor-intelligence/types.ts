export type GovernanceStatus = "strong" | "healthy" | "monitor" | "needs_attention" | "critical";

export type BoardIntelligenceMode =
  | "board"
  | "investor"
  | "meeting"
  | "decisions"
  | "performance"
  | "briefing"
  | "governance"
  | "scenarios"
  | "narrative"
  | "learning";

export type PerformanceIndicator = {
  score: number;
  status: GovernanceStatus;
  note?: string;
};

export type BoardInvestorIntelligenceCenter = {
  found: boolean;
  has_access?: boolean;
  upgrade_required?: boolean;
  board_dashboard?: {
    initiatives_on_track: number;
    initiatives_at_risk: number;
    executive_priorities: number;
    organization_health_score: number;
    organization_health_status: string;
    financial_trend_summary: string;
    risk_landscape_count: number;
    major_opportunities: number;
    board_attention_items: Array<{ id: string; title: string; reason: string }>;
  };
  investor_readiness?: {
    revenue_trajectory: string;
    revenue_trajectory_note: string;
    customer_growth_indicator: number;
    retention_indicator: number;
    product_adoption_trend: string;
    expansion_readiness: string;
    operational_maturity: GovernanceStatus;
    governance_maturity: GovernanceStatus;
  };
  board_meeting?: {
    executive_highlights: string[];
    major_accomplishments: Array<{ title: string; completed_at?: string }>;
    strategic_updates: Array<{ title: string; status: string; health: string }>;
    risks_for_discussion: Array<{ title: string; risk_level: string }>;
    investment_opportunities: Array<{ title: string; impact: string }>;
    recommended_decisions: string[];
    action_items: Array<{ title: string; created_at?: string }>;
  };
  decision_register?: Array<{
    id: string;
    action_id?: string;
    decision: string;
    event_type: string;
    outcome: string;
    rationale: string;
    implementation_status: string;
    follow_up: string;
    created_at: string;
    performed_by?: string;
  }>;
  strategic_performance?: Record<string, PerformanceIndicator>;
  investor_briefing?: {
    current_position: string;
    market_opportunities: string;
    growth_potential: string;
    operational_strengths: string[];
    material_risks: string[];
    recommended_focus: string[];
    confidence_score: number;
    confidence_level: string;
    disclaimer: string;
  };
  governance_health?: {
    overall_score: number;
    overall_status: GovernanceStatus;
    decision_transparency: PerformanceIndicator;
    approval_discipline: PerformanceIndicator;
    risk_oversight: PerformanceIndicator;
    policy_compliance: PerformanceIndicator;
    executive_accountability: PerformanceIndicator;
    audit_readiness: PerformanceIndicator;
    board_effectiveness: PerformanceIndicator;
  };
  scenarios?: Array<{ question: string; possibility: string; certainty: string }>;
  executive_narrative?: {
    summary: string;
    achievements: string[];
    challenges: string[];
    risks: string;
    opportunities: string;
    recommended_priorities: string[];
    suitable_for: string[];
  };
  learning_insights?: Record<string, string>;
  principle?: string;
};

export type BoardInvestorIntelligenceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  humanOversight: string;
  principle: string;
  executiveLink: string;
  cockpitLink: string;
  earlyWarningLink: string;
  generateNarrative: string;
  generateBriefing: string;
  recorded: string;
  tabs: Record<BoardIntelligenceMode, string>;
  board: {
    title: string;
    onTrack: string;
    atRisk: string;
    executivePriorities: string;
    orgHealth: string;
    financialTrend: string;
    riskLandscape: string;
    opportunities: string;
    attentionItems: string;
  };
  investor: {
    title: string;
    revenueTrajectory: string;
    revenueNote: string;
    customerGrowth: string;
    retention: string;
    productAdoption: string;
    expansionReadiness: string;
    operationalMaturity: string;
    governanceMaturity: string;
  };
  meeting: {
    title: string;
    highlights: string;
    accomplishments: string;
    strategicUpdates: string;
    risks: string;
    opportunities: string;
    decisions: string;
    actionItems: string;
  };
  decisions: {
    title: string;
    decision: string;
    outcome: string;
    rationale: string;
    status: string;
    followUp: string;
    empty: string;
  };
  performance: { title: string; note: string };
  briefing: {
    title: string;
    position: string;
    opportunities: string;
    growth: string;
    strengths: string;
    risks: string;
    focus: string;
    confidence: string;
    disclaimer: string;
  };
  governance: {
    title: string;
    overall: string;
    decisionTransparency: string;
    approvalDiscipline: string;
    riskOversight: string;
    policyCompliance: string;
    executiveAccountability: string;
    auditReadiness: string;
    boardEffectiveness: string;
    statuses: Record<GovernanceStatus, string>;
  };
  scenarios: { title: string; certaintyNote: string };
  narrative: {
    title: string;
    summary: string;
    achievements: string;
    challenges: string;
    risks: string;
    opportunities: string;
    priorities: string;
    suitableFor: string;
  };
  learning: { title: string };
  faq: {
    title: string;
    whatIsBoard: string;
    whatIsBoardAnswer: string;
    governanceSupport: string;
    governanceSupportAnswer: string;
    replaceDecisions: string;
    replaceDecisionsAnswer: string;
    investorInsights: string;
    investorInsightsAnswer: string;
    confidenceScores: string;
    confidenceScoresAnswer: string;
  };
  upgradeTitle: string;
  upgradeBody: string;
  upgradeCta: string;
};
