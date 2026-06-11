import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_employee_knowledge_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Employee knowledge request failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;

    const { error } = await supabase.rpc("update_eke_settings", {
      p_employee_assistant_enabled: body.employee_assistant_enabled ?? null,
      p_gap_detection_enabled: body.gap_detection_enabled ?? null,
      p_onboarding_enabled: body.onboarding_enabled ?? null,
      p_improvement_loop_enabled: body.improvement_loop_enabled ?? null,
      p_require_admin_approval: body.require_admin_approval ?? null,
      p_video_support_enabled: body.video_support_enabled ?? null,
      p_privacy_settings: body.privacy_settings ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const { data: center, error: centerError } = await supabase.rpc(
      "get_customer_employee_knowledge_center"
    );
    if (centerError) return NextResponse.json({ error: centerError.message }, { status: 400 });

    return NextResponse.json(center);
  } catch {
    return NextResponse.json({ error: "Employee knowledge update failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const action = body.action as string | undefined;

    if (action === "create_item") {
      const { data, error } = await supabase.rpc("create_employee_knowledge_item", {
        p_category: body.category,
        p_title: body.title,
        p_content: body.content,
        p_source_type: body.source_type ?? "manual",
        p_source_reference: body.source_reference ?? null,
        p_steps: body.steps ?? [],
        p_roles_visible: body.roles_visible ?? [],
        p_confidence_score: body.confidence_score ?? 70,
        p_approved: body.approved ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data });
    }

    if (action === "approve_item") {
      const { data, error } = await supabase.rpc("approve_employee_knowledge_item", {
        p_item_id: body.item_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "import_source") {
      const { data, error } = await supabase.rpc("import_employee_knowledge_source", {
        p_source_type: body.source_type,
        p_source_label: body.source_label,
        p_source_url: body.source_url ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json({ id: data });
    }

    if (action === "onboarding_progress") {
      const { data, error } = await supabase.rpc("record_onboarding_progress", {
        p_module: body.module,
        p_completed: body.completed ?? true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "feedback") {
      const { data, error } = await supabase.rpc("record_employee_knowledge_feedback", {
        p_question: body.question,
        p_helpful: body.helpful,
        p_note: body.note ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Employee knowledge action failed" }, { status: 500 });
  }
}
