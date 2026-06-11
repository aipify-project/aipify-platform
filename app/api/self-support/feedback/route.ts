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
      message_id?: string;
      rating?: string;
      comment?: string;
      improvement_suggestion?: string;
    };
    if (!body.conversation_id || !body.rating) {
      return NextResponse.json({ error: "conversation_id and rating required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("submit_self_support_feedback", {
      p_conversation_id: body.conversation_id,
      p_rating: body.rating,
      p_message_id: body.message_id ?? null,
      p_comment: body.comment ?? null,
      p_improvement_suggestion: body.improvement_suggestion ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
