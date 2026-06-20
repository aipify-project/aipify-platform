import { NextResponse } from "next/server";
import { parseICCOverview } from "@/lib/app-portal/intelligence-command-center";
import {
  appPortalRpcErrorResponse,
  requireReadyAppPortalContext,
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
    const { data, error } = await supabase.rpc("get_app_portal_intelligence_command_center", {
      p_category:       searchParams.get("category")       || null,
      p_priority:       searchParams.get("priority")       || null,
      p_time_horizon:   searchParams.get("time_horizon")   || null,
      p_department:     searchParams.get("department")     || null,
      p_executive_owner:searchParams.get("executive_owner")|| null,
      p_review_status:  searchParams.get("review_status")  || null,
      p_search:         searchParams.get("search")         || null,
    });
    if (error) return appPortalRpcErrorResponse("[route]", error.message);
    return NextResponse.json(parseICCOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return appPortalRpcErrorResponse("[intelligence-command-center]", message);
  }
}
