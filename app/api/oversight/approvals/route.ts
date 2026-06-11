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
    const limit = searchParams.get("limit");

    const { data, error } = await supabase.rpc("list_organization_oversight_approvals", {
      p_status: status,
      p_limit: limit ? Number(limit) : 50,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ approvals: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to list oversight approvals" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      action_type?: string;
      risk_level?: string;
      explanation?: Record<string, unknown>;
      confidence?: number;
      ai_initiated?: boolean;
      related_request_id?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("submit_oversight_approval_request", {
      p_action_type: body.action_type,
      p_risk_level: body.risk_level ?? "medium",
      p_explanation: body.explanation ?? {},
      p_confidence: body.confidence ?? null,
      p_ai_initiated: body.ai_initiated ?? true,
      p_related_request_id: body.related_request_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? {});
  } catch {
    return NextResponse.json({ error: "Failed to submit oversight approval" }, { status: 500 });
  }
}
