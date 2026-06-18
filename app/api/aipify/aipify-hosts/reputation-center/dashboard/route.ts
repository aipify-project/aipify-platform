import { NextResponse } from "next/server";
import { getAipifyHostsReputationCenterDashboard } from "@/lib/core/aipify-hosts-reputation-center";
import { parseAipifyHostsReputationCenterDashboard } from "@/lib/aipify/aipify-hosts-reputation-center/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getAipifyHostsReputationCenterDashboard(
      supabase,
      url.searchParams.get("section") ?? "review_overview",
      {
        propertyId: url.searchParams.get("property_id"),
        category: url.searchParams.get("category"),
        status: url.searchParams.get("status"),
        dateFrom: url.searchParams.get("date_from"),
        dateTo: url.searchParams.get("date_to"),
      },
    );
    const parsed = parseAipifyHostsReputationCenterDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load reputation center" }, { status: 500 });
  }
}
