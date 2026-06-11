import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEvolutionBoard } from "@/lib/aipify/global-learning";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_evolution_board");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEvolutionBoard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load evolution board" }, { status: 500 });
  }
}
