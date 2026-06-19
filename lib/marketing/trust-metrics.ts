import { getSkillRegistrySummary } from "@/lib/core/skills/registry";

/** Customer-facing marketing locales with full marketing copy (Phase 391). */
export const MARKETING_WEBSITE_LOCALES = 4;

/** Active Business Pack domains surfaced on the public website. */
export const MARKETING_BUSINESS_PACK_COUNT = 6;

export type MarketingTrustMetricKey =
  | "businessPacks"
  | "operationalModules"
  | "knowledgeAssets"
  | "approvalWorkflows"
  | "supportedLanguages"
  | "governanceControls";

export type MarketingTrustMetricValues = Record<MarketingTrustMetricKey, number>;

export function getMarketingTrustMetricValues(): MarketingTrustMetricValues {
  const { total } = getSkillRegistrySummary();

  return {
    businessPacks: MARKETING_BUSINESS_PACK_COUNT,
    operationalModules: total,
    knowledgeAssets: total,
    approvalWorkflows: 1,
    supportedLanguages: MARKETING_WEBSITE_LOCALES,
    governanceControls: 6,
  };
}

export function formatMarketingTrustMetricValue(
  key: MarketingTrustMetricKey,
  value: number
): string {
  if (key === "approvalWorkflows") {
    return "Built-in";
  }

  if (key === "supportedLanguages" || key === "businessPacks" || key === "governanceControls") {
    return String(value);
  }

  return value >= 10 ? `${value}+` : String(value);
}
