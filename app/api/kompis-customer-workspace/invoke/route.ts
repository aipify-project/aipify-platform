import { NextResponse } from "next/server";
import {
  executeKompisCreateDraft,
  executeKompisReadAccessStatus,
  proposeKompisUpdatePreference,
} from "@/lib/kompis-customer-workspace/adapters";
import { loadKompisServerWorkspaceBundle } from "@/lib/kompis-customer-workspace/server-context";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Real runtime invoke for authenticated Kompis tools.
 * READ and DRAFT execute immediately (draft never privileged-executes).
 * Privileged writes return a confirmation card only.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const toolKey = typeof body?.tool_key === "string" ? body.tool_key.trim() : "";
    const route = typeof body?.route === "string" ? body.route.trim() : "/app/kompis-workspace";
    const locale = typeof body?.locale === "string" ? body.locale.trim() : "en";
    const sessionId =
      typeof body?.session_id === "string" && body.session_id.trim() ? body.session_id.trim() : null;

    if (!toolKey) {
      return NextResponse.json({ error: "tool_key required" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const loaded = await loadKompisServerWorkspaceBundle(supabase, {
      route,
      module: typeof body?.module === "string" ? body.module : "account",
      locale,
    });
    if (!loaded.ok) {
      return NextResponse.json({ error: loaded.error }, { status: loaded.status, headers: NO_STORE });
    }

    const ctx = {
      supabase,
      permissions: loaded.bundle.permissions,
      sessionId,
      organizationId: loaded.bundle.organizationId,
      organizationName: loaded.bundle.organizationName,
      userRole: loaded.bundle.userRole,
      locale,
      route,
    };

    if (toolKey === "get_my_access_status") {
      const result = await executeKompisReadAccessStatus(ctx);
      return NextResponse.json(result, { status: result.ok ? 200 : 403, headers: NO_STORE });
    }

    if (toolKey === "create_draft") {
      const result = await executeKompisCreateDraft(ctx, {
        title: typeof body?.title === "string" ? body.title : "Draft",
        body: typeof body?.body === "string" ? body.body : "",
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 403, headers: NO_STORE });
    }

    if (toolKey === "update_preference") {
      const result = await proposeKompisUpdatePreference(ctx, {
        preference_key:
          typeof body?.preference_key === "string" ? body.preference_key : "workspace_assist",
        preference_value:
          typeof body?.preference_value === "string" ? body.preference_value : "enabled",
        idempotency_key:
          typeof body?.idempotency_key === "string" ? body.idempotency_key : undefined,
      });
      return NextResponse.json(result, { status: result.ok ? 200 : 403, headers: NO_STORE });
    }

    return NextResponse.json(
      { ok: false, code: "tool_not_implemented", message: "Tool is not available in this runtime" },
      { status: 400, headers: NO_STORE }
    );
  } catch {
    return NextResponse.json({ error: "Invoke failed" }, { status: 500, headers: NO_STORE });
  }
}
