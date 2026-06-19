const ACTION_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(can you|can aipify|do this|capable)\b/i, key: "can_do" },
  { pattern: /\b(approval|approve|who approves|required)\b/i, key: "approval" },
  { pattern: /\b(permission|who can|access)\b/i, key: "permissions" },
  { pattern: /\b(integration|connect|system|needed)\b/i, key: "integrations" },
  { pattern: /\b(pending|waiting|queue)\b/i, key: "pending" },
  { pattern: /\b(failed|error|retry)\b/i, key: "failed" },
  { pattern: /\b(template|start quickly)\b/i, key: "templates" },
  { pattern: /\b(report|summary|overview)\b/i, key: "report" },
];

export function detectCompanionActionAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of ACTION_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getCompanionActionAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "approval":
      return "/app/actions/approvals";
    case "permissions":
      return "/app/actions/permissions";
    case "integrations":
      return "/app/integrations";
    case "pending":
      return "/app/actions/pending";
    case "failed":
      return "/app/actions/history";
    case "templates":
      return "/app/actions/reports";
    default:
      return "/app/actions/reports";
  }
}
