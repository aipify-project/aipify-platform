import { NextResponse } from "next/server";
import { getAipifyHostsPropertyHealthDashboard } from "@/lib/core/aipify-hosts-property-health";
import { parseAipifyHostsPropertyHealthDashboard } from "@/lib/aipify/aipify-hosts-property-health/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const section = url.searchParams.get("section") ?? "portfolio_overview";
    const propertyId = url.searchParams.get("property_id");
    const data = await getAipifyHostsPropertyHealthDashboard(supabase, section, propertyId);
    const parsed = parseAipifyHostsPropertyHealthDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load property health" }, { status: 500 });
  }
}
