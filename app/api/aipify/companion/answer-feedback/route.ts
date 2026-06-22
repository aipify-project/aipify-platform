import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "@/lib/i18n/get-locale";

type FeedbackBody = {
  conversation_id?: string;
  message_id?: string;
  question?: string;
  answer_summary?: string;
  sources?: unknown;
  route_context?: string;
  language?: string;
  feedback_type?: "helpful" | "not_helpful" | "org_confirm";
  negative_reason?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as FeedbackBody;
    const locale = body.language ?? (await getLocale());

    const feedbackType = body.feedback_type ?? "helpful";
    if (!["helpful", "not_helpful", "org_confirm"].includes(feedbackType)) {
      return NextResponse.json({ error: "Invalid feedback type" }, { status: 400 });
    }

    if (!body.conversation_id || !body.message_id || !body.question || !body.answer_summary) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_companion_answer_feedback", {
      p_conversation_id: body.conversation_id,
      p_message_id: body.message_id,
      p_question: body.question,
      p_answer_summary: body.answer_summary,
      p_sources: Array.isArray(body.sources) ? body.sources : [],
      p_route_context: body.route_context ?? null,
      p_language: locale,
      p_feedback_type: feedbackType,
      p_negative_reason: body.negative_reason ?? null,
      p_metadata: body.metadata ?? {},
    });

    if (error) {
      return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
    }

    const result = data as { recorded?: boolean; error?: string };
    if (result.error === "forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ recorded: result.recorded === true });
  } catch {
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}
