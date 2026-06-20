import { NextResponse } from "next/server";
import {
  getTrustCenterOperations,
  parseTrustCenterOperations,
} from "@/lib/trust-center-operations";
import {
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
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "trust_center.view",
      "trust_center.manage"
    );
    if (!permission.ok) return permission.response;

    const url = new URL(request.url);
    const data = await getTrustCenterOperations(
      supabase,
      url.searchParams.get("section") ?? undefined
    );
    return NextResponse.json(parseTrustCenterOperations(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load Trust Center";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[app/trust-center-operations]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
