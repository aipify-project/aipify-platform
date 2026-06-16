import { NextResponse } from "next/server";
import { getAipifyHostsUpgradeSignalsCard } from "@/lib/core/aipify-hosts-upgrade-signals";
import { parseAipifyHostsUpgradeSignalsCard } from "@/lib/aipify/aipify-hosts-upgrade-signals";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const surface = new URL(request.url).searchParams.get("surface") ?? "embed";
    const data = await getAipifyHostsUpgradeSignalsCard(supabase, surface);
    const parsed = parseAipifyHostsUpgradeSignalsCard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load upgrade signals card" }, { status: 500 });
  }
}
