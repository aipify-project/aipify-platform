import { NextResponse } from "next/server";
import { searchAipifyHostsKnowledge } from "@/lib/core/aipify-hosts-knowledge";
import { parseAipifyHostsKnowledgeSearch } from "@/lib/aipify/aipify-hosts-knowledge/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const data = await searchAipifyHostsKnowledge(supabase, query);
    return NextResponse.json(parseAipifyHostsKnowledgeSearch(data));
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
