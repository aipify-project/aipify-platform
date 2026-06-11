import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePilotEvents } from "@/lib/aipify/pilot";

export async function GET(
  request: Request,
  context: { params: Promise<{ tenantId: string }> }
) {
  try {
    const { tenantId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? "50");
    const { data, error } = await supabase.rpc("get_tenant_pilot_events", {
      p_tenant_id: tenantId,
      p_limit: limit,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePilotEvents(data));
  } catch {
    return NextResponse.json({ error: "Failed to load pilot events" }, { status: 500 });
  }
}
