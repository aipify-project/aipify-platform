/** Aipify Hosts property licensing — one platform, capacity-only limits. */
export const AIPIFY_HOSTS_PLAN_TYPES = [
  "hosts_solo",
  "hosts_5",
  "hosts_10",
  "hosts_20",
  "hosts_enterprise",
] as const;

export type AipifyHostsPlanType = (typeof AIPIFY_HOSTS_PLAN_TYPES)[number];

/** Maps legacy plan keys to current capacity-based keys. */
export const AIPIFY_HOSTS_LEGACY_PLAN_MAP: Record<string, AipifyHostsPlanType> = {
  hosts_starter: "hosts_5",
  hosts_professional: "hosts_10",
  hosts_business: "hosts_20",
};

export const AIPIFY_HOSTS_BASE_PROPERTY_LIMITS: Record<AipifyHostsPlanType, number | null> = {
  hosts_solo: 1,
  hosts_5: 5,
  hosts_10: 10,
  hosts_20: 20,
  hosts_enterprise: null,
};

export const AIPIFY_HOSTS_LICENSING_PRINCIPLE =
  "Customers buy operational capacity — not different functionality.";

export function normalizeHostsPlanKey(planKey?: string | null): AipifyHostsPlanType {
  if (!planKey) return "hosts_5";
  const normalized = AIPIFY_HOSTS_LEGACY_PLAN_MAP[planKey] ?? planKey;
  if ((AIPIFY_HOSTS_PLAN_TYPES as readonly string[]).includes(normalized)) {
    return normalized as AipifyHostsPlanType;
  }
  return "hosts_5";
}

/** Full platform for every plan — no feature fragmentation. */
export function isHostsModuleIncluded(_packageKey?: string, _moduleKey?: string): boolean {
  return true;
}

export const AIPIFY_HOSTS_BILLING_ROUTE = "/app/settings/billing/packages";
export const AIPIFY_HOSTS_CONTACT_SALES_ROUTE = "mailto:sales@aipify.ai?subject=Aipify%20Hosts%20Enterprise";
