import assert from "node:assert/strict";
import test from "node:test";
import { corePositionToLocalQuestionId, localQuestionIdToCorePosition, toCoreAnswersByPosition } from "./core-mapping";

test("local id ↔ Core position", () => {
  assert.equal(localQuestionIdToCorePosition("kw_q01"), 1);
  assert.equal(localQuestionIdToCorePosition("kw_q25"), 25);
  assert.equal(localQuestionIdToCorePosition("other"), null);
  assert.equal(corePositionToLocalQuestionId(7), "kw_q07");
  assert.equal(corePositionToLocalQuestionId(0), null);
  assert.equal(corePositionToLocalQuestionId(1.5), null);
});

test("answers are re-keyed by position; unmapped ids dropped", () => {
  assert.deepEqual(toCoreAnswersByPosition(new Map([["kw_q03", "b"], ["x", "a"]])), { "3": "b" });
});
