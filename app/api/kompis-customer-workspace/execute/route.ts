import { NextResponse } from "next/server";
import { confirmKompisPrivilegedAction } from "@/lib/kompis-customer-workspace/adapters";
import { loadKompisServerWorkspaceBundle } from "@/lib/kompis-customer-workspace/server-context";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/** Confirms a pending privileged action after explicit customer review. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const confirmationId =
      typeof body?.confirmation_id === "string" ? body.confirmation_id.trim() : "";
    const route = typeof body?.route === "string" ? body.route.trim() : "/app/kompis-workspace";
    const locale = typeof body?.locale === "string" ? body.locale.trim() : "en";

    if (!confirmationId) {
      return NextResponse.json(
        { error: "confirmation_id required" },
        { status: 400, headers: NO_STORE }
      );
    }

    const supabase = await createClient();
    const loaded = await loadKompisServerWorkspaceBundle(supabase, { route, locale });
    if (!loaded.ok) {
      return NextResponse.json({ error: loaded.error }, { status: loaded.status, headers: NO_STORE });
    }

    const result = await confirmKompisPrivilegedAction(
      {
        supabase,
        permissions: loaded.bundle.permissions,
        sessionId: null,
        organizationId: loaded.bundle.organizationId,
        organizationName: loaded.bundle.organizationName,
        userRole: loaded.bundle.userRole,
        locale,
        route,
      },
      confirmationId,
      typeof body?.idempotency_key === "string" ? body.idempotency_key : undefined
    );

    return NextResponse.json(result, { status: result.ok ? 200 : 403, headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Execute failed" }, { status: 500, headers: NO_STORE });
  }
}
