import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseOrchestrationEvents } from "@/lib/aipify/orchestration";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_orchestration_events", {
      p_module: searchParams.get("module"),
      p_event_type: searchParams.get("event_type"),
      p_severity: searchParams.get("severity"),
      p_status: searchParams.get("status"),
      p_limit: Number(searchParams.get("limit") ?? 50),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ events: parseOrchestrationEvents(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabase.rpc("emit_orchestration_event", { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to emit event" }, { status: 500 });
  }
}
