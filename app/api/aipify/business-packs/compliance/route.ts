import { NextResponse } from "next/server";
import { parseComplianceOverview } from "@/lib/app-portal/business-pack-compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_compliance", {
      p_compliance_status: searchParams.get("compliance_status") || null,
      p_pack_key: searchParams.get("pack_key") || null,
      p_policy_category: searchParams.get("policy_category") || null,
      p_reviewer: searchParams.get("reviewer") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_priority_level: searchParams.get("priority_level") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseComplianceOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load compliance center" }, { status: 500 });
  }
}
