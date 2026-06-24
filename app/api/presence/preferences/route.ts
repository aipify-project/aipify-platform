import { NextResponse } from "next/server";
import {
  isDatabaseExecutionError,
  requireOrganizationViewPermission,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";
import {
  logPreferencesRouteDiagnostic,
  normalizePreferencesRpcPayload,
  summarizePreferencesRpcPayload,
} from "@/lib/app/notifications/preferences-route-diagnostics";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      logPreferencesRouteDiagnostic({
        phase: "auth_missing",
        httpStatus: 401,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: orgContextRaw } = await supabase.rpc("get_app_organization_context");
    const orgRecord =
      orgContextRaw && typeof orgContextRaw === "object"
        ? (orgContextRaw as Record<string, unknown>)
        : null;

    logPreferencesRouteDiagnostic({
      phase: "org_context",
      authUserId: user.id,
      organizationId:
        typeof orgRecord?.organization_id === "string" ? orgRecord.organization_id : null,
      customerId: typeof orgRecord?.customer_id === "string" ? orgRecord.customer_id : null,
      accessState: typeof orgRecord?.state === "string" ? orgRecord.state : null,
      hasCustomer: orgRecord?.has_customer === true,
    });

    // Match /api/presence/notifications: authenticated session + RPC (no portal gate).
    // Portal gates caused 403 while notification feed still loaded for the same session.
    const { data, error } = await supabase.rpc("get_presence_notification_preferences");
    if (error) {
      logPreferencesRouteDiagnostic({
        phase: "rpc_error",
        authUserId: user.id,
        rpcError: error.message,
        httpStatus: rpcErrorStatus(error.message, classifyAppPortalError(error.message)),
      });
      throw new Error(error.message);
    }

    const payload = normalizePreferencesRpcPayload(data);
    const summary = summarizePreferencesRpcPayload(payload);

    logPreferencesRouteDiagnostic({
      phase: "rpc_success",
      authUserId: user.id,
      httpStatus: 200,
      hasCustomer: summary.hasCustomer,
      hasPreferencesObject: summary.hasPreferencesObject,
      preferenceKeys: summary.preferenceKeys,
      parserAccepted: summary.parserAccepted,
    });

    return NextResponse.json(payload, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load preferences";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    const httpStatus = rpcErrorStatus(message, access_state);

    logPreferencesRouteDiagnostic({
      phase: "handler_error",
      rpcError: message,
      accessState: access_state,
      httpStatus,
    });

    console.error("[presence/preferences]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: httpStatus },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "settings.view",
      "settings.manage",
    );
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("update_presence_notification_preferences", {
      p_quiet_hours_mode: body.quiet_hours_mode ?? null,
      p_working_hours_start: body.working_hours_start ?? null,
      p_working_hours_end: body.working_hours_end ?? null,
      p_timezone: body.timezone ?? null,
      p_vacation_until: body.vacation_until ?? null,
      p_channel_in_app: body.channel_in_app ?? null,
      p_channel_desktop: body.channel_desktop ?? null,
      p_channel_email_digest: body.channel_email_digest ?? null,
      p_channel_mobile_push: body.channel_mobile_push ?? null,
      p_min_level_in_app: body.min_level_in_app ?? null,
      p_min_level_desktop: body.min_level_desktop ?? null,
      p_min_level_email: body.min_level_email ?? null,
      p_quiet_hours_enabled: body.quiet_hours_enabled ?? null,
      p_playful_moments_enabled: body.playful_moments_enabled ?? null,
      p_sound_enabled: body.sound_enabled ?? null,
      p_companion_replies_enabled: body.companion_replies_enabled ?? null,
      p_approvals_critical_enabled: body.approvals_critical_enabled ?? null,
    });

    if (error) throw new Error(error.message);

    const payload = normalizePreferencesRpcPayload(data);
    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update preferences";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[presence/preferences]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) },
    );
  }
}
