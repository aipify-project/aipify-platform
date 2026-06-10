import type { PrivacyByDesignAnswer } from "./types";

/** Privacy-by-design gate (Phase 19 §21). */
export const PRIVACY_BY_DESIGN_QUESTIONS = [
  "What data is required?",
  "Who owns the data?",
  "Where is the data stored?",
  "How long is it retained?",
  "Can the customer revoke access?",
] as const;

export function validatePrivacyByDesign(
  answers: Partial<PrivacyByDesignAnswer>
): { complete: boolean; missing: string[] } {
  const missing: string[] = [];
  if (!answers.dataRequired) missing.push(PRIVACY_BY_DESIGN_QUESTIONS[0]);
  if (!answers.dataOwner) missing.push(PRIVACY_BY_DESIGN_QUESTIONS[1]);
  if (!answers.storageLocation) missing.push(PRIVACY_BY_DESIGN_QUESTIONS[2]);
  if (!answers.retentionPeriod) missing.push(PRIVACY_BY_DESIGN_QUESTIONS[3]);
  if (answers.revocable === undefined) missing.push(PRIVACY_BY_DESIGN_QUESTIONS[4]);
  return { complete: missing.length === 0, missing };
}

export function mustPauseImplementation(
  answers: Partial<PrivacyByDesignAnswer>
): boolean {
  return !validatePrivacyByDesign(answers).complete;
}
