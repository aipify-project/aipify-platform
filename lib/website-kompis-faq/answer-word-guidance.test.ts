import assert from "node:assert/strict";
import {
  FAQ_ANSWER_WORD_TARGET,
  FAQ_ANSWER_WORD_WARNING_THRESHOLD,
  countFaqAnswerWords,
  getFaqAnswerWordGuidance,
} from "@/lib/website-kompis-faq/answer-word-guidance";

assert.equal(FAQ_ANSWER_WORD_TARGET, 150);
assert.equal(FAQ_ANSWER_WORD_WARNING_THRESHOLD, 130);

assert.equal(countFaqAnswerWords(""), 0);
assert.equal(countFaqAnswerWords("   "), 0);
assert.equal(countFaqAnswerWords("one"), 1);
assert.equal(countFaqAnswerWords("  one  two  "), 2);
assert.equal(countFaqAnswerWords("one\ntwo\nthree"), 3);
assert.equal(countFaqAnswerWords("one,\ntwo."), 2);
assert.equal(countFaqAnswerWords("a  b\t\tc\nd"), 4);

function words(n: number): string {
  return Array.from({ length: n }, (_, i) => `w${i}`).join(" ");
}

const g0 = getFaqAnswerWordGuidance("");
assert.equal(g0.wordCount, 0);
assert.equal(g0.remaining, 150);
assert.equal(g0.overBy, 0);
assert.equal(g0.progressRatio, 0);
assert.equal(g0.tone, "ok");

const g1 = getFaqAnswerWordGuidance(words(1));
assert.equal(g1.wordCount, 1);
assert.equal(g1.remaining, 149);
assert.equal(g1.tone, "ok");
assert.ok(Math.abs(g1.progressRatio - 1 / 150) < 1e-9);

const g129 = getFaqAnswerWordGuidance(words(129));
assert.equal(g129.wordCount, 129);
assert.equal(g129.remaining, 21);
assert.equal(g129.tone, "ok");

const g130 = getFaqAnswerWordGuidance(words(130));
assert.equal(g130.wordCount, 130);
assert.equal(g130.remaining, 20);
assert.equal(g130.tone, "warning");

const g150 = getFaqAnswerWordGuidance(words(150));
assert.equal(g150.wordCount, 150);
assert.equal(g150.remaining, 0);
assert.equal(g150.overBy, 0);
assert.equal(g150.progressRatio, 1);
assert.equal(g150.tone, "warning");

const g151 = getFaqAnswerWordGuidance(words(151));
assert.equal(g151.wordCount, 151);
assert.equal(g151.remaining, -1);
assert.equal(g151.overBy, 1);
assert.equal(g151.progressRatio, 1);
assert.equal(g151.tone, "over");

const g200 = getFaqAnswerWordGuidance(words(200));
assert.equal(g200.wordCount, 200);
assert.equal(g200.overBy, 50);
assert.equal(g200.progressRatio, 1);
assert.equal(g200.tone, "over");

// Soft guidance only — over-limit answers remain countable (editor must stay editable).
assert.equal(countFaqAnswerWords(words(400)), 400);

console.log("website-kompis-faq-answer-word-guidance.test.ts: all assertions passed");
