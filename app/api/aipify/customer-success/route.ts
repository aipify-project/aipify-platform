import { NextResponse } from "next/server";
import { parseCustomerSuccessOverview } from "@/lib/app-portal/customer-success";
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: hasPermission, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "success.view" }
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

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_success", {
      p_department: searchParams.get("department") || null,
      p_category: searchParams.get("category") || null,
      p_priority: searchParams.get("priority") || null,
      p_success_status: searchParams.get("success_status") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
      p_owner: searchParams.get("owner") || null,
      p_due_date: searchParams.get("due_date") || null,
      p_sort_by: searchParams.get("sort_by") || null,
    });
    if (error) {
      const access_state = classifyAppPortalError(error.message);
      return NextResponse.json(
        {
          error: error.message,
          access_state,
          found: false,
        },
        { status: rpcErrorStatus(error.message, access_state) }
      );
    }
    return NextResponse.json(parseCustomerSuccessOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load customer success" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: hasPermission, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "success.view" }
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

    const { data, error } = await supabase.rpc("begin_app_portal_customer_success_journey");
    if (error) {
      const access_state = classifyAppPortalError(error.message);
      return NextResponse.json(
        { error: error.message, access_state, found: false },
        { status: rpcErrorStatus(error.message, access_state) }
      );
    }
    return NextResponse.json(parseCustomerSuccessOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to begin success journey" }, { status: 500 });
  }
}
