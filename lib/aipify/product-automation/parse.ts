import type {
  AbosSuccessCriterion,
  BlueprintObjective,
  CompanionGuidance,
  ImplementationBlueprintMeta,
  IntegrationLink,
  ProductAutomationActionResult,
  ProductAutomationBlueprint,
  ProductAutomationBriefingResult,
  ProductAutomationCard,
  ProductAutomationDashboard,
  ProductAutomationEngagementSummary,
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

function parseEngagementSummary(data: unknown): ProductAutomationEngagementSummary | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProductAutomationEngagementSummary;
}

function parseBlueprintBlock(data: unknown): ProductAutomationBlueprint | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProductAutomationBlueprint;
}

function parseRecord(data: unknown): Record<string, unknown> | undefined {
  if (typeof data !== "object" || !data) return undefined;
  return data as Record<string, unknown>;
}

function parseStringList(data: unknown): string[] | undefined {
  if (!Array.isArray(data)) return undefined;
  return data.filter((item): item is string => typeof item === "string");
}

function parseWorkflowAutomation(data: unknown): ProductAutomationDashboard["workflow_automation"] {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProductAutomationDashboard["workflow_automation"];
}

function parseApprovalPrinciples(data: unknown): ProductAutomationDashboard["approval_principles"] {
  if (typeof data !== "object" || !data) return undefined;
  return data as ProductAutomationDashboard["approval_principles"];
}

export function parseProductAutomationCard(data: unknown): ProductAutomationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    automation_score: Number(d.automation_score ?? 0),
    awaiting_approval_count: Number(d.awaiting_approval_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase102: parseBlueprintMeta(d.implementation_blueprint_phase102),
    product_automation_mission: typeof d.product_automation_mission === "string" ? d.product_automation_mission : undefined,
    product_automation_abos_principle:
      typeof d.product_automation_abos_principle === "string" ? d.product_automation_abos_principle : undefined,
    product_automation_engagement_summary: parseEngagementSummary(d.product_automation_engagement_summary),
    product_automation_note: typeof d.product_automation_note === "string" ? d.product_automation_note : undefined,
    product_automation_vision_note:
      typeof d.product_automation_vision_note === "string" ? d.product_automation_vision_note : undefined,
  };
}

export function parseProductAutomationDashboard(data: unknown): ProductAutomationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_publish_disabled: Boolean(d.auto_publish_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    engine_enabled: Boolean(d.engine_enabled ?? true),
    default_target_language: typeof d.default_target_language === "string" ? d.default_target_language : undefined,
    default_rewriting_mode: typeof d.default_rewriting_mode === "string" ? d.default_rewriting_mode : undefined,
    automation_score: Number(d.automation_score ?? 0),
    imported_products_count: Number(d.imported_products_count ?? 0),
    awaiting_approval_count: Number(d.awaiting_approval_count ?? 0),
    avg_readiness_score: Number(d.avg_readiness_score ?? 0),
    seo_recommendations_count: Number(d.seo_recommendations_count ?? 0),
    quality_warnings_count: Number(d.quality_warnings_count ?? 0),
    pending_approvals: Number(d.pending_approvals ?? 0),
    translation_opportunities: Number(d.translation_opportunities ?? 0),
    brand_voice:
      typeof d.brand_voice === "object" && d.brand_voice
        ? (d.brand_voice as ProductAutomationDashboard["brand_voice"])
        : undefined,
    imported_products: Array.isArray(d.imported_products)
      ? (d.imported_products as ProductAutomationDashboard["imported_products"])
      : [],
    awaiting_approval: Array.isArray(d.awaiting_approval)
      ? (d.awaiting_approval as ProductAutomationDashboard["awaiting_approval"])
      : [],
    translation_opportunities_list: Array.isArray(d.translation_opportunities_list)
      ? (d.translation_opportunities_list as ProductAutomationDashboard["translation_opportunities_list"])
      : [],
    seo_recommendations: Array.isArray(d.seo_recommendations)
      ? (d.seo_recommendations as ProductAutomationDashboard["seo_recommendations"])
      : [],
    quality_warnings: Array.isArray(d.quality_warnings)
      ? (d.quality_warnings as ProductAutomationDashboard["quality_warnings"])
      : [],
    category_suggestions: Array.isArray(d.category_suggestions)
      ? (d.category_suggestions as ProductAutomationDashboard["category_suggestions"])
      : [],
    approval_requests: Array.isArray(d.approval_requests)
      ? (d.approval_requests as ProductAutomationDashboard["approval_requests"])
      : [],
    bulk_jobs: Array.isArray(d.bulk_jobs) ? (d.bulk_jobs as ProductAutomationDashboard["bulk_jobs"]) : [],
    recent_translations: Array.isArray(d.recent_translations)
      ? (d.recent_translations as ProductAutomationDashboard["recent_translations"])
      : [],
    recent_rewrites: Array.isArray(d.recent_rewrites)
      ? (d.recent_rewrites as ProductAutomationDashboard["recent_rewrites"])
      : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as ProductAutomationDashboard["briefings"]) : [],
    integrations:
      typeof d.integrations === "object" && d.integrations ? (d.integrations as Record<string, string>) : undefined,
    implementation_blueprint_phase102: parseBlueprintMeta(d.implementation_blueprint_phase102),
    product_automation_engine_note:
      typeof d.product_automation_engine_note === "string" ? d.product_automation_engine_note : undefined,
    product_automation_blueprint: parseBlueprintBlock(d.product_automation_blueprint),
    product_automation_distinction_note:
      typeof d.product_automation_distinction_note === "string" ? d.product_automation_distinction_note : undefined,
    product_automation_mission: typeof d.product_automation_mission === "string" ? d.product_automation_mission : undefined,
    product_automation_philosophy:
      typeof d.product_automation_philosophy === "string" ? d.product_automation_philosophy : undefined,
    product_automation_abos_principle:
      typeof d.product_automation_abos_principle === "string" ? d.product_automation_abos_principle : undefined,
    product_automation_objectives: parseObjectives(d.product_automation_objectives),
    product_import_automation: parseRecord(d.product_import_automation),
    product_translation: parseRecord(d.product_translation),
    product_rewriting: parseRecord(d.product_rewriting),
    seo_optimization: parseRecord(d.seo_optimization),
    category_recommendations: parseRecord(d.category_recommendations),
    product_quality_checks: parseRecord(d.product_quality_checks),
    product_companion_guidance: parseCompanionGuidance(d.product_companion_guidance),
    workflow_automation: parseWorkflowAutomation(d.workflow_automation),
    approval_principles: parseApprovalPrinciples(d.approval_principles),
    product_automation_self_love_connection: parseSelfLoveConnection(d.product_automation_self_love_connection),
    product_automation_trust_connection: parseTrustConnection(d.product_automation_trust_connection),
    product_automation_dogfooding: parseRecord(d.product_automation_dogfooding),
    paebp102_integration_links: parseIntegrationLinks(d.paebp102_integration_links),
    product_automation_engagement_summary: parseEngagementSummary(d.product_automation_engagement_summary),
    product_automation_success_criteria: parseSuccessCriteria(d.product_automation_success_criteria),
    product_automation_vision: typeof d.product_automation_vision === "string" ? d.product_automation_vision : undefined,
    product_automation_vision_phrases: parseStringList(d.product_automation_vision_phrases),
    product_automation_privacy_note:
      typeof d.product_automation_privacy_note === "string" ? d.product_automation_privacy_note : undefined,
  };
}

export function parseProductAutomationActionResult(data: unknown): ProductAutomationActionResult {
  return (data ?? {}) as ProductAutomationActionResult;
}

export function parseProductAutomationBriefingResult(data: unknown): ProductAutomationBriefingResult {
  return (data ?? {}) as ProductAutomationBriefingResult;
}
