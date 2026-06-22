import { NextResponse } from "next/server";
import { parseAbosCommandCenterTimeline } from "@/lib/app-portal/abos-command-center";
import {
  appPortalRpcErrorResponse,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
} from "@/lib/tenant/app-portal-route-access";
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
    const { data, error } = await supabase.rpc("list_app_portal_command_center_timeline", {
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return appPortalRpcErrorResponse("[aipify/command-center/timeline]", error.message);
    return NextResponse.json({ timeline: parseAbosCommandCenterTimeline(data) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load timeline";
    return appPortalRpcErrorResponse("[aipify/command-center/timeline]", message);
  }
}
