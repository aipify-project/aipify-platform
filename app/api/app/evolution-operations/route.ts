import { NextResponse } from "next/server";
import { getEvolutionOperationsCenter, parseEvolutionOperationsCenter } from "@/lib/evolution-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getEvolutionOperationsCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseEvolutionOperationsCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load evolution center" }, { status: 500 });
  }
}
