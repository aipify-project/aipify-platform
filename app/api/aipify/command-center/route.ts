import { NextResponse } from "next/server";
import { parseAbosCommandCenterOverview } from "@/lib/app-portal/abos-command-center";
import {
  appPortalRpcErrorResponse,
  appPortalStableErrorCode,
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
      "operations_center.view",
      "operations_center.manage"
    );
    if (!permission.ok) return permission.response;

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_command_center", {
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_priority: searchParams.get("priority") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_recommendation_type: searchParams.get("recommendation_type") || null,
      p_focus_category: searchParams.get("focus_category") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return appPortalRpcErrorResponse("[aipify/command-center]", error.message);
    return NextResponse.json(parseAbosCommandCenterOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return appPortalRpcErrorResponse("[command-center]", message);
  }
}

export async function POST() {
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
      "operations_center.view",
      "operations_center.manage"
    );
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("begin_app_portal_command_center_briefing");
    if (error) return appPortalRpcErrorResponse("[aipify/command-center]", error.message);
    return NextResponse.json(parseAbosCommandCenterOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate briefing";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: appPortalStableErrorCode(access_state), access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
