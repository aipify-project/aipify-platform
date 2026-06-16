import { NextResponse } from "next/server";
import { parseAppPortalDashboard } from "@/lib/app-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_app_portal_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseAppPortalDashboard(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load APP dashboard" }, { status: 500 });
  }
}
