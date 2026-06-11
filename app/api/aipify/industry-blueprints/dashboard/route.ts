import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBlueprintDashboard } from "@/lib/aipify/industry-blueprints";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_industry_blueprints_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBlueprintDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load industry blueprints dashboard" }, { status: 500 });
  }
}
