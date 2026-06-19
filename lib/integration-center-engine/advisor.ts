const INTEGRATION_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(connected|systems|integrations)\b/i, key: "connected" },
  { pattern: /\b(permission|access|grant)\b/i, key: "permissions" },
  { pattern: /\b(attention|failed|health|broken)\b/i, key: "health" },
  { pattern: /\b(action|capabilit|available)\b/i, key: "capabilities" },
  { pattern: /\b(install|marketplace|available app)\b/i, key: "marketplace" },
  { pattern: /\b(sync|data)\b/i, key: "sync" },
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
    case "permissions":
      return "/app/integrations/permissions";
    case "health":
      return "/app/integrations/health";
    case "capabilities":
      return "/app/integrations/permissions";
    case "marketplace":
      return "/app/integrations/available-apps";
    case "sync":
      return "/app/integrations/health";
    default:
      return "/app/integrations/reports";
  }
}
