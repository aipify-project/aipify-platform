import { NextResponse } from "next/server";
import { parseGovernanceReviewResult } from "@/lib/app-portal/business-pack-governance";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      pack_key?: string;
      governance_notes?: string;
      review_frequency?: string;
    };

    if (!body.pack_key) {
      return NextResponse.json({ error: "pack_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("review_app_portal_business_pack_governance", {
      p_pack_key: body.pack_key,
      p_governance_notes: body.governance_notes ?? null,
      p_review_frequency: body.review_frequency ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseGovernanceReviewResult(data));
  } catch {
    return NextResponse.json({ error: "Governance review failed" }, { status: 500 });
  }
}
