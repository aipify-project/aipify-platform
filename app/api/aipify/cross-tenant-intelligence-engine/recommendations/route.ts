import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      global_insight_id?: string;
      notes?: string;
      outcome_id?: string;
      status?: string;
      outcome_summary?: string;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "record_outcome") {
      if (!body.outcome_id) {
        return NextResponse.json({ error: "outcome_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_cross_tenant_intelligence_outcome", {
        p_outcome_id: body.outcome_id,
        p_status: body.status ?? "implemented",
        p_outcome_summary: body.outcome_summary ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.global_insight_id) {
      return NextResponse.json({ error: "global_insight_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("approve_cross_tenant_recommendation", {
      p_global_insight_id: body.global_insight_id,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process recommendation action" }, { status: 500 });
  }
}
