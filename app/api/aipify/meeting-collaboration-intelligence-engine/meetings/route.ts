import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      meeting_id?: string;
      meeting_title?: string;
      meeting_type?: string;
      scheduled_at?: string;
      status?: string;
      summary_metadata?: Record<string, unknown>;
      decision_text?: string;
      metadata?: Record<string, unknown>;
      capture_memory?: boolean;
      report_type?: string;
      format?: string;
      regenerate?: boolean;
      action_items?: unknown[];
    };

    if (body.action === "update_status") {
      if (!body.meeting_id || !body.status) {
        return NextResponse.json({ error: "meeting_id and status required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_meeting_status", {
        p_meeting_id: body.meeting_id,
        p_status: body.status,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "cancel") {
      if (!body.meeting_id) {
        return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("cancel_meeting", { p_meeting_id: body.meeting_id });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "generate_agenda") {
      if (!body.meeting_id) {
        return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("generate_meeting_agenda", {
        p_meeting_id: body.meeting_id,
        p_regenerate: body.regenerate ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "capture_summary") {
      if (!body.meeting_id) {
        return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("capture_meeting_summary", {
        p_meeting_id: body.meeting_id,
        p_summary_metadata: body.summary_metadata ?? {},
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "extract_actions") {
      if (!body.meeting_id) {
        return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("extract_action_items", {
        p_meeting_id: body.meeting_id,
        p_action_items: body.action_items ?? [],
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "capture_decision") {
      if (!body.meeting_id || !body.decision_text) {
        return NextResponse.json({ error: "meeting_id and decision_text required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("capture_meeting_decision", {
        p_meeting_id: body.meeting_id,
        p_decision_text: body.decision_text,
        p_metadata: body.metadata ?? {},
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "generate_outputs") {
      if (!body.meeting_id) {
        return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("generate_meeting_outputs", {
        p_meeting_id: body.meeting_id,
        p_report_type: body.report_type ?? "executive",
        p_format: body.format ?? "pdf",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "workflow_hook") {
      if (!body.meeting_id) {
        return NextResponse.json({ error: "meeting_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("trigger_meeting_workflow_hook", {
        p_meeting_id: body.meeting_id,
        p_trigger_context: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.meeting_title) {
      return NextResponse.json({ error: "meeting_title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_collaboration_meeting", {
      p_meeting_title: body.meeting_title,
      p_meeting_type: body.meeting_type ?? "department",
      p_scheduled_at: body.scheduled_at ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process meeting action" }, { status: 500 });
  }
}
