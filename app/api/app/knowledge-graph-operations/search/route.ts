import { NextResponse } from "next/server";
import { parseKnowledgeGraphSearchResults, searchKnowledgeGraphEntities } from "@/lib/knowledge-graph-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await searchKnowledgeGraphEntities(supabase, url.searchParams.get("q") ?? "", Number(url.searchParams.get("limit") ?? 30));
    return NextResponse.json({ found: data.found === true, results: parseKnowledgeGraphSearchResults(data) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
