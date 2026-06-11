import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("search_knowledge_articles", {
      p_query: body.query,
      p_language: body.language ?? "en",
      p_visibility_context: body.visibility_context ?? "authenticated",
      p_limit: body.limit ?? 10,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ results: data });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
