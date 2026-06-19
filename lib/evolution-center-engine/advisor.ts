const EVOLUTION_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(build next|what should we build|roadmap)\b/i, key: "build_next" },
  { pattern: /\b(emerging|opportunit|growth|market)\b/i, key: "emerging" },
  { pattern: /\b(missing|capabilit|gap)\b/i, key: "missing" },
  { pattern: /\b(improve|stewardship|debt|recommend)\b/i, key: "improve" },
  { pattern: /\b(innovation|pilot|beta|experiment)\b/i, key: "innovation" },
  { pattern: /\b(companion evolution|identity|governance)\b/i, key: "companion" },
  { pattern: /\b(business pack|pack evolution)\b/i, key: "packs" },
  { pattern: /\b(evolution report|briefing|report)\b/i, key: "report" },
];

export function detectEvolutionAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of EVOLUTION_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getEvolutionAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "build_next":
      return "/app/evolution/roadmaps";
    case "emerging":
      return "/app/evolution/opportunities";
    case "missing":
      return "/app/evolution/platform";
    case "improve":
      return "/app/evolution/recommendations";
    case "innovation":
      return "/app/evolution/platform";
    case "companion":
      return "/app/evolution/companion";
    case "packs":
      return "/app/evolution/business-packs";
    default:
      return "/app/evolution/reports";
  }
}
