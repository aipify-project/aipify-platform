import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      state?: string;
      reason?: string;
    };

    const state = body.state ?? "emergency_shutdown";
    const { data, error } = await supabase.rpc("set_tenant_emergency_state", {
      p_state: state,
      p_reason: body.reason ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update emergency state" }, { status: 500 });
  }
}
