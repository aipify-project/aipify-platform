import { NextResponse } from "next/server";
import { parseOnboarding } from "@/lib/app-portal/onboarding";
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

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(supabase, "self_support.view");
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("get_app_portal_onboarding");
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/onboarding]", error.message);
    }

    return NextResponse.json(parseOnboarding(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load onboarding";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/onboarding]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}

type PatchBody = {
  action?: "start" | "update_task" | "dismiss_milestone";
  task_key?: string;
  status?: string;
  milestone_key?: string;
};

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: canManage, error: manageError } = await supabase.rpc("has_organization_permission", {
      p_permission_key: "self_support.manage",
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

    const body = (await request.json()) as PatchBody;
    if (!body.action) return NextResponse.json({ error: "Action required" }, { status: 400 });

    const { data, error } = await supabase.rpc("patch_app_portal_onboarding", {
      p_action: body.action,
      p_task_key: body.task_key ?? null,
      p_status: body.status ?? null,
      p_milestone_key: body.milestone_key ?? null,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/onboarding]", error.message);
    }

    return NextResponse.json(parseOnboarding(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update onboarding";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/onboarding]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
