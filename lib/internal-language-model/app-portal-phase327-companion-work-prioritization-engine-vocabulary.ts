/** Phase 327 — Companion Work Prioritization Engine vocabulary. */

export const COMPANION_WORK_PRIORITIZATION_PRINCIPLE =
  "Focus on what matters. Reduce decision fatigue. Support human judgment.";

export const COMPANION_WORK_PRIORITIZATION_PRIVACY_NOTE =
  "Aipify recommends priorities with transparent reasoning. Users remain responsible for decisions.";

export const COMPANION_WORK_PRIORITIZATION_EXAMPLES = [
  "Your highest priority today is an approval delaying multiple departments.",
  "This task has moderate urgency but high strategic value.",
  "You have more work than available capacity this week.",
] as const;

export function getCompanionWorkPrioritizationPrinciple(): string {
  return COMPANION_WORK_PRIORITIZATION_PRINCIPLE;
}
