import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isCompanionWorkerConfigured } from "@/lib/app/companion/chat-queue/dispatch-worker";
import { scheduleCompanionQueueProcessing } from "@/lib/app/companion/chat-queue/process-queue";

export const maxDuration = 300;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      conversation_id?: string;
      idempotency_key?: string;
      question?: string;
      attachment_ids?: string[];
      active_artifact_id?: string | null;
      attachment_summaries?: unknown[];
      locale?: string;
      pathname?: string;
      platform_active_modules?: string | null;
      title?: string;
      companion_active?: boolean;
    };

    const conversationId = String(body.conversation_id ?? "").trim();
    const idempotencyKey = String(body.idempotency_key ?? "").trim();
    const question = String(body.question ?? "").trim();
    const companionActive = body.companion_active !== false;

    if (!conversationId || !idempotencyKey) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const hasAttachments = Array.isArray(body.attachment_ids) && body.attachment_ids.length > 0;
    if (!question && !hasAttachments) {
      return NextResponse.json({ ok: false, error: "empty_question" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("enqueue_companion_chat_message", {
      p_conversation_id: conversationId,
      p_idempotency_key: idempotencyKey,
      p_question_text: question,
      p_attachment_ids: body.attachment_ids ?? [],
      p_active_artifact_id: body.active_artifact_id ?? null,
      p_attachment_summaries: body.attachment_summaries ?? [],
      p_locale: body.locale ?? null,
      p_pathname: body.pathname ?? null,
      p_platform_active_modules: body.platform_active_modules ?? null,
      p_user_client_message_id: idempotencyKey.split(":").pop() ?? null,
      p_title: body.title ?? null,
      p_companion_active: companionActive,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    scheduleCompanionQueueProcessing(conversationId, {
      origin: new URL(request.url).origin,
    });

    const payload =
      data && typeof data === "object" && !Array.isArray(data)
        ? { ...(data as Record<string, unknown>) }
        : { ok: true };

    return NextResponse.json({
      ...payload,
      worker_dispatch: isCompanionWorkerConfigured() ? "scheduled" : "unavailable",
    });
  } catch {
    return NextResponse.json({ ok: false, error: "enqueue_failed" }, { status: 500 });
  }
}
