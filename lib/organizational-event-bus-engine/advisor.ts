const SIGNAL_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(signal|important|today|appeared)\b/i, key: "signals_today" },
  { pattern: /\b(changed|this week|what changed)\b/i, key: "weekly" },
  { pattern: /\b(pattern|emerging|trend)\b/i, key: "patterns" },
  { pattern: /\b(risk|watch|threat)\b/i, key: "risks" },
  { pattern: /\b(activity|live|stream|feed)\b/i, key: "activity" },
  { pattern: /\b(subscri|alert|notify)\b/i, key: "subscriptions" },
];

export function detectSignalAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of SIGNAL_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getSignalAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "weekly":
      return "/app/events/history";
    case "patterns":
      return "/app/events/signals";
    case "risks":
      return "/app/events/alerts";
    case "activity":
      return "/app/events/live-activity";
    case "subscriptions":
      return "/app/events/subscriptions";
    default:
      return "/app/events/reports";
  }
}
