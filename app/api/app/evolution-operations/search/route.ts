import { NextResponse } from "next/server";
import { parseEvolutionSearchResults, searchEvolutionRecommendations } from "@/lib/evolution-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    const data = await searchEvolutionRecommendations(supabase, q);
    return NextResponse.json({ ...data, results: parseEvolutionSearchResults(data) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
