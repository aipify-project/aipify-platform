import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      decision_id?: string;
      review_notes?: string;
      approval_rationale?: string;
      rejection_rationale?: string;
    };

    if (!body.decision_id) {
      return NextResponse.json({ error: "decision_id required" }, { status: 400 });
    }

    if (body.action === "approve") {
      const { data, error } = await supabase.rpc("approve_decision", {
        p_decision_id: body.decision_id,
        p_approval_rationale: body.approval_rationale ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "reject") {
      const { data, error } = await supabase.rpc("reject_decision", {
        p_decision_id: body.decision_id,
        p_rejection_rationale: body.rejection_rationale ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("review_decision", {
      p_decision_id: body.decision_id,
      p_review_notes: body.review_notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process review action" }, { status: 500 });
  }
}
