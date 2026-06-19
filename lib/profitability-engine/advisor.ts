const PROFITABILITY_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(margin|margins|profitability|profit)\b/i, key: "margins" },
  { pattern: /\b(pric(e|ing)|list price|recommend)\b/i, key: "pricing" },
  { pattern: /\b(cost|costing|labor cost|consumable)\b/i, key: "costs" },
  { pattern: /\b(overhead|allocation|allocate)\b/i, key: "allocations" },
  { pattern: /\b(scenario|what.?if|simulate)\b/i, key: "scenarios" },
  { pattern: /\b(exception|incomplete|missing data)\b/i, key: "exceptions" },
  { pattern: /\b(approval|approve)\b/i, key: "approvals" },
  { pattern: /\b(policy|governance|threshold)\b/i, key: "policies" },
  { pattern: /\b(service|services)\b/i, key: "services" },
  { pattern: /\b(forecast|projection)\b/i, key: "forecasts" },
];

export function detectProfitabilityAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of PROFITABILITY_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getProfitabilityAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "margins":
      return "/app/profitability/margins";
    case "pricing":
      return "/app/profitability/pricing";
    case "costs":
      return "/app/profitability/costs";
    case "allocations":
      return "/app/profitability/allocations";
    case "scenarios":
      return "/app/profitability/scenarios";
    case "exceptions":
      return "/app/profitability/exceptions";
    case "approvals":
      return "/app/profitability/approvals";
    case "policies":
      return "/app/profitability/policies";
    case "services":
      return "/app/profitability/services";
    case "forecasts":
      return "/app/profitability/forecasts";
    default:
      return "/app/profitability";
  }
}
