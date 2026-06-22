import { NextResponse } from "next/server";
import { parseCustomerSuccessOverview } from "@/lib/app-portal/customer-success";
import {
  appPortalAccessDeniedResponse,
  appPortalRpcErrorResponse,
  appPortalStableErrorCode,
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

    const { data: hasPermission, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "success.view" }
    );
    if (permissionError) {
      const access_state = classifyAppPortalError(permissionError.message);
      return NextResponse.json(
        { error: appPortalStableErrorCode(access_state), access_state, found: false },
        { status: rpcErrorStatus(permissionError.message, access_state), headers: NO_STORE }
      );
    }
    if (!hasPermission) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_success", {
      p_department: searchParams.get("department") || null,
      p_category: searchParams.get("category") || null,
      p_priority: searchParams.get("priority") || null,
      p_success_status: searchParams.get("success_status") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
      p_owner: searchParams.get("owner") || null,
      p_due_date: searchParams.get("due_date") || null,
      p_sort_by: searchParams.get("sort_by") || null,
    });
    if (error) {
      return appPortalRpcErrorResponse("[aipify/customer-success]", error.message);
    }
    return NextResponse.json(parseCustomerSuccessOverview(data), { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load customer success";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/customer-success]", message);
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

    const { data: hasPermission, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "success.view" }
    );
    if (permissionError) {
      const access_state = classifyAppPortalError(permissionError.message);
      return NextResponse.json(
        { error: appPortalStableErrorCode(access_state), access_state, found: false },
        { status: rpcErrorStatus(permissionError.message, access_state), headers: NO_STORE }
      );
    }
    if (!hasPermission) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const { data, error } = await supabase.rpc("begin_app_portal_customer_success_journey");
    if (error) {
      return appPortalRpcErrorResponse("[aipify/customer-success]", error.message);
    }
    return NextResponse.json(parseCustomerSuccessOverview(data), { headers: NO_STORE });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to begin success journey";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/customer-success]", message);
    return NextResponse.json(
      { error: appPortalStableErrorCode(access_state), access_state, found: false },
      { status: rpcErrorStatus(message, access_state), headers: NO_STORE }
    );
  }
}
