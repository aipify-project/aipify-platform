import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const riskLevel = searchParams.get("risk_level");

    const { data, error } = await supabase.rpc("list_aipify_actions", {
      p_status: status,
      p_risk_level: riskLevel,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load actions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      title?: string;
      description?: string;
      payload_json?: Record<string, unknown>;
      preview_text?: string;
      risk_level?: string;
      execution_level?: string;
      created_by_module?: string;
      requires_approval?: boolean;
      estimated_impact?: string;
    };

    if (!body.action_type || !body.title) {
      return NextResponse.json({ error: "action_type and title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_aipify_action", {
      p_action_type: body.action_type,
      p_title: body.title,
      p_description: body.description ?? "",
      p_payload_json: body.payload_json ?? {},
      p_preview_text: body.preview_text ?? "",
      p_risk_level: body.risk_level ?? "low",
      p_execution_level: body.execution_level ?? "assistant",
      p_created_by_module: body.created_by_module ?? "aef",
      p_requires_approval: body.requires_approval ?? true,
      p_estimated_impact: body.estimated_impact ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Failed to create action" }, { status: 500 });
  }
}
