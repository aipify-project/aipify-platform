/** Intelligence tasks Aipify routes to the most appropriate model profile. */
export const INTELLIGENCE_TASKS = [
  "executive_summary",
  "support_response",
  "recommendation",
  "knowledge_retrieval",
  "email_draft",
  "presence_briefing",
  "installation_guidance",
  "risk_explanation",
] as const;

export type IntelligenceTask = (typeof INTELLIGENCE_TASKS)[number];

export function isIntelligenceTask(value: string): value is IntelligenceTask {
  return (INTELLIGENCE_TASKS as readonly string[]).includes(value);
}
