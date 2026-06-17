import { NextResponse } from "next/server";
import { getPartnerAdvisor } from "@/lib/core/partner-advisor";
import { parsePartnerAdvisorOverview } from "@/lib/partner-advisor";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerAdvisor(supabase, {
      advisor_type: url.searchParams.get("advisor_type") ?? undefined,
      health_score: url.searchParams.get("health_score") ?? undefined,
      performance: url.searchParams.get("performance") ?? undefined,
      country: url.searchParams.get("country") ?? undefined,
      partner_tier: url.searchParams.get("partner_tier") ?? undefined,
      goal_status: url.searchParams.get("goal_status") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerAdvisorOverview(data);
    if (!parsed) {
      const raw = data as Record<string, unknown>;
      if (raw.has_access === false) {
        return NextResponse.json({ has_access: false, access_denied: Boolean(raw.access_denied) });
      }
      return NextResponse.json({ has_access: false, filtered_out: true });
    }
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load advisor center" }, { status: 500 });
  }
}
