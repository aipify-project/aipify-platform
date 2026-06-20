import { NextResponse } from "next/server";
import { parseCFIOverview } from "@/lib/app-portal/cross-functional-intelligence";
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
    const { data, error } = await supabase.rpc("list_app_portal_cross_functional_intelligence", {
      p_department:      searchParams.get("department")       || null,
      p_team:            searchParams.get("team")             || null,
      p_dependency_type: searchParams.get("dependency_type")  || null,
      p_risk_level:      searchParams.get("risk_level")       || null,
      p_priority:        searchParams.get("priority")         || null,
      p_review_status:   searchParams.get("review_status")    || null,
      p_search:          searchParams.get("search")           || null,
    });
    if (error) return appPortalRpcErrorResponse("[route]", error.message);
    return NextResponse.json(parseCFIOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return appPortalRpcErrorResponse("[cross-functional-intelligence]", message);
  }
}
