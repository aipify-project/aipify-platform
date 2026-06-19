const COMPENSATION_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(commission|commissions|sales comp)\b/i, key: "commissions" },
  { pattern: /\b(tip|tips|gratuity)\b/i, key: "tips" },
  { pattern: /\b(bonus|bonuses)\b/i, key: "bonuses" },
  { pattern: /\b(payroll|export|fiken)\b/i, key: "payroll" },
  { pattern: /\b(approval|approve)\b/i, key: "approvals" },
  { pattern: /\b(exception|blocker)\b/i, key: "exceptions" },
  { pattern: /\b(my pay|my compensation|payslip)\b/i, key: "my_compensation" },
  { pattern: /\b(policy|governance|separation)\b/i, key: "policies" },
];

export function detectCompensationAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of COMPENSATION_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getCompensationAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "commissions":
      return "/app/compensation/commissions";
    case "tips":
      return "/app/compensation/tips";
    case "bonuses":
      return "/app/compensation/bonuses";
    case "payroll":
      return "/app/compensation/payroll-input";
    case "approvals":
      return "/app/compensation/approvals";
    case "exceptions":
      return "/app/compensation/exceptions";
    case "my_compensation":
      return "/app/compensation/my-compensation";
    case "policies":
      return "/app/compensation/policies";
    default:
      return "/app/compensation";
  }
}
