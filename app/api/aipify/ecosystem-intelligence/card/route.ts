import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEcosystemIntelligenceCard } from "@/lib/aipify/ecosystem-intelligence";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_ecosystem_intelligence_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEcosystemIntelligenceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load ecosystem card" }, { status: 500 });
  }
}
