import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      access_model?: Record<string, unknown>;
      participating_org_ids?: string[];
      governance_tier?: string;
    };

    if (!body.title) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_joint_operations_shared_workspace", {
      p_title: body.title,
      p_access_model: body.access_model ?? {},
      p_participating_org_ids: body.participating_org_ids ?? [],
      p_governance_tier: body.governance_tier ?? "standard",
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}
