/** Canonical marketing conversion destinations — Phase 389 primary CTA standard. */
export const MARKETING_PRIMARY_CTA_HREFS = {
  bookDemo: "/book-demo",
  earlyAccess: "/early-access",
  growthPartners: "/growth-partners",
  seeHowItWorks: "#how-it-works",
} as const;

/** Phase 394 — enterprise buyer CTAs. */
export const MARKETING_ENTERPRISE_CTA_HREFS = {
  bookEnterpriseDemo: "/book-demo",
  speakWithAipify: "/contact",
  earlyAccess: "/early-access",
} as const;

export type MarketingPrimaryCtaLabels = {
  bookDemo: string;
  earlyAccess: string;
  growthPartners: string;
  seeHowItWorks?: string;
};
