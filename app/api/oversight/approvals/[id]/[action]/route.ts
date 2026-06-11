import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_ACTIONS = new Set(["approve", "reject", "override", "update_rationale"]);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const { id, action } = await params;
    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json({ error: "Unknown action" }, { status: 404 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      reason?: string;
      explanation?: Record<string, unknown>;
      override_reason?: string;
      business_justification?: string;
      review_required?: boolean;
    };

    if (action === "override") {
      if (!body.override_reason || !body.business_justification) {
        return NextResponse.json(
          { error: "override_reason and business_justification are required" },
          { status: 400 }
        );
      }
      const { data, error } = await supabase.rpc("apply_oversight_override", {
        p_approval_id: id,
        p_override_reason: body.override_reason,
        p_business_justification: body.business_justification,
        p_review_required: body.review_required ?? true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data ?? {});
    }

    const { data, error } = await supabase.rpc("perform_oversight_approval_action", {
      p_approval_id: id,
      p_action: action,
      p_reason: body.reason ?? null,
      p_explanation: body.explanation ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({ error: "Oversight action failed" }, { status: 500 });
  }
}
