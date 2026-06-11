import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const center = data as { workflows?: unknown[] };
    return NextResponse.json({ workflows: center.workflows ?? [] });
  } catch {
    return NextResponse.json({ error: "Workflows request failed" }, { status: 500 });
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
      name?: string;
      description?: string;
      trigger_event?: string;
      steps?: unknown[];
      approval_required?: boolean;
      risk_level?: string;
    };

    if (!body.name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_business_workflow", {
      p_name: body.name,
      p_description: body.description ?? "",
      p_trigger_event: body.trigger_event ?? "support_request",
      p_steps: body.steps ?? [],
      p_approval_required: body.approval_required ?? true,
      p_risk_level: body.risk_level ?? "medium",
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Workflow create failed" }, { status: 500 });
  }
}
