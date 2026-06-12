export type BlueprintObjective = {
  key?: string;
  label?: string;
  emoji?: string;
  description?: string;
};

export type AbosSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type ImplementationBlueprintMeta = {
  phase?: string;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
};

export type EarlySignal = {
  id: string;
  signal_key?: string;
  signal_type?: string;
  title?: string;
  summary?: string;
  severity?: string;
  trend_direction?: string;
  status?: string;
};

export type SupportOpportunity = {
  id: string;
  opportunity_key?: string;
  opportunity_type?: string;
  title?: string;
  summary?: string;
  target_audience?: string | null;
  priority?: string;
  status?: string;
};

export type PulseSnapshot = {
  id: string;
  snapshot_key?: string;
  pulse_dimension?: string;
  summary?: string;
  signal_strength?: string;
  trend_pct?: number | null;
  value_numeric?: number | null;
};

export type ProactiveRecommendation = {
  id: string;
  recommendation_key?: string;
  recommendation_type?: string;
  title?: string;
  summary?: string;
  status?: string;
  priority?: string;
};

export type ProactiveCompanionMeta = {
  principle?: string;
  supports?: Record<string, unknown>[];
  examples?: { emoji?: string; prompt?: string; consideration?: string }[];
};

export type ProactiveOrganizationBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  proactive_organization_center?: Record<string, unknown>[];
  early_signal_engine?: Record<string, unknown>[];
  preventative_support_engine?: Record<string, unknown>[];
  organizational_pulse_engine?: Record<string, unknown>[];
  proactive_companion?: ProactiveCompanionMeta;
  support_opportunity_engine?: Record<string, unknown>[];
  proactive_knowledge_delivery?: Record<string, unknown>[];
  executive_anticipation_dashboard?: Record<string, unknown>[];
  companion_limitations?: Record<string, unknown>[];
  self_love_connection?: Record<string, unknown>[];
  security_requirements?: Record<string, unknown>[];
  integration_links?: IntegrationLink[];
  dogfooding?: string;
  success_criteria?: AbosSuccessCriterion[];
  engagement_summary?: ProactiveOrganizationEngagementSummary;
  vision?: string;
  vision_phrases?: string[];
  privacy_note?: string;
};

export type ProactiveOrganizationEngagementSummary = {
  proactive_score?: number;
  signals_active?: number;
  support_opportunities_open?: number;
  recommendations_pending?: number;
  pulse_indicators?: number;
  objectives_count?: number;
  integration_links_count?: number;
  privacy_note?: string;
};

export type ProactiveOrganizationCard = {
  has_customer: boolean;
  proactive_score?: number;
  signals_active?: number;
  support_opportunities_open?: number;
  recommendations_pending?: number;
  philosophy?: string;
  human_governance_required?: boolean;
  care_not_surveillance_mode?: boolean;
  proactive_center_enabled?: boolean;
  implementation_blueprint?: ImplementationBlueprintMeta;
  proactive_organization_mission?: string;
  proactive_organization_abos_principle?: string;
  proactive_organization_engagement_summary?: ProactiveOrganizationEngagementSummary;
  proactive_organization_note?: string;
  proactive_organization_vision_note?: string;
};

export type ProactiveOrganizationDashboard = {
  has_customer: boolean;
  proactive_center_enabled?: boolean;
  anticipatory_support_enabled?: boolean;
  pulse_monitoring_enabled?: boolean;
  companion_alerts_enabled?: boolean;
  human_governance_required?: boolean;
  care_not_surveillance_mode?: boolean;
  philosophy?: string;
  safety_note?: string;
  distinction_note?: string;
  proactive_score?: number;
  signals_active?: number;
  support_opportunities_open?: number;
  recommendations_pending?: number;
  pulse_indicators?: number;
  avg_pulse_value?: number;
  early_signals: EarlySignal[];
  support_opportunities: SupportOpportunity[];
  pulse_snapshots: PulseSnapshot[];
  recommendations: ProactiveRecommendation[];
  proactive_organization_center: Record<string, unknown>[];
  early_signal_engine: Record<string, unknown>[];
  preventative_support_engine: Record<string, unknown>[];
  organizational_pulse_engine: Record<string, unknown>[];
  proactive_companion?: ProactiveCompanionMeta;
  support_opportunity_engine: Record<string, unknown>[];
  proactive_knowledge_delivery: Record<string, unknown>[];
  executive_anticipation_dashboard: Record<string, unknown>[];
  companion_limitations: Record<string, unknown>[];
  self_love_connection: Record<string, unknown>[];
  security_requirements: Record<string, unknown>[];
  integration_links: IntegrationLink[];
  implementation_blueprint?: ProactiveOrganizationBlueprint;
  proactive_organization_blueprint?: ProactiveOrganizationBlueprint;
  proactive_organization_mission?: string;
  proactive_organization_philosophy?: string;
  proactive_organization_abos_principle?: string;
  proactive_organization_objectives?: BlueprintObjective[];
  proactive_organization_engagement_summary?: ProactiveOrganizationEngagementSummary;
  proactive_organization_success_criteria?: AbosSuccessCriterion[];
  porgbp135_cross_links?: IntegrationLink[];
  proactive_organization_vision?: string;
  proactive_organization_vision_phrases?: string[];
  proactive_organization_privacy_note?: string;
  proactive_organization_engine_note?: string;
};
