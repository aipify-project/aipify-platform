import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ActiveBody = {
  conversation_id?: string;
  attachment_id?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ActiveBody;
    const conversationId = body.conversation_id?.trim();
    const attachmentId = body.attachment_id?.trim();

    if (!conversationId || !attachmentId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("set_companion_active_artifact", {
      p_conversation_id: conversationId,
      p_attachment_id: attachmentId,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: "set_active_failed" }, { status: 500 });
    }

    const result = (data ?? {}) as { ok?: boolean; error?: string };
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error ?? "not_found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, active_attachment_id: attachmentId });
  } catch {
    return NextResponse.json({ ok: false, error: "set_active_failed" }, { status: 500 });
  }
}
