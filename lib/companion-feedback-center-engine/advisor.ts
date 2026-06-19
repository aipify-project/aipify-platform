const EXPERIENCE_ADVISOR_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /\b(frustrat|unhelpful|problem|issue|complaint)\b/i, key: "frustrations" },
  { pattern: /\b(works best|helpful|positive|success|satisfaction)\b/i, key: "works_best" },
  { pattern: /\b(improve|next|recommend|gap|training)\b/i, key: "improve_next" },
  { pattern: /\b(business pack|pack feedback|module feedback)\b/i, key: "pack_feedback" },
  { pattern: /\b(feature request|request)\b/i, key: "feature_request" },
  { pattern: /\b(knowledge|article|search|faq)\b/i, key: "knowledge" },
  { pattern: /\b(rating|score|quality)\b/i, key: "quality" },
  { pattern: /\b(report|experience|feedback)\b/i, key: "report" },
];

export function detectExperienceAdvisorIntent(message: string): string | null {
  const text = message.trim();
  if (!text) return null;
  for (const { pattern, key } of EXPERIENCE_ADVISOR_PATTERNS) {
    if (pattern.test(text)) return key;
  }
  return null;
}

export function getExperienceAdvisorRoute(intent: string | null): string {
  switch (intent) {
    case "frustrations":
      return "/app/feedback/insights";
    case "works_best":
      return "/app/feedback/ratings";
    case "improve_next":
    case "knowledge":
      return "/app/feedback/improvements";
    case "pack_feedback":
    case "feature_request":
    case "report":
      return "/app/feedback/reports";
    case "quality":
      return "/app/feedback/ratings";
    default:
      return "/app/feedback/reports";
  }
}
