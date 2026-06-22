import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  classifyAppPortalError,
  parseAppOrganizationContext,
  type AppOrganizationContext,
  type AppOrganizationContextState,
} from "./resolve-app-organization-context";

export function isDatabaseExecutionError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("read-only transaction") ||
    lower.includes("cannot execute insert") ||
    lower.includes("cannot execute update") ||
    lower.includes("cannot execute delete") ||
    lower.includes("insert is not allowed in a non-volatile function") ||
    lower.includes("update is not allowed in a non-volatile function") ||
    lower.includes("delete is not allowed in a non-volatile function") ||
    lower.includes("greatest types") ||
    lower.includes("pgrst202") ||
    lower.includes("could not find the function") ||
    lower.includes("could not find the function") ||
    (lower.includes("function") && lower.includes("does not exist")) ||
    (lower.includes("column") && lower.includes("does not exist"))
  );
}

/** Stable client-facing error code — never expose raw Postgres/PostgREST text. */
export function appPortalStableErrorCode(accessState: AppOrganizationContextState): string {
  switch (accessState) {
    case "permission_missing":
      return "permission_missing";
    case "organization_missing":
    case "membership_missing":
    case "user_not_provisioned":
      return "organization_context_required";
    case "subscription_inactive":
    case "license_inactive":
      return "subscription_inactive";
    case "entitlement_missing":
      return "entitlement_missing";
    case "unauthenticated":
      return "unauthenticated";
    case "database_execution_error":
      return "load_error";
    default:
      return "access_denied";
  }
}

export function rpcErrorStatus(message: string, accessState: string): number {
  if (isDatabaseExecutionError(message)) return 500;
  const lower = message.toLowerCase();
  if (lower.includes("pgrst202") || lower.includes("could not find the function")) {
    return 503;
  }
  if (accessState === "unauthenticated") return 401;
  if (accessState === "subscription_inactive" || accessState === "license_inactive") return 402;
  if (accessState === "organization_missing" || accessState === "membership_missing") return 409;
  if (accessState === "entitlement_missing") return 403;
  if (accessState === "permission_missing") return 403;
  if (accessState === "database_execution_error") return 500;
  return 403;
}

export async function requireOrganizationViewPermission(
  supabase: SupabaseClient,
  viewKey: string,
  manageKey?: string
): Promise<{ ok: true } | { ok: false; response: NextResponse }> {
  const { data: hasView, error: viewError } = await supabase.rpc("has_organization_permission", {
    p_permission_key: viewKey,
  });
  if (viewError) {
    const access_state = classifyAppPortalError(viewError.message);
    return {
      ok: false,
      response: NextResponse.json(
        {
          error: appPortalStableErrorCode(access_state),
          access_state,
          found: false,
        },
        { status: rpcErrorStatus(viewError.message, access_state) }
      ),
    };
  }
  if (hasView) return { ok: true };

  if (manageKey) {
    const { data: canManage, error: manageError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: manageKey }
    );
    if (manageError) {
      const access_state = classifyAppPortalError(manageError.message);
      return {
        ok: false,
        response: NextResponse.json(
          {
            error: appPortalStableErrorCode(access_state),
            access_state,
            found: false,
          },
          { status: rpcErrorStatus(manageError.message, access_state) }
        ),
      };
    }
    if (canManage) return { ok: true };
  }

  return {
    ok: false,
    response: appPortalAccessDeniedResponse("permission_missing", "permission_missing"),
  };
}

export function appPortalRpcErrorResponse(
  logTag: string,
  message: string
): NextResponse {
  const access_state = isDatabaseExecutionError(message)
    ? "database_execution_error"
    : classifyAppPortalError(message);
  console.error(logTag, message);
  return NextResponse.json(
    {
      error: appPortalStableErrorCode(access_state),
      access_state,
      found: false,
    },
    { status: rpcErrorStatus(message, access_state) }
  );
}

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
