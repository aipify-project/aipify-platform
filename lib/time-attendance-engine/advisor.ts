const TIME_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(timesheet|submit|hours)\b/i, key: "timesheet" },
  { pattern: /\b(leave|vacation|absence|holiday)\b/i, key: "leave" },
  { pattern: /\b(overtime|extra hours)\b/i, key: "overtime" },
  { pattern: /\b(payroll|export|fiken)\b/i, key: "payroll" },
  { pattern: /\b(attendance|clock|timer)\b/i, key: "attendance" },
  { pattern: /\b(policy|privacy|surveillance)\b/i, key: "policy" },
];

export function detectTimeAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of TIME_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getTimeAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "timesheet":
      return "/app/time-attendance/timesheets";
    case "leave":
      return "/app/time-attendance/leave";
    case "overtime":
      return "/app/time-attendance/overtime";
    case "payroll":
      return "/app/time-attendance/payroll-preparation";
    case "attendance":
      return "/app/time-attendance/attendance";
    case "policy":
      return "/app/time-attendance/policies";
    default:
      return "/app/time-attendance";
  }
}
