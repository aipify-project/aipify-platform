import { NextResponse } from "next/server";
import {
  assertKompisBlockedDuringExam,
  buildPublicExamQuestions,
  CSP_EXAM_QUESTION_COUNT,
  CSP_KOMPIS_WEB_COURSE_KEY,
  KOMPIS_WEB_QUESTION_BANK,
  KOMPIS_WEB_QUESTION_IDS,
  selectExamVariant,
} from "@/lib/certified-sales-partner";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/get-locale";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_PRODUCT_KEY = "kompis_web";
/** Upper bound — keeps rotation arithmetic sane; server does not persist attempts in practice mode. */
const MAX_ATTEMPT_INDEX = 999;

function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Starts an exam: returns the locale-resolved questions of one rotation variant.
 * The response carries NO answers and NO answer-key derived data. This route deliberately does
 * not import the server-only answer key.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      product_key?: unknown;
      locale?: unknown;
      attempt_index?: unknown;
    };

    const productKey = typeof body.product_key === "string" && body.product_key ? body.product_key : DEFAULT_PRODUCT_KEY;
    if (productKey !== DEFAULT_PRODUCT_KEY) {
      return NextResponse.json({ error: "product_exam_not_available" }, { status: 400 });
    }

    const attemptIndex = body.attempt_index === undefined ? 0 : body.attempt_index;
    if (
      typeof attemptIndex !== "number" ||
      !Number.isInteger(attemptIndex) ||
      attemptIndex < 0 ||
      attemptIndex > MAX_ATTEMPT_INDEX
    ) {
      return NextResponse.json({ error: "invalid_attempt_index" }, { status: 400 });
    }

    let locale: Locale = DEFAULT_LOCALE;
    if (isLocale(body.locale)) {
      locale = body.locale;
    } else if (body.locale === undefined) {
      const resolved = await getLocale().catch(() => DEFAULT_LOCALE);
      locale = isLocale(resolved) ? resolved : DEFAULT_LOCALE;
    } else {
      return NextResponse.json({ error: "invalid_locale" }, { status: 400 });
    }

    const variant = selectExamVariant(attemptIndex, KOMPIS_WEB_QUESTION_IDS);
    const questions = buildPublicExamQuestions(variant.questionIds, KOMPIS_WEB_QUESTION_BANK, locale);

    return NextResponse.json({
      course_key: CSP_KOMPIS_WEB_COURSE_KEY,
      product_key: productKey,
      variantId: variant.variantId,
      attemptIndex,
      locale,
      questions,
      total: CSP_EXAM_QUESTION_COUNT,
      kompis_help: assertKompisBlockedDuringExam(),
    });
  } catch {
    return NextResponse.json({ error: "exam_start_failed" }, { status: 500 });
  }
}
