import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIncidentDetail } from "@/lib/aipify/continuity/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_continuity_incident", { p_incident_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const detail = parseIncidentDetail(data);
    if (!detail) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(detail);
  } catch {
    return NextResponse.json({ error: "Failed to load incident" }, { status: 500 });
  }
}
