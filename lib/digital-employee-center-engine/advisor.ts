const WORKFORCE_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(digital employee|workforce|registry|who exists)\b/i, key: "employees" },
  { pattern: /\b(performing|assigned|task|work)\b/i, key: "work" },
  { pattern: /\b(attention|escalat|pending|approval)\b/i, key: "attention" },
  { pattern: /\b(overload|role|team capacity)\b/i, key: "overloaded" },
  { pattern: /\b(performance|accuracy|completion)\b/i, key: "performance" },
  { pattern: /\b(permission|autonomy|governance)\b/i, key: "permissions" },
  { pattern: /\b(workforce report|report)\b/i, key: "report" },
];

export function detectWorkforceAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of WORKFORCE_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getWorkforceAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "employees":
      return "/app/digital-employees/employees";
    case "work":
      return "/app/digital-employees/assignments";
    case "attention":
      return "/app/digital-employees/approvals";
    case "overloaded":
      return "/app/digital-employees/roles";
    case "performance":
      return "/app/digital-employees/performance";
    case "permissions":
      return "/app/digital-employees/permissions";
    default:
      return "/app/digital-employees/reports";
  }
}
