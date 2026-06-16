/** Aipify Group AS — Company Foundation Directive vocabulary (sourced from company.config.ts). */

import { COMPANY_CONFIG } from "@/lib/company/company.config";
import {
  formatCompanyLegalReference,
  formatCompanyProductLine,
} from "@/lib/company/helpers";

export const COMPANY_LEGAL_NAME = COMPANY_CONFIG.legalCompanyName;

export const COMPANY_COUNTRY_OF_ORIGIN = COMPANY_CONFIG.country;

export const COMPANY_TAGLINE = COMPANY_CONFIG.corporateSignature;

export const PRODUCT_NAME = COMPANY_CONFIG.brandName;

export const COMPANY_MISSION_LEAD =
  "Develop intelligent software that empowers people — never built to replace them." as const;

export const COMPANY_VISION_LEAD =
  "One of the world's leading providers of Aipify-powered business operating systems." as const;

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
  `Does this support the long-term vision of ${COMPANY_CONFIG.legalCompanyName}?` as const;

export const COMPANY_GLOBAL_REMINDER =
  "Think globally. Build responsibly. Act professionally." as const;

/** Use in legal, investor, ownership, and platform-admin copy. */
export { formatCompanyLegalReference };

/** Use when both company and product must appear together. */
export { formatCompanyProductLine };
