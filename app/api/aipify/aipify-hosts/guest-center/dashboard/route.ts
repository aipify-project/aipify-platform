import { NextResponse } from "next/server";
import { getAipifyHostsGuestCenterDashboard } from "@/lib/core/aipify-hosts-guest-center";
import { parseAipifyHostsGuestCenterDashboard } from "@/lib/aipify/aipify-hosts-guest-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "active_guests";
    const filter = searchParams.get("filter") ?? "active_guests";
    const guestId = searchParams.get("guest_id");

    const data = await getAipifyHostsGuestCenterDashboard(supabase, section, filter, guestId);
    const parsed = parseAipifyHostsGuestCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load guest center" }, { status: 500 });
  }
}
