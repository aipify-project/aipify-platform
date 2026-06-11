import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMemoryEngineCard } from "@/lib/aipify/memory";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_memory_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMemoryEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load memory card" }, { status: 500 });
  }
}
