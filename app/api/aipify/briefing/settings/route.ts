import { NextResponse } from "next/server";
import { parseBriefingSettings } from "@/lib/aipify/briefing/parse";
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

    const { data, error } = await supabase.rpc("get_briefing_settings");
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/briefing/settings]", error.message);
    }
    return NextResponse.json(parseBriefingSettings(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load settings";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_briefing_settings", { p_patch: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBriefingSettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
