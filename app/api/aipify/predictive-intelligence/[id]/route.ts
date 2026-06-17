import { NextResponse } from "next/server";
import { parsePredictiveDetail } from "@/lib/app-portal/predictive-intelligence";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const { data, error } = await supabase.rpc("get_app_portal_predictive_intelligence_prediction", {
      p_prediction_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePredictiveDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load prediction" }, { status: 500 });
  }
}
