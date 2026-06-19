import { NextResponse } from "next/server";
import { parseActivitySearchResult, searchActivityOperations } from "@/lib/activity-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const query = url.searchParams.get("q") ?? "";
    const limit = Number(url.searchParams.get("limit") ?? 30);
    const data = await searchActivityOperations(supabase, query, limit);
    return NextResponse.json({ found: data.found === true, results: parseActivitySearchResult(data) });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
