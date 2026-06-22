/** Companion answer feedback governance — read path never consumes feedback rows. */

export const COMPANION_FEEDBACK_TYPES = ["helpful", "not_helpful", "org_confirm"] as const;
export type CompanionFeedbackType = (typeof COMPANION_FEEDBACK_TYPES)[number];

export const COMPANION_NEGATIVE_FEEDBACK_REASONS = [
  "incorrect",
  "incomplete",
  "outdated",
  "not_relevant",
  "permission_issue",
  "other",
] as const;

export type CompanionNegativeFeedbackReason = (typeof COMPANION_NEGATIVE_FEEDBACK_REASONS)[number];

export function feedbackAffectsAnswerReadPath(): boolean {
  return false;
}

export function helpfulFeedbackBecomesCanonicalTruth(): boolean {
  return false;
}

export function negativeFeedbackWritesKnowledgeAutomatically(): boolean {
  return false;
}

export function orgConfirmRequiresExplicitGovernance(): boolean {
  return true;
}

export function canRecordOrgConfirm(role: string | null | undefined): boolean {
  const normalized = String(role ?? "staff").toLowerCase();
  return normalized === "owner" || normalized === "admin";
}

export function isValidCompanionFeedbackType(value: string): value is CompanionFeedbackType {
  return (COMPANION_FEEDBACK_TYPES as readonly string[]).includes(value);
}

export function isValidNegativeFeedbackReason(value: string): value is CompanionNegativeFeedbackReason {
  return (COMPANION_NEGATIVE_FEEDBACK_REASONS as readonly string[]).includes(value);
}
