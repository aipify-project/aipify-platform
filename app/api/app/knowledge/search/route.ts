import { NextRequest, NextResponse } from "next/server";
import { parseGlobalSearchResult, searchGlobalKnowledgeDocuments } from "@/lib/document-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const q = request.nextUrl.searchParams.get("q") ?? "";
    const category = request.nextUrl.searchParams.get("category");
    const filters: Record<string, unknown> = {};
    if (category) filters.category = category;

    const data = await searchGlobalKnowledgeDocuments(supabase, q, filters);
    return NextResponse.json(parseGlobalSearchResult(data) ?? { found: false, query: q, documents: [], knowledge_articles: [], templates: [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
