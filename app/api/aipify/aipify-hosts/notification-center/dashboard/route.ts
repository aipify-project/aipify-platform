import { NextResponse } from "next/server";
import { getAipifyHostsNotificationCenterDashboard } from "@/lib/core/aipify-hosts-notification-center";
import { parseAipifyHostsNotificationCenterDashboard } from "@/lib/aipify/aipify-hosts-notification-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "all_notifications";
    const data = await getAipifyHostsNotificationCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsNotificationCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load notification center" }, { status: 500 });
  }
}
