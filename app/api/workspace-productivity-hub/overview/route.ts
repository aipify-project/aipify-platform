import { NextResponse } from "next/server";
import { parseWorkspaceProductivityHub } from "@/lib/workspace-productivity-hub";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const { data, error } = await supabase.rpc("get_workspace_productivity_hub", {
      p_search: url.searchParams.get("search"),
      p_status: url.searchParams.get("status"),
      p_priority: url.searchParams.get("priority"),
      p_category: url.searchParams.get("category"),
      p_due_from: url.searchParams.get("due_from"),
      p_due_to: url.searchParams.get("due_to"),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWorkspaceProductivityHub(data));
  } catch {
    return NextResponse.json({ error: "Failed to load workspace hub" }, { status: 500 });
  }
}
