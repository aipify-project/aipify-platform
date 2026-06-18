import { NextResponse } from "next/server";
import { getAipifyHostsExpansionIntelligenceCard } from "@/lib/core/aipify-hosts-expansion-intelligence";
import { parseAipifyHostsExpansionIntelligenceCard } from "@/lib/aipify/aipify-hosts-expansion-intelligence/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsExpansionIntelligenceCard(supabase);
    return NextResponse.json(parseAipifyHostsExpansionIntelligenceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load expansion intelligence card" }, { status: 500 });
  }
}
