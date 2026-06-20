import { NextResponse } from "next/server";
import { parseCustomerHealthRecommendations } from "@/lib/app-portal/customer-health";
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "customer_health.view",
      "customer_health.manage"
    );
    if (!permission.ok) return permission.response;

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_health_recommendations", {
      p_priority: searchParams.get("priority") || null,
      p_category: searchParams.get("category") || null,
      p_recommendation_status: searchParams.get("recommendation_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/customer-health/recommendations]", error.message);
    }
    return NextResponse.json({ found: true, recommendations: parseCustomerHealthRecommendations(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load recommendations";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/customer-health/recommendations]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
