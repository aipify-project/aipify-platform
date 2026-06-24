import { NextResponse } from "next/server";
import { cancelOrganizationProviderAccessRequest } from "@/lib/organization-access-approval/center";
import {
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { id } = await context.params;
    const result = await cancelOrganizationProviderAccessRequest(supabase, id);
    return NextResponse.json({ request: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to cancel access request";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[app/organization-access/cancel]", message);
    return NextResponse.json(
      { error: message, access_state },
      { status: rpcErrorStatus(message, access_state) },
    );
  }
}
