import { NextResponse } from "next/server";
import { parseScenarioOverview } from "@/lib/app-portal/scenario-planning";
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
    const { data, error } = await supabase.rpc("list_app_portal_scenario_planning", {
      p_category: searchParams.get("category") || null,
      p_scenario_type: searchParams.get("scenario_type") || null,
      p_planning_status: searchParams.get("planning_status") || null,
      p_time_horizon: searchParams.get("time_horizon") || null,
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return appPortalRpcErrorResponse("[route]", error.message);
    return NextResponse.json(parseScenarioOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return appPortalRpcErrorResponse("[scenario-planning]", message);
  }
}
