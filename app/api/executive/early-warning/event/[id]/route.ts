import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type EventBody = {
  event_type?: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as EventBody;
    if (!body.event_type) return NextResponse.json({ error: "event_type required" }, { status: 400 });

    const { data, error } = await supabase.rpc("record_organizational_early_warning_event", {
      p_signal_id: id,
      p_event_type: body.event_type,
      p_description: body.description ?? "",
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data ?? { recorded: true });
  } catch {
    return NextResponse.json({ error: "Failed to record early warning event" }, { status: 500 });
  }
}
