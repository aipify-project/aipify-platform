import { NextResponse } from "next/server";
import { isDeveloperKnowledgeQuestion } from "@/lib/aipify/knowledge";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const query = String(body.query ?? "").trim();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    const useDeveloper = Boolean(body.developer) || isDeveloperKnowledgeQuestion(query);
    const rpc = useDeveloper ? "retrieve_developer_knowledge_answer" : "retrieve_knowledge_answer";

    const { data, error } = await supabase.rpc(rpc, {
      p_query: query,
      p_language: body.language ?? "en",
      p_visibility_context: body.visibility_context ?? "authenticated",
      p_source_type: body.source_type ?? (useDeveloper ? "developer_assistant" : "admin_chat"),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Retrieve answer failed" }, { status: 500 });
  }
}
