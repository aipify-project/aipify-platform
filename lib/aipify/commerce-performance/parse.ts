import type {
  CommercePerformanceActionResult,
  CommercePerformanceBriefingResult,
  CommercePerformanceCard,
  CommercePerformanceDashboard,
} from "./types";

export function parseCommercePerformanceCard(data: unknown): CommercePerformanceCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    performance_score: Number(d.performance_score ?? 0),
    performance_classification: typeof d.performance_classification === "string" ? d.performance_classification : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseCommercePerformanceDashboard(data: unknown): CommercePerformanceDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_actions_disabled: Boolean(d.auto_actions_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    engine_enabled: Boolean(d.engine_enabled ?? true),
    margin_alert_threshold: Number(d.margin_alert_threshold ?? 20),
    performance_score: Number(d.performance_score ?? 0),
    performance_classification: typeof d.performance_classification === "string" ? d.performance_classification : undefined,
    total_revenue: Number(d.total_revenue ?? 0),
    estimated_profit: Number(d.estimated_profit ?? 0),
    avg_net_margin_percent: Number(d.avg_net_margin_percent ?? 0),
    open_risks: Number(d.open_risks ?? 0),
    opportunity_count: Number(d.opportunity_count ?? 0),
    products_tracked: Number(d.products_tracked ?? 0),
    profit_risk_products: Number(d.profit_risk_products ?? 0),
    profit_intelligence: Array.isArray(d.profit_intelligence)
      ? (d.profit_intelligence as CommercePerformanceDashboard["profit_intelligence"])
      : [],
    product_profitability: Array.isArray(d.product_profitability)
      ? (d.product_profitability as CommercePerformanceDashboard["product_profitability"])
      : [],
    customer_value_signals: Array.isArray(d.customer_value_signals)
      ? (d.customer_value_signals as CommercePerformanceDashboard["customer_value_signals"])
      : [],
    revenue_trends: Array.isArray(d.revenue_trends)
      ? (d.revenue_trends as CommercePerformanceDashboard["revenue_trends"])
      : [],
    performance_opportunities: Array.isArray(d.performance_opportunities)
      ? (d.performance_opportunities as CommercePerformanceDashboard["performance_opportunities"])
      : [],
    loss_prevention: Array.isArray(d.loss_prevention)
      ? (d.loss_prevention as CommercePerformanceDashboard["loss_prevention"])
      : [],
    strategic_recommendations: Array.isArray(d.strategic_recommendations)
      ? (d.strategic_recommendations as CommercePerformanceDashboard["strategic_recommendations"])
      : [],
    executive_reports: Array.isArray(d.executive_reports)
      ? (d.executive_reports as CommercePerformanceDashboard["executive_reports"])
      : [],
    integrations:
      typeof d.integrations === "object" && d.integrations ? (d.integrations as Record<string, string>) : undefined,
  };
}

export function parseCommercePerformanceActionResult(data: unknown): CommercePerformanceActionResult {
  return (data ?? {}) as CommercePerformanceActionResult;
}

export function parseCommercePerformanceBriefingResult(data: unknown): CommercePerformanceBriefingResult {
  return (data ?? {}) as CommercePerformanceBriefingResult;
}
