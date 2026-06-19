const AOS_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(what changed|changed|updates across)\b/i, key: "changed" },
  { pattern: /\b(what matters|priorit|health|intelligence)\b/i, key: "matters" },
  { pattern: /\b(requires action|approval|attention|signal|risk)\b/i, key: "action" },
  { pattern: /\b(what next|should happen|orchestrat|companion)\b/i, key: "next" },
  { pattern: /\b(organization model|departments|roles|unified org)\b/i, key: "organization" },
  { pattern: /\b(search|find across|global search)\b/i, key: "search" },
  { pattern: /\b(report|briefing|board|executive report)\b/i, key: "report" },
  { pattern: /\b(business pack|pack orchestration|ecosystem)\b/i, key: "packs" },
];

export function detectAosAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of AOS_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getAosAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "changed":
      return "/app/aos";
    case "matters":
      return "/app/aos/intelligence";
    case "action":
      return "/app/aos/signals";
    case "next":
      return "/app/aos/companion";
    case "organization":
      return "/app/aos/organization";
    case "search":
      return "/app/aos/operations";
    case "report":
      return "/app/aos/reports";
    case "packs":
      return "/app/aos/business-packs";
    default:
      return "/app/aos";
  }
}
