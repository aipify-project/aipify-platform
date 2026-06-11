import type {
  DropshippingActionResult,
  DropshippingBriefingResult,
  DropshippingOperationsCard,
  DropshippingOperationsDashboard,
} from "./types";

export function parseDropshippingOperationsCard(data: unknown): DropshippingOperationsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    operational_score: Number(d.operational_score ?? 0),
    health_classification: typeof d.health_classification === "string" ? d.health_classification : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseDropshippingOperationsDashboard(data: unknown): DropshippingOperationsDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_actions_disabled: Boolean(d.auto_actions_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    operations_enabled: Boolean(d.operations_enabled ?? true),
    operational_score: Number(d.operational_score ?? 0),
    health_classification: typeof d.health_classification === "string" ? d.health_classification : undefined,
    active_products: Number(d.active_products ?? 0),
    open_alerts: Number(d.open_alerts ?? 0),
    delivery_risks: Number(d.delivery_risks ?? 0),
    suppliers_monitored: Number(d.suppliers_monitored ?? 0),
    open_escalations: Number(d.open_escalations ?? 0),
    supplier_insights: Array.isArray(d.supplier_insights)
      ? (d.supplier_insights as DropshippingOperationsDashboard["supplier_insights"])
      : [],
    product_watchlists: Array.isArray(d.product_watchlists)
      ? (d.product_watchlists as DropshippingOperationsDashboard["product_watchlists"])
      : [],
    order_health_insights: Array.isArray(d.order_health_insights)
      ? (d.order_health_insights as DropshippingOperationsDashboard["order_health_insights"])
      : [],
    delivery_risk_indicators: Array.isArray(d.delivery_risk_indicators)
      ? (d.delivery_risk_indicators as DropshippingOperationsDashboard["delivery_risk_indicators"])
      : [],
    opportunity_alerts: Array.isArray(d.opportunity_alerts)
      ? (d.opportunity_alerts as DropshippingOperationsDashboard["opportunity_alerts"])
      : [],
    operations_recommendations: Array.isArray(d.operations_recommendations)
      ? (d.operations_recommendations as DropshippingOperationsDashboard["operations_recommendations"])
      : [],
    escalation_activity: Array.isArray(d.escalation_activity)
      ? (d.escalation_activity as DropshippingOperationsDashboard["escalation_activity"])
      : [],
    risk_notifications: Array.isArray(d.risk_notifications)
      ? (d.risk_notifications as DropshippingOperationsDashboard["risk_notifications"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as DropshippingOperationsDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseDropshippingActionResult(data: unknown): DropshippingActionResult {
  return (data ?? {}) as DropshippingActionResult;
}

export function parseDropshippingBriefingResult(data: unknown): DropshippingBriefingResult {
  return (data ?? {}) as DropshippingBriefingResult;
}
