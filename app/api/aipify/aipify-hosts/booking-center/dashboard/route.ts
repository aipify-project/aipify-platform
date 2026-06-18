import { NextResponse } from "next/server";
import { getAipifyHostsBookingCenterDashboard } from "@/lib/core/aipify-hosts-booking-center";
import { parseAipifyHostsBookingCenterDashboard } from "@/lib/aipify/aipify-hosts-booking-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getAipifyHostsBookingCenterDashboard(
      supabase,
      url.searchParams.get("section") ?? "upcoming_bookings",
      {
        propertyId: url.searchParams.get("property_id"),
        status: url.searchParams.get("status"),
        dateFrom: url.searchParams.get("date_from"),
        dateTo: url.searchParams.get("date_to"),
        guestName: url.searchParams.get("guest_name"),
      },
    );
    const parsed = parseAipifyHostsBookingCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load booking center" }, { status: 500 });
  }
}
