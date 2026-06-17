import { NextResponse } from "next/server";
import { parseEcosystemTimeline } from "@/lib/app-portal/business-pack-ecosystem-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_business_pack_ecosystem_timeline", {
      p_pack_key: searchParams.get("pack_key") || null,
      p_period_from: searchParams.get("period_from") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ events: parseEcosystemTimeline(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}
