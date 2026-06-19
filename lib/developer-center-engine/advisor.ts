const DEVELOPER_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(project|developer|build)\b/i, key: "projects" },
  { pattern: /\b(sdk|manifest|component|localization)\b/i, key: "sdk" },
  { pattern: /\b(api|endpoint|key|rest|event)\b/i, key: "api" },
  { pattern: /\b(test|sandbox|validation|validate)\b/i, key: "testing" },
  { pattern: /\b(publish|version|certif|release)\b/i, key: "publishing" },
  { pattern: /\b(marketplace|listing|catalog)\b/i, key: "marketplace" },
  { pattern: /\b(report|briefing|audit|documentation)\b/i, key: "reports" },
];

export function detectDeveloperAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of DEVELOPER_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getDeveloperAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "projects":
      return "/platform/developers/projects";
    case "sdk":
      return "/platform/developers/sdk";
    case "api":
      return "/platform/developers/api";
    case "testing":
      return "/platform/developers/testing";
    case "publishing":
      return "/platform/developers/publishing";
    case "marketplace":
      return "/platform/developers/marketplace";
    default:
      return "/platform/developers/reports";
  }
}
