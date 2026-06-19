import { NextResponse } from "next/server";
import { performUniversalSearchQuery, parseUniversalSearchQueryResult } from "@/lib/universal-search-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await performUniversalSearchQuery(
      supabase,
      url.searchParams.get("q") ?? "",
      {},
      url.searchParams.get("mode") ?? "global",
      Number(url.searchParams.get("limit") ?? 40),
    );
    return NextResponse.json(parseUniversalSearchQueryResult(data));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
