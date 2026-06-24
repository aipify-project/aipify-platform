import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { awaitCompanionQueueProcessing } from "@/lib/app/companion/chat-queue/process-queue";

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
    };

    const conversationId = String(body.conversation_id ?? "").trim();
    if (!conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const dispatch = await awaitCompanionQueueProcessing(conversationId, {
      origin: new URL(request.url).origin,
    });

    return NextResponse.json({
      ok: dispatch.ok,
      triggered: true,
      worker_dispatch: dispatch.ok ? "completed" : dispatch.error_code,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "process_failed" }, { status: 500 });
  }
}
