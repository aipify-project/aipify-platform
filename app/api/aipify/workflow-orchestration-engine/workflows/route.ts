import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      template_key?: string;
      workflow_name?: string;
      description?: string;
      category?: string;
      trust_level?: string;
      steps?: unknown[];
    };

    if (body.template_key) {
      const { data, error } = await supabase.rpc("create_workflow_from_template", {
        p_template_key: body.template_key,
        p_workflow_name: body.workflow_name ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("create_organization_workflow", {
      p_workflow_name: body.workflow_name,
      p_description: body.description ?? null,
      p_category: body.category ?? "operations",
      p_trust_level: body.trust_level ?? "standard",
      p_steps: body.steps ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create workflow" }, { status: 500 });
  }
}
