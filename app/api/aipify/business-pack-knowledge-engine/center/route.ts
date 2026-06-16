import { NextResponse } from "next/server";
import { getBusinessPackKnowledgeCenter } from "@/lib/core/business-pack-knowledge-engine";
import { parseBusinessPackKnowledgeCenter } from "@/lib/aipify/business-pack-knowledge-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const packKey = url.searchParams.get("packKey");
    if (!packKey) return NextResponse.json({ error: "packKey required" }, { status: 400 });

    const data = await getBusinessPackKnowledgeCenter(supabase, {
      packKey,
      locale: url.searchParams.get("locale") ?? "en",
      search: url.searchParams.get("search"),
      category: url.searchParams.get("category"),
      contextSurface: url.searchParams.get("context"),
    });
    const parsed = parseBusinessPackKnowledgeCenter(data);
    if (!parsed) return NextResponse.json({ found: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load knowledge center" }, { status: 500 });
  }
}
