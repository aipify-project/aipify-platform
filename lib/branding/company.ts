/** Canonical Aipify Group AS brand foundation — see AIPIFY_GROUP_AS_BRAND_FOUNDATION.md */
export const AIPIFY_GROUP = {
  legalName: "Aipify Group AS",
  headquarters: "Bergen, Norway",
  headquartersCity: "Bergen",
  headquartersCountry: "Norway",
  officialStatementLines: ["Bergen.", "Norway. For the world."] as const,
  marketingSignature: "Bergen. Norway. For the world.",
  shortSignature: "Norway. For the world.",
  foundingPrinciple: "Our ambition is global. Our values remain Norwegian.",
  footerDescription:
    "Building intelligent business systems designed to help organizations work smarter, respond faster, and grow with confidence.",
  investorLine:
    "Founded in Bergen, Norway. Building operational business systems for organizations worldwide.",
  principles: [
    "Humble enough to listen.",
    "Ambitious enough to think globally.",
    "Disciplined enough to build for the long term.",
    "Responsible enough to earn trust.",
    "Curious enough to keep improving.",
  ] as const,
  internalReminder: [
    "Never pretend to be bigger than we are.",
    "Be proud of where we come from.",
    "Build products worthy of being used around the world.",
  ] as const,
} as const;

export type AipifyGroupBrand = typeof AIPIFY_GROUP;
