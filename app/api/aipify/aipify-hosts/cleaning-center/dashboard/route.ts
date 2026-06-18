import { NextResponse } from "next/server";
import { getAipifyHostsCleaningCenterDashboard } from "@/lib/core/aipify-hosts-cleaning-center";
import { parseAipifyHostsCleaningCenterDashboard } from "@/lib/aipify/aipify-hosts-cleaning-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const section = url.searchParams.get("section") ?? "todays_cleaning";
    const data = await getAipifyHostsCleaningCenterDashboard(supabase, section, {
      propertyId: url.searchParams.get("property_id"),
      status: url.searchParams.get("status"),
    });
    const parsed = parseAipifyHostsCleaningCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load cleaning center" }, { status: 500 });
  }
}
