const RELATIONSHIP_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(follow.?up|follow up|commitment)\b/i, key: "follow_up" },
  { pattern: /\b(customer|attention|relationship)\b/i, key: "customers" },
  { pattern: /\b(date|milestone|anniversary|birthday|renewal)\b/i, key: "dates" },
  { pattern: /\b(preference|setting|personaliz)\b/i, key: "preferences" },
  { pattern: /\b(review|approve|delete|correct)\b/i, key: "review" },
  { pattern: /\b(context|remember|previous)\b/i, key: "context" },
  { pattern: /\b(briefing|report|summary)\b/i, key: "report" },
];

export function detectRelationshipAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of RELATIONSHIP_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getRelationshipAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "follow_up":
      return "/app/memory/reports";
    case "customers":
      return "/app/memory/relationships";
    case "dates":
      return "/app/memory/organization";
    case "preferences":
      return "/app/memory/preferences";
    case "review":
      return "/app/memory/reviews";
    case "context":
      return "/app/memory/personal";
    default:
      return "/app/memory/reports";
  }
}
