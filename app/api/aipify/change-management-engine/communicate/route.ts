import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      initiative_id?: string;
      communication_type?: string;
      subject?: string;
      message_summary?: string;
      audience?: Record<string, unknown>;
      scheduled_at?: string;
      plan_id?: string;
    };

    if (body.action === "release") {
      if (!body.plan_id) return NextResponse.json({ error: "plan_id required" }, { status: 400 });
      const { data, error } = await supabase.rpc("release_change_communication", {
        p_plan_id: body.plan_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.initiative_id || !body.communication_type || !body.subject) {
      return NextResponse.json(
        { error: "initiative_id, communication_type, and subject required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("create_change_communication_plan", {
      p_initiative_id: body.initiative_id,
      p_communication_type: body.communication_type,
      p_subject: body.subject,
      p_message_summary: body.message_summary ?? null,
      p_audience: body.audience ?? {},
      p_scheduled_at: body.scheduled_at ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process communication" }, { status: 500 });
  }
}
