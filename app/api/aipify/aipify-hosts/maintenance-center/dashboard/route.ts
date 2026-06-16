import { NextResponse } from "next/server";
import { getAipifyHostsMaintenanceCenterDashboard } from "@/lib/core/aipify-hosts-maintenance-center";
import { parseAipifyHostsMaintenanceCenterDashboard } from "@/lib/aipify/aipify-hosts-maintenance-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const section = url.searchParams.get("section") ?? "open_work_orders";
    const data = await getAipifyHostsMaintenanceCenterDashboard(supabase, section, {
      propertyId: url.searchParams.get("property_id"),
      status: url.searchParams.get("status"),
    });
    const parsed = parseAipifyHostsMaintenanceCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load maintenance center" }, { status: 500 });
  }
}
