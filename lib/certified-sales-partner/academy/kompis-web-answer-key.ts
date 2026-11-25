/**
 * SERVER-ONLY — Kompis Web exam answer key.
 *
 * Never import this file from client components, pages shipped to the browser, or any module
 * re-exported from `lib/certified-sales-partner/index.ts`. It is reachable only through the
 * named server path `lib/certified-sales-partner/academy/server.ts` (API routes, server actions,
 * Core RPC adapters). Correct answers must never be sent to the client.
 */
import type { CspExamOptionId } from "./types";

export const KOMPIS_WEB_ANSWER_KEY: Readonly<Record<string, CspExamOptionId>> = {
  kw_q01: "b",
  kw_q02: "c",
  kw_q03: "a",
  kw_q04: "d",
  kw_q05: "b",
  kw_q06: "a",
  kw_q07: "c",
  kw_q08: "d",
  kw_q09: "b",
  kw_q10: "c",
  kw_q11: "a",
  kw_q12: "d",
  kw_q13: "c",
  kw_q14: "b",
  kw_q15: "a",
  kw_q16: "c",
  kw_q17: "d",
  kw_q18: "b",
  kw_q19: "a",
  kw_q20: "c",
  kw_q21: "b",
  kw_q22: "d",
  kw_q23: "a",
  kw_q24: "c",
  kw_q25: "b",
};

/**
 * Returns the answer key restricted to the questions of one exam variant.
 * Pass the result to `scoreExam()` so `total` equals the exam length (15), not the whole bank.
 * Throws if a question id has no key (fail closed).
 */
export function getAnswerKeyForQuestions(questionIds: readonly string[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const id of questionIds) {
    const correct = KOMPIS_WEB_ANSWER_KEY[id];
    if (!correct) throw new Error(`csp_academy_answer_key_missing:${id}`);
    out[id] = correct;
  }
  return out;
}
