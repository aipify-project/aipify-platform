import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseProactiveOrganizationDashboard } from "@/lib/aipify/proactive-organization-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_proactive_organization_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProactiveOrganizationDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load proactive organization dashboard" }, { status: 500 });
  }
}
