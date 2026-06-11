import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseActionItems } from "@/lib/aipify/action-hub";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_action_items", {
      p_status: searchParams.get("status"),
      p_priority: searchParams.get("priority"),
      p_source_module: searchParams.get("source_module"),
      p_assigned_to_me: searchParams.get("assigned_to_me") === "true",
      p_limit: Number(searchParams.get("limit") ?? 50),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ items: parseActionItems(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load action queue" }, { status: 500 });
  }
}
