import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/** Create authenticated workspace session after login (server-side binding only). */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const locale = typeof body?.locale === "string" ? body.locale.trim() : "en";
    const surface =
      typeof body?.surface === "string" ? body.surface.trim() : "authenticated_portal";
    const linked =
      typeof body?.linked_public_session_id === "string" && body.linked_public_session_id.trim()
        ? body.linked_public_session_id.trim()
        : null;

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("create_kompis_customer_workspace_auth_session", {
      p_locale: locale,
      p_linked_public_session_id: linked,
      p_surface: surface,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? {}, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to create session" }, { status: 500, headers: NO_STORE });
  }
}

export async function DELETE(request: Request) {
  try {
    const sessionId = new URL(request.url).searchParams.get("session_id");
    if (!sessionId) {
      return NextResponse.json({ error: "session_id required" }, { status: 400, headers: NO_STORE });
    }
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("revoke_kompis_customer_workspace_session", {
      p_session_id: sessionId,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? { revoked: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to revoke session" }, { status: 500, headers: NO_STORE });
  }
}
