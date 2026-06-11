import type { BillingCenter, ModulesCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
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
