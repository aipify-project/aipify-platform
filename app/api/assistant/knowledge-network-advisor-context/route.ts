import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_knowledge_network_advisor_context", {
      p_query: url.searchParams.get("query"),
    });
    if (error) throw new Error(error.message);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load advisor context" },
      { status: 500 }
    );
  }
}
