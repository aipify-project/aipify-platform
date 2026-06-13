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
      action?:
        | "update_status"
        | "archive"
        | "mark_decided"
        | "dismiss_insight"
        | "add_stakeholder_input";
      decision_key?: string;
      insight_key?: string;
      status?: string;
      outcome_summary?: string;
      contributor_label?: string;
      input_type?: string;
      content?: string;
      rating?: number;
    };

    const { data, error } = await supabase.rpc("process_executive_decision_action", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process decision action" }, { status: 500 });
  }
}
