import { NextResponse } from "next/server";
import { parsePredictiveTimeline } from "@/lib/app-portal/predictive-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get("prediction_id");
    const { data, error } = await supabase.rpc("get_app_portal_predictive_intelligence_timeline", {
      p_prediction_id: predictionId || null,
      p_period_from: searchParams.get("period_from") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ events: parsePredictiveTimeline(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}
