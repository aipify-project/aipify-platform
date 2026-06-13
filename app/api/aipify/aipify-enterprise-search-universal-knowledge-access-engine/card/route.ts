import { NextResponse } from "next/server";
import { parseAipifyEnterpriseSearchUniversalKnowledgeAccessEngineCard } from "@/lib/aipify/aipify-enterprise-search-universal-knowledge-access-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_enterprise_search_universal_knowledge_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyEnterpriseSearchUniversalKnowledgeAccessEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load card" }, { status: 500 });
  }
}
