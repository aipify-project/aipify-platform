import { NextRequest, NextResponse } from "next/server";
import { parsePlatformDecisionCenter } from "@/lib/platform-decision-center";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    category: searchParams.get("category") ?? undefined,
    impact_level: searchParams.get("impact_level") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    owner: searchParams.get("owner") ?? undefined,
    confidence_min: searchParams.get("confidence_min") ?? undefined,
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
    const { data, error } = await supabase.rpc("get_platform_decision_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePlatformDecisionCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load decision center" }, { status: 500 });
  }
}
