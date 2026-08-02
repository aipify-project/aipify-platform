import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };
const ROLES = new Set(["customer_it", "external_provider", "partner"]);

/**
 * Typed invite placeholder — does not issue full APP access or secrets.
 * Full invite backend is a scoped gap (backend_status: typed_placeholder).
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const providerKey = typeof body?.provider_key === "string" ? body.provider_key.trim() : "";
    const role = typeof body?.role === "string" ? body.role.trim() : "";
    const recipient =
      typeof body?.recipient_email === "string" ? body.recipient_email.trim() : null;

    if (!providerKey || !ROLES.has(role)) {
      return NextResponse.json({ error: "Invalid invite request" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc(
      "create_app_portal_installation_invite_placeholder",
      {
        p_provider_key: providerKey,
        p_role: role,
        p_recipient_email: recipient,
      }
    );

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? { status: "placeholder" }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to create invite placeholder" }, { status: 500, headers: NO_STORE });
  }
}
