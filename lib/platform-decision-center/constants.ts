export const RECOMMENDATION_CATEGORIES = [
  "customer_success",
  "revenue_growth",
  "product_improvements",
  "support_optimization",
  "operational_efficiency",
  "security_awareness",
  "governance_improvements",
] as const;

export type RecommendationCategory = (typeof RECOMMENDATION_CATEGORIES)[number];

export const IMPACT_LEVELS = ["low", "medium", "high", "strategic"] as const;

export type ImpactLevel = (typeof IMPACT_LEVELS)[number];

export const RECOMMENDATION_STATUSES = [
  "new",
  "under_review",
  "accepted",
  "implemented",
  "dismissed",
] as const;

export type RecommendationStatus = (typeof RECOMMENDATION_STATUSES)[number];

export const STATUS_BADGES: Record<RecommendationStatus, string> = {
  new: "bg-sky-50 text-sky-800 ring-sky-200",
  under_review: "bg-amber-50 text-amber-900 ring-amber-200",
  accepted: "bg-green-50 text-green-800 ring-green-200",
  implemented: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  dismissed: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const IMPACT_BADGES: Record<ImpactLevel, string> = {
  low: "bg-gray-100 text-gray-800 ring-gray-200",
  medium: "bg-sky-50 text-sky-800 ring-sky-200",
  high: "bg-orange-50 text-orange-900 ring-orange-200",
  strategic: "bg-violet-50 text-violet-800 ring-violet-200",
};

export function confidenceLabel(score: number): string {
  return `${Math.round(score)}%`;
}

export function confidenceTone(score: number): string {
  if (score >= 80) return "text-green-700";
  if (score >= 60) return "text-amber-700";
  return "text-red-700";
}
