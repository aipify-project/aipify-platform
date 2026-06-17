import { NextResponse } from "next/server";
import { parseForecastDetail } from "@/lib/app-portal/organizational-forecasting";
import { createClient } from "@/lib/supabase/server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_org_forecast", {
      p_forecast_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseForecastDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load forecast" }, { status: 500 });
  }
}
