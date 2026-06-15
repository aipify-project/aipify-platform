import { NextResponse } from "next/server";
import { parseWorkspaceProductivityHub } from "@/lib/workspace-productivity-hub";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string; payload?: Record<string, unknown> };
    if (!body.action) return NextResponse.json({ error: "action required" }, { status: 400 });

    const { data, error } = await supabase.rpc("record_workspace_productivity_action", {
      p_action: body.action,
      p_payload: body.payload ?? {},
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    if (body.action.startsWith("create_") || body.action.startsWith("update_") || body.action.startsWith("complete_") || body.action.startsWith("delegate_") || body.action.startsWith("dismiss_")) {
      const refresh = await supabase.rpc("get_workspace_productivity_hub", {
        p_search: null,
        p_status: null,
        p_priority: null,
        p_category: null,
        p_due_from: null,
        p_due_to: null,
      });
      if (!refresh.error) {
        return NextResponse.json({
          action: data,
          hub: parseWorkspaceProductivityHub(refresh.data),
        });
      }
    }

    return NextResponse.json({ action: data });
  } catch {
    return NextResponse.json({ error: "Workspace action failed" }, { status: 500 });
  }
}
