/** Phase 326 — Companion Daily Briefing Center vocabulary. */

export const COMPANION_DAILY_BRIEFING_PRINCIPLE =
  "Start the day with clarity. Surface what matters most. Signal over noise.";

export const COMPANION_DAILY_BRIEFING_PRIVACY_NOTE =
  "Briefings use approved context only. Personalization controls detail level via the Personalization Engine.";

export const COMPANION_DAILY_BRIEFING_EXAMPLES = [
  "Good morning. You have: 1 overdue approval, 3 tasks due today, 1 executive review tomorrow, and 2 new proactive insights.",
  "Support activity increased by 12% this week. Consider reviewing staffing capacity.",
  "Three items require attention today. One approval is overdue and a strategic review is scheduled tomorrow.",
] as const;

export function getCompanionDailyBriefingPrinciple(): string {
  return COMPANION_DAILY_BRIEFING_PRINCIPLE;
}
