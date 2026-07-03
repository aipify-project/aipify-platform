import { NextResponse } from "next/server";
import {
  isCoreHumanApprovalUiEnabled,
  isHumanApprovalPilotRole,
} from "@/lib/app/human-approval-nav";
import {
  isSafeCoreHumanApprovalRpcPayload,
  parseCoreHumanApprovalRequest,
} from "@/lib/core/human-approval/parse";
import {
  appPortalAccessDeniedResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", enabled: false }, { status: 401 });
    }

    if (!isCoreHumanApprovalUiEnabled()) {
      return NextResponse.json(
        { enabled: false, error: "feature_disabled" },
        { status: 404 },
      );
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    if (!isHumanApprovalPilotRole(access.context.organization_role)) {
      return appPortalAccessDeniedResponse("permission_missing", "human_approval_owner_admin_required");
    }

    const { data, error } = await supabase.rpc("get_core_human_approval_request", {
      p_request_id: id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const request = parseCoreHumanApprovalRequest(data);
    if (!request || !isSafeCoreHumanApprovalRpcPayload(request)) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    return NextResponse.json({ enabled: true, request });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load human approval request";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[app/human-approval/detail]", message);
    return NextResponse.json(
      { error: message, access_state, enabled: false },
      { status: rpcErrorStatus(message, access_state) },
    );
  }
}

export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
