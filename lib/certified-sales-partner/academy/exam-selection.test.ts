import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { LOCALES } from "@/lib/i18n/config";
import { CSP_CERTIFICATION_PASS_SCORE } from "../constants";
import { scoreExam, type CspExamAnswer } from "../academy-quiz";
import {
  CSP_EXAM_QUESTION_COUNT,
  buildPublicExamQuestions,
  selectExamVariant,
} from "./exam-selection";
import { KOMPIS_WEB_ANSWER_KEY, getAnswerKeyForQuestions } from "./kompis-web-answer-key";
import { KOMPIS_WEB_LESSONS } from "./kompis-web-lessons";
import { KOMPIS_WEB_QUESTION_BANK, KOMPIS_WEB_QUESTION_IDS } from "./kompis-web-question-bank";

const difficultyOf = new Map(KOMPIS_WEB_QUESTION_BANK.map((q) => [q.id, q.difficulty] as const));

function diffCount(a: readonly string[], b: readonly string[]): number {
  const set = new Set(b);
  return a.filter((id) => !set.has(id)).length;
}

/** Answers the first `correctCount` exam questions correctly and the rest wrongly. */
function answersWithCorrect(questionIds: readonly string[], correctCount: number): CspExamAnswer[] {
  return questionIds.map((questionId, i) => {
    const correct = KOMPIS_WEB_ANSWER_KEY[questionId];
    const wrong = correct === "a" ? "b" : "a";
    return { questionId, selectedOptionId: i < correctCount ? correct : wrong };
  });
}

test("bank has at least 25 well-formed, fully localized questions with stable ids", () => {
  assert.ok(KOMPIS_WEB_QUESTION_BANK.length >= 25);
  assert.equal(new Set(KOMPIS_WEB_QUESTION_IDS).size, KOMPIS_WEB_QUESTION_IDS.length);
  const lessonIds = new Set(KOMPIS_WEB_LESSONS.map((l) => l.id));
  for (const q of KOMPIS_WEB_QUESTION_BANK) {
    assert.match(q.id, /^kw_q\d{2}$/);
    assert.ok(["easy", "medium", "hard"].includes(q.difficulty));
    assert.ok(lessonIds.has(q.lessonId), `${q.id} lesson`);
    assert.deepEqual(q.options.map((o) => o.id), ["a", "b", "c", "d"]);
    for (const locale of LOCALES) {
      assert.ok(q.question[locale].trim().length > 0, `${q.id} question ${locale}`);
      for (const o of q.options) assert.ok(o.text[locale].trim().length > 0, `${q.id}/${o.id} ${locale}`);
    }
    // No answer data on the source question.
    assert.deepEqual(Object.keys(q).sort(), ["difficulty", "id", "lessonId", "options", "productId", "question"]);
  }
});

test("lessons: six stable ids, every locale filled", () => {
  assert.deepEqual(KOMPIS_WEB_LESSONS.map((l) => l.id), [
    "lesson_01", "lesson_02", "lesson_03", "lesson_04", "lesson_05", "lesson_06",
  ]);
  for (const lesson of KOMPIS_WEB_LESSONS) {
    for (const locale of LOCALES) {
      assert.ok(lesson.title[locale].trim().length > 0);
      for (const p of lesson.body) assert.ok(p[locale].trim().length > 0);
    }
  }
  assert.equal(KOMPIS_WEB_LESSONS.filter((l) => l.containsPlannedCatalogFacts).length, 1);
});

test("answer key covers the whole bank with valid, varied option ids", () => {
  assert.deepEqual(Object.keys(KOMPIS_WEB_ANSWER_KEY).sort(), [...KOMPIS_WEB_QUESTION_IDS].sort());
  for (const q of KOMPIS_WEB_QUESTION_BANK) {
    assert.ok(q.options.some((o) => o.id === KOMPIS_WEB_ANSWER_KEY[q.id]), `${q.id} key option exists`);
  }
  assert.equal(new Set(Object.values(KOMPIS_WEB_ANSWER_KEY)).size, 4, "correct answers use all four positions");
  assert.throws(() => getAnswerKeyForQuestions(["kw_unknown"]));
});

test("every exam has exactly 15 unique bank questions, balanced by difficulty", () => {
  for (let attempt = 0; attempt < 9; attempt += 1) {
    const { questionIds } = selectExamVariant(attempt, KOMPIS_WEB_QUESTION_IDS);
    assert.equal(questionIds.length, CSP_EXAM_QUESTION_COUNT);
    assert.equal(new Set(questionIds).size, CSP_EXAM_QUESTION_COUNT);
    for (const id of questionIds) assert.ok(difficultyOf.has(id));
    const counts = { easy: 0, medium: 0, hard: 0 };
    for (const id of questionIds) counts[difficultyOf.get(id)!] += 1;
    assert.deepEqual(counts, { easy: 5, medium: 6, hard: 4 });
  }
});

test("three variants share a 10-question core and differ by 4-5 questions", () => {
  const v = [0, 1, 2].map((i) => selectExamVariant(i, KOMPIS_WEB_QUESTION_IDS));
  assert.equal(new Set(v.map((x) => x.variantId)).size, 3);
  for (let i = 0; i < 3; i += 1) {
    for (let j = i + 1; j < 3; j += 1) {
      const d = diffCount(v[i].questionIds, v[j].questionIds);
      assert.ok(d >= 4 && d <= 5, `variants ${i}/${j} differ by ${d}`);
      assert.equal(diffCount(v[j].questionIds, v[i].questionIds), d);
    }
  }
  const core = v[0].questionIds.filter((id) => v[1].questionIds.includes(id) && v[2].questionIds.includes(id));
  assert.equal(core.length, 10);
});

test("selection is deterministic, cycles through variants, and is input-order independent", () => {
  assert.deepEqual(selectExamVariant(4, KOMPIS_WEB_QUESTION_IDS), selectExamVariant(4, KOMPIS_WEB_QUESTION_IDS));
  const shuffled = [...KOMPIS_WEB_QUESTION_IDS].reverse();
  assert.deepEqual(selectExamVariant(1, shuffled), selectExamVariant(1, KOMPIS_WEB_QUESTION_IDS));
  assert.equal(selectExamVariant(3, KOMPIS_WEB_QUESTION_IDS).variantId, selectExamVariant(0, KOMPIS_WEB_QUESTION_IDS).variantId);
});

test("selection fails closed on bad input", () => {
  assert.throws(() => selectExamVariant(-1, KOMPIS_WEB_QUESTION_IDS), /invalid_attempt_index/);
  assert.throws(() => selectExamVariant(1.5, KOMPIS_WEB_QUESTION_IDS), /invalid_attempt_index/);
  assert.throws(() => selectExamVariant(0, KOMPIS_WEB_QUESTION_IDS.slice(0, 20)), /bank_too_small/);
});

test("scoreExam with the key: 11/15 fails, 12/15 passes (pass score 80)", () => {
  assert.equal(CSP_CERTIFICATION_PASS_SCORE, 80);
  const { questionIds } = selectExamVariant(0, KOMPIS_WEB_QUESTION_IDS);
  const key = getAnswerKeyForQuestions(questionIds);
  assert.equal(Object.keys(key).length, 15);

  const fail = scoreExam(answersWithCorrect(questionIds, 11), key);
  assert.equal(fail.correct, 11);
  assert.equal(fail.total, 15);
  assert.equal(fail.passed, false);

  const pass = scoreExam(answersWithCorrect(questionIds, 12), key);
  assert.equal(pass.correct, 12);
  assert.equal(pass.scorePct, 80);
  assert.equal(pass.passed, true);

  assert.equal(scoreExam(answersWithCorrect(questionIds, 15), key).passed, true);
  assert.equal(scoreExam([], key).passed, false);
});

test("public questions never expose the answer and resolve every locale", () => {
  const { questionIds } = selectExamVariant(2, KOMPIS_WEB_QUESTION_IDS);
  for (const locale of LOCALES) {
    const pub = buildPublicExamQuestions(questionIds, KOMPIS_WEB_QUESTION_BANK, locale);
    assert.equal(pub.length, 15);
    assert.deepEqual(pub.map((p) => p.id), questionIds);
    for (const p of pub) {
      assert.deepEqual(Object.keys(p).sort(), ["difficulty", "id", "lessonId", "options", "question"]);
      assert.equal(p.options.length, 4);
      assert.equal(typeof p.question, "string");
      for (const o of p.options) assert.deepEqual(Object.keys(o).sort(), ["id", "text"]);
    }
    assert.ok(!/correct|answerKey/i.test(JSON.stringify(Object.keys(pub[0]))));
  }
  const en = buildPublicExamQuestions(questionIds.slice(0, 1), KOMPIS_WEB_QUESTION_BANK, "en")[0];
  const no = buildPublicExamQuestions(questionIds.slice(0, 1), KOMPIS_WEB_QUESTION_BANK, "no")[0];
  assert.notEqual(en.question, no.question);
  const fallback = buildPublicExamQuestions(questionIds.slice(0, 1), KOMPIS_WEB_QUESTION_BANK, "xx")[0];
  assert.equal(fallback.question, en.question);
  assert.throws(() => buildPublicExamQuestions(["kw_nope"], KOMPIS_WEB_QUESTION_BANK, "en"), /unknown_question/);
});

test("public index never re-exports the server-only answer key", () => {
  const root = readFileSync(join(__dirname, "..", "index.ts"), "utf8");
  const academy = readFileSync(join(__dirname, "index.ts"), "utf8");
  for (const src of [root, academy]) {
    assert.ok(!/answer-key/.test(src.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")));
    assert.ok(!/\.\/server["']/.test(src.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "")));
  }
  assert.match(readFileSync(join(__dirname, "kompis-web-answer-key.ts"), "utf8"), /SERVER-ONLY/);
});
