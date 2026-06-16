import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type EventBody = {
  event_type?: string;
  description?: string;
  metadata?: Record<string, unknown>;
  action_id?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as EventBody;
    if (!body.event_type) return NextResponse.json({ error: "event_type required" }, { status: 400 });

    const { data, error } = await supabase.rpc("record_transformation_change_event", {
      p_event_type: body.event_type,
      p_description: body.description ?? "",
      p_metadata: body.metadata ?? {},
      p_action_id: body.action_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? { recorded: true });
  } catch {
    return NextResponse.json({ error: "Failed to record transformation event" }, { status: 500 });
  }
}
