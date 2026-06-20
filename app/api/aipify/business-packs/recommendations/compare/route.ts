import { NextResponse } from "next/server";
import { parsePackComparison } from "@/lib/app-portal/business-pack-recommendations";
import {
  appPortalAccessDeniedResponse,
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: canManage, error: manageError } = await supabase.rpc("has_organization_permission", {
      p_permission_key: "business_recommendations.manage",
    });
    if (manageError) {
      const access_state = classifyAppPortalError(manageError.message);
      return NextResponse.json(
        { error: manageError.message, access_state, found: false },
        { status: rpcErrorStatus(manageError.message, access_state) }
      );
    }
    if (!canManage) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const body = (await request.json()) as { pack_keys?: string[] };
    if (!body.pack_keys?.length) return NextResponse.json({ error: "pack_keys required" }, { status: 400 });

    const { data, error } = await supabase.rpc("compare_app_portal_business_pack_recommendations", {
      p_pack_keys: body.pack_keys,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/business-packs/recommendations/compare]", error.message);
    }

    return NextResponse.json({ comparison: parsePackComparison(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to compare recommendations";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/business-packs/recommendations/compare]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
