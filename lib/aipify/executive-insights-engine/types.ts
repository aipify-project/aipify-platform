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
  executive_insights_engine_note?: string;
  since_last_time?: SinceLastTimeSummary;
};

export type ExecutiveInsightsEngineDashboard = {
  has_organization: boolean;
  implementation_blueprint?: ImplementationBlueprint;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  vision?: string;
  executive_insights_engine_note?: string;
  distinction_note?: string;
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
