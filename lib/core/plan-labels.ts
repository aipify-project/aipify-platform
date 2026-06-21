import type { Translator } from "@/lib/i18n/translate";
import { PACKAGE_TIER_LABELS } from "@/lib/package-access/constants";

const PLAN_KEY_ALIASES: Record<string, string> = {
  growth: "professional",
  professional: "professional",
  insights: "business",
};

export function normalizePlanKey(planKey?: string | null): string {
  const raw = (planKey ?? "").trim().toLowerCase();
  if (!raw) return "starter";
  return PLAN_KEY_ALIASES[raw] ?? raw;
}

/** Shared formatter — never show raw plan_key strings like "starter" in customer UI. */
export function formatPlanLabel(
  planKey?: string | null,
  t?: Translator,
  i18nPrefix = "customerApp.portalStructure.planLabels"
): string {
  const normalized = normalizePlanKey(planKey);
  if (t) {
    const translated = t(`${i18nPrefix}.${normalized}`);
    if (translated !== `${i18nPrefix}.${normalized}`) return translated;
  }
  const tierKey = normalized as keyof typeof PACKAGE_TIER_LABELS;
  if (tierKey in PACKAGE_TIER_LABELS) {
    return PACKAGE_TIER_LABELS[tierKey];
  }
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}
