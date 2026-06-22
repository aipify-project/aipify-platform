export const APP_PORTAL_PREMIUM_PLAN_KEYS = new Set([
  "business",
  "enterprise",
  "professional",
  "growth",
  "lifetime",
  "internal",
]);

export function isPremiumPortalPlan(planKey: string | null | undefined): boolean {
  if (!planKey) return false;
  const normalized = planKey.toLowerCase().replace(/\s+/g, "_");
  if (APP_PORTAL_PREMIUM_PLAN_KEYS.has(normalized)) return true;
  for (const key of APP_PORTAL_PREMIUM_PLAN_KEYS) {
    if (normalized.includes(key)) return true;
  }
  return false;
}

export function resolvePortalFeatureEnabled(
  feature: string,
  planKey: string | null | undefined
): boolean {
  const normalized = feature.trim() || "core";
  if (normalized === "business_packs" || normalized === "workflows" || normalized === "advanced_insights") {
    return isPremiumPortalPlan(planKey);
  }
  if (normalized === "team_management" || normalized === "billing") {
    return planKey !== "paused";
  }
  return true;
}
