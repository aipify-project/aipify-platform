import { NextResponse } from "next/server";
import { getAipifyHostsVendorCenterDashboard } from "@/lib/core/aipify-hosts-vendor-center";
import { parseAipifyHostsVendorCenterDashboard } from "@/lib/aipify/aipify-hosts-vendor-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "vendors";
    const data = await getAipifyHostsVendorCenterDashboard(supabase, section);
    const parsed = parseAipifyHostsVendorCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load vendor center" }, { status: 500 });
  }
}
