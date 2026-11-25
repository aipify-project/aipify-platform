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
import {
  corePositionToLocalQuestionId,
  toCoreAnswersByPosition,
} from "@/lib/certified-sales-partner/academy/core-mapping";
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
 * Extracts a Core answer key. Supports the `csp_get_academy_answer_key` shape
 * (`questions: [{ question_id, position, answer_key }]`) and a flat `answer_key` map.
 * Core questions are matched to local ids directly or by position (`kw_q01` = position 1).
 * Returns null when the payload is unusable.
 */
function parseCoreAnswerKey(data: unknown): Record<string, string> | null {
  const root = rec(data);
  const out: Record<string, string> = {};
  const flat = rec(root.answer_key);
  for (const [id, value] of Object.entries(flat)) {
    if (typeof value === "string") out[id] = value;
  }
  if (Array.isArray(root.questions)) {
    for (const item of root.questions) {
      const q = rec(item);
      const raw = q.answer_key;
      const value = typeof raw === "string" ? raw : rec(raw).correct;
      if (typeof value !== "string") continue;
      if (typeof q.question_id === "string") out[q.question_id] = value;
      if (typeof q.position === "number") {
        const localId = corePositionToLocalQuestionId(q.position);
        if (localId) out[localId] = value;
      }
    }
  }
  return Object.keys(out).length > 0 ? out : null;
}

/**
 * Exam submit — the server ALWAYS scores. Client scores are never trusted.
 *
 * Scoring key: Core's answer key when Core is ready AND covers every question of the exam;
 * otherwise the Academy answer key from `academy/server` for the exam variant derived from
 * `attempt_index` (never from client-chosen question ids — a client cannot shrink the exam).
 *
 * Persistence: `csp_record_academy_attempt` runs only when Core is ready and a Core course id (UUID)
 * resolves (server-side lookup of the published `kompis_web_v1` course). Core re-scores over ALL loaded
 * course questions; when its score differs from ours the attempt is reported as `core_score_mismatch`
 * (practice) and never as certified. Without Core the score is still returned (HTTP 200, honest practice mode) with
 * `certification_persisted:false` and `backend_ready:false` — certification is NEVER claimed
 * without a Core record. The full answer key is never returned.
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
    // Core course id: resolved server-side from the course key (Core validates it is published).
    // A client-supplied UUID is only a fallback and is re-validated by Core.
    const courseId =
      (await resolveCoreAcademyCourseId(CSP_KOMPIS_WEB_COURSE_KEY)) ??
      (typeof body.course_id === "string" && UUID_PATTERN.test(body.course_id) ? body.course_id : null);

    // 1) Answer key — prefer Core when ready and complete for this exam; else Academy server key.
    let coreReady = false;
    let answerKey: Record<string, string> | null = null;
    let answerSource: "core" | "academy_local" = "academy_local";
    if (courseId) {
      const keyResult = await callCspRpc(supabase, "csp_get_academy_answer_key", { p_course_id: courseId });
      coreReady = keyResult.ready;
      if (keyResult.ready) {
        const coreKey = parseCoreAnswerKey(keyResult.data);
        if (coreKey && variant.questionIds.every((id) => typeof coreKey[id] === "string")) {
          answerKey = Object.fromEntries(variant.questionIds.map((id) => [id, coreKey[id]]));
          answerSource = "core";
        }
      }
    }
    if (!answerKey) {
      try {
        answerKey = getAnswerKeyForQuestions(variant.questionIds);
      } catch {
        return NextResponse.json({ error: "answer_key_unavailable", kompis_help: kompis }, { status: 503 });
      }
    }

    // 2) Always server-score against the full exam (unanswered counts wrong).
    const scored = scoreExam(answers, answerKey);

    // Pedagogical hint: which lessons to revisit — aggregated per lesson, never per-question answers.
    const lessonsToReview = Array.from(
      new Set(
        KOMPIS_WEB_QUESTION_BANK.filter(
          (q) => examIds.has(q.id) && latest.get(q.id) !== answerKey![q.id],
        ).map((q) => q.lessonId),
      ),
    ).sort();

    // 3) Persist via Core when possible. Never claim certification without a Core record.
    let persistenceStatus: PersistenceStatus = courseId ? "core_not_ready" : "core_course_unavailable";
    let backendReady = false;
    let certificationPersisted = false;
    let attemptRecorded = false;
    let attemptId: string | null = null;

    if (courseId && coreReady) {
      const persist = await callCspRpc(supabase, "csp_record_academy_attempt", {
        p_course_id: courseId,
        p_score_pct: scored.scorePct,
        p_passed: scored.passed,
        // Core recomputes the score from this object, keyed by question position -> chosen option.
        p_answers: toCoreAnswersByPosition(latest),
      });
      if (persist.ready) {
        backendReady = true;
        const core = rec(persist.data);
        attemptId = typeof core.attempt_id === "string" ? core.attempt_id : null;
        attemptRecorded = attemptId !== null;
        const corePassed = core.passed === true;
        const coreScore = typeof core.score_pct === "number" ? core.score_pct : null;
        if (coreScore !== null && Math.round(coreScore) !== Math.round(scored.scorePct)) {
          // Core scored against its own question set — its record is authoritative, ours is practice.
          persistenceStatus = "core_score_mismatch";
        } else {
          persistenceStatus = "persisted";
        }
        certificationPersisted =
          persistenceStatus === "persisted" &&
          scored.passed &&
          corePassed &&
          core.certification_status === "passed";
      } else {
        persistenceStatus = "core_not_ready";
      }
    }

    // 4) Certificate meta only after a Core-confirmed pass and with a known display name.
    let certificate: ReturnType<typeof buildCertificateMeta> | null = null;
    if (certificationPersisted) {
      try {
        const overview = await callCspRpc(supabase, "csp_get_partner_overview");
        const parsed = overview.ready ? parsePartnerOverview(overview.data) : null;
        const metadata = rec(user.user_metadata);
        const displayName =
          parsed?.displayName ??
          (typeof metadata.full_name === "string" ? metadata.full_name : null) ??
          (typeof metadata.name === "string" ? metadata.name : null);
        if (displayName && parsed?.partnerId) {
          const locale =
            typeof body.locale === "string" && (LOCALES as readonly string[]).includes(body.locale)
              ? body.locale
              : DEFAULT_LOCALE;
          certificate = buildCertificateMeta({
            fullName: displayName,
            passedAt: new Date(),
            locale,
            certificateId: deriveCspCertificateId(parsed.partnerId, "kompis_web"),
          });
        }
      } catch {
        certificate = null; // fail closed — no certificate without a verifiable issuer and name
      }
    }

    return NextResponse.json({
      course_key: CSP_KOMPIS_WEB_COURSE_KEY,
      variantId: variant.variantId,
      attemptIndex,
      scored,
      // Flat copies for simple clients.
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
      answer_source: answerSource,
      backend_ready: backendReady,
      persistence_status: persistenceStatus,
      attempt_recorded: attemptRecorded,
      certification_persisted: certificationPersisted,
      certificate,
      kompis_help: kompis,
    });
  } catch {
    return NextResponse.json({ error: "exam_submit_failed" }, { status: 500 });
  }
}
