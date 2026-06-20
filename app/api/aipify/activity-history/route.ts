import { NextResponse } from "next/server";
import { parseActivityHistory } from "@/lib/app-portal/activity-history";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_activity_history", {
      p_event_type: searchParams.get("event_type") || null,
      p_module: searchParams.get("module") || null,
      p_user_id: searchParams.get("user_id") || null,
      p_severity: searchParams.get("severity") || null,
      p_date_from: searchParams.get("date_from") || null,
      p_date_to: searchParams.get("date_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/activity-history]", error.message);
    }
    return NextResponse.json(parseActivityHistory(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load activity history";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
