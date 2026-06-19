import { NextResponse } from "next/server";
import { getCompanionKnowledgeGraphContext } from "@/lib/knowledge-graph-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    return NextResponse.json(
      await getCompanionKnowledgeGraphContext(
        supabase,
        url.searchParams.get("q") ?? undefined,
        url.searchParams.get("entity_id") ?? undefined,
      ),
    );
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load context" }, { status: 500 });
  }
}
