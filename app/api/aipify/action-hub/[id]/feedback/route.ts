import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { feedback_type?: string; comment?: string };
    if (!body.feedback_type) {
      return NextResponse.json({ error: "feedback_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_action_feedback", {
      p_action_id: id,
      p_feedback_type: body.feedback_type,
      p_comment: body.comment ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record feedback" }, { status: 500 });
  }
}
