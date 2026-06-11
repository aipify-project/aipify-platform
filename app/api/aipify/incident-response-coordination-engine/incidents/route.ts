import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      incident_title?: string;
      incident_type?: string;
      severity?: string;
      owner_user_id?: string;
      detected_at?: string;
      root_cause_metadata?: Record<string, unknown>;
      incident_id?: string;
      status?: string;
      communication_type?: string;
      content_metadata?: Record<string, unknown>;
      summary?: string;
      recommendations?: unknown[];
      capture_memory?: boolean;
    };

    if (body.action === "assign_owner") {
      if (!body.incident_id || !body.owner_user_id) {
        return NextResponse.json({ error: "incident_id and owner_user_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("assign_incident_owner", {
        p_incident_id: body.incident_id,
        p_owner_user_id: body.owner_user_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_severity") {
      if (!body.incident_id || !body.severity) {
        return NextResponse.json({ error: "incident_id and severity required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_incident_severity", {
        p_incident_id: body.incident_id,
        p_severity: body.severity,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_status") {
      if (!body.incident_id || !body.status) {
        return NextResponse.json({ error: "incident_id and status required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_incident_status", {
        p_incident_id: body.incident_id,
        p_status: body.status,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "record_communication") {
      if (!body.incident_id || !body.communication_type) {
        return NextResponse.json({ error: "incident_id and communication_type required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_incident_communication", {
        p_incident_id: body.incident_id,
        p_communication_type: body.communication_type,
        p_content_metadata: body.content_metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "capture_lessons") {
      if (!body.incident_id || !body.summary) {
        return NextResponse.json({ error: "incident_id and summary required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("capture_incident_lessons_learned", {
        p_incident_id: body.incident_id,
        p_summary: body.summary,
        p_recommendations: body.recommendations ?? [],
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.incident_title || !body.incident_type) {
      return NextResponse.json({ error: "incident_title and incident_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_incident", {
      p_incident_title: body.incident_title,
      p_incident_type: body.incident_type,
      p_severity: body.severity ?? "medium",
      p_owner_user_id: body.owner_user_id ?? null,
      p_detected_at: body.detected_at ?? null,
      p_root_cause_metadata: body.root_cause_metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process incident action" }, { status: 500 });
  }
}
