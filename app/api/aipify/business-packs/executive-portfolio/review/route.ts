import { NextResponse } from "next/server";
import { parseExecutivePortfolioReviewResult } from "@/lib/app-portal/business-pack-executive-portfolio";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      pack_key?: string;
      review_type?: string;
      review_outcome?: string;
      governance_notes?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_business_pack_executive_portfolio", {
      p_pack_key: body.pack_key ?? "",
      p_review_type: body.review_type ?? "quarterly_executive",
      p_review_outcome: body.review_outcome ?? "continue_investment",
      p_governance_notes: body.governance_notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutivePortfolioReviewResult(data));
  } catch {
    return NextResponse.json({ error: "Executive portfolio review failed" }, { status: 500 });
  }
}
