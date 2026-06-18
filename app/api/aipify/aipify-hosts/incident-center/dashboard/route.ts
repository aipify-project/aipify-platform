import { NextResponse } from "next/server";
import { getAipifyHostsIncidentCenterDashboard } from "@/lib/core/aipify-hosts-incident-center";
import { parseAipifyHostsIncidentCenterDashboard } from "@/lib/aipify/aipify-hosts-incident-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "active_incidents";
    const data = await getAipifyHostsIncidentCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsIncidentCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load incident center" }, { status: 500 });
  }
}
