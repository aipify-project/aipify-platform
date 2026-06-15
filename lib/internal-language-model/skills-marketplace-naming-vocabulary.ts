/** Skills Marketplace naming standard — never expose AI in skill names. */
export const SKILLS_MARKETPLACE_NAMING_PRINCIPLE =
  "Users buy Aipify, not AI. Skills are business capabilities — Center, Specialist, Companion, Engine, Intelligence — extensions of one Aipify, not separate assistants.";

export const SKILLS_MARKETPLACE_NAME_REPLACEMENTS = {
  analyticsAi: { avoid: "Analytics AI", use: "Analytics Center" },
  commerceAi: { avoid: "Commerce AI", use: "Commerce Specialist" },
  executiveAi: { avoid: "Executive AI", use: "Executive Briefing" },
  marketingAi: { avoid: "Marketing AI", use: "Marketing Specialist" },
  moderationAi: { avoid: "Moderation AI", use: "Moderation Center" },
  memoryEngineAi: { avoid: "Memory Engine AI", use: "Memory Engine" },
  supportAi: { avoid: "Support AI", use: "Support Specialist" },
  knowledgeAi: { avoid: "Knowledge AI", use: "Knowledge Center" },
  complianceAi: { avoid: "Compliance AI", use: "Compliance Center" },
  growthAi: { avoid: "Growth AI", use: "Growth Specialist" },
} as const;

export const SKILLS_MARKETPLACE_FORBIDDEN_TERMS = [
  "AI",
  "GPT",
  "Bot",
  "Chatbot",
  "Copilot",
  "Assistant",
] as const;
