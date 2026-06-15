import { NextRequest, NextResponse } from "next/server";
import { parseComplianceGovernanceCenter } from "@/lib/compliance-governance-center";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    category: searchParams.get("category") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    risk_level: searchParams.get("risk_level") ?? undefined,
    owner: searchParams.get("owner") ?? undefined,
    review_from: searchParams.get("review_from") ?? undefined,
    review_to: searchParams.get("review_to") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filters = buildFilters(request.nextUrl.searchParams);
    const { data, error } = await supabase.rpc("get_compliance_governance_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseComplianceGovernanceCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load compliance center" }, { status: 500 });
  }
}
