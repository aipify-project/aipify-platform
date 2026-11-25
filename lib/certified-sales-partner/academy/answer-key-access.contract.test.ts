/**
 * Contract tests for Academy answer-key secrecy.
 * Validates PREPARED SQL text + scoring rules without applying SQL or calling Production.
 */
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { selectExamVariant } from "./exam-selection";
import { KOMPIS_WEB_QUESTION_IDS } from "./kompis-web-question-bank";
import { KOMPIS_WEB_ANSWER_KEY, getAnswerKeyForQuestions } from "./kompis-web-answer-key";
import { scoreExam } from "../academy-quiz";

const ROOT = join(process.cwd());
const FIX_SQL = join(
  ROOT,
  "docs/security-hardening/CSP_ACADEMY_ANSWER_KEY_ACCESS_FIX_PREPARED_ONLY_20261125.sql",
);
const BANK_SQL = join(
  ROOT,
  "docs/security-hardening/CSP_ACADEMY_BANK_SUBSET_SCORING_OVERVIEW_PREPARED_ONLY_20261125.sql",
);
const SUBMIT_ROUTE = join(ROOT, "app/api/certified-sales-partner/academy/submit/route.ts");

function read(path: string): string {
  return readFileSync(path, "utf8");
}

test("answer-key fix SQL revokes EXECUTE from browser-reachable roles and never grants authenticated", () => {
  const sql = read(FIX_SQL);
  assert.match(sql, /PREPARED ONLY/i);
  assert.match(sql, /create or replace function public\.csp_get_academy_answer_key/i);
  assert.match(sql, /['"]forbidden['"]/);
  assert.doesNotMatch(sql, /answer_key\s*,/); // must not return answer_key payload fields
  assert.match(
    sql,
    /revoke all on function public\.csp_get_academy_answer_key\(uuid\)\s+from public,\s*anon,\s*authenticated,\s*service_role/i,
  );
  // No re-grant to authenticated after revoke in this file.
  const afterRevoke = sql.split(/revoke all on function public\.csp_get_academy_answer_key/i)[1] ?? "";
  assert.doesNotMatch(afterRevoke, /grant execute[^\n]*authenticated/i);
  assert.match(sql, /BEFORE any Academy bank/i);
});

test("bank candidate still depends on prior fix and must not be applied alone for publish safety", () => {
  const bank = read(BANK_SQL);
  assert.match(bank, /published = true/i);
  assert.match(bank, /csp_record_academy_attempt/i);
  // Original bank SHA identity file must remain; Gate S order is fix-then-bank.
  assert.ok(bank.includes("kompis_web_v1"));
});

test("submit route never invokes csp_get_academy_answer_key RPC", () => {
  const src = read(SUBMIT_ROUTE);
  assert.doesNotMatch(src, /callCspRpc\([^)]*csp_get_academy_answer_key/);
  assert.doesNotMatch(src, /\.rpc\(\s*["']csp_get_academy_answer_key["']/);
  assert.match(src, /getAnswerKeyForQuestions/);
  assert.match(src, /csp_record_academy_attempt/);
  assert.match(src, /answer_source: "academy_local"/);
});

test("public question bank export has no answer keys", async () => {
  const pub = await import("./index");
  assert.ok(Array.isArray(pub.KOMPIS_WEB_QUESTION_BANK));
  const blob = JSON.stringify(pub.KOMPIS_WEB_QUESTION_BANK);
  assert.doesNotMatch(blob, /"correct"/i);
  assert.doesNotMatch(blob, /answer_key/i);
  assert.equal("KOMPIS_WEB_ANSWER_KEY" in pub, false);
});

test("11/15 fails and 12/15 passes; variant rotation changes 4–5 questions", () => {
  const v0 = selectExamVariant(0, KOMPIS_WEB_QUESTION_IDS);
  const v1 = selectExamVariant(1, KOMPIS_WEB_QUESTION_IDS);
  assert.equal(v0.questionIds.length, 15);
  assert.equal(v1.questionIds.length, 15);
  const changed = v0.questionIds.filter((id) => !v1.questionIds.includes(id)).length;
  assert.ok(changed >= 4 && changed <= 5, `expected 4–5 rotated, got ${changed}`);

  const key = getAnswerKeyForQuestions(v0.questionIds);
  const correctAnswers = v0.questionIds.map((id) => ({ questionId: id, selectedOptionId: key[id] }));
  const pass12 = scoreExam(correctAnswers.slice(0, 12).concat(
    v0.questionIds.slice(12).map((id) => ({ questionId: id, selectedOptionId: "z" })),
  ), key);
  assert.equal(pass12.correct, 12);
  assert.equal(pass12.passed, true);

  const fail11 = scoreExam(correctAnswers.slice(0, 11).concat(
    v0.questionIds.slice(11).map((id) => ({ questionId: id, selectedOptionId: "z" })),
  ), key);
  assert.equal(fail11.correct, 11);
  assert.equal(fail11.passed, false);
});

test("answer key module covers the bank and is not re-exported from academy index", async () => {
  assert.equal(Object.keys(KOMPIS_WEB_ANSWER_KEY).length, 25);
  const indexSrc = read(join(ROOT, "lib/certified-sales-partner/academy/index.ts"));
  assert.doesNotMatch(indexSrc, /kompis-web-answer-key/);
  assert.doesNotMatch(indexSrc, /KOMPIS_WEB_ANSWER_KEY/);
});
