/**
 * Skills Marketplace naming standard — product-oriented skill labels.
 * Never expose "AI" in skill names shown to customers.
 * Skills are extensions of Aipify — not separate assistant identities.
 * See AIPIFY_BRAND_RULE_SINGLE_IDENTITY.md · AIPIFY_SKILLS_MARKETPLACE_NAMING_STANDARD.md
 */

export const SKILLS_MARKETPLACE_DISPLAY_NAMES_BY_KEY = {
  "support-assistant": "Support Specialist",
  "analytics-assistant": "Analytics Center",
  "commerce-assistant": "Commerce Specialist",
  "executive-briefings": "Executive Briefing",
  "executive-briefing": "Executive Briefing",
  "marketing-assistant": "Marketing Specialist",
  "moderation-assistant": "Moderation Center",
  "memory-engine": "Memory Engine",
  "knowledge-center": "Knowledge Center",
  "knowledge-assistant": "Knowledge Center",
} as const;

/** Legacy marketplace labels → enterprise skill names. */
export const SKILLS_MARKETPLACE_LEGACY_NAME_MAP: Record<string, string> = {
  "Analytics AI": "Analytics Center",
  "Commerce AI": "Commerce Specialist",
  "Executive AI": "Executive Briefing",
  "Executive Briefings": "Executive Briefing",
  "Marketing AI": "Marketing Specialist",
  "Moderation AI": "Moderation Center",
  "Memory Engine AI": "Memory Engine",
  "Support AI": "Support Specialist",
  "Support Assistant": "Support Specialist",
  "Knowledge AI": "Knowledge Center",
  "Knowledge Base Assistant": "Knowledge Center",
  "Compliance AI": "Compliance Center",
  "Growth AI": "Growth Specialist",
  "Marketing Assistant": "Marketing Specialist",
  "Commerce Assistant": "Commerce Specialist",
};

export function normalizeSkillDisplayName(name: string, key?: string): string {
  if (key && key in SKILLS_MARKETPLACE_DISPLAY_NAMES_BY_KEY) {
    return SKILLS_MARKETPLACE_DISPLAY_NAMES_BY_KEY[
      key as keyof typeof SKILLS_MARKETPLACE_DISPLAY_NAMES_BY_KEY
    ];
  }
  return SKILLS_MARKETPLACE_LEGACY_NAME_MAP[name] ?? name;
}

export function normalizeSkillDescription(description: string): string {
  return description
    .replace(/\bAI-assisted\b/gi, "Operational")
    .replace(/\bAI-powered\b/gi, "Intelligent")
    .replace(/\bAI support\b/gi, "support operations")
    .replace(/\bAI\b/g, "Aipify");
}
