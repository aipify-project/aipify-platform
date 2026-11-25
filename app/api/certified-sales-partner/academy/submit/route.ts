import { NextResponse } from "next/server";
import {
  assertKompisBlockedDuringExam,
  buildCertificateMeta,
  callCspRpc,
  CSP_CERTIFICATION_PASS_SCORE,
  CSP_KOMPIS_WEB_COURSE_KEY,
  deriveCspCertificateId,
  KOMPIS_WEB_QUESTION_BANK,
  KOMPIS_WEB_QUESTION_IDS,
  parsePartnerOverview,
  scoreExam,
  selectExamVariant,
  type CspExamAnswer,
} from "@/lib/certified-sales-partner";
// SERVER-ONLY: the answer key may only be imported by server routes — never by client components.
import { getAnswerKeyForQuestions } from "@/lib/certified-sales-partner/academy/server";
import { resolveCoreAcademyCourseId } from "@/lib/certified-sales-partner/academy/core-course";
import { toCoreAnswersByPosition } from "@/lib/certified-sales-partner/academy/core-mapping";
import { deliverCspOnboardingEmailThrottled } from "@/lib/certified-sales-partner/onboarding-email";
import { DEFAULT_LOCALE, LOCALES } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ATTEMPT_INDEX = 999;
const MAX_ANSWERS = 50;

type PersistenceStatus = "persisted" | "core_not_ready" | "core_course_unavailable" | "core_score_mismatch";

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

/**
 * Exam submit — the server ALWAYS scores. Client scores are never trusted.
 *
 * Answer key: SERVER-ONLY Academy module (`getAnswerKeyForQuestions`). Never call
 * `csp_get_academy_answer_key` (retired / partner-leakage risk). Core persists via
 * `csp_record_academy_attempt`, which recomputes score from stored keys.
 *
 * Without a published Core course the score is still returned (practice) with
 * `certification_persisted:false`. Certification is NEVER claimed without a Core record.
 * The answer key is never returned to the client.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => null)) as {
      course_key?: unknown;
      course_id?: unknown;
      variant_id?: unknown;
      attempt_index?: unknown;
      locale?: unknown;
      answers?: unknown;
      /** Ignored — client scores are never trusted. */
      score_pct?: unknown;
    } | null;

    if (!body || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "answers_required" }, { status: 400 });
    }
    if (body.answers.length > MAX_ANSWERS) {
      return NextResponse.json({ error: "too_many_answers" }, { status: 400 });
    }
    if (body.course_key !== undefined && body.course_key !== CSP_KOMPIS_WEB_COURSE_KEY) {
      return NextResponse.json({ error: "unknown_course_key" }, { status: 400 });
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

    const variant = selectExamVariant(attemptIndex, KOMPIS_WEB_QUESTION_IDS);
    if (body.variant_id !== undefined && body.variant_id !== variant.variantId) {
      return NextResponse.json({ error: "variant_mismatch" }, { status: 400 });
    }

    // Latest answer per question; every submitted id must belong to this exam variant.
    const examIds = new Set(variant.questionIds);
    const latest = new Map<string, string>();
    for (const raw of body.answers) {
      const a = rec(raw);
      if (typeof a.questionId !== "string" || typeof a.selectedOptionId !== "string") {
        return NextResponse.json({ error: "invalid_answer_shape" }, { status: 400 });
      }
      if (!examIds.has(a.questionId)) {
        return NextResponse.json({ error: "answer_not_part_of_exam" }, { status: 400 });
      }
      latest.set(a.questionId, a.selectedOptionId);
    }
    const answers: CspExamAnswer[] = Array.from(latest, ([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));

    const kompis = assertKompisBlockedDuringExam();
    const courseId =
      (await resolveCoreAcademyCourseId(CSP_KOMPIS_WEB_COURSE_KEY)) ??
      (typeof body.course_id === "string" && UUID_PATTERN.test(body.course_id) ? body.course_id : null);

    // 1) Server-only local answer key for the exam variant (never Core fasit RPC).
    let answerKey: Record<string, string>;
    try {
      answerKey = getAnswerKeyForQuestions(variant.questionIds);
    } catch {
      return NextResponse.json({ error: "answer_key_unavailable", kompis_help: kompis }, { status: 503 });
    }

    // 2) Always server-score against the full exam (unanswered counts wrong).
    const scored = scoreExam(answers, answerKey);

    // Pedagogical hint: lessons to revisit — never per-question correct answers.
    const lessonsToReview = Array.from(
      new Set(
        KOMPIS_WEB_QUESTION_BANK.filter(
          (q) => examIds.has(q.id) && latest.get(q.id) !== answerKey[q.id],
        ).map((q) => q.lessonId),
      ),
    ).sort();

    // 3) Persist via Core when a published course id resolves. Core recomputes the score.
    let persistenceStatus: PersistenceStatus = courseId ? "core_not_ready" : "core_course_unavailable";
    let backendReady = false;
    let certificationPersisted = false;
    let attemptRecorded = false;
    let attemptId: string | null = null;

    if (courseId) {
      const persist = await callCspRpc(supabase, "csp_record_academy_attempt", {
        p_course_id: courseId,
        p_score_pct: scored.scorePct,
        p_passed: scored.passed,
        p_answers: toCoreAnswersByPosition(latest),
      });
      if (persist.ready) {
        backendReady = true;
        const core = rec(persist.data);
        if (core.error === "forbidden" || core.error === "unauthorized") {
          persistenceStatus = "core_not_ready";
        } else if (core.found === false) {
          persistenceStatus = "core_not_ready";
        } else {
          attemptId = typeof core.attempt_id === "string" ? core.attempt_id : null;
          attemptRecorded = attemptId !== null;
          const corePassed = core.passed === true;
          const coreScore = typeof core.score_pct === "number" ? core.score_pct : null;
          if (coreScore !== null && Math.round(coreScore) !== Math.round(scored.scorePct)) {
            persistenceStatus = "core_score_mismatch";
          } else {
            persistenceStatus = "persisted";
          }
          certificationPersisted =
            persistenceStatus === "persisted" &&
            scored.passed &&
            corePassed &&
            core.certification_status === "passed";
        }
      } else {
        persistenceStatus = "core_not_ready";
      }
    }

    // 4) Certificate meta only after a Core-confirmed pass.
    let certificate: ReturnType<typeof buildCertificateMeta> | null = null;
    let certificateEmail: string | undefined;
    if (certificationPersisted) {
      try {
        const overview = await callCspRpc(supabase, "csp_get_partner_overview");
        const parsed = overview.ready ? parsePartnerOverview(overview.data) : null;
        const metadata = rec(user.user_metadata);
        const displayName =
          parsed?.displayName ??
          (typeof metadata.full_name === "string" ? metadata.full_name : null) ??
          (typeof metadata.name === "string" ? metadata.name : null);
        const locale =
          typeof body.locale === "string" && (LOCALES as readonly string[]).includes(body.locale)
            ? body.locale
            : DEFAULT_LOCALE;
        if (displayName && parsed?.partnerId) {
          certificate = buildCertificateMeta({
            fullName: displayName,
            passedAt: new Date(),
            locale,
            certificateId: deriveCspCertificateId(parsed.partnerId, "kompis_web"),
          });
        }
        if (user.email && parsed?.partnerId) {
          certificateEmail = (
            await deliverCspOnboardingEmailThrottled({
              kind: "certificate_awarded",
              to: user.email,
              locale,
              vars: { name: displayName, emailVerified: Boolean(user.email_confirmed_at) },
              idempotencyKey: `csp-certificate_awarded-${parsed.partnerId}-kompis_web`,
            })
          ).outcome;
        }
      } catch {
        certificate = null;
      }
    }

    return NextResponse.json({
      course_key: CSP_KOMPIS_WEB_COURSE_KEY,
      variantId: variant.variantId,
      attemptIndex,
      scored,
      passed: scored.passed,
      scorePct: scored.scorePct,
      correct: scored.correct,
      total: scored.total,
      pass_score_pct: CSP_CERTIFICATION_PASS_SCORE,
      feedback: {
        outcome: scored.passed ? "passed" : "not_passed",
        correct: scored.correct,
        total: scored.total,
        lessons_to_review: lessonsToReview,
      },
      answer_source: "academy_local",
      backend_ready: backendReady,
      persistence_status: persistenceStatus,
      attempt_recorded: attemptRecorded,
      certification_persisted: certificationPersisted,
      certificate,
      ...(certificateEmail ? { certificate_email: certificateEmail } : {}),
      kompis_help: kompis,
    });
  } catch {
    return NextResponse.json({ error: "exam_submit_failed" }, { status: 500 });
  }
}
