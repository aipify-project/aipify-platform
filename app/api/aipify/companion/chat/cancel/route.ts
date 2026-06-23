import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { scheduleCompanionQueueProcessing } from "@/lib/app/companion/chat-queue/process-queue";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { queue_id?: string; conversation_id?: string };
    const queueId = String(body.queue_id ?? "").trim();
    if (!queueId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("cancel_companion_queue_item", {
      p_queue_id: queueId,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    if (body.conversation_id) {
      scheduleCompanionQueueProcessing(body.conversation_id, {
        cookieHeader: request.headers.get("cookie"),
        origin: new URL(request.url).origin,
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false, error: "cancel_failed" }, { status: 500 });
  }
}
