import { NextResponse } from "next/server";
import { getCustomerModulesCenter } from "@/lib/commercial-packages/client";
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
      "modules.view",
      "modules.manage"
    );
    if (!permission.ok) return permission.response;

    const data = await getCustomerModulesCenter(supabase);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Modules center request failed";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[commercial-packages/modules]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(supabase, "modules.manage");
    if (!permission.ok) return permission.response;

    const body = (await request.json()) as {
      module_key?: string;
      enabled?: boolean;
      status?: string;
    };

    if (!body.module_key) {
      return NextResponse.json({ error: "module_key required" }, { status: 400 });
    }

    const { error } = await supabase.rpc("update_tenant_module", {
      p_module_key: body.module_key,
      p_enabled: body.enabled ?? null,
      p_status: body.status ?? null,
    });
    if (error) throw new Error(error.message);

    const data = await getCustomerModulesCenter(supabase);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Module update failed";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[commercial-packages/modules]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
