import { NextResponse } from "next/server";
import { parseActivityOperationsCenter } from "@/lib/activity-operations";
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      const access_state = classifyAppPortalError(error.message);
      if (access_state === "permission_missing") {
        return appPortalAccessDeniedResponse("permission_missing", error.message);
      }
      return appPortalRpcErrorResponse("[app/activity-operations]", error.message);
    }

    const parsed = parseActivityOperationsCenter((data as Record<string, unknown>) ?? {});
    if (parsed.found !== true && parsed.error) {
      const access_state = classifyAppPortalError(parsed.error);
      return NextResponse.json(
        { error: parsed.error, access_state, found: false },
        { status: rpcErrorStatus(parsed.error, access_state) }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load activity center";
    if (isDatabaseExecutionError(message)) {
      return NextResponse.json(
        { error: message, access_state: "database_execution_error", found: false },
        { status: 500 }
      );
    }
    const access_state = classifyAppPortalError(message);
    if (access_state === "permission_missing") {
      return appPortalAccessDeniedResponse("permission_missing", message);
    }
    console.error("[app/activity-operations]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
