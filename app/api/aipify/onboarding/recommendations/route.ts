import { NextResponse } from "next/server";
import { parseOnboardingRecommendations } from "@/lib/app-portal/onboarding";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(supabase, "self_support.view");
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("get_app_portal_onboarding_recommendations");
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/onboarding/recommendations]", error.message);
    }

    return NextResponse.json(parseOnboardingRecommendations(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load recommendations";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/onboarding/recommendations]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
