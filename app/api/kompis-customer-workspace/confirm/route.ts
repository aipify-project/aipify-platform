import { NextResponse } from "next/server";
import {
  evaluateKompisConfirmationGate,
  parseKompisCustomerWorkspaceContract,
  resolveKompisWorkspacePermissions,
  isKompisWorkspaceSurface,
} from "@/lib/kompis-customer-workspace";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Builds a confirmation card for a proposed write/draft tool.
 * Does not execute the action — adapters remain a follow-up.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const toolKey = typeof body?.tool_key === "string" ? body.tool_key.trim() : "";
    const summary = typeof body?.summary === "string" ? body.summary.trim() : "";
    const surface = body?.surface;
    const route = typeof body?.route === "string" ? body.route : "";
    const moduleKey = typeof body?.module === "string" ? body.module : "";
    const userRole = typeof body?.user_role === "string" ? body.user_role : "";
    const accessTier = typeof body?.access_tier === "string" ? body.access_tier : "";

    if (
      !toolKey ||
      !summary ||
      !isKompisWorkspaceSurface(surface) ||
      !route ||
      !moduleKey ||
      !userRole ||
      !accessTier
    ) {
      return NextResponse.json({ error: "Invalid confirmation request" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_kompis_customer_workspace_contract");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }

    const row = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
    const parsed = parseKompisCustomerWorkspaceContract(row.contract);
    if (!parsed.ok) {
      return NextResponse.json({ error: "Contract unavailable" }, { status: 403, headers: NO_STORE });
    }

    const permissions = resolveKompisWorkspacePermissions({
      contract: parsed.contract,
      context: {
        surface,
        route,
        module: moduleKey,
        user_role: userRole,
        access_tier: accessTier,
        entity_type: typeof body?.entity_type === "string" ? body.entity_type : null,
      },
    });

    const gate = evaluateKompisConfirmationGate({
      tool_key: toolKey,
      permissions,
      summary,
      consequences: Array.isArray(body?.consequences)
        ? body.consequences.filter((c: unknown): c is string => typeof c === "string")
        : [],
      is_public: body?.is_public === true,
      is_financial: body?.is_financial === true,
      is_irreversible: body?.is_irreversible === true,
    });

    return NextResponse.json({ gate, execute: false }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to build confirmation" }, { status: 500, headers: NO_STORE });
  }
}
