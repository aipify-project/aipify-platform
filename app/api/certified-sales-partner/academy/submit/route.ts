import { NextResponse } from "next/server";
import {
  assertKompisBlockedDuringExam,
  callCspRpc,
  failClosedJson,
  scoreExam,
  type CspExamAnswer,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/**
 * Product exam submit — server scores answers; never trusts client scorePct.
 * Kompis remains blocked for the exam context.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      course_id?: string;
      answers?: CspExamAnswer[];
      /** Ignored — client scores are never trusted. */
      score_pct?: number;
    };

    if (!body.course_id || !Array.isArray(body.answers)) {
      return NextResponse.json({ error: "course_id_and_answers_required" }, { status: 400 });
    }

    const kompis = assertKompisBlockedDuringExam();
    const keyResult = await callCspRpc(supabase, "csp_get_academy_answer_key", {
      p_course_id: body.course_id,
    });
    if (!keyResult.ready) {
      const closed = failClosedJson(keyResult);
      return NextResponse.json(
        { ...closed.body, kompis_help: kompis },
        { status: closed.status },
      );
    }

    const answerKey =
      keyResult.data &&
      typeof keyResult.data === "object" &&
      (keyResult.data as { answer_key?: Record<string, string> }).answer_key
        ? (keyResult.data as { answer_key: Record<string, string> }).answer_key
        : null;
    if (!answerKey) {
      return NextResponse.json({ error: "answer_key_unavailable", kompis_help: kompis }, { status: 503 });
    }

    const scored = scoreExam(body.answers, answerKey);
    const persist = await callCspRpc(supabase, "csp_record_academy_attempt", {
      p_course_id: body.course_id,
      p_score_pct: scored.scorePct,
      p_passed: scored.passed,
      p_answers: body.answers,
    });
    if (!persist.ready) {
      const closed = failClosedJson(persist);
      return NextResponse.json(
        { ...closed.body, scored, kompis_help: kompis },
        { status: closed.status },
      );
    }

    return NextResponse.json({
      ...scored,
      kompis_help: kompis,
      persistence: persist.data,
    });
  } catch {
    return NextResponse.json({ error: "exam_submit_failed" }, { status: 500 });
  }
}
