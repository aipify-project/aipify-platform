import { NextResponse } from "next/server";
import { getGrowthPartnerPortalDashboard } from "@/lib/core/growth-partner-portal";
import { parseGrowthPartnerPortalDashboard } from "@/lib/growth-partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getGrowthPartnerPortalDashboard(
      supabase,
      url.searchParams.get("section") ?? "dashboard",
    );
    const parsed = parseGrowthPartnerPortalDashboard(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load Growth Partner Portal" }, { status: 500 });
  }
}
