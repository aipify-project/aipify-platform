export type SupplierProfile = {
  id: string;
  supplier_key: string;
  supplier_name: string;
  status: string;
  region: string;
  dependency_level: string;
  relationship_longevity_months: number;
};

export type SupplierHealthScore = {
  id: string;
  supplier_id: string;
  supplier_name?: string;
  health_score: number;
  status_level: string;
  delivery_reliability: number;
  quality_indicator: number;
  refund_frequency: number;
  responsiveness: number;
  margin_performance: number;
};

export type SupplierRelationshipRecord = {
  id: string;
  supplier_id?: string | null;
  supplier_name?: string | null;
  contact_history_summary?: string | null;
  meeting_summary?: string | null;
  improvement_initiative?: string | null;
  partnership_opportunity?: string | null;
  recorded_at?: string;
};

export type SupplierRiskEvent = {
  id: string;
  supplier_id?: string | null;
  supplier_name?: string | null;
  risk_type: string;
  title: string;
  summary: string;
  severity: string;
  resolved?: boolean;
};

export type SupplierOpportunityInsight = {
  id: string;
  supplier_id?: string | null;
  supplier_name?: string | null;
  opportunity_type: string;
  title: string;
  summary: string;
  priority: string;
};

export type SupplierDiversificationAlert = {
  id: string;
  supplier_id?: string | null;
  supplier_name?: string | null;
  alert_type: string;
  title: string;
  summary: string;
  affected_products_count: number;
  acknowledged?: boolean;
};

export type SupplierIntelligenceRecommendation = {
  id: string;
  supplier_id?: string | null;
  section: string;
  title: string;
  summary: string;
  recommendation_type: string;
  priority: string;
  rationale: string;
};

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
  phase?: string | number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type CompanionGuidanceExample = {
  emoji?: string;
  key?: string;
  prompt?: string;
  consideration?: string;
};

export type CompanionGuidance = {
  principle?: string;
  companion_name?: string;
  not_label?: string;
  examples?: CompanionGuidanceExample[];
  boundary_note?: string;
};

export type SelfLoveConnection = {
  principle?: string;
  quotes?: string[];
  practices?: string[];
  route?: string;
  boundary_note?: string;
};

export type TrustConnection = {
  principle?: string;
  users_should_see?: string[];
  operators_should_understand?: string[];
  audit_note?: string;
  approvals_route?: string;
};

export type LimitationPrinciples = {
  principle?: string;
  avoid?: Array<{ key?: string; label?: string; description?: string }>;
  boundary_note?: string;
};

export type SupplierIntelligenceEngagementSummary = {
  portfolio_score?: number;
  health_classification?: string;
  active_suppliers?: number;
  open_risks?: number;
  diversification_alerts?: number;
  objectives_documented?: number;
  score_components?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type SupplierIntelligenceBlueprint = {
  phase?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
  distinction_note?: string;
  mission?: string;
  philosophy?: string;
  abos_principle?: string;
  objectives?: BlueprintObjective[];
  supplier_dashboard?: Record<string, unknown>;
  supplier_health_indicators?: Record<string, unknown>;
  supplier_score_components?: Record<string, unknown>;
  supplier_diversification_insights?: Record<string, unknown>;
  supplier_relationship_management?: Record<string, unknown>;
  supplier_risk_intelligence?: Record<string, unknown>;
  supplier_opportunity_insights?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  meeting_companion_connection?: Record<string, unknown>;
  self_love_connection?: SelfLoveConnection;
  leadership_connection?: Record<string, unknown>;
  trust_connection?: TrustConnection;
  limitation_principles?: LimitationPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: SupplierIntelligenceEngagementSummary;
  privacy_note?: string;
};

export type SupplierIntelligenceCard = {
  has_customer: boolean;
  portfolio_score?: number;
  health_classification?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase106?: ImplementationBlueprintMeta;
  supplier_intelligence_mission?: string;
  supplier_intelligence_abos_principle?: string;
  supplier_intelligence_engagement_summary?: SupplierIntelligenceEngagementSummary;
  supplier_intelligence_note?: string;
  supplier_intelligence_vision_note?: string;
};

export type SupplierIntelligenceDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_replacement_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  engine_enabled?: boolean;
  diversification_alert_threshold?: number;
  portfolio_score?: number;
  health_classification?: string;
  active_suppliers?: number;
  open_risks?: number;
  opportunity_insights_count?: number;
  diversification_alerts?: number;
  relationship_records_count?: number;
  recommendations_pending?: number;
  supplier_profiles: SupplierProfile[];
  health_scores: SupplierHealthScore[];
  relationship_records: SupplierRelationshipRecord[];
  risk_events: SupplierRiskEvent[];
  opportunity_insights: SupplierOpportunityInsight[];
  diversification_alerts_list: SupplierDiversificationAlert[];
  recommendations: SupplierIntelligenceRecommendation[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase106?: ImplementationBlueprintMeta;
  supplier_intelligence_engine_note?: string;
  supplier_intelligence_blueprint?: SupplierIntelligenceBlueprint;
  supplier_intelligence_distinction_note?: string;
  supplier_intelligence_mission?: string;
  supplier_intelligence_philosophy?: string;
  supplier_intelligence_abos_principle?: string;
  supplier_intelligence_objectives?: BlueprintObjective[];
  supplier_dashboard?: Record<string, unknown>;
  supplier_health_indicators?: Record<string, unknown>;
  supplier_score_components?: Record<string, unknown>;
  supplier_diversification_insights?: Record<string, unknown>;
  supplier_relationship_management?: Record<string, unknown>;
  supplier_risk_intelligence?: Record<string, unknown>;
  supplier_opportunity_insights?: Record<string, unknown>;
  supplier_companion_guidance?: CompanionGuidance;
  supplier_meeting_companion_connection?: Record<string, unknown>;
  supplier_self_love_connection?: SelfLoveConnection;
  supplier_leadership_connection?: Record<string, unknown>;
  supplier_trust_connection?: TrustConnection;
  supplier_limitation_principles?: LimitationPrinciples;
  supplier_intelligence_dogfooding?: Record<string, unknown>;
  sirbp106_integration_links?: IntegrationLink[];
  supplier_intelligence_engagement_summary?: SupplierIntelligenceEngagementSummary;
  supplier_intelligence_success_criteria?: AbosSuccessCriterion[];
  supplier_intelligence_vision?: string;
  supplier_intelligence_vision_phrases?: string[];
  supplier_intelligence_privacy_note?: string;
};

export type SupplierIntelligenceActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type SupplierIntelligenceBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
