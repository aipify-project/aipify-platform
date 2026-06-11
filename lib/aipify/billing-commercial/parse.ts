import type {
  CommercialModelActionResult,
  CommercialModelBriefingResult,
  CommercialModelCard,
  CommercialModelDashboard,
} from "./types";

export function parseCommercialModelCard(data: unknown): CommercialModelCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    customer_tier: typeof d.customer_tier === "string" ? d.customer_tier : undefined,
    customer_tier_label: typeof d.customer_tier_label === "string" ? d.customer_tier_label : undefined,
    health_score: Number(d.health_score ?? 0),
    mrr: Number(d.mrr ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
  };
}

export function parseCommercialModelDashboard(data: unknown): CommercialModelDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    self_service_enabled: Boolean(d.self_service_enabled ?? true),
    trials_enabled: Boolean(d.trials_enabled ?? true),
    partner_billing_enabled: Boolean(d.partner_billing_enabled ?? true),
    global_billing_enabled: Boolean(d.global_billing_enabled ?? true),
    downgrade_grace_days: Number(d.downgrade_grace_days ?? 14),
    customer_tier: typeof d.customer_tier === "string" ? d.customer_tier : undefined,
    customer_tier_label: typeof d.customer_tier_label === "string" ? d.customer_tier_label : undefined,
    health_score: Number(d.health_score ?? 0),
    engagement_score: Number(d.engagement_score ?? 0),
    adoption_score: Number(d.adoption_score ?? 0),
    renewal_likelihood: Number(d.renewal_likelihood ?? 0),
    expansion_opportunity: Number(d.expansion_opportunity ?? 0),
    mrr: Number(d.mrr ?? 0),
    arr: Number(d.arr ?? 0),
    currency: typeof d.currency === "string" ? d.currency : "EUR",
    billing_cycle: typeof d.billing_cycle === "string" ? d.billing_cycle : undefined,
    subscription_status: typeof d.subscription_status === "string" ? d.subscription_status : undefined,
    payment_method: typeof d.payment_method === "string" ? d.payment_method : undefined,
    packaging_layers: Array.isArray(d.packaging_layers)
      ? (d.packaging_layers as CommercialModelDashboard["packaging_layers"])
      : [],
    customer_tiers: Array.isArray(d.customer_tiers)
      ? (d.customer_tiers as CommercialModelDashboard["customer_tiers"])
      : [],
    subscription_models: Array.isArray(d.subscription_models) ? (d.subscription_models as string[]) : [],
    business_packs: Array.isArray(d.business_packs) ? (d.business_packs as CommercialModelDashboard["business_packs"]) : [],
    addon_modules: Array.isArray(d.addon_modules) ? (d.addon_modules as CommercialModelDashboard["addon_modules"]) : [],
    enterprise_services: Array.isArray(d.enterprise_services)
      ? (d.enterprise_services as CommercialModelDashboard["enterprise_services"])
      : [],
    usage_metrics: typeof d.usage_metrics === "object" && d.usage_metrics
      ? (d.usage_metrics as Record<string, unknown>)
      : undefined,
    invoices: Array.isArray(d.invoices) ? (d.invoices as CommercialModelDashboard["invoices"]) : [],
    renewal_events: Array.isArray(d.renewal_events) ? (d.renewal_events as CommercialModelDashboard["renewal_events"]) : [],
    partner_commissions: Array.isArray(d.partner_commissions)
      ? (d.partner_commissions as CommercialModelDashboard["partner_commissions"])
      : [],
    commercial_analytics: typeof d.commercial_analytics === "object" && d.commercial_analytics
      ? (d.commercial_analytics as Record<string, unknown>)
      : undefined,
    downgrade_controls: Array.isArray(d.downgrade_controls) ? d.downgrade_controls : [],
    trial_framework: Array.isArray(d.trial_framework) ? (d.trial_framework as string[]) : [],
    pricing_governance: Array.isArray(d.pricing_governance) ? (d.pricing_governance as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as CommercialModelDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
  };
}

export function parseCommercialModelActionResult(data: unknown): CommercialModelActionResult {
  return (data ?? {}) as CommercialModelActionResult;
}

export function parseCommercialModelBriefingResult(data: unknown): CommercialModelBriefingResult {
  return (data ?? {}) as CommercialModelBriefingResult;
}
