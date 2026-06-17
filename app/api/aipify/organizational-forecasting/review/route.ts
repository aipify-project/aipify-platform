import { NextResponse } from "next/server";
import { parseForecastActionResult } from "@/lib/app-portal/organizational-forecasting";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      forecast_id?: string;
      review_notes?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_org_forecast", {
      p_forecast_id:  body.forecast_id  ?? null,
      p_action:       body.action       ?? null,
      p_review_notes: body.review_notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseForecastActionResult(data));
  } catch {
    return NextResponse.json({ error: "Forecast review failed" }, { status: 500 });
  }
}
