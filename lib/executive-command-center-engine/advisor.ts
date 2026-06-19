const EXECUTIVE_COMMAND_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(summarize|summary|organization|org)\b/i, key: "summarize" },
  { pattern: /\b(changed|major changes|since last|what happened)\b/i, key: "changes" },
  { pattern: /\b(leadership|briefing|morning|executive briefing)\b/i, key: "briefing" },
  { pattern: /\b(risk|threat|emerging risk)\b/i, key: "risks" },
  { pattern: /\b(opportunit|expansion|growth)\b/i, key: "opportunities" },
  { pattern: /\b(board|director|qbr|mbr)\b/i, key: "board" },
  { pattern: /\b(approval|pending|action center)\b/i, key: "approvals" },
  { pattern: /\b(alert|urgent|critical|attention)\b/i, key: "alerts" },
];

export function detectExecutiveCommandAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of EXECUTIVE_COMMAND_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getExecutiveCommandAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "changes":
      return "/app/command-center/since-last-login";
    case "briefing":
      return "/app/command-center/companion-briefing";
    case "risks":
      return "/app/command-center/risks";
    case "opportunities":
      return "/app/command-center/opportunities";
    case "board":
      return "/app/command-center/companion-briefing";
    case "approvals":
      return "/app/command-center/approvals";
    case "alerts":
      return "/app/command-center/alerts";
    default:
      return "/app/command-center";
  }
}
