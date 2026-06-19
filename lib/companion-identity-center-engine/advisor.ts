const IDENTITY_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(identity|who are you|companion name|values)\b/i, key: "identity" },
  { pattern: /\b(personality|trait|character)\b/i, key: "personality" },
  { pattern: /\b(communication|tone|style|briefing|concise)\b/i, key: "communication" },
  { pattern: /\b(humor|playful|friendly)\b/i, key: "humor" },
  { pattern: /\b(preference|setting|theme|notification)\b/i, key: "preferences" },
  { pattern: /\b(wellbeing|self.?love|self.?care|healthy)\b/i, key: "wellbeing" },
  { pattern: /\b(governance|aggressive|manipul|inappropriate)\b/i, key: "governance" },
  { pattern: /\b(executive|board mode|briefing depth)\b/i, key: "executive" },
  { pattern: /\b(introduction|welcome|greeting)\b/i, key: "introduction" },
];

export function detectCompanionIdentityAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of IDENTITY_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getCompanionIdentityAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "identity":
      return "/app/companion/identity/core";
    case "personality":
      return "/app/companion/identity/personality";
    case "communication":
    case "humor":
    case "introduction":
    case "executive":
      return "/app/companion/identity/communication";
    case "preferences":
    case "themes":
      return "/app/companion/identity/preferences";
    case "wellbeing":
    case "governance":
      return "/app/companion/identity/behavior";
    default:
      return "/app/companion/identity/reports";
  }
}
