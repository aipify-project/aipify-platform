import { NextResponse } from "next/server";
import { getAipifyHostsBookingCenterCard } from "@/lib/core/aipify-hosts-booking-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsBookingCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load booking card" }, { status: 500 });
  }
}
