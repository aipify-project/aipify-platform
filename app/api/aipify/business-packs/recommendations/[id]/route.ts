import { NextResponse } from "next/server";
import { parsePackRecommendationDetail } from "@/lib/app-portal/business-pack-recommendations";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
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

    const { data, error } = await supabase.rpc("get_app_portal_business_pack_recommendation_detail", {
      p_pack_key: id,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/business-packs/recommendations/[id]]", error.message);
    }

    return NextResponse.json(parsePackRecommendationDetail(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load recommendation detail";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/business-packs/recommendations/[id]]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
