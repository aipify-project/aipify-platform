import { NextResponse } from "next/server";
import { loadSeedKnowledgeArticles } from "@/lib/aipify/knowledge/import-seed";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const articles = loadSeedKnowledgeArticles();
    const payload = articles.map((article) => ({
      title: article.title,
      slug: article.slug,
      category: article.category,
      language: article.language,
      visibility: article.visibility,
      status: article.status,
      tags: article.tags,
      keywords: article.keywords,
      article_type: article.article_type,
      body: article.body,
      source_path: article.source_path,
    }));

    const { data, error } = await supabase.rpc("import_knowledge_seed_articles", {
      p_articles: payload,
      p_overwrite: Boolean(body.overwrite),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Import failed" }, { status: 500 });
  }
}
