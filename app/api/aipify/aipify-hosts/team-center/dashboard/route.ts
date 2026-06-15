import { NextResponse } from "next/server";
import { getAipifyHostsTeamCenterDashboard } from "@/lib/core/aipify-hosts-team-center";
import { parseAipifyHostsTeamCenterDashboard } from "@/lib/aipify/aipify-hosts-team-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "team_members";

    const data = await getAipifyHostsTeamCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsTeamCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load team center" }, { status: 500 });
  }
}
