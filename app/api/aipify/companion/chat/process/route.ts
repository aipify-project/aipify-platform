import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  processCompanionQueueForConversation,
  scheduleCompanionQueueProcessing,
} from "@/lib/app/companion/chat-queue/process-queue";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      conversation_id?: string;
      companion_active?: boolean;
    };

    const conversationId = String(body.conversation_id ?? "").trim();
    if (!conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const { processed, hasMore } = await processCompanionQueueForConversation(
      supabase,
      conversationId,
      {
        maxItems: 3,
        companionActive: body.companion_active !== false,
      },
    );

    if (hasMore) {
      scheduleCompanionQueueProcessing(conversationId, {
        companionActive: body.companion_active !== false,
        cookieHeader: request.headers.get("cookie"),
        origin: new URL(request.url).origin,
      });
    }

    return NextResponse.json({ ok: true, processed, has_more: hasMore });
  } catch {
    return NextResponse.json({ ok: false, error: "process_failed" }, { status: 500 });
  }
}
