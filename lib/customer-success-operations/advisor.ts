const CSAR587_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(at risk|at-risk|churn|retention)\b/i, key: "at_risk" },
  { pattern: /\b(thriving|healthy|success)\b/i, key: "thriving" },
  { pattern: /\b(expand|expansion|upgrade|upsell)\b/i, key: "expansion" },
  { pattern: /\b(onboarding|incomplete|setup)\b/i, key: "onboarding" },
  { pattern: /\b(renewal|renew)\b/i, key: "renewal" },
  { pattern: /\b(adoption|usage|engage)\b/i, key: "adoption" },
  { pattern: /\b(customer success|health score)\b/i, key: "health" },
];

export function detectCustomerSuccessAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of CSAR587_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getCustomerSuccessAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "onboarding":
      return "/app/customer-success/onboarding";
    case "renewal":
      return "/app/customer-success/renewals";
    case "expansion":
      return "/app/customer-success/opportunities";
    case "at_risk":
      return "/app/customer-success/risks";
    case "adoption":
      return "/app/customer-success/adoption";
    default:
      return "/app/customer-success";
  }
}
