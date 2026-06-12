import type { BillingCenter, EnterprisePricingPhilosophy, ModulesCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function parseEnterprisePricingPhilosophy(value: unknown): EnterprisePricingPhilosophy | undefined {
  if (!value || typeof value !== "object") return undefined;
  const d = value as Record<string, unknown>;
  return {
    doc: typeof d.doc === "string" ? d.doc : undefined,
    principle: typeof d.principle === "string" ? d.principle : undefined,
    value_based_avoid: asArray<string>(d.value_based_avoid),
    value_based_price_on: asArray<string>(d.value_based_price_on),
    customer_segments: asArray(d.customer_segments),
    plan_pricing_guidance: asArray(d.plan_pricing_guidance),
    enterprise_implementation:
      d.enterprise_implementation && typeof d.enterprise_implementation === "object"
        ? (d.enterprise_implementation as Record<string, unknown>)
        : undefined,
    sales_expert_examples: asArray(d.sales_expert_examples),
    revenue_model:
      d.revenue_model && typeof d.revenue_model === "object"
        ? (d.revenue_model as Record<string, unknown>)
        : undefined,
    positioning_comparisons: asArray<{ avoid?: string; prefer?: string }>(d.positioning_comparisons),
    pricing_signal_expectations: asArray<string>(d.pricing_signal_expectations),
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    vision: asArray<string>(d.vision),
    guidance_note: typeof d.guidance_note === "string" ? d.guidance_note : undefined,
  };
}

export function parseBillingCenter(data: unknown): BillingCenter {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  const pkg = d.current_package as Record<string, unknown> | undefined;
  return {
    has_customer: Boolean(d.has_customer),
    current_package: pkg
      ? {
          package_key: String(pkg.package_key ?? ""),
          package_name: String(pkg.package_name ?? ""),
          description: String(pkg.description ?? ""),
          features: asArray<string>(pkg.features),
        }
      : undefined,
    enabled_modules: asArray(d.enabled_modules),
    usage: d.usage as Record<string, unknown>,
    tenant_limits: d.tenant_limits as Record<string, unknown>,
    upgrade_options: asArray(d.upgrade_options),
    addon_marketplace: asArray(d.addon_marketplace),
    upgrade_recommendations: asArray(d.upgrade_recommendations),
    billing_history: asArray(d.billing_history),
    suites: asArray(d.suites) as BillingCenter["suites"],
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    positioning: typeof d.positioning === "string" ? d.positioning : undefined,
    enterprise_pricing_philosophy: parseEnterprisePricingPhilosophy(d.enterprise_pricing_philosophy),
  };
}

export function parseModulesCenter(data: unknown): ModulesCenter {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    current_package: typeof d.current_package === "string" ? d.current_package : undefined,
    installed_modules: asArray(d.installed_modules),
    available_modules: asArray(d.available_modules),
    trial_modules: asArray(d.trial_modules),
    upgrade_recommendations: asArray(d.upgrade_recommendations),
    feature_flag_states: asArray<string>(d.feature_flag_states),
    packages: asArray(d.packages),
    documentation_note:
      typeof d.documentation_note === "string" ? d.documentation_note : undefined,
    integrations: d.integrations as Record<string, string>,
  };
}
