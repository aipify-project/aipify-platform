import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const query = String(body.query ?? "").trim();
    if (!query) return NextResponse.json({ error: "Query required" }, { status: 400 });

    const { data, error } = await supabase.rpc("retrieve_knowledge_answer", {
      p_query: query,
      p_language: body.language ?? "en",
      p_visibility_context: body.visibility_context ?? "authenticated",
      p_source_type: body.source_type ?? "admin_chat",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Retrieve answer failed" }, { status: 500 });
  }
}
