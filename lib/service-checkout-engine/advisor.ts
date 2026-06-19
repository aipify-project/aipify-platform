const CHECKOUT_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(open checkout|pending payment|cart)\b/i, key: "open_checkouts" },
  { pattern: /\b(daily close|close (the )?day|end of day)\b/i, key: "daily_close" },
  { pattern: /\b(refund|return|credit note)\b/i, key: "refunds" },
  { pattern: /\b(front desk|queue|walk[- ]?in)\b/i, key: "front_desk" },
  { pattern: /\b(tip|gratuity)\b/i, key: "tips" },
  { pattern: /\b(receipt|print)\b/i, key: "payments" },
  { pattern: /\b(appointment|booking handoff)\b/i, key: "appointments" },
  { pattern: /\b(cash drawer|cash difference)\b/i, key: "cash_management" },
  { pattern: /\b(reconcil|settlement)\b/i, key: "reconciliation" },
];

export function detectCompanionCheckoutAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of CHECKOUT_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getCompanionCheckoutAdvisorRoute(intent: string | null): string {
  const base = "/app/checkout";
  switch (intent) {
    case "daily_close":
      return `${base}/daily-close`;
    case "refunds":
      return `${base}/refunds`;
    case "front_desk":
      return `${base}/front-desk`;
    case "tips":
      return `${base}/tips`;
    case "payments":
      return `${base}/payments`;
    case "appointments":
      return `${base}/appointments`;
    case "cash_management":
      return `${base}/cash-management`;
    case "reconciliation":
      return `${base}/reconciliation`;
    case "open_checkouts":
      return `${base}/open-checkouts`;
    default:
      return base;
  }
}
