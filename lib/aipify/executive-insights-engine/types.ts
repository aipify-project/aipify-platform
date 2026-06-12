export type ExecutiveReportingPeriod = "daily" | "weekly" | "monthly" | "quarterly";

export type ExecutiveInsightItem = {
  source?: string;
  source_label?: string;
  title?: string;
  severity?: string;
  confidence?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExecutiveRecommendedAction = {
  action_key?: string;
  title?: string;
  rationale?: string;
  urgency?: string;
  expected_outcome?: string;
  estimated_effort?: string;
  source?: string;
  route?: string;
  [key: string]: unknown;
};

export type ExecutiveReportSummary = {
  id?: string;
  reporting_period?: string;
  summary?: string;
  risk_count?: number;
  opportunity_count?: number;
  action_count?: number;
  created_at?: string;
};

export type ExecutiveReportSchedule = {
  id?: string;
  reporting_period?: string;
  enabled?: boolean;
  delivery_channels?: string[];
  [key: string]: unknown;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type ImplementationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type IntegrationLink = {
  label?: string;
  route?: string;
  note?: string;
};

export type ExecutiveObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type OverviewCapability = {
  key?: string;
  label?: string;
  description?: string;
};

export type InsightCategory = {
  key?: string;
  label?: string;
  description?: string;
  examples?: string[];
  source_modules?: string[];
};

export type SinceLastTimeSummary = {
  since?: string;
  since_source?: string;
  assumption_note?: string;
  support_cases_resolved?: number;
  kc_articles_updated?: number;
  high_priority_tasks_completed?: number;
  bottlenecks_open?: number;
  bell_moments?: number;
  trend_summary?: string;
};

export type CompanionCommunicationExample = {
  emoji?: string;
  key?: string;
  scenario?: string;
  example?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  executive_patterns?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  executives_should_know?: string[];
  organizations_should_understand?: string[];
  audit_note?: string;
  data_vs_hypotheses?: {
    verified_data?: string[];
    hypotheses?: string[];
  };
  uncertainty_note?: string;
};

export type StrategicConversation = {
  emoji?: string;
  key?: string;
  scenario?: string;
  question?: string;
  example?: string;
};

export type StrategicObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type PriorityAlignment = {
  principle?: string;
  dimensions?: Array<Record<string, unknown>>;
  misalignment_scaffold?: string[];
  alignment_route?: string;
  boundary_note?: string;
};

export type OpportunityExploration = {
  principle?: string;
  exploration_types?: Array<Record<string, unknown>>;
  awareness_not_certainty?: string;
  strategic_intelligence_route?: string;
  ecosystem_route?: string;
};

export type StrategicReviewSessions = {
  principle?: string;
  cadences?: Array<Record<string, unknown>>;
  executive_reports_link?: string;
  boundary_note?: string;
};

export type StrategicEngagementSummary = {
  strategic_objectives_total?: number;
  strategic_objectives_active?: number;
  open_strategic_opportunities?: number;
  pending_org_decisions?: number;
  active_okr_objectives?: number;
  alignment_snapshots_90d?: number;
  strategic_reviews_90d?: number;
  summary_note?: string;
};

export type StrategicSelfLoveConnection = {
  principle?: string;
  strategic_patterns?: string[];
  self_love_route?: string;
  naming_doc?: string;
  boundary_note?: string;
};

export type DataSources = {
  principle?: string;
  modules?: Array<Record<string, unknown>>;
  privacy_note?: string;
};

export type ExecutiveInsightsEngineCard = {
  has_organization: boolean;
  health_score?: number;
  health_status?: string;
  risk_count?: number;
  action_count?: number;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  implementation_blueprint?: ImplementationBlueprint;
  implementation_blueprint_phase59?: ImplementationBlueprint;
  executive_insights_engine_note?: string;
  strategic_thinking_note?: string;
  blueprint_note?: string;
  since_last_time?: SinceLastTimeSummary;
  strategic_engagement_summary?: StrategicEngagementSummary;
};

export type ExecutiveInsightsEngineDashboard = {
  has_organization: boolean;
  implementation_blueprint?: ImplementationBlueprint;
  implementation_blueprint_phase59?: ImplementationBlueprint;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  executive_insights_engine_note?: string;
  strategic_thinking_note?: string;
  distinction_note?: string;
  blueprint_distinction_note?: string;
  blueprint_mission?: string;
  blueprint_philosophy?: string;
  blueprint_abos_principle?: string;
  strategic_thinking_objectives?: StrategicObjective[];
  strategic_conversations?: StrategicConversation[];
  priority_alignment?: PriorityAlignment;
  opportunity_exploration?: OpportunityExploration;
  strategic_review_sessions?: StrategicReviewSessions;
  executive_briefings?: StrategicConversation[];
  strategic_self_love?: StrategicSelfLoveConnection;
  strategic_trust?: TrustConnection;
  strategic_dogfooding?: Record<string, unknown>;
  strategic_integration_links?: IntegrationLink[];
  strategic_engagement_summary?: StrategicEngagementSummary;
  strategic_success_criteria?: AbosSuccessCriterion[];
  strategic_vision_phrases?: string[];
  executive_objectives?: ExecutiveObjective[];
  overview_capabilities?: OverviewCapability[];
  insight_categories?: InsightCategory[];
  since_last_time?: SinceLastTimeSummary;
  companion_communication_examples?: CompanionCommunicationExample[];
  self_love_connection?: SelfLoveConnection;
  self_love_note?: string;
  trust_connection?: TrustConnection;
  data_sources?: DataSources;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  safety_note?: string;
  principles?: string[];
  summary?: {
    health_score?: number;
    health_status?: string;
    risk_count?: number;
    opportunity_count?: number;
    action_count?: number;
    reports_generated?: number;
  };
  organization_health?: {
    score?: number;
    status?: string;
    factors?: Record<string, string>;
  };
  major_achievements: ExecutiveInsightItem[];
  operational_risks: ExecutiveInsightItem[];
  strategic_opportunities: ExecutiveInsightItem[];
  customer_trends: Array<Record<string, unknown>>;
  ai_recommendations: ExecutiveRecommendedAction[];
  recommended_actions: ExecutiveRecommendedAction[];
  recent_reports: ExecutiveReportSummary[];
  schedules: ExecutiveReportSchedule[];
  settings?: Record<string, unknown>;
  source_modules?: Array<Record<string, unknown>>;
  [key: string]: unknown;
};

export type ExecutiveReportExport = {
  export_format?: string;
  exported_at?: string;
  privacy_note?: string;
  report?: Record<string, unknown>;
};
