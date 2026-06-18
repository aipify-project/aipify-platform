import { NextResponse } from "next/server";
import { getAipifyHostsKnowledgeArticle } from "@/lib/core/aipify-hosts-knowledge";
import { parseAipifyHostsKnowledgeArticle } from "@/lib/aipify/aipify-hosts-knowledge/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    const data = await getAipifyHostsKnowledgeArticle(supabase, slug);
    return NextResponse.json(parseAipifyHostsKnowledgeArticle(data));
  } catch {
    return NextResponse.json({ error: "Failed to load article" }, { status: 500 });
  }
}
