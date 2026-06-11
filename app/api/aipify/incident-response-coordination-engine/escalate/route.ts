import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      incident_id?: string;
      escalation_metadata?: Record<string, unknown>;
      communication_content?: Record<string, unknown>;
    };

    if (!body.incident_id) {
      return NextResponse.json({ error: "incident_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("escalate_incident", {
      p_incident_id: body.incident_id,
      p_escalation_metadata: body.escalation_metadata ?? {},
      p_communication_content: body.communication_content ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to escalate incident" }, { status: 500 });
  }
}
