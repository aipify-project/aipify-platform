import { NextResponse } from "next/server";
import { performTrustCenterAction } from "@/lib/trust-center-operations";
import {
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: canManage, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "trust_center.manage" }
    );
    if (permissionError) {
      const access_state = classifyAppPortalError(permissionError.message);
      return NextResponse.json(
        { error: permissionError.message, access_state },
        { status: rpcErrorStatus(permissionError.message, access_state) }
      );
    }
    if (!canManage) {
      return NextResponse.json(
        { error: "permission_missing", access_state: "permission_missing" },
        { status: 403 }
      );
    }

    const body = (await request.json()) as {
      action_type?: string;
      payload?: Record<string, unknown>;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performTrustCenterAction(
      supabase,
      body.action_type,
      body.payload ?? {}
    );
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Trust Center action failed";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[app/trust-center-operations/action]", message);
    return NextResponse.json(
      { error: message, access_state },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
