import { NextResponse } from "next/server";
import { getAipifyHostsReportsDashboard } from "@/lib/core/aipify-hosts-reports";
import { parseAipifyHostsReportsDashboard } from "@/lib/aipify/aipify-hosts-reports/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") ?? "last_30_days";

    const data = await getAipifyHostsReportsDashboard(supabase, filter);
    const parsed = parseAipifyHostsReportsDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load reports dashboard" }, { status: 500 });
  }
}
