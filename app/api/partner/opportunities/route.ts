import { NextResponse } from "next/server";
import { createPartnerOpportunity, getPartnerOpportunities } from "@/lib/core/partner-opportunities";
import { parsePartnerOpportunitiesOverview, parsePartnerOpportunityDetail } from "@/lib/partner-opportunities";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const valueMin = url.searchParams.get("value_min");
    const data = await getPartnerOpportunities(supabase, {
      stage: url.searchParams.get("stage") ?? undefined,
      country: url.searchParams.get("country") ?? undefined,
      industry: url.searchParams.get("industry") ?? undefined,
      value_min: valueMin ? Number(valueMin) : undefined,
      owner: url.searchParams.get("owner") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerOpportunitiesOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load opportunities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = (await request.json()) as Record<string, unknown>;
    const data = await createPartnerOpportunity(supabase, payload);
    const parsed = parsePartnerOpportunityDetail(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create opportunity";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
