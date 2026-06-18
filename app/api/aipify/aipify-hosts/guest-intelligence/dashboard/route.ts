import { NextResponse } from "next/server";
import { getAipifyHostsGuestIntelligenceDashboard } from "@/lib/core/aipify-hosts-guest-intelligence";
import { parseAipifyHostsGuestIntelligenceDashboard } from "@/lib/aipify/aipify-hosts-guest-intelligence/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsGuestIntelligenceDashboard(supabase);
    const parsed = parseAipifyHostsGuestIntelligenceDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load guest intelligence dashboard" }, { status: 500 });
  }
}
