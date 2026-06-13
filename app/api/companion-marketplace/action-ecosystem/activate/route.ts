import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "activate" | "deactivate" | "event";
      capability_key?: string;
      event_type?: string;
      summary?: string;
    };

    if (body.action === "deactivate") {
      if (!body.capability_key) {
        return NextResponse.json({ error: "capability_key required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("deactivate_marketplace_capability", {
        p_capability_key: body.capability_key,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "event") {
      const { data, error } = await supabase.rpc("record_marketplace_action_event", {
        p_payload: {
          event_type: body.event_type ?? "approval_event",
          capability_key: body.capability_key,
          summary: body.summary,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.capability_key) {
      return NextResponse.json({ error: "capability_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("activate_marketplace_capability", {
      p_capability_key: body.capability_key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process marketplace action" }, { status: 500 });
  }
}
