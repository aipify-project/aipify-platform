/**
 * CSP Academy — exam variant selection (pure, deterministic, client-safe, no answer keys).
 *
 * ROTATION DESIGN
 * ───────────────
 * Every exam has exactly 15 questions = 10 CORE + 5 ROTATING.
 *
 *  1. Bank ids are de-duplicated and sorted. The first 10 ids are the CORE set and appear in
 *     every exam, so every candidate is tested on the essentials (product, privacy, planned-catalog
 *     honesty, ethical sales). The remaining ids form the ROTATING pool.
 *  2. The rotating pool is split by stride: pool index i belongs to variant (i % 3).
 *     With a 25-question bank this gives three disjoint groups of 5, so any two variants
 *     differ in exactly 5 of 15 questions (a retake never repeats the rotating questions of the
 *     previous variant).
 *  3. variant = attemptIndex % 3 (v1, v2, v3, v1, …). On later cycles (attemptIndex >= 3) a larger
 *     bank rotates inside the variant group by `cycle * 5`, so new questions appear when the bank grows.
 *  4. DIFFICULTY BALANCE comes from bank ORDER (documented in kompis-web-question-bank.ts):
 *     the core holds 3 easy · 4 medium · 3 hard, and the rotating pool is arranged in triples of equal
 *     difficulty so each variant receives one question per triple → 5 easy · 6 medium · 4 hard per exam.
 *     Selection only sees ids, so keep that ordering contract when adding questions (append only).
 *  5. Question ORDER inside an exam is a deterministic shuffle seeded by (variant, cycle) so that the
 *     same attempt always renders identically but core questions are not always first.
 *
 * Nothing here knows or returns correct answers.
 */
import {
  pickLocale,
  type CspExamOptionId,
  type CspAcademyExamQuestion,
  type CspPublicExamQuestion,
} from "./types";

export const CSP_EXAM_QUESTION_COUNT = 15;
export const CSP_EXAM_CORE_COUNT = 10;
export const CSP_EXAM_ROTATING_COUNT = CSP_EXAM_QUESTION_COUNT - CSP_EXAM_CORE_COUNT; // 5
export const CSP_EXAM_VARIANT_COUNT = 3;
/** Minimum bank size so that three disjoint rotating groups of 5 exist. */
export const CSP_EXAM_MIN_BANK_SIZE = CSP_EXAM_CORE_COUNT + CSP_EXAM_ROTATING_COUNT * CSP_EXAM_VARIANT_COUNT; // 25

export type CspExamVariant = { variantId: string; questionIds: string[] };

/** FNV-1a 32-bit hash. */
function hash32(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** mulberry32 PRNG — small, deterministic, good enough for ordering. */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deterministicShuffle<T>(items: readonly T[], seedKey: string): T[] {
  const out = items.slice();
  const rand = seededRandom(hash32(seedKey));
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Selects the exam variant for an attempt. Pure and deterministic: the same
 * (attemptIndex, bankIds) always yields the same variant and question order.
 *
 * @param attemptIndex 0-based attempt number for this partner/product (non-negative integer).
 * @param bankIds ids of the question bank (order-insensitive; at least 25 unique ids).
 */
export function selectExamVariant(attemptIndex: number, bankIds: readonly string[]): CspExamVariant {
  if (!Number.isInteger(attemptIndex) || attemptIndex < 0) {
    throw new Error("csp_exam_invalid_attempt_index");
  }
  const ids = Array.from(new Set(bankIds)).sort();
  if (ids.length < CSP_EXAM_MIN_BANK_SIZE) {
    throw new Error("csp_exam_bank_too_small");
  }

  const core = ids.slice(0, CSP_EXAM_CORE_COUNT);
  const pool = ids.slice(CSP_EXAM_CORE_COUNT);

  const variantIndex = attemptIndex % CSP_EXAM_VARIANT_COUNT;
  const cycle = Math.floor(attemptIndex / CSP_EXAM_VARIANT_COUNT);

  const group = pool.filter((_, i) => i % CSP_EXAM_VARIANT_COUNT === variantIndex);
  const offset = (cycle * CSP_EXAM_ROTATING_COUNT) % group.length;
  const rotating: string[] = [];
  for (let k = 0; k < CSP_EXAM_ROTATING_COUNT; k += 1) {
    rotating.push(group[(offset + k) % group.length]);
  }

  const variantId = `kw_exam_v${variantIndex + 1}`;
  const questionIds = deterministicShuffle([...core, ...rotating], `${variantId}:${cycle}`);
  return { variantId, questionIds };
}

/**
 * Builds the client-facing exam: locale-resolved text only. The result NEVER contains the
 * correct option or any field derived from the answer key. Unknown ids fail closed.
 */
export function buildPublicExamQuestions(
  questionIds: readonly string[],
  bank: readonly CspAcademyExamQuestion[],
  locale: string,
): CspPublicExamQuestion[] {
  const byId = new Map(bank.map((question) => [question.id, question] as const));
  return questionIds.map((id) => {
    const source = byId.get(id);
    if (!source) throw new Error(`csp_exam_unknown_question:${id}`);
    return {
      id: source.id,
      difficulty: source.difficulty,
      lessonId: source.lessonId,
      question: pickLocale(source.question, locale),
      options: source.options.map((option) => ({
        id: option.id as CspExamOptionId,
        text: pickLocale(option.text, locale),
      })),
    };
  });
}
