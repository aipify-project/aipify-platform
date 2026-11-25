/**
 * Exam submit persistence outcomes from `/api/certified-sales-partner/academy/submit`.
 *
 * Practice banners must only appear when Core did not record a real attempt —
 * never when a Core pass/attempt was persisted.
 */

export const CSP_PRACTICE_PERSISTENCE_STATUSES = [
  "core_course_unavailable",
  "core_not_ready",
  "core_score_mismatch",
] as const;

export type CspPracticePersistenceStatus = (typeof CSP_PRACTICE_PERSISTENCE_STATUSES)[number];

export type CspExamPersistenceStatus = CspPracticePersistenceStatus | "persisted";

/** True when the result is practice-only (no Core certification / attempt confirmation). */
export function isPracticeExamPersistence(
  certificationPersisted: boolean | undefined,
  persistenceStatus: string | undefined,
): boolean {
  if (certificationPersisted === true) return false;
  return (CSP_PRACTICE_PERSISTENCE_STATUSES as readonly string[]).includes(persistenceStatus ?? "");
}

/** True when Core recorded the attempt but certification was not issued (e.g. not passed). */
export function isRecordedExamAttempt(
  certificationPersisted: boolean | undefined,
  persistenceStatus: string | undefined,
  attemptRecorded?: boolean,
): boolean {
  if (certificationPersisted === true) return false;
  if (persistenceStatus === "persisted") return true;
  return attemptRecorded === true && !isPracticeExamPersistence(false, persistenceStatus);
}
