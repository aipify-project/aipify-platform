import { NextResponse } from "next/server";
import { parseQualitySettings } from "@/lib/aipify/quality/parse";
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

    const { data, error } = await supabase.rpc("get_quality_settings");
    if (error) {
      const message = error.message;
      const access_state = isDatabaseExecutionError(message)
        ? "database_execution_error"
        : classifyAppPortalError(message);
      console.error("[aipify/quality/settings]", message);
      return NextResponse.json(
        { error: message, access_state, found: false },
        { status: rpcErrorStatus(message, access_state) }
      );
    }

    const raw = data as Record<string, unknown>;
    if (raw.has_access === false) {
      const access_state = String(raw.access_state ?? "entitlement_missing");
      return NextResponse.json(
        {
          ...raw,
          access_state,
          found: false,
        },
        { status: access_state === "plan_required" || access_state === "entitlement_missing" ? 403 : 403 }
      );
    }

    const permission = await requireOrganizationViewPermission(
      supabase,
      "quality.view",
      "quality.manage"
    );
    if (!permission.ok) return permission.response;

    return NextResponse.json(parseQualitySettings(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load settings";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[aipify/quality/settings]", message);
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

    const permission = await requireOrganizationViewPermission(
      supabase,
      "quality.manage"
    );
    if (!permission.ok) return permission.response;

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_quality_settings", { p_patch: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseQualitySettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
