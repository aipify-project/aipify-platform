import { NextResponse } from "next/server";
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

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const permission = await requireOrganizationViewPermission(
      supabase,
      "settings.view",
      "settings.manage"
    );
    if (!permission.ok) return permission.response;

    const { data, error } = await supabase.rpc("get_presence_notification_preferences");
    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load preferences";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[presence/preferences]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
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

    const permission = await requireOrganizationViewPermission(supabase, "settings.manage");
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
    });

    if (error) throw new Error(error.message);

    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update preferences";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[presence/preferences]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
