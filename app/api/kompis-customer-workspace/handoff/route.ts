import { NextResponse } from "next/server";
import {
  createAuthenticatedHandoffFromPublic,
  parseKompisCustomerWorkspaceContract,
} from "@/lib/kompis-customer-workspace";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/**
 * Public → authenticated handoff.
 * Preserves customer-safe intent only. Never auto-executes actions.
 * Open redirects and cross-tenant links are rejected.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const publicSessionId =
      typeof body?.public_session_id === "string" ? body.public_session_id.trim() : "";
    const topic =
      typeof body?.topic_summary === "string" ? body.topic_summary.trim().slice(0, 280) : null;
    const locale = typeof body?.locale === "string" ? body.locale.trim() : "en";
    const returnPath =
      typeof body?.return_path === "string" ? body.return_path.trim() : "/app/kompis-workspace";

    if (!publicSessionId) {
      return NextResponse.json(
        { error: "public_session_id required" },
        { status: 400, headers: NO_STORE }
      );
    }
    if (!returnPath.startsWith("/app/") || returnPath.includes("//") || returnPath.includes("://")) {
      return NextResponse.json({ error: "Invalid return path" }, { status: 400, headers: NO_STORE });
    }

    const supabase = await createClient();
    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) {
      return NextResponse.json(
        { error: "Authentication and organization revalidation required" },
        { status: 403, headers: NO_STORE }
      );
    }

    const { data: contractRow, error: contractError } = await supabase.rpc(
      "get_kompis_customer_workspace_contract"
    );
    if (contractError) {
      return NextResponse.json({ error: contractError.message }, { status: 403, headers: NO_STORE });
    }

    const row =
      contractRow && typeof contractRow === "object"
        ? (contractRow as Record<string, unknown>)
        : {};
    const parsed = parseKompisCustomerWorkspaceContract(row.contract);
    if (!parsed.ok) {
      return NextResponse.json({ error: "Contract unavailable" }, { status: 403, headers: NO_STORE });
    }

    const tenantKey = parsed.contract.tenant_key;
    const orgId = access.context.organization_id;
    const companyId = access.context.company_id;
    // Tenant binding: contract tenant_key must match organization or company id.
    if (tenantKey !== orgId && tenantKey !== companyId) {
      return NextResponse.json({ error: "Tenant mismatch" }, { status: 403, headers: NO_STORE });
    }

    const { data: authData } = await supabase.auth.getUser();
    const authUserId = authData.user?.id;
    if (!authUserId) {
      return NextResponse.json({ error: "Authenticated user required" }, { status: 403, headers: NO_STORE });
    }

    const handoff = createAuthenticatedHandoffFromPublic({
      contract: parsed.contract,
      public_session: {
        session_id: publicSessionId,
        tenant_id: tenantKey,
        locale,
        topic_summary: topic,
      },
      authenticated_user: {
        user_id: authUserId,
        tenant_id: tenantKey,
      },
    });

    if (!handoff.ok) {
      return NextResponse.json(
        { error: handoff.message, code: handoff.code },
        { status: 403, headers: NO_STORE }
      );
    }

    const { data: session, error: sessionError } = await supabase.rpc(
      "create_kompis_customer_workspace_auth_session",
      {
        p_locale: handoff.preserved_locale,
        p_linked_public_session_id: null,
        p_surface: "authenticated_portal",
      }
    );
    if (sessionError) {
      return NextResponse.json({ error: sessionError.message }, { status: 403, headers: NO_STORE });
    }

    return NextResponse.json(
      {
        ok: true,
        auto_executed: false,
        preserved_topic: handoff.preserved_topic,
        preserved_locale: handoff.preserved_locale,
        dropped_sensitive_assumptions: true,
        message_key: handoff.message_key,
        return_path: returnPath,
        session,
      },
      { headers: NO_STORE }
    );
  } catch {
    return NextResponse.json({ error: "Handoff failed" }, { status: 500, headers: NO_STORE });
  }
}
