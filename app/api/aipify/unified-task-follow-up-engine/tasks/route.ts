import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      task_id?: string;
      title?: string;
      description?: string;
      priority?: string;
      due_date?: string;
      assigned_user_id?: string;
      status?: string;
      source_type?: string;
      source_id?: string;
      metadata?: Record<string, unknown>;
      capture_memory?: boolean;
      remind_at?: string;
      channel?: string;
      reason?: string;
      escalation_level?: string;
      provider?: string;
    };

    if (body.action === "assign") {
      if (!body.task_id || !body.assigned_user_id) {
        return NextResponse.json({ error: "task_id and assigned_user_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("assign_organization_task", {
        p_task_id: body.task_id,
        p_assigned_user_id: body.assigned_user_id,
        p_due_date: body.due_date ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_status") {
      if (!body.task_id || !body.status) {
        return NextResponse.json({ error: "task_id and status required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_organization_task_status", {
        p_task_id: body.task_id,
        p_status: body.status,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "complete") {
      if (!body.task_id) {
        return NextResponse.json({ error: "task_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("complete_organization_task", {
        p_task_id: body.task_id,
        p_capture_memory: body.capture_memory ?? false,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_from_source") {
      if (!body.source_type) {
        return NextResponse.json({ error: "source_type required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("create_task_from_source", {
        p_source_type: body.source_type,
        p_source_id: body.source_id ?? null,
        p_title: body.title ?? null,
        p_description: body.description ?? null,
        p_priority: body.priority ?? "medium",
        p_due_date: body.due_date ?? null,
        p_assigned_user_id: body.assigned_user_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "schedule_reminder") {
      if (!body.task_id) {
        return NextResponse.json({ error: "task_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("schedule_task_reminder", {
        p_task_id: body.task_id,
        p_remind_at: body.remind_at ?? null,
        p_channel: body.channel ?? "in_app",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "escalate") {
      if (!body.task_id) {
        return NextResponse.json({ error: "task_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("escalate_organization_task", {
        p_task_id: body.task_id,
        p_reason: body.reason ?? null,
        p_escalation_level: body.escalation_level ?? "recommended",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "sync_calendar") {
      if (!body.task_id) {
        return NextResponse.json({ error: "task_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("sync_task_calendar_hook", {
        p_task_id: body.task_id,
        p_provider: body.provider ?? "aipify_internal",
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.title) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_organization_task", {
      p_title: body.title,
      p_description: body.description ?? null,
      p_priority: body.priority ?? "medium",
      p_due_date: body.due_date ?? null,
      p_assigned_user_id: body.assigned_user_id ?? null,
      p_source_type: body.source_type ?? "manual",
      p_source_id: body.source_id ?? null,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process task action" }, { status: 500 });
  }
}
