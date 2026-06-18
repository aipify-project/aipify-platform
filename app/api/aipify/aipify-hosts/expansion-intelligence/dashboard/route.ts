import { NextResponse } from "next/server";
import { getAipifyHostsExpansionIntelligenceDashboard } from "@/lib/core/aipify-hosts-expansion-intelligence";
import { parseAipifyHostsExpansionIntelligenceDashboard } from "@/lib/aipify/aipify-hosts-expansion-intelligence/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsExpansionIntelligenceDashboard(supabase);
    const parsed = parseAipifyHostsExpansionIntelligenceDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load expansion intelligence dashboard" }, { status: 500 });
  }
}
