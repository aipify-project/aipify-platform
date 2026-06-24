import { NextResponse } from "next/server";
import { grantOrganizationProviderAccessDirectly } from "@/lib/organization-access-approval/center";
import {
  resolveProviderAccessManifest,
  resolveScopesForCapability,
} from "@/lib/core/organization-access-approval/provider-scope-registry";
import {
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const body = (await request.json()) as {
      provider_key?: string;
      capability_key?: string | null;
      scope_keys?: string[];
      access_mode?: "one_time" | "ongoing";
      duration_hours?: number | null;
      reason_summary?: string;
      context_payload?: Record<string, unknown>;
      idempotency_key?: string | null;
    };

    const providerKey = body.provider_key?.trim();
    if (!providerKey) {
      return NextResponse.json({ error: "provider_key_required" }, { status: 400 });
    }

    const manifest = resolveProviderAccessManifest(providerKey);
    const scopeKeys =
      body.scope_keys && body.scope_keys.length > 0
        ? body.scope_keys
        : resolveScopesForCapability({
            provider_key: providerKey,
            capability_key: body.capability_key,
          });

    if (scopeKeys.length === 0) {
      return NextResponse.json({ error: "scope_keys_required" }, { status: 400 });
    }

    const defaultScope = manifest?.required_scopes[0];
    const result = await grantOrganizationProviderAccessDirectly(supabase, {
      provider_key: providerKey,
      capability_key: body.capability_key ?? null,
      scope_keys: scopeKeys,
      access_mode: body.access_mode ?? defaultScope?.default_access_mode ?? "one_time",
      duration_hours: body.duration_hours ?? defaultScope?.default_duration_hours ?? null,
      risk_level: defaultScope?.risk_level ?? 1,
      reason_summary: body.reason_summary ?? "",
      context_payload: body.context_payload ?? {},
      idempotency_key: body.idempotency_key ?? null,
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to grant access directly";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[app/organization-access/grant-direct]", message);
    return NextResponse.json(
      { error: message, access_state },
      { status: rpcErrorStatus(message, access_state) },
    );
  }
}
