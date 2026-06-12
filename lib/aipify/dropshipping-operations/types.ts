export type SupplierInsight = {
  id: string;
  supplier_id: string;
  supplier_name: string;
  health_score: number;
  status_level: string;
  strengths: string;
  risks?: string | null;
  recommendation: string;
  delivery_consistency?: string;
  quality_indicator?: string;
};

export type ProductWatchlistItem = {
  id: string;
  product_key: string;
  product_name: string;
  category: string;
  watch_reason: string;
  status: string;
};

export type OrderHealthInsight = {
  id: string;
  insight_type: string;
  title: string;
  summary: string;
  trend_direction: string;
};

export type DeliveryRiskIndicator = {
  id: string;
  risk_type: string;
  title: string;
  summary: string;
  severity: string;
  resolved?: boolean;
};

export type OpportunityAlert = {
  id: string;
  alert_type: string;
  title: string;
  summary: string;
  priority: string;
  acknowledged?: boolean;
};

export type OperationsRecommendation = {
  id: string;
  section: string;
  title: string;
  summary: string;
  recommendation_type: string;
  priority: string;
  rationale: string;
};

export type EscalationActivity = {
  id: string;
  supplier_id?: string | null;
  issue_summary: string;
  escalation_status: string;
  alternative_supplier?: string | null;
  created_at?: string;
};

export type RiskNotification = {
  id: string;
  title: string;
  message: string;
  priority: string;
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

export type ApprovalPrinciples = {
  principle?: string;
  rules?: Array<{ key?: string; label?: string; description?: string }>;
  approvals_route?: string;
  boundary_note?: string;
};

export type DropshippingOperationsEngagementSummary = {
  operational_score?: number;
  health_classification?: string;
  active_products?: number;
  open_alerts?: number;
  delivery_risks?: number;
  suppliers_monitored?: number;
  open_escalations?: number;
  watchlist_count?: number;
  objectives_documented?: number;
  order_tracking_steps?: number;
  lifecycle_steps?: number;
  companion_examples?: number;
  integration_links?: number;
  privacy_note?: string;
};

export type DropshippingOperationsBlueprint = {
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
  dropshipping_dashboard?: Record<string, unknown>;
  supplier_intelligence?: Record<string, unknown>;
  order_tracking_center?: Record<string, unknown>;
  risk_monitoring?: Record<string, unknown>;
  profitability_intelligence?: Record<string, unknown>;
  top_product_insights?: Record<string, unknown>;
  product_lifecycle_management?: Record<string, unknown>;
  customer_experience_connection?: Record<string, unknown>;
  companion_guidance?: CompanionGuidance;
  self_love_connection?: SelfLoveConnection;
  trust_connection?: TrustConnection;
  approval_principles?: ApprovalPrinciples;
  dogfooding?: Record<string, unknown>;
  success_criteria?: AbosSuccessCriterion[];
  vision?: string;
  vision_phrases?: string[];
  integration_links?: IntegrationLink[];
  engagement_summary?: DropshippingOperationsEngagementSummary;
  privacy_note?: string;
};

export type DropshippingOperationsCard = {
  has_customer: boolean;
  operational_score?: number;
  health_classification?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase103?: ImplementationBlueprintMeta;
  dropshipping_operations_mission?: string;
  dropshipping_operations_abos_principle?: string;
  dropshipping_operations_engagement_summary?: DropshippingOperationsEngagementSummary;
  dropshipping_operations_note?: string;
  dropshipping_operations_vision_note?: string;
};

export type DropshippingOperationsDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  auto_actions_disabled?: boolean;
  philosophy?: string;
  safety_note?: string;
  operations_enabled?: boolean;
  operational_score?: number;
  health_classification?: string;
  active_products?: number;
  open_alerts?: number;
  delivery_risks?: number;
  suppliers_monitored?: number;
  open_escalations?: number;
  supplier_insights: SupplierInsight[];
  product_watchlists: ProductWatchlistItem[];
  order_health_insights: OrderHealthInsight[];
  delivery_risk_indicators: DeliveryRiskIndicator[];
  opportunity_alerts: OpportunityAlert[];
  operations_recommendations: OperationsRecommendation[];
  escalation_activity: EscalationActivity[];
  risk_notifications: RiskNotification[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
  implementation_blueprint_phase103?: ImplementationBlueprintMeta;
  dropshipping_operations_engine_note?: string;
  dropshipping_operations_blueprint?: DropshippingOperationsBlueprint;
  dropshipping_operations_distinction_note?: string;
  dropshipping_operations_mission?: string;
  dropshipping_operations_philosophy?: string;
  dropshipping_operations_abos_principle?: string;
  dropshipping_operations_objectives?: BlueprintObjective[];
  dropshipping_dashboard?: Record<string, unknown>;
  dropshipping_supplier_intelligence?: Record<string, unknown>;
  dropshipping_order_tracking_center?: Record<string, unknown>;
  dropshipping_risk_monitoring?: Record<string, unknown>;
  dropshipping_profitability_intelligence?: Record<string, unknown>;
  dropshipping_top_product_insights?: Record<string, unknown>;
  dropshipping_product_lifecycle_management?: Record<string, unknown>;
  dropshipping_customer_experience_connection?: Record<string, unknown>;
  dropshipping_companion_guidance?: CompanionGuidance;
  dropshipping_self_love_connection?: SelfLoveConnection;
  dropshipping_trust_connection?: TrustConnection;
  dropshipping_approval_principles?: ApprovalPrinciples;
  dropshipping_operations_dogfooding?: Record<string, unknown>;
  docbp103_integration_links?: IntegrationLink[];
  dropshipping_operations_engagement_summary?: DropshippingOperationsEngagementSummary;
  dropshipping_operations_success_criteria?: AbosSuccessCriterion[];
  dropshipping_operations_vision?: string;
  dropshipping_operations_vision_phrases?: string[];
  dropshipping_operations_privacy_note?: string;
};

export type DropshippingActionResult = {
  status?: string;
  error?: string;
  [key: string]: unknown;
};

export type DropshippingBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
