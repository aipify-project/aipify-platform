import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const finalDecision = typeof body.final_decision === "string" ? body.final_decision : "";
    const reason = typeof body.reason === "string" ? body.reason : "";
    const overrideAi = body.override_ai === true;

    if (!finalDecision) {
      return NextResponse.json({ error: "final_decision is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("review_moderation_result", {
      p_result_id: id,
      p_final_decision: finalDecision,
      p_reason: reason,
      p_override_ai: overrideAi,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to review moderation result" }, { status: 500 });
  }
}
