import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      conversation_id?: string;
      question?: string;
      request_human?: boolean;
      subject?: string;
      channel?: string;
    };
    if (!body.question) return NextResponse.json({ error: "question required" }, { status: 400 });

    let conversationId = body.conversation_id;
    if (!conversationId) {
      const { data: conv, error: convError } = await supabase.rpc("create_self_support_conversation", {
        p_subject: body.subject ?? body.question.slice(0, 120),
        p_channel: body.channel ?? "dashboard",
      });
      if (convError) return NextResponse.json({ error: convError.message }, { status: 403 });
      conversationId = (conv as { id?: string })?.id;
    }

    if (!conversationId) return NextResponse.json({ error: "conversation_id required" }, { status: 400 });

    const { data, error } = await supabase.rpc("ask_self_support", {
      p_conversation_id: conversationId,
      p_question: body.question,
      p_request_human: body.request_human ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 });
  }
}
