import { NextResponse } from "next/server";
import {
  buildSupportAssistantCorpus,
  buildSupportAssistantLabels,
  getSupportAssistantArticleById,
  searchSupportAssistantCorpus,
} from "@/lib/app-portal/support-assistant";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const articleId = searchParams.get("article_id");

    const locale = await getLocale();
    const dict = await getCustomerAppDictionaryForSplits(locale, ["navigation"]);
    const t = createTranslator(dict);
    const labels = buildSupportAssistantLabels(t);
    const corpus = buildSupportAssistantCorpus(labels, t);

    if (articleId) {
      const article = getSupportAssistantArticleById(articleId, corpus);
      if (!article) return NextResponse.json({ found: false, query: "", articles: [] });
      return NextResponse.json({ found: true, query: articleId, articles: [article] });
    }

    const articles = searchSupportAssistantCorpus(query, corpus);
    return NextResponse.json({
      found: true,
      query,
      articles,
      principle: labels.principle,
    });
  } catch {
    return NextResponse.json({ error: "Failed to search knowledge" }, { status: 500 });
  }
}
