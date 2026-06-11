import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      source_module?: string;
      source_id?: string;
      feedback_type?: string;
      comment?: string;
    };
    if (!body.source_module || !body.feedback_type) {
      return NextResponse.json({ error: "source_module and feedback_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_learning_feedback", {
      p_source_module: body.source_module,
      p_source_id: body.source_id ?? null,
      p_feedback_type: body.feedback_type,
      p_comment: body.comment ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}
