/**
 * CSP Academy — shared types for the Kompis Web certification track.
 * Pure, client-safe. Contains NO answer keys.
 */
import type { Locale } from "@/lib/i18n/config";

/** One string per supported locale (en, no, sv, da, pl, uk, es). English is the baseline. */
export type CspLocaleBlock = Readonly<Record<Locale, string>>;

/** Builds a locale block — argument order matches `LOCALES` in `lib/i18n/config.ts`. */
export function localeBlock(
  en: string,
  no: string,
  sv: string,
  da: string,
  pl: string,
  uk: string,
  es: string,
): CspLocaleBlock {
  return { en, no, sv, da, pl, uk, es };
}

/** Picks the text for a locale; falls back to English for an unknown locale. */
export function pickLocale(block: CspLocaleBlock, locale: string): string {
  const value = (block as Readonly<Record<string, string | undefined>>)[locale];
  return typeof value === "string" && value.length > 0 ? value : block.en;
}

export type CspAcademyProductId = "kompis_web";

/** Stable academy course key for the Kompis Web track (Core course ids are UUIDs, resolved separately). */
export const CSP_KOMPIS_WEB_COURSE_KEY = "kompis_web_v1" as const;

export const CSP_EXAM_DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type CspExamDifficulty = (typeof CSP_EXAM_DIFFICULTIES)[number];

export type CspAcademyLesson = {
  /** Stable id (lesson_01..lesson_06) — never renumber. */
  readonly id: string;
  readonly productId: CspAcademyProductId;
  readonly order: number;
  readonly title: CspLocaleBlock;
  /** Paragraphs; each paragraph carries its own locale block. */
  readonly body: readonly CspLocaleBlock[];
  /** True when the lesson cites planned catalog facts that are not live in billing. */
  readonly containsPlannedCatalogFacts: boolean;
};

export type CspExamOptionId = "a" | "b" | "c" | "d";

export type CspExamOption = {
  readonly id: CspExamOptionId;
  readonly text: CspLocaleBlock;
};

/** Source question — contains NO correct-answer field (key lives in the server-only module). */
export type CspAcademyExamQuestion = {
  /** Stable semantic id (kw_q01..) — never renumber. */
  readonly id: string;
  readonly productId: CspAcademyProductId;
  readonly difficulty: CspExamDifficulty;
  /** Lesson that teaches the topic. */
  readonly lessonId: string;
  readonly question: CspLocaleBlock;
  readonly options: readonly [CspExamOption, CspExamOption, CspExamOption, CspExamOption];
};

/** Locale-resolved question sent to the client. Never carries the correct answer. */
export type CspPublicExamQuestion = {
  readonly id: string;
  readonly difficulty: CspExamDifficulty;
  readonly lessonId: string;
  readonly question: string;
  readonly options: readonly { readonly id: CspExamOptionId; readonly text: string }[];
};
