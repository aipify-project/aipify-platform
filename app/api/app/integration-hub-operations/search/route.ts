import { NextResponse } from "next/server";
import { parseIntegrationHubSearchResults, searchIntegrationHubConnectors } from "@/lib/integration-hub-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const q = url.searchParams.get("q") ?? "";
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const data = await searchIntegrationHubConnectors(supabase, q, limit);
    const results = parseIntegrationHubSearchResults(data);
    return NextResponse.json({ ...data, results });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
