import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type LearningBody = {
  expected_result?: string;
  actual_result?: string;
  timeline_accuracy?: string;
  business_impact?: string;
  lessons_learned?: string;
  improvements?: string;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as LearningBody;

    const { data, error } = await supabase.rpc("record_action_center_initiative_learning", {
      p_action_id: id,
      p_expected_result: body.expected_result ?? "",
      p_actual_result: body.actual_result ?? "",
      p_timeline_accuracy: body.timeline_accuracy ?? "",
      p_business_impact: body.business_impact ?? "",
      p_lessons_learned: body.lessons_learned ?? "",
      p_improvements: body.improvements ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.rpc("send_notification", {
      p_user_id: null,
      p_category: "informational",
      p_priority: "low",
      p_title: "Initiative learning captured",
      p_message: body.lessons_learned ?? null,
      p_action_url: "/app/action-center",
      p_recommended_action: "Review in Strategic Initiative Portfolio",
      p_delivery_channels: ["in_app", "dashboard"],
      p_metadata: { action_id: id, event_type: "initiative_learning" },
    });

    return NextResponse.json(data ?? { recorded: true });
  } catch {
    return NextResponse.json({ error: "Failed to record initiative learning" }, { status: 500 });
  }
}
