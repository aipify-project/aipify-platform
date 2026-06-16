import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type ActionBody = {
  title?: string;
  root_causes?: string;
  recommended_actions?: string;
  success_criteria?: string;
  expected_outcomes?: string;
  lessons_applied_elsewhere?: string;
  notes?: string;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ActionBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_learning_action", {
      p_record_id: id,
      p_title: body.title,
      p_root_causes: body.root_causes ?? "",
      p_recommended_actions: body.recommended_actions ?? "",
      p_success_criteria: body.success_criteria ?? "",
      p_expected_outcomes: body.expected_outcomes ?? "",
      p_lessons_applied_elsewhere: body.lessons_applied_elsewhere ?? "",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record improvement action" }, { status: 500 });
  }
}
