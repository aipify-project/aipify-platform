const INTEGRATION_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(connected|systems|integrations|which apps)\b/i, key: "connected" },
  { pattern: /\b(permission|access|governance|scope)\b/i, key: "permissions" },
  { pattern: /\b(attention|failed|health|broken|expir)\b/i, key: "health" },
  { pattern: /\b(action|capabilit|what can)\b/i, key: "actions" },
  { pattern: /\b(sync|data|update)\b/i, key: "sync" },
  { pattern: /\b(marketplace|install|available)\b/i, key: "marketplace" },
  { pattern: /\b(report|summary|overview)\b/i, key: "report" },
];

export function detectIntegrationAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of INTEGRATION_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getIntegrationAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "connected":
      return "/app/integrations/connected-apps";
    case "permissions":
      return "/app/integrations/permissions";
    case "health":
      return "/app/integrations/health";
    case "actions":
      return "/app/integrations/permissions";
    case "sync":
      return "/app/integrations/logs";
    case "marketplace":
      return "/app/integrations/available-apps";
    default:
      return "/app/integrations/reports";
  }
}
