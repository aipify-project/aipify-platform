import { NextResponse } from "next/server";
import { parseSupportHistory } from "@/lib/app-portal/support-history";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

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
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/support-history]", error.message);
    }

    return NextResponse.json(parseSupportHistory(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load support history";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/support-history]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
