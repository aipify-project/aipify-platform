import { NextResponse } from "next/server";
import { getAipifyHostsUpgradeSignalsDashboard } from "@/lib/core/aipify-hosts-upgrade-signals";
import { parseAipifyHostsUpgradeSignalsDashboard } from "@/lib/aipify/aipify-hosts-upgrade-signals";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const surface = new URL(request.url).searchParams.get("surface") ?? "upgrade_signals";
    const data = await getAipifyHostsUpgradeSignalsDashboard(supabase, surface);
    const parsed = parseAipifyHostsUpgradeSignalsDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load upgrade signals" }, { status: 500 });
  }
}
