import { NextResponse } from "next/server";
import { parseBenchmarkOverview } from "@/lib/app-portal/enterprise-benchmarking";
import {
  appPortalRpcErrorResponse,
  requireReadyAppPortalContext,
} from "@/lib/tenant/app-portal-route-access";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const maturityLevel = searchParams.get("maturity_level");
    const { data, error } = await supabase.rpc("list_app_portal_enterprise_benchmarking", {
      p_dimension_key: searchParams.get("dimension_key") || null,
      p_maturity_level: maturityLevel ? Number(maturityLevel) : null,
      p_organizational_area: searchParams.get("organizational_area") || null,
      p_priority_level: searchParams.get("priority_level") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return appPortalRpcErrorResponse("[aipify/benchmarking]", error.message);
    return NextResponse.json(parseBenchmarkOverview(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return appPortalRpcErrorResponse("[benchmarking]", message);
  }
}
