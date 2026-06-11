import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      incident_id?: string;
      root_cause_metadata?: Record<string, unknown>;
      communication_content?: Record<string, unknown>;
    };

    if (!body.incident_id) {
      return NextResponse.json({ error: "incident_id required" }, { status: 400 });
    }

    if (body.action === "close") {
      const { data, error } = await supabase.rpc("close_incident", {
        p_incident_id: body.incident_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("resolve_incident", {
      p_incident_id: body.incident_id,
      p_root_cause_metadata: body.root_cause_metadata ?? {},
      p_communication_content: body.communication_content ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to resolve incident" }, { status: 500 });
  }
}
