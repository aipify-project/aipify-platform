import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string; action: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action } = await context.params;
    const body = (await request.json().catch(() => ({}))) as {
      message?: string;
      resolution_message?: string;
    };

    if (action === "update") {
      const { data, error } = await supabase.rpc("update_status_incident", {
        p_event_id: id,
        p_message: body.message ?? "Status update",
        p_update_type: "update",
        p_public_visibility: true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "resolve") {
      const { data, error } = await supabase.rpc("resolve_status_incident", {
        p_event_id: id,
        p_resolution_message: body.resolution_message ?? body.message ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process incident action" }, { status: 500 });
  }
}
