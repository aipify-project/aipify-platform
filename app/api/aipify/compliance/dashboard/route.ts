import { NextResponse } from "next/server";
import { parseComplianceDashboard } from "@/lib/aipify/security-compliance/parse";
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
      "compliance.view",
      "compliance.manage"
    );
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("get_compliance_dashboard");
    if (error) {
      const message = error.message;
      const access_state = isDatabaseExecutionError(message)
        ? "database_execution_error"
        : classifyAppPortalError(message);
      console.error("[aipify/compliance/dashboard]", message);
      return NextResponse.json(
        { error: message, access_state, found: false },
        { status: rpcErrorStatus(message, access_state) }
      );
    }

    return NextResponse.json(parseComplianceDashboard(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load compliance dashboard";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[aipify/compliance/dashboard]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
