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
      action?: "record_moment" | "advance_stage" | "event";
      title?: string;
      summary?: string;
      outcome_type?: string;
      time_saved_minutes?: number;
      adoption_stage?: string;
      event_type?: string;
    };

    if (body.action === "record_moment") {
      const { data, error } = await supabase.rpc("record_trust_value_moment", {
        p_payload: {
          title: body.title,
          summary: body.summary,
          outcome_type: body.outcome_type ?? "time_saved",
          time_saved_minutes: body.time_saved_minutes ?? 0,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "advance_stage") {
      const { data, error } = await supabase.rpc("update_trust_adoption_stage", {
        p_payload: { adoption_stage: body.adoption_stage },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_trust_adoption_event", {
      p_payload: { event_type: body.event_type ?? "adoption_reviewed" },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process trust adoption action" }, { status: 500 });
  }
}
