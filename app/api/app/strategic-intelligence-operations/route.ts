import { NextResponse } from "next/server";
import { getStrategicIntelligenceCenter, parseStrategicIntelligenceCenter } from "@/lib/strategic-intelligence-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getStrategicIntelligenceCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseStrategicIntelligenceCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load strategic intelligence" }, { status: 500 });
  }
}
