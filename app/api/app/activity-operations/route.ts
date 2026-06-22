import { NextResponse } from "next/server";
import { parseActivityOperationsCenter } from "@/lib/activity-operations";
import {
  appPortalAccessDeniedResponse,
  appPortalStableErrorCode,
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

const LOG_TAG = "[app/activity-operations]";

function activityOperationsErrorResponse(message: string, accessState: AppOrganizationContextState) {
  console.error(LOG_TAG, message);
  return NextResponse.json(
    {
      error: appPortalStableErrorCode(accessState),
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
    if (!user) {
      return NextResponse.json(
        { error: "unauthenticated", access_state: "unauthenticated", found: false },
        { status: 401 }
      );
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "activity_history.view",
      "activity_history.manage"
    );
    if (!permission.ok) return permission.response;

    const url = new URL(request.url);
    const { data, error } = await supabase.rpc("get_activity_operations_center", {
      p_section: url.searchParams.get("section") ?? null,
    });

    if (error) {
      const accessState = isDatabaseExecutionError(error.message)
        ? "database_execution_error"
        : classifyAppPortalError(error.message);
      if (accessState === "permission_missing") {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
      return activityOperationsErrorResponse(error.message, accessState);
    }

    const parsed = parseActivityOperationsCenter((data as Record<string, unknown>) ?? {});
    if (parsed.found !== true && parsed.error) {
      const accessState = classifyAppPortalError(parsed.error);
      if (accessState === "permission_missing") {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
      return activityOperationsErrorResponse(parsed.error, accessState);
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load activity center";
    const accessState = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    if (accessState === "permission_missing") {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }
    return activityOperationsErrorResponse(message, accessState);
  }
}
