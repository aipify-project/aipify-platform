import { NextResponse } from "next/server";
import {
  isKompisWorkspaceSurface,
  loadKompisServerWorkspaceBundle,
  parseKompisCustomerWorkspaceContract,
  previewKompisWorkspaceEffectiveAccess,
} from "@/lib/kompis-customer-workspace";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Server-validated effective permissions for the current authenticated tenant.
 * Route/module are hints only — tenant and role come from Core session context.
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const route = url.searchParams.get("route")?.trim() || "/app";
    const moduleKey = url.searchParams.get("module")?.trim() || "account";
    const locale = url.searchParams.get("locale")?.trim() || "en";

    const supabase = await createClient();
    const loaded = await loadKompisServerWorkspaceBundle(supabase, {
      route,
      module: moduleKey,
      locale,
    });
    if (!loaded.ok) {
      return NextResponse.json({ error: loaded.error }, { status: loaded.status, headers: NO_STORE });
    }

    return NextResponse.json(
      {
        enabled: loaded.bundle.permissions.enabled,
        permissions: loaded.bundle.permissions,
        organization_name: loaded.bundle.organizationName,
        user_role: loaded.bundle.userRole,
        route,
        module: moduleKey,
      },
      { headers: NO_STORE }
    );
  } catch {
    return NextResponse.json({ error: "Failed to load permissions" }, { status: 500, headers: NO_STORE });
  }
}

/** Read-only effective permissions preview for admin/control surfaces. */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const surface = body?.surface;
    const route = typeof body?.route === "string" ? body.route : "";
    const moduleKey = typeof body?.module === "string" ? body.module : "";
    const userRole = typeof body?.user_role === "string" ? body.user_role : "";
    const accessTier = typeof body?.access_tier === "string" ? body.access_tier : "";

    if (!isKompisWorkspaceSurface(surface) || !route || !moduleKey || !userRole || !accessTier) {
      return NextResponse.json({ error: "Invalid preview request" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_kompis_customer_workspace_contract");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }

    const row = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    const parsed = parseKompisCustomerWorkspaceContract(row.contract, { allowDraft: true });
    if (!parsed.ok) {
      return NextResponse.json(
        { enabled: false, fail_closed: true, denied_reasons: ["invalid_or_missing_contract"] },
        { headers: NO_STORE }
      );
    }

    const preview = previewKompisWorkspaceEffectiveAccess({
      contract: parsed.contract,
      surface,
      route,
      module: moduleKey,
      user_role: userRole,
      access_tier: accessTier,
      user_groups: Array.isArray(body?.user_groups)
        ? body.user_groups.filter((g: unknown): g is string => typeof g === "string")
        : undefined,
    });

    return NextResponse.json(preview, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to preview permissions" }, { status: 500, headers: NO_STORE });
  }
}
