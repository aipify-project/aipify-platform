import { NextResponse } from "next/server";
import { getCustomerBillingCenter } from "@/lib/commercial-packages/client";
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
      "billing.view",
      "billing.manage"
    );
    if (!permission.ok) return permission.response;

    const data = await getCustomerBillingCenter(supabase);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Billing center request failed";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[commercial-packages/billing]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
