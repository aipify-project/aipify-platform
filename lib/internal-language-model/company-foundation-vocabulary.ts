/** Aipify Group AS — Company Foundation Directive vocabulary. */

export const COMPANY_LEGAL_NAME = "Aipify Group AS" as const;

export const COMPANY_COUNTRY_OF_ORIGIN = "Norway" as const;

export const COMPANY_TAGLINE = "From Norway. For the world." as const;

export const PRODUCT_NAME = "Aipify" as const;

export const COMPANY_MISSION_LEAD =
  "Develop intelligent software that empowers people — never built to replace them." as const;

export const COMPANY_VISION_LEAD =
  "One of the world's leading providers of AI-powered business operating systems." as const;

export const COMPANY_SECONDARY_MESSAGING = [
  "Business Intelligence. Human Understanding.",
  "Built to support. Designed to scale.",
  "AI that works with people.",
] as const;

export const COMPANY_PRINCIPLES = [
  "Build for trust before scale.",
  "Build for longevity before trends.",
  "Enterprise quality is the minimum standard.",
  "Human oversight remains essential.",
  "Technology should remove friction, not humanity.",
  "Every feature should solve a real problem.",
  "Global ambitions must be supported by local understanding.",
  "The best products are often built from frustrations experienced firsthand.",
] as const;

export const COMPANY_DECISION_FILTER_QUESTION =
  "Does this support the long-term vision of Aipify Group AS?" as const;

export const COMPANY_GLOBAL_REMINDER =
  "Think globally. Build responsibly. Act professionally." as const;

/** Use in legal, investor, ownership, and platform-admin copy. */
export function formatCompanyLegalReference(): string {
  return `${COMPANY_LEGAL_NAME} · ${COMPANY_TAGLINE}`;
}

/** Use when both company and product must appear together. */
export function formatCompanyProductLine(): string {
  return `${PRODUCT_NAME} is developed by ${COMPANY_LEGAL_NAME}. ${COMPANY_TAGLINE}`;
}
