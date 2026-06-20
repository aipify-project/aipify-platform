import { NextResponse } from "next/server";
import { parsePredictiveOverview } from "@/lib/app-portal/predictive-intelligence";
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
    const { data, error } = await supabase.rpc("list_app_portal_predictive_intelligence", {
      p_category: searchParams.get("category") || null,
      p_confidence_level: searchParams.get("confidence_level") || null,
      p_time_horizon: searchParams.get("time_horizon") || null,
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_potential_impact: searchParams.get("potential_impact") || null,
      p_review_status: searchParams.get("review_status") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return appPortalRpcErrorResponse("[route]", error.message);
    return NextResponse.json(parsePredictiveOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return appPortalRpcErrorResponse("[predictive-intelligence]", message);
  }
}
