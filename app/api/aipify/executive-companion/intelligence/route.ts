import { NextResponse } from "next/server";
import { parseExecutiveCompanionIntelligence } from "@/lib/aipify/companion-executive-layer";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_executive_layer_intelligence");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutiveCompanionIntelligence(data));
  } catch {
    return NextResponse.json({ error: "Failed to load intelligence" }, { status: 500 });
  }
}
