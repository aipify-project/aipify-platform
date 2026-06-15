import { NextRequest, NextResponse } from "next/server";
import { parseKnowledgeEvolutionCenter } from "@/lib/platform-knowledge-evolution";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    health_status: searchParams.get("health_status") ?? undefined,
    workflow_status: searchParams.get("workflow_status") ?? undefined,
    source: searchParams.get("source") ?? undefined,
    locale: searchParams.get("locale") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filters = buildFilters(request.nextUrl.searchParams);
    const { data, error } = await supabase.rpc("get_knowledge_evolution_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseKnowledgeEvolutionCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load knowledge evolution center" }, { status: 500 });
  }
}
