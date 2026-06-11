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

export type DropshippingOperationsCard = {
  has_customer: boolean;
  operational_score?: number;
  health_classification?: string;
  philosophy?: string;
  human_oversight_required?: boolean;
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
