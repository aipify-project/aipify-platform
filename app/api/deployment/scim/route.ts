import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * SCIM readiness scaffold (Phase A.39) — full SCIM provisioning in a future phase.
 */
export async function GET() {
  return NextResponse.json({
    status: "readiness_scaffold",
    message: "SCIM endpoint stub — configure via deployment dashboard until full SCIM ships.",
    supported_operations: [],
  });
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("save_scim_provisioning_settings", {
      p_settings: (body.settings as Record<string, unknown>) ?? {},
      p_enabled: Boolean(body.enabled),
      p_endpoint_url: (body.endpoint_url as string) ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save SCIM settings" }, { status: 500 });
  }
}
