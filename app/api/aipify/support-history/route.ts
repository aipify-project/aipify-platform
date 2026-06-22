import { NextResponse } from "next/server";
import { parseSupportHistory } from "@/lib/app-portal/support-history";
import {
  appPortalAccessDeniedResponse,
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import {
  classifyAppPortalError,
  type AppOrganizationContextState,
} from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

const LOG_TAG = "[aipify/support-history]";

function stableSupportHistoryErrorCode(accessState: AppOrganizationContextState): string {
  switch (accessState) {
    case "permission_missing":
      return "permission_missing";
    case "organization_missing":
    case "membership_missing":
      return "organization_context_required";
    case "subscription_inactive":
    case "license_inactive":
      return "subscription_inactive";
    case "entitlement_missing":
      return "entitlement_missing";
    case "unauthenticated":
      return "unauthenticated";
    case "database_execution_error":
      return "load_error";
    default:
      return "access_denied";
  }
}

function supportHistoryErrorResponse(message: string, accessState: AppOrganizationContextState) {
  console.error(LOG_TAG, message);
  return NextResponse.json(
    {
      error: stableSupportHistoryErrorCode(accessState),
      access_state: accessState,
      found: false,
    },
    { status: rpcErrorStatus(message, accessState) }
  );
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "support_requests.view",
      "support_requests.manage"
    );
    if (!permission.ok) return permission.response;

    const { searchParams } = new URL(request.url);
    const assignedRaw = searchParams.get("assigned");
    const assigned =
      assignedRaw && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assignedRaw)
        ? assignedRaw
        : null;
    const pageRaw = searchParams.get("page");
    const pageSizeRaw = searchParams.get("page_size");

    const { data, error } = await supabase.rpc("get_app_portal_support_history", {
      p_status: searchParams.get("status") || null,
      p_category: searchParams.get("category") || null,
      p_priority: searchParams.get("priority") || null,
      p_channel: searchParams.get("channel") || null,
      p_assigned: assigned,
      p_date_from: searchParams.get("date_from") || null,
      p_date_to: searchParams.get("date_to") || null,
      p_search: searchParams.get("search") || null,
      p_sort: searchParams.get("sort") || null,
      p_page: pageRaw ? Number(pageRaw) : 1,
      p_page_size: pageSizeRaw ? Number(pageSizeRaw) : 10,
    });

    if (error) {
      const accessState = isDatabaseExecutionError(error.message)
        ? "database_execution_error"
        : classifyAppPortalError(error.message);
      if (accessState === "permission_missing") {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
      return supportHistoryErrorResponse(error.message, accessState);
    }

    return NextResponse.json(parseSupportHistory(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load support history";
    const accessState = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    if (accessState === "permission_missing") {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }
    return supportHistoryErrorResponse(message, accessState);
  }
}
