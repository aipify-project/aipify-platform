import { NextResponse } from "next/server";
import { getAipifyHostsGuestIntelligenceCard } from "@/lib/core/aipify-hosts-guest-intelligence";
import { parseAipifyHostsGuestIntelligenceCard } from "@/lib/aipify/aipify-hosts-guest-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsGuestIntelligenceCard(supabase);
    return NextResponse.json(parseAipifyHostsGuestIntelligenceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load guest intelligence card" }, { status: 500 });
  }
}
