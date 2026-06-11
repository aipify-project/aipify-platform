import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      chain_key: string;
      chain_title: string;
      chain_type?: string;
      steps?: unknown[];
      emergency_override_config?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("save_enterprise_approval_chain", {
      p_chain_key: body.chain_key,
      p_chain_title: body.chain_title,
      p_chain_type: body.chain_type ?? "department",
      p_steps: body.steps ?? [],
      p_emergency_override_config: body.emergency_override_config ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save approval chain" }, { status: 500 });
  }
}
