import { NextResponse } from "next/server";
import { getAipifyHostsCalendarCenterDashboard } from "@/lib/core/aipify-hosts-calendar-center";
import { parseAipifyHostsCalendarCenterDashboard } from "@/lib/aipify/aipify-hosts-calendar-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getAipifyHostsCalendarCenterDashboard(supabase, {
      section: url.searchParams.get("section") ?? "master_calendar",
      view: url.searchParams.get("view") ?? "month",
      propertyId: url.searchParams.get("property_id"),
      teamMember: url.searchParams.get("team_member"),
      eventType: url.searchParams.get("event_type"),
      dateFrom: url.searchParams.get("date_from"),
      dateTo: url.searchParams.get("date_to"),
    });
    const parsed = parseAipifyHostsCalendarCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load calendar center" }, { status: 500 });
  }
}
