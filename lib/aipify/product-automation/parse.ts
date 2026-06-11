import type {
  ProductAutomationActionResult,
  ProductAutomationBriefingResult,
  ProductAutomationCard,
  ProductAutomationDashboard,
} from "./types";

export function parseProductAutomationCard(data: unknown): ProductAutomationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    automation_score: Number(d.automation_score ?? 0),
    awaiting_approval_count: Number(d.awaiting_approval_count ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
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
  };
}

export function parseProductAutomationActionResult(data: unknown): ProductAutomationActionResult {
  return (data ?? {}) as ProductAutomationActionResult;
}

export function parseProductAutomationBriefingResult(data: unknown): ProductAutomationBriefingResult {
  return (data ?? {}) as ProductAutomationBriefingResult;
}
