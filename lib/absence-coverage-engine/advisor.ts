const VACATION_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(vacation|ferie|away|absence|fravær)\b/i, key: "vacation" },
  { pattern: /\b(coverage|dekning|continuity)\b/i, key: "coverage" },
  { pattern: /\b(delegat|delegate|coverage person)\b/i, key: "delegation" },
  { pattern: /\b(template|response|svar)\b/i, key: "responses" },
  { pattern: /\b(return|tilbake|come back)\b/i, key: "return" },
  { pattern: /\b(readiness|ready|prepared)\b/i, key: "readiness" },
  { pattern: /\b(team|availability|tilgjengelig)\b/i, key: "team" },
  { pattern: /\b(report|analytics|continuity score)\b/i, key: "reports" },
];

export function detectVacationAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of VACATION_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getVacationAdvisorRoute(intent: string | null, basePath = "/app/absence"): string {
  switch (intent) {
    case "coverage":
      return `${basePath}/coverage`;
    case "delegation":
      return `${basePath}/delegation`;
    case "responses":
      return `${basePath}/aipify-responses`;
    case "return":
      return `${basePath}/return-summary`;
    case "readiness":
      return basePath;
    case "team":
      return `${basePath}/team-availability`;
    case "reports":
      return `${basePath}/reports`;
    default:
      return `${basePath}/my-vacation`;
  }
}
