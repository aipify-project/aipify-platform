import { NextResponse } from "next/server";
import { getAipifyHostsAccessCenterDashboard } from "@/lib/core/aipify-hosts-access-center";
import { parseAipifyHostsAccessCenterDashboard } from "@/lib/aipify/aipify-hosts-access-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "access_overview";
    const filter = searchParams.get("filter") ?? "all_properties";
    const propertyId = searchParams.get("property_id");

    const data = await getAipifyHostsAccessCenterDashboard(supabase, section, filter, propertyId);
    const parsed = parseAipifyHostsAccessCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load access center" }, { status: 500 });
  }
}
