export const FRICTION_CATEGORIES = [
  "support",
  "sales",
  "process",
  "team",
  "customer",
  "meeting",
  "email",
  "task",
] as const;

export type FrictionCategory = (typeof FRICTION_CATEGORIES)[number];

export const FRICTION_SCORE_LEVELS = ["low", "moderate", "elevated", "high"] as const;

export type FrictionScoreLevel = (typeof FRICTION_SCORE_LEVELS)[number];

export const FRICTION_RECOMMENDATION_STATUSES = [
  "active",
  "accepted",
  "dismissed",
  "implemented",
] as const;

export type FrictionRecommendationStatus = (typeof FRICTION_RECOMMENDATION_STATUSES)[number];

export const FIE_ALLOWED_PLANS = ["business", "enterprise"] as const;

export const FIE_ENTERPRISE_PLANS = ["enterprise"] as const;

export const FIE_BUSINESS_CATEGORIES: FrictionCategory[] = [
  "support",
  "sales",
  "process",
  "customer",
  "meeting",
  "email",
  "task",
];

export const FIE_ENTERPRISE_CATEGORIES: FrictionCategory[] = ["team"];
