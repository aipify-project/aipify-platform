import type {
  AbosSuccessCriterion,
  ApprovalPrinciples,
  BlueprintObjective,
  CompanionGuidance,
  DropshippingActionResult,
  DropshippingBriefingResult,
  DropshippingOperationsBlueprint,
  DropshippingOperationsCard,
  DropshippingOperationsDashboard,
  DropshippingOperationsEngagementSummary,
  ImplementationBlueprintMeta,
  IntegrationLink,
  SelfLoveConnection,
  TrustConnection,
} from "./types";

function parseBlueprintMeta(data: unknown): ImplementationBlueprintMeta | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ImplementationBlueprintMeta;
}

function parseObjectives(data: unknown): BlueprintObjective[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as BlueprintObjective[];
}

function parseSuccessCriteria(data: unknown): AbosSuccessCriterion[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as AbosSuccessCriterion[];
}

function parseIntegrationLinks(data: unknown): IntegrationLink[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data as IntegrationLink[];
}

function parseCompanionGuidance(data: unknown): CompanionGuidance | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as CompanionGuidance;
}

function parseSelfLoveConnection(data: unknown): SelfLoveConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as SelfLoveConnection;
}

function parseTrustConnection(data: unknown): TrustConnection | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as TrustConnection;
}

function parseApprovalPrinciples(data: unknown): ApprovalPrinciples | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ApprovalPrinciples;
}

function parseEngagementSummary(data: unknown): DropshippingOperationsEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DropshippingOperationsEngagementSummary;
}

function parseBlueprintBlock(data: unknown): DropshippingOperationsBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as DropshippingOperationsBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

export function parseDropshippingOperationsCard(data: unknown): DropshippingOperationsCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    operational_score: Number(d.operational_score ?? 0),
    health_classification: typeof d.health_classification === "string" ? d.health_classification : undefined,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase103: parseBlueprintMeta(d.implementation_blueprint_phase103),
    dropshipping_operations_mission:
      typeof d.dropshipping_operations_mission === "string" ? d.dropshipping_operations_mission : undefined,
    dropshipping_operations_abos_principle:
      typeof d.dropshipping_operations_abos_principle === "string"
        ? d.dropshipping_operations_abos_principle
        : undefined,
    dropshipping_operations_engagement_summary: parseEngagementSummary(
      d.dropshipping_operations_engagement_summary,
    ),
    dropshipping_operations_note:
      typeof d.dropshipping_operations_note === "string" ? d.dropshipping_operations_note : undefined,
    dropshipping_operations_vision_note:
      typeof d.dropshipping_operations_vision_note === "string"
        ? d.dropshipping_operations_vision_note
        : undefined,
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
    implementation_blueprint_phase103: parseBlueprintMeta(d.implementation_blueprint_phase103),
    dropshipping_operations_engine_note:
      typeof d.dropshipping_operations_engine_note === "string"
        ? d.dropshipping_operations_engine_note
        : undefined,
    dropshipping_operations_blueprint: parseBlueprintBlock(d.dropshipping_operations_blueprint),
    dropshipping_operations_distinction_note:
      typeof d.dropshipping_operations_distinction_note === "string"
        ? d.dropshipping_operations_distinction_note
        : undefined,
    dropshipping_operations_mission:
      typeof d.dropshipping_operations_mission === "string" ? d.dropshipping_operations_mission : undefined,
    dropshipping_operations_philosophy:
      typeof d.dropshipping_operations_philosophy === "string"
        ? d.dropshipping_operations_philosophy
        : undefined,
    dropshipping_operations_abos_principle:
      typeof d.dropshipping_operations_abos_principle === "string"
        ? d.dropshipping_operations_abos_principle
        : undefined,
    dropshipping_operations_objectives: parseObjectives(d.dropshipping_operations_objectives),
    dropshipping_dashboard: parseRecord(d.dropshipping_dashboard),
    dropshipping_supplier_intelligence: parseRecord(d.dropshipping_supplier_intelligence),
    dropshipping_order_tracking_center: parseRecord(d.dropshipping_order_tracking_center),
    dropshipping_risk_monitoring: parseRecord(d.dropshipping_risk_monitoring),
    dropshipping_profitability_intelligence: parseRecord(d.dropshipping_profitability_intelligence),
    dropshipping_top_product_insights: parseRecord(d.dropshipping_top_product_insights),
    dropshipping_product_lifecycle_management: parseRecord(d.dropshipping_product_lifecycle_management),
    dropshipping_customer_experience_connection: parseRecord(d.dropshipping_customer_experience_connection),
    dropshipping_companion_guidance: parseCompanionGuidance(d.dropshipping_companion_guidance),
    dropshipping_self_love_connection: parseSelfLoveConnection(d.dropshipping_self_love_connection),
    dropshipping_trust_connection: parseTrustConnection(d.dropshipping_trust_connection),
    dropshipping_approval_principles: parseApprovalPrinciples(d.dropshipping_approval_principles),
    dropshipping_operations_dogfooding: parseRecord(d.dropshipping_operations_dogfooding),
    docbp103_integration_links: parseIntegrationLinks(d.docbp103_integration_links),
    dropshipping_operations_engagement_summary: parseEngagementSummary(
      d.dropshipping_operations_engagement_summary,
    ),
    dropshipping_operations_success_criteria: parseSuccessCriteria(d.dropshipping_operations_success_criteria),
    dropshipping_operations_vision:
      typeof d.dropshipping_operations_vision === "string" ? d.dropshipping_operations_vision : undefined,
    dropshipping_operations_vision_phrases: parseStringList(d.dropshipping_operations_vision_phrases),
    dropshipping_operations_privacy_note:
      typeof d.dropshipping_operations_privacy_note === "string"
        ? d.dropshipping_operations_privacy_note
        : undefined,
  };
}

export function parseDropshippingActionResult(data: unknown): DropshippingActionResult {
  return (data ?? {}) as DropshippingActionResult;
}

export function parseDropshippingBriefingResult(data: unknown): DropshippingBriefingResult {
  return (data ?? {}) as DropshippingBriefingResult;
}
