import { NextResponse } from "next/server";
import { parseSupportRequestItem } from "@/lib/app-portal/support-requests";
import {
  appPortalAccessDeniedResponse,
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

type ReopenBody = { reason?: string };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const body = (await request.json()) as ReopenBody;
    if (!body.reason?.trim()) {
      return NextResponse.json({ error: "Reopen reason is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("reopen_app_portal_support_request", {
      p_id: id,
      p_reason: body.reason.trim(),
    });

    if (error) {
      const lower = error.message.toLowerCase();
      if (lower.includes("permission denied") || lower.includes("access denied")) {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/support-requests/reopen]", error.message);
    }

    const item = parseSupportRequestItem(data);
    return NextResponse.json({ reopened: true, request: item });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to reopen support request";
    const access_state = classifyAppPortalError(message);
    console.error("[aipify/support-requests/reopen]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
