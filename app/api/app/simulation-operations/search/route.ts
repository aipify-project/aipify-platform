import { NextResponse } from "next/server";
import { parseSimulationSearchResults, searchSimulationScenarios } from "@/lib/simulation-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await searchSimulationScenarios(supabase, url.searchParams.get("q") ?? "", Number(url.searchParams.get("limit") ?? 20));
    return NextResponse.json({ ...data, results: parseSimulationSearchResults(data) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
