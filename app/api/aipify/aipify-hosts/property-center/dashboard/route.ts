import { NextResponse } from "next/server";
import { getAipifyHostsPropertyCenterDashboard } from "@/lib/core/aipify-hosts-property-center";
import { parseAipifyHostsPropertyCenterDashboard } from "@/lib/aipify/aipify-hosts-property-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("property_id");
    const section = searchParams.get("section") ?? "overview";

    const data = await getAipifyHostsPropertyCenterDashboard(supabase, propertyId, section);
    const parsed = parseAipifyHostsPropertyCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load property center" }, { status: 500 });
  }
}
