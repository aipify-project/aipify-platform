import { NextResponse } from "next/server";
import { getPartnerAdvisorGoals } from "@/lib/core/partner-advisor";
import { parsePartnerAdvisorGoals } from "@/lib/partner-advisor";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerAdvisorGoals(supabase, {
      goal_type: url.searchParams.get("goal_type") ?? undefined,
      goal_status: url.searchParams.get("goal_status") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerAdvisorGoals(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load goals" }, { status: 500 });
  }
}
