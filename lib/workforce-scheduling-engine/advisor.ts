const SCHEDULING_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(coverage|gap|understaffed|open shift)\b/i, key: "coverage" },
  { pattern: /\b(on[- ]?call|oncall|rotation)\b/i, key: "on_call" },
  { pattern: /\b(swap|trade shift|exchange)\b/i, key: "requests" },
  { pattern: /\b(fair|fairness|distribution)\b/i, key: "policies" },
  { pattern: /\b(tomorrow|this week|schedule|who is working)\b/i, key: "schedule" },
  { pattern: /\b(briefing|handover|pre-shift)\b/i, key: "on_call" },
  { pattern: /\b(conflict|overlap|double booked)\b/i, key: "conflicts" },
  { pattern: /\b(availability|time off|vacation)\b/i, key: "availability" },
];

export function detectCompanionSchedulingAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of SCHEDULING_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getCompanionSchedulingAdvisorRoute(intent: string | null, partner = false): string {
  const base = partner ? "/partners/workforce-scheduling" : "/app/workforce-scheduling";
  switch (intent) {
    case "on_call":
      return `${base}/on-call`;
    case "coverage":
      return `${base}/coverage`;
    case "requests":
      return `${base}/requests`;
    case "conflicts":
      return `${base}/conflicts`;
    case "availability":
      return `${base}/availability`;
    case "policies":
      return `${base}/policies`;
    case "schedule":
      return `${base}/schedule`;
    default:
      return base;
  }
}
