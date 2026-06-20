import { NextResponse } from "next/server";
import { getGovernanceManagementCenter, parseGovernanceCenter } from "@/lib/governance-management";
import {
  appPortalAccessDeniedResponse,
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
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

    const permission = await requireOrganizationViewPermission(
      supabase,
      "governance.view",
      "governance.manage"
    );
    if (!permission.ok) return permission.response;

    const url = new URL(request.url);
    const data = await getGovernanceManagementCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseGovernanceCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load governance";
    if (isDatabaseExecutionError(message)) {
      return NextResponse.json(
        { error: message, access_state: "database_execution_error", found: false },
        { status: 500 }
      );
    }
    const access_state = classifyAppPortalError(message);
    if (access_state === "permission_missing") {
      return appPortalAccessDeniedResponse("permission_missing", message);
    }
    console.error("[app/governance]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
