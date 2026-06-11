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
      feedback_type?: string;
      source?: string;
      rating?: number;
      comment_summary?: string;
    };

    if (!body.feedback_type) {
      return NextResponse.json({ error: "feedback_type is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("submit_pilot_feedback", {
      p_feedback_type: body.feedback_type,
      p_source: body.source ?? "dashboard",
      p_rating: body.rating ?? null,
      p_comment_summary: body.comment_summary ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to submit pilot feedback" }, { status: 500 });
  }
}
