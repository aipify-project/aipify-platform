import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  classifyAppPortalError,
  parseAppOrganizationContext,
  type AppOrganizationContext,
  type AppOrganizationContextState,
} from "./resolve-app-organization-context";

export function appPortalAccessDeniedResponse(
  state: AppOrganizationContextState,
  message?: string
) {
  return NextResponse.json(
    {
      error: message ?? state,
      access_state: state,
      found: false,
    },
    { status: state === "unauthenticated" ? 401 : 403 }
  );
}

export async function requireReadyAppPortalContext(
  supabase: SupabaseClient
): Promise<
  | { ok: true; context: AppOrganizationContext }
  | { ok: false; response: NextResponse }
> {
  const { data, error } = await supabase.rpc("get_app_organization_context");
  if (error) {
    return {
      ok: false,
      response: appPortalAccessDeniedResponse(
        classifyAppPortalError(error.message),
        error.message
      ),
    };
  }

  const context = parseAppOrganizationContext(data);
  if (context.state !== "ready") {
    return {
      ok: false,
      response: appPortalAccessDeniedResponse(context.state, context.state),
    };
  }

  return { ok: true, context };
}
