import { NextResponse } from "next/server";
import { parseEcosystemOverview } from "@/lib/app-portal/business-pack-ecosystem-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_ecosystem_intelligence", {
      p_pack_key: searchParams.get("pack_key") || null,
      p_coverage_category: searchParams.get("coverage_category") || null,
      p_ecosystem_status: searchParams.get("ecosystem_status") || null,
      p_relationship_strength: searchParams.get("relationship_strength") || null,
      p_priority_level: searchParams.get("priority_level") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEcosystemOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load ecosystem intelligence" }, { status: 500 });
  }
}
