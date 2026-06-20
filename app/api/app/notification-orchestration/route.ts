import { NextResponse } from "next/server";
import {
  getNotificationOrchestrationCenter,
  parseNotificationOrchestrationCenter,
} from "@/lib/notification-orchestration";
import {
  appPortalAccessDeniedResponse,
  requireReadyAppPortalContext,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

function rpcErrorStatus(message: string, accessState: string): number {
  const lower = message.toLowerCase();
  if (lower.includes("pgrst202") || lower.includes("could not find the function")) {
    return 503;
  }
  if (accessState === "unauthenticated") return 401;
  if (accessState === "subscription_inactive" || accessState === "license_inactive") return 402;
  if (accessState === "organization_missing" || accessState === "membership_missing") return 409;
  if (accessState === "entitlement_missing") return 403;
  if (accessState === "permission_missing") return 403;
  return 403;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: hasPermission, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "notifications.view" }
    );
    if (permissionError) {
      const access_state = classifyAppPortalError(permissionError.message);
      return NextResponse.json(
        { error: permissionError.message, access_state, found: false },
        { status: rpcErrorStatus(permissionError.message, access_state) }
      );
    }
    if (!hasPermission) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const url = new URL(request.url);
    const data = await getNotificationOrchestrationCenter(
      supabase,
      url.searchParams.get("section") ?? undefined
    );
    const parsed = parseNotificationOrchestrationCenter(data);
    if (!parsed?.found) {
      const access_state = classifyAppPortalError(parsed?.error ?? "access_denied");
      return NextResponse.json(
        {
          error: parsed?.error ?? "access_denied",
          access_state,
          found: false,
        },
        { status: rpcErrorStatus(parsed?.error ?? "access_denied", access_state) }
      );
    }
    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load notification center";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      {
        error: message,
        access_state,
        found: false,
      },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
