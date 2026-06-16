import { NextResponse } from "next/server";
import { parseGrowthPortalDashboard } from "@/lib/growth-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_growth_portal_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseGrowthPortalDashboard(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load Partners dashboard" }, { status: 500 });
  }
}
