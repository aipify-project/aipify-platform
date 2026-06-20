import { NextResponse } from "next/server";
import { parseCapabilityCenter } from "@/lib/app-portal/capability-center";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data, error } = await supabase.rpc("get_app_portal_capability_center");
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/capability-center]", error.message);
    }
    return NextResponse.json(parseCapabilityCenter(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load capability center";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
