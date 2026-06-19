const STRATEGIC_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(focus|priorit|what should)\b/i, key: "focus" },
  { pattern: /\b(changed|this month|what changed)\b/i, key: "changes" },
  { pattern: /\b(risk|threat|attention)\b/i, key: "risks" },
  { pattern: /\b(opportunit|emerging|expand)\b/i, key: "opportunities" },
  { pattern: /\b(board|governance|director)\b/i, key: "board" },
  { pattern: /\b(strateg|objective|planning)\b/i, key: "strategy" },
];

export function detectStrategicAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of STRATEGIC_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getStrategicAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "risks":
      return "/app/strategy/risks";
    case "opportunities":
      return "/app/strategy/opportunities";
    case "board":
      return "/app/strategy/board";
    case "focus":
      return "/app/strategy/objectives";
    default:
      return "/app/strategy";
  }
}
