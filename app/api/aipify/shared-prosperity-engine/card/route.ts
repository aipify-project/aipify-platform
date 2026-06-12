import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSharedProsperityCard } from "@/lib/aipify/shared-prosperity-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_shared_prosperity_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSharedProsperityCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Shared Prosperity card" }, { status: 500 });
  }
}
