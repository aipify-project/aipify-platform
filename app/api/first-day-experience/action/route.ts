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
      action?: "advance" | "complete_task" | "personalize";
      step?: number;
      task_type?: string;
      communication_style?: string;
      briefing_frequency?: string;
      approval_sensitivity?: string;
      companion_naming?: string;
    };

    if (body.action === "complete_task") {
      const { data, error } = await supabase.rpc("complete_first_day_task", {
        p_payload: { task_type: body.task_type ?? "draft_email" },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "personalize") {
      const { data, error } = await supabase.rpc("update_first_day_personalization", {
        p_payload: {
          communication_style: body.communication_style,
          briefing_frequency: body.briefing_frequency,
          approval_sensitivity: body.approval_sensitivity,
          companion_naming: body.companion_naming,
        },
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.step || body.step < 1 || body.step > 8) {
      return NextResponse.json({ error: "step must be 1-8" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("advance_first_day_step", {
      p_step: body.step,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process first day action" }, { status: 500 });
  }
}
