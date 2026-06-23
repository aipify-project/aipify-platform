import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { conversation_id?: string };
    const conversationId = String(body.conversation_id ?? "").trim();
    if (!conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("mark_companion_conversation_read", {
      p_conversation_id: conversationId,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false, error: "read_failed" }, { status: 500 });
  }
}
