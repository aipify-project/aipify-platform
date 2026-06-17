import { NextResponse } from "next/server";
import { parseGovernanceOverview } from "@/lib/app-portal/business-pack-governance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_governance", {
      p_governance_status: searchParams.get("governance_status") || null,
      p_department: searchParams.get("department") || null,
      p_primary_owner: searchParams.get("primary_owner") || null,
      p_backup_owner: searchParams.get("backup_owner") || null,
      p_review_frequency: searchParams.get("review_frequency") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseGovernanceOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load governance center" }, { status: 500 });
  }
}
