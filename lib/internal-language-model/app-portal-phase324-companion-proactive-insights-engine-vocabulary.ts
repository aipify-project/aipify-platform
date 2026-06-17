/** Phase 324 — Companion Proactive Insights Engine vocabulary. */

export const COMPANION_PROACTIVE_INSIGHTS_PRINCIPLE =
  "Surface meaningful observations. Explain reasoning. High signal, low noise.";

export const COMPANION_PROACTIVE_INSIGHTS_PRIVACY_NOTE =
  "Insights are informational and advisory. Users remain responsible for decisions and actions.";

export const COMPANION_PROACTIVE_INSIGHTS_EXAMPLES = [
  "Good morning. Customer onboarding requests have increased by 14%. Would you like a summary?",
  "Aipify found three recurring issues that may benefit from a process review.",
  "Your team completed significantly more tasks this month than average.",
] as const;

export function getCompanionProactiveInsightsPrinciple(): string {
  return COMPANION_PROACTIVE_INSIGHTS_PRINCIPLE;
}
