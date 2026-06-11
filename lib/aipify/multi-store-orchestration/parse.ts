import type {
  MultiStoreActionResult,
  MultiStoreBriefingResult,
  MultiStoreOrchestrationCard,
  MultiStoreOrchestrationDashboard,
} from "./types";

export function parseMultiStoreOrchestrationCard(data: unknown): MultiStoreOrchestrationCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    portfolio_score: Number(d.portfolio_score ?? 0),
    portfolio_classification: typeof d.portfolio_classification === "string" ? d.portfolio_classification : undefined,
    stores_connected: Number(d.stores_connected ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseMultiStoreOrchestrationDashboard(data: unknown): MultiStoreOrchestrationDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    auto_sync_disabled: Boolean(d.auto_sync_disabled ?? true),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    orchestration_enabled: Boolean(d.orchestration_enabled ?? true),
    portfolio_score: Number(d.portfolio_score ?? 0),
    portfolio_classification: typeof d.portfolio_classification === "string" ? d.portfolio_classification : undefined,
    stores_connected: Number(d.stores_connected ?? 0),
    portfolio_revenue: Number(d.portfolio_revenue ?? 0),
    avg_profit_margin_percent: Number(d.avg_profit_margin_percent ?? 0),
    stores_needing_attention: Number(d.stores_needing_attention ?? 0),
    opportunity_count: Number(d.opportunity_count ?? 0),
    governance_gaps: Number(d.governance_gaps ?? 0),
    regions_tracked: Number(d.regions_tracked ?? 0),
    store_summaries: Array.isArray(d.store_summaries)
      ? (d.store_summaries as MultiStoreOrchestrationDashboard["store_summaries"])
      : [],
    cross_store_insights: Array.isArray(d.cross_store_insights)
      ? (d.cross_store_insights as MultiStoreOrchestrationDashboard["cross_store_insights"])
      : [],
    product_sync_guidance: Array.isArray(d.product_sync_guidance)
      ? (d.product_sync_guidance as MultiStoreOrchestrationDashboard["product_sync_guidance"])
      : [],
    opportunity_distributions: Array.isArray(d.opportunity_distributions)
      ? (d.opportunity_distributions as MultiStoreOrchestrationDashboard["opportunity_distributions"])
      : [],
    governance_coordination: Array.isArray(d.governance_coordination)
      ? (d.governance_coordination as MultiStoreOrchestrationDashboard["governance_coordination"])
      : [],
    regional_expansion: Array.isArray(d.regional_expansion)
      ? (d.regional_expansion as MultiStoreOrchestrationDashboard["regional_expansion"])
      : [],
    strategic_recommendations: Array.isArray(d.strategic_recommendations)
      ? (d.strategic_recommendations as MultiStoreOrchestrationDashboard["strategic_recommendations"])
      : [],
    portfolio_notifications: Array.isArray(d.portfolio_notifications)
      ? (d.portfolio_notifications as MultiStoreOrchestrationDashboard["portfolio_notifications"])
      : [],
    executive_reports: Array.isArray(d.executive_reports)
      ? (d.executive_reports as MultiStoreOrchestrationDashboard["executive_reports"])
      : [],
    integrations:
      typeof d.integrations === "object" && d.integrations ? (d.integrations as Record<string, string>) : undefined,
  };
}

export function parseMultiStoreActionResult(data: unknown): MultiStoreActionResult {
  return (data ?? {}) as MultiStoreActionResult;
}

export function parseMultiStoreBriefingResult(data: unknown): MultiStoreBriefingResult {
  return (data ?? {}) as MultiStoreBriefingResult;
}
