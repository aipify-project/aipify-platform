import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action } = await params;
    const body = action === "escalate" ? ((await request.json()) as { reason?: string }) : {};

    if (action === "escalate") {
      const { data, error } = await supabase.rpc("escalate_self_support_conversation", {
        p_conversation_id: id,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }
    if (action === "close") {
      const { data, error } = await supabase.rpc("close_self_support_conversation", {
        p_conversation_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }
    if (action === "search") {
      const searchBody = (await request.json()) as { query?: string };
      if (!searchBody.query) return NextResponse.json({ error: "query required" }, { status: 400 });
      const { data, error } = await supabase.rpc("search_self_support_knowledge", {
        p_query: searchBody.query,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process self-support action" }, { status: 500 });
  }
}
