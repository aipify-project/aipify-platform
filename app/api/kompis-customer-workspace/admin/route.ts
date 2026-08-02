import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/** Owner/admin-only Kompis workspace controls (minimum surface). */
export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_kompis_customer_workspace_admin_state");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? { admin: false, visible: false }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Admin state unavailable" }, { status: 500, headers: NO_STORE });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body?.enabled !== "boolean") {
      return NextResponse.json({ error: "enabled boolean required" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("set_kompis_customer_workspace_enabled", {
      p_enabled: body.enabled,
      p_authenticated_enabled:
        typeof body?.authenticated_enabled === "boolean" ? body.authenticated_enabled : true,
      p_reason: typeof body?.reason === "string" ? body.reason : "admin_toggle",
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? {}, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Admin update failed" }, { status: 500, headers: NO_STORE });
  }
}
