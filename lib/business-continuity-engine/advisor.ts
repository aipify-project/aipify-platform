const CONTINUITY_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(readiness|prepared|continuity score)\b/i, key: "readiness" },
  { pattern: /\b(dependenc|single point|spof|supplier)\b/i, key: "dependencies" },
  { pattern: /\b(crisis|emergency|incident)\b/i, key: "crisis" },
  { pattern: /\b(recover|recovery|restore)\b/i, key: "recovery" },
  { pattern: /\b(plan|continuity plan|bia|business impact)\b/i, key: "plans" },
  { pattern: /\b(exercise|tabletop|simulation|drill)\b/i, key: "exercises" },
  { pattern: /\b(contact|emergency contact)\b/i, key: "contacts" },
  { pattern: /\b(communicat|status page|customer message)\b/i, key: "communication" },
];

export function detectContinuityAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of CONTINUITY_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getContinuityAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "readiness":
      return "/app/business-continuity";
    case "dependencies":
      return "/app/business-continuity/dependencies";
    case "crisis":
      return "/app/business-continuity/crisis";
    case "recovery":
      return "/app/business-continuity/recovery";
    case "plans":
      return "/app/business-continuity/plans";
    case "exercises":
      return "/app/business-continuity/exercises";
    case "contacts":
      return "/app/business-continuity/emergency-contacts";
    case "communication":
      return "/app/business-continuity/communication";
    default:
      return "/app/business-continuity/reports";
  }
}
