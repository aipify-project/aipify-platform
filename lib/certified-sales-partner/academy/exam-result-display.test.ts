import assert from "node:assert/strict";
import test from "node:test";
import {
  formatExamPassedAtDisplay,
  formatExamScoreDisplay,
  hasVerifiedExamCounts,
} from "./exam-result-display";

test("score with verified counts shows correct/total and percent", () => {
  const line = formatExamScoreDisplay({
    scorePct: 80,
    correct: 12,
    total: 15,
    scoreWithCounts: "{correct} av {total} riktige ({score} %)",
    scorePercentOnly: "Resultat: {score} % – bestått",
  });
  assert.equal(line, "12 av 15 riktige (80 %)");
});

test("score with percent only never invents 0 of —", () => {
  const line = formatExamScoreDisplay({
    scorePct: 80,
    correct: null,
    total: null,
    scoreWithCounts: "{correct} av {total} riktige ({score} %)",
    scorePercentOnly: "Resultat: {score} % – bestått",
  });
  assert.equal(line, "Resultat: 80 % – bestått");
  assert.equal(line?.includes("0 av"), false);
  assert.equal(line?.includes("—"), false);
});

test("zero placeholders from already-passed seed are treated as missing counts", () => {
  assert.equal(hasVerifiedExamCounts(0, 0), false);
  const line = formatExamScoreDisplay({
    scorePct: 80,
    correct: 0,
    total: 0,
    scoreWithCounts: "{correct} of {total} correct ({score}%)",
    scorePercentOnly: "Result: {score}% — passed",
  });
  assert.equal(line, "Result: 80% — passed");
});

test("missing score returns null", () => {
  assert.equal(
    formatExamScoreDisplay({
      scorePct: null,
      correct: null,
      total: null,
      scoreWithCounts: "{correct}/{total}/{score}",
      scorePercentOnly: "{score}",
    }),
    null,
  );
});

test("Norwegian passed-at uses Europe/Oslo calendar date", () => {
  // 2026-11-25T23:13:56Z → 26 November 2026 in Oslo (CET)
  const formatted = formatExamPassedAtDisplay("2026-11-25T23:13:56.583782+00:00", "no");
  assert.match(formatted, /26/);
  assert.match(formatted, /2026/);
  assert.equal(formatted.includes("T23:13"), false);
});

test("English passed-at uses UTC calendar date", () => {
  const formatted = formatExamPassedAtDisplay("2026-11-25T23:13:56.583782+00:00", "en");
  assert.match(formatted, /25/);
  assert.match(formatted, /2026/);
});
