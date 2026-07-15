import { NextResponse } from "next/server";
import { guardPrivilegedPlatformScopeSession } from "@/lib/auth/platform-server-access";
import { parsePaymentProvidersCenter } from "@/lib/payment-providers";
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

    if (scope === "platform") {
      const platformGuard = await guardPrivilegedPlatformScopeSession(supabase, scope);
      if (platformGuard) return platformGuard;
    }

    if (scope === "tenant") {
      const access = await requireReadyAppPortalContext(supabase);
      if (!access.ok) return access.response;

      const permission = await requireOrganizationViewPermission(
        supabase,
        "payment_providers.view",
        "payment_providers.manage"
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

    const { data, error } = await supabase.rpc("get_payment_providers_center", {
      p_scope: scope,
    });
    if (error) {
      const message = error.message;
      const access_state = classifyAppPortalError(message);
      console.error("[payment-providers]", message);
      return NextResponse.json(
        { error: message, access_state, found: false },
        { status: rpcErrorStatus(message, access_state) }
      );
    }

    const parsed = parsePaymentProvidersCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load payment providers";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[payment-providers]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
