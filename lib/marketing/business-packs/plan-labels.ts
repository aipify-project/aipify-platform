import type { PublicMarketingPlanKey } from "@/lib/marketing/public-pricing";

export type MarketingPlanLabelMap = Record<PublicMarketingPlanKey, string>;

export const DEFAULT_MARKETING_PLAN_LABELS: MarketingPlanLabelMap = {
  starter: "Starter",
  professional: "Professional",
  business: "Business",
  enterprise: "Enterprise",
};

export function formatMarketingPlanLabel(
  plan: PublicMarketingPlanKey,
  labels: MarketingPlanLabelMap = DEFAULT_MARKETING_PLAN_LABELS,
): string {
  return labels[plan] ?? DEFAULT_MARKETING_PLAN_LABELS[plan] ?? plan;
}
