const ECOSYSTEM_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(provider|verification|certif)\b/i, key: "providers" },
  { pattern: /\b(business pack|pack publish|publication)\b/i, key: "publications" },
  { pattern: /\b(marketplace|listing|catalog)\b/i, key: "marketplace" },
  { pattern: /\b(governance|compliance|security review)\b/i, key: "governance" },
  { pattern: /\b(revenue|payout|revenue share|commission)\b/i, key: "revenue" },
  { pattern: /\b(review|rating|satisfaction)\b/i, key: "reviews" },
  { pattern: /\b(certification|partner program)\b/i, key: "certifications" },
  { pattern: /\b(ecosystem report|briefing|report)\b/i, key: "reports" },
];

export function detectEcosystemAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of ECOSYSTEM_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getEcosystemAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "providers":
      return "/platform/ecosystem/providers";
    case "publications":
      return "/platform/ecosystem/business-packs";
    case "marketplace":
      return "/platform/ecosystem/marketplace";
    case "governance":
      return "/platform/ecosystem/governance";
    case "revenue":
      return "/platform/ecosystem/revenue";
    case "reviews":
      return "/platform/ecosystem/reviews";
    case "certifications":
      return "/platform/ecosystem/certifications";
    default:
      return "/platform/ecosystem/reports";
  }
}
