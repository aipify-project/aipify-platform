import { NextResponse } from "next/server";
import { parseCultureOverview } from "@/lib/app-portal/trust-culture";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_culture_overview", {
      p_dimension: searchParams.get("dimension") || null,
      p_from: searchParams.get("from") || null,
      p_to: searchParams.get("to") || null,
      p_department: searchParams.get("department") || null,
      p_trend: searchParams.get("trend") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCultureOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load culture overview" }, { status: 500 });
  }
}
