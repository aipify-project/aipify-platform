import { NextResponse } from "next/server";
import {
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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
      "profitability.view",
      "profitability.manage"
    );
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("get_organization_profitability_settings");
    if (error) throw new Error(error.message);

    if (data?.found === false && !data?.error) {
      return NextResponse.json(data, { status: 200 });
    }
    if (data?.found === false && data?.error) {
      const message = String(data.error);
      const access_state = classifyAppPortalError(message);
      return NextResponse.json(
        { ...data, access_state },
        { status: rpcErrorStatus(message, access_state) }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load Profitability settings";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[profitability/settings]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
