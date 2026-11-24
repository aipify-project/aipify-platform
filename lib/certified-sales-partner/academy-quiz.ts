/**
 * CSP Academy exam scoring and sales-link gating — pure, fail-closed.
 */
import { CSP_CERTIFICATION_PASS_SCORE } from "./constants";

export type CspExamAnswer = { questionId: string; selectedOptionId: string };

export type CspExamResult = {
  scorePct: number;
  correct: number;
  total: number;
  passed: boolean;
};

/**
 * Scores an exam against the answer key. `total` is the number of keyed questions;
 * unanswered questions count as wrong, unknown question ids are ignored, and the
 * last answer per question wins. An empty key never passes.
 */
export function scoreExam(
  answers: readonly CspExamAnswer[],
  answerKey: Record<string, string>,
): CspExamResult {
  const keyed = Object.keys(answerKey);
  const total = keyed.length;
  if (total === 0) return { scorePct: 0, correct: 0, total: 0, passed: false };

  const latest = new Map<string, string>();
  for (const a of answers ?? []) {
    if (a && typeof a.questionId === "string" && typeof a.selectedOptionId === "string") {
      latest.set(a.questionId, a.selectedOptionId);
    }
  }

  let correct = 0;
  for (const questionId of keyed) {
    if (latest.get(questionId) === answerKey[questionId]) correct += 1;
  }

  const scorePct = Math.round((correct / total) * 10000) / 100;
  return { scorePct, correct, total, passed: scorePct >= CSP_CERTIFICATION_PASS_SCORE };
}

export const CSP_KOMPIS_DISABLED_DURING_EXAM = "kompis_disabled_during_exam" as const;

/** Kompis help is never available while an exam is in progress. */
export function assertKompisBlockedDuringExam(): {
  allowed: false;
  reason: typeof CSP_KOMPIS_DISABLED_DURING_EXAM;
} {
  return { allowed: false, reason: CSP_KOMPIS_DISABLED_DURING_EXAM };
}

export type CspSalesLinkGate = {
  partnerApproved: boolean;
  productPublished: boolean;
  certificationPassed: boolean;
  agreementAccepted: boolean;
};

/** A sales link may be issued only when every gate is strictly true. */
export function canIssueSalesLink(gate: CspSalesLinkGate): boolean {
  return (
    gate?.partnerApproved === true &&
    gate?.productPublished === true &&
    gate?.certificationPassed === true &&
    gate?.agreementAccepted === true
  );
}
