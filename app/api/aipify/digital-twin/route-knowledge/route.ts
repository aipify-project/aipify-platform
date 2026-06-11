import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseKnowledgeRouteResult } from "@/lib/aipify/digital-twin";

export async function GET(req: NextRequest) {
  try {
    const topic = req.nextUrl.searchParams.get("topic");
    if (!topic) return NextResponse.json({ error: "topic required" }, { status: 400 });
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("route_digital_twin_knowledge", { p_topic_key: topic });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseKnowledgeRouteResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to route knowledge" }, { status: 500 });
  }
}
