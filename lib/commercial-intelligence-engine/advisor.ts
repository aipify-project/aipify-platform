const REVENUE_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(churn|declining|retention risk)\b/i, key: "churn" },
  { pattern: /\b(grow|growth|increase revenue)\b/i, key: "growth" },
  { pattern: /\b(expand|expansion|upsell|upgrade)\b/i, key: "expansion" },
  { pattern: /\b(forecast|predict|projection)\b/i, key: "forecast" },
  { pattern: /\b(mrr|arr|recurring|nrr)\b/i, key: "recurring" },
  { pattern: /\b(revenue|commercial|drivers)\b/i, key: "revenue" },
];

export function detectRevenueAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of REVENUE_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getRevenueAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "churn":
      return "/app/revenue/retention";
    case "forecast":
      return "/app/revenue/forecasts";
    case "expansion":
    case "growth":
      return "/app/revenue/growth";
    default:
      return "/app/revenue";
  }
}
