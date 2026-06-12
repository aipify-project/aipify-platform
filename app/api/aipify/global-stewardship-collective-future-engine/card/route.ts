import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseGlobalStewardshipCard } from "@/lib/aipify/global-stewardship-collective-future-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_global_stewardship_collective_future_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGlobalStewardshipCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load global stewardship card" }, { status: 500 });
  }
}
