import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ id: string; action: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id, action } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "resolve") {
      const body = (await request.json().catch(() => ({}))) as { resolution_notes?: string };
      const { data, error } = await supabase.rpc("resolve_platform_incident", {
        p_incident_id: id,
        p_resolution_notes: body.resolution_notes ?? null,
        p_status: "resolved",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "investigate") {
      const { data, error } = await supabase.rpc("resolve_platform_incident", {
        p_incident_id: id,
        p_resolution_notes: null,
        p_status: "investigating",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "monitor") {
      const { data, error } = await supabase.rpc("resolve_platform_incident", {
        p_incident_id: id,
        p_resolution_notes: null,
        p_status: "monitoring",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 });
  }
}
