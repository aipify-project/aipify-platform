import { NextResponse } from "next/server";
import { parseGrowthPartnerForecastCenter } from "@/lib/growth-partner-forecast";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      payload?: Record<string, unknown>;
      surface?: string;
    };
    if (!body.action) return NextResponse.json({ error: "action required" }, { status: 400 });

    const surface = body.surface ?? "partner";
    const { data, error } = await supabase.rpc("record_growth_partner_forecast_action", {
      p_surface: surface,
      p_action: body.action,
      p_payload: body.payload ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const refresh = await supabase.rpc("get_growth_partner_forecast_center", { p_surface: surface });
    if (!refresh.error) {
      return NextResponse.json({
        action: data,
        center: parseGrowthPartnerForecastCenter(refresh.data),
      });
    }

    return NextResponse.json({ action: data });
  } catch {
    return NextResponse.json({ error: "Forecast action failed" }, { status: 500 });
  }
}
