import { NextResponse } from "next/server";
import { parseLearningEngineDashboard } from "@/lib/aipify/learning-engine/parse";
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
      "learning.view",
      "learning.manage"
    );
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("get_learning_engine_dashboard");
    if (error) {
      const message = error.message;
      const access_state = isDatabaseExecutionError(message)
        ? "database_execution_error"
        : classifyAppPortalError(message);
      console.error("[aipify/learning-engine/dashboard]", message);
      return NextResponse.json(
        { error: message, access_state, found: false },
        { status: rpcErrorStatus(message, access_state) }
      );
    }

    return NextResponse.json(parseLearningEngineDashboard(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load learning dashboard";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[aipify/learning-engine/dashboard]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
