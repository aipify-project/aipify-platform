import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      partner_id?: string;
      engagement_type?: string;
      onboarding_status?: string;
      metadata?: Record<string, unknown>;
      engagement_id?: string;
      review_summary?: string;
      adoption_score?: number;
      renewal_readiness?: string;
      open_risks?: Record<string, unknown>[];
      outcome_type?: string;
    };

    if (body.action === "review") {
      if (!body.engagement_id) {
        return NextResponse.json({ error: "engagement_id is required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_partner_success_review", {
        p_engagement_id: body.engagement_id,
        p_review_summary: body.review_summary ?? null,
        p_adoption_score: body.adoption_score ?? null,
        p_renewal_readiness: body.renewal_readiness ?? null,
        p_open_risks: body.open_risks ?? null,
        p_outcome_type: body.outcome_type ?? "lesson",
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.partner_id) {
      return NextResponse.json({ error: "partner_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_partner_engagement", {
      p_partner_id: body.partner_id,
      p_engagement_type: body.engagement_type ?? "implementation",
      p_onboarding_status: body.onboarding_status ?? "in_progress",
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process engagement" }, { status: 500 });
  }
}
