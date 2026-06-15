import { NextResponse } from "next/server";
import { getAipifyHostsCheckinCenterDashboard } from "@/lib/core/aipify-hosts-checkin-center";
import { parseAipifyHostsCheckinCenterDashboard } from "@/lib/aipify/aipify-hosts-checkin-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "upcoming_check_ins";
    const data = await getAipifyHostsCheckinCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsCheckinCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load check-in center" }, { status: 500 });
  }
}
