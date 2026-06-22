import { NextResponse } from "next/server";
import { parseCustomerHealthWorkspace } from "@/lib/app-portal/customer-health";
import {
  appPortalAccessDeniedResponse,
  appPortalRpcErrorResponse,
  appPortalStableErrorCode,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "customer_health.view",
      "customer_health.manage"
    );
    if (!permission.ok) return permission.response;

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_health", {
      p_category: searchParams.get("category") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_department: searchParams.get("department") || null,
      p_priority: searchParams.get("priority") || null,
      p_trend: searchParams.get("trend") || null,
      p_recommendation_status: searchParams.get("recommendation_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      return appPortalRpcErrorResponse("[aipify/customer-health]", error.message);
    }
    return NextResponse.json(parseCustomerHealthWorkspace(data), { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load customer health";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/customer-health]", message);
    return NextResponse.json(
      { error: appPortalStableErrorCode(access_state), access_state, found: false },
      { status: rpcErrorStatus(message, access_state), headers: NO_STORE }
    );
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: NO_STORE });
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: canManage, error: manageError } = await supabase.rpc("has_organization_permission", {
      p_permission_key: "customer_health.manage",
    });
    if (manageError) {
      const access_state = classifyAppPortalError(manageError.message);
      return NextResponse.json(
        { error: appPortalStableErrorCode(access_state), access_state, found: false },
        { status: rpcErrorStatus(manageError.message, access_state), headers: NO_STORE }
      );
    }
    if (!canManage) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const { data, error } = await supabase.rpc("begin_app_portal_customer_health_review");
    if (error) {
      return appPortalRpcErrorResponse("[aipify/customer-health]", error.message);
    }
    return NextResponse.json(parseCustomerHealthWorkspace(data), { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to start health review";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/customer-health]", message);
    return NextResponse.json(
      { error: appPortalStableErrorCode(access_state), access_state, found: false },
      { status: rpcErrorStatus(message, access_state), headers: NO_STORE }
    );
  }
}
