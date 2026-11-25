import assert from "node:assert/strict";
import test from "node:test";
import { isPracticeExamPersistence, isRecordedExamAttempt } from "./exam-persistence";

test("practice banner only for practice persistence statuses when not certified", () => {
  assert.equal(isPracticeExamPersistence(false, "core_course_unavailable"), true);
  assert.equal(isPracticeExamPersistence(false, "core_not_ready"), true);
  assert.equal(isPracticeExamPersistence(false, "core_score_mismatch"), true);
  assert.equal(isPracticeExamPersistence(false, "persisted"), false);
  assert.equal(isPracticeExamPersistence(false, undefined), false);
  assert.equal(isPracticeExamPersistence(true, "core_not_ready"), false);
  assert.equal(isPracticeExamPersistence(true, "persisted"), false);
});

test("Core-recorded attempts are never treated as practice", () => {
  assert.equal(isRecordedExamAttempt(false, "persisted"), true);
  assert.equal(isRecordedExamAttempt(false, "persisted", false), true);
  assert.equal(isRecordedExamAttempt(true, "persisted"), false);
  assert.equal(isRecordedExamAttempt(false, "core_not_ready"), false);
  assert.equal(isRecordedExamAttempt(false, "core_course_unavailable", true), false);
});
