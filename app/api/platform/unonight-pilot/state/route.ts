import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string; payload?: Record<string, unknown> };
    if (!body.action) {
      return NextResponse.json({ ok: false, error: "action required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("platform_set_unonight_pilot_state", {
      p_action: body.action,
      p_payload: body.payload ?? {},
    });
    if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update pilot state" }, { status: 500 });
  }
}
