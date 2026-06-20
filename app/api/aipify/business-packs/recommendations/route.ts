import { NextResponse } from "next/server";
import { parsePackRecommendationOverview } from "@/lib/app-portal/business-pack-recommendations";
import {
  appPortalAccessDeniedResponse,
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
      "business_recommendations.view",
      "business_recommendations.manage"
    );
    if (!permission.ok) return permission.response;

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_business_pack_recommendation_engine", {
      p_industry: searchParams.get("industry") || null,
      p_category: searchParams.get("category") || null,
      p_complexity: searchParams.get("complexity") || null,
      p_business_impact: searchParams.get("business_impact") || null,
      p_confidence_level: searchParams.get("confidence_level") || null,
      p_installed_status: searchParams.get("installed_status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/business-packs/recommendations]", error.message);
    }

    return NextResponse.json(parsePackRecommendationOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load business pack recommendations";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/business-packs/recommendations]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
