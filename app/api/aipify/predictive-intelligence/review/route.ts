import { NextResponse } from "next/server";
import { parsePredictiveReviewResult } from "@/lib/app-portal/predictive-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      prediction_id?: string;
      outcome?: string;
      review_notes?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_predictive_intelligence", {
      p_prediction_id: body.prediction_id ?? null,
      p_outcome: body.outcome ?? null,
      p_review_notes: body.review_notes ?? null,
      p_action: body.action ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePredictiveReviewResult(data));
  } catch {
    return NextResponse.json({ error: "Prediction review failed" }, { status: 500 });
  }
}
