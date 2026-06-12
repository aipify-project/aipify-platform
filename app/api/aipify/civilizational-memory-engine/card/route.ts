import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCivilizationalMemoryCard } from "@/lib/aipify/civilizational-memory-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_civilizational_memory_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCivilizationalMemoryCard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load Civilizational Memory card" },
      { status: 500 },
    );
  }
}
