import { NextResponse } from "next/server";
import { parsePackCommandOverview } from "@/lib/app-portal/business-pack-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_command_center", {
      p_pack_key: searchParams.get("pack_key") || null,
      p_health_status: searchParams.get("health_status") || null,
      p_adoption_level: searchParams.get("adoption_level") || null,
      p_value_category: searchParams.get("value_category") || null,
      p_owner: searchParams.get("owner") || null,
      p_priority_level: searchParams.get("priority_level") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackCommandOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load command center" }, { status: 500 });
  }
}
