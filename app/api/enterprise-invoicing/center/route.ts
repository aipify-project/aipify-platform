import { NextResponse } from "next/server";
import { parseEnterpriseInvoiceBillingCenter } from "@/lib/enterprise-invoicing";
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
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") === "platform" ? "platform" : "tenant";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (scope === "tenant") {
      const access = await requireReadyAppPortalContext(supabase);
      if (!access.ok) return access.response;

      const permission = await requireOrganizationViewPermission(
        supabase,
        "enterprise_invoice.view",
        "enterprise_invoice.manage"
      );
      if (!permission.ok) {
        const billingPermission = await requireOrganizationViewPermission(
          supabase,
          "billing.view",
          "billing.manage"
        );
        if (!billingPermission.ok) {
          const subscriptionPermission = await requireOrganizationViewPermission(
            supabase,
            "subscription.view",
            "subscription.manage"
          );
          if (!subscriptionPermission.ok) return subscriptionPermission.response;
        }
      }
    }

    const { data, error } = await supabase.rpc("get_enterprise_invoice_billing_center", {
      p_scope: scope,
    });
    if (error) {
      const message = error.message;
      const access_state = classifyAppPortalError(message);
      console.error("[enterprise-invoicing/center]", message);
      return NextResponse.json(
        { error: message, access_state, found: false },
        { status: rpcErrorStatus(message, access_state) }
      );
    }

    const parsed = parseEnterpriseInvoiceBillingCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load enterprise billing center";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[enterprise-invoicing/center]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
