import assert from "node:assert/strict";
import test from "node:test";
import { assertKompisBlockedDuringExam, canIssueSalesLink, scoreExam } from "./academy-quiz";

const key = { q1: "a", q2: "b", q3: "c", q4: "d", q5: "a" };

test("scoreExam passes at exactly 80%", () => {
  const r = scoreExam(
    [
      { questionId: "q1", selectedOptionId: "a" },
      { questionId: "q2", selectedOptionId: "b" },
      { questionId: "q3", selectedOptionId: "c" },
      { questionId: "q4", selectedOptionId: "d" },
      { questionId: "q5", selectedOptionId: "x" },
    ],
    key,
  );
  assert.deepEqual(r, { scorePct: 80, correct: 4, total: 5, passed: true });
});

test("scoreExam fails below 80%, ignores unknown questions, counts unanswered wrong", () => {
  const r = scoreExam(
    [
      { questionId: "q1", selectedOptionId: "a" },
      { questionId: "q2", selectedOptionId: "b" },
      { questionId: "q3", selectedOptionId: "c" },
      { questionId: "zzz", selectedOptionId: "a" },
    ],
    key,
  );
  assert.equal(r.correct, 3);
  assert.equal(r.total, 5);
  assert.equal(r.scorePct, 60);
  assert.equal(r.passed, false);
});

test("scoreExam with empty key never passes", () => {
  assert.equal(scoreExam([], {}).passed, false);
});

test("kompis is blocked during exam", () => {
  assert.deepEqual(assertKompisBlockedDuringExam(), { allowed: false, reason: "kompis_disabled_during_exam" });
});

test("canIssueSalesLink requires every gate", () => {
  const all = { partnerApproved: true, productPublished: true, certificationPassed: true, agreementAccepted: true };
  assert.equal(canIssueSalesLink(all), true);
  for (const k of Object.keys(all) as (keyof typeof all)[]) {
    assert.equal(canIssueSalesLink({ ...all, [k]: false }), false);
  }
});
