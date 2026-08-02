import type { KompisWorkspaceSurface } from "./enums";
import type { KompisCustomerWorkspaceContract, KompisWorkspaceContext } from "./types";
import { resolveKompisWorkspacePermissions } from "./permissions";

const FORBIDDEN_CONTEXT_FIELDS = new Set([
  "dom",
  "inner_html",
  "private_message",
  "private_messages",
  "secret",
  "password",
  "token",
  "admin_hidden",
  "stack_trace",
]);

export type BuildKompisWorkspaceContextInput = {
  contract: KompisCustomerWorkspaceContract;
  tenant_id: string;
  surface: KompisWorkspaceSurface;
  route: string;
  module: string;
  entity_type?: string | null;
  entity_id?: string | null;
  user_role: string;
  access_tier: string;
  locale: string;
  current_status?: string | null;
  safe_summary: string;
  proposed_fields?: Record<string, unknown>;
  user_groups?: string[];
  context_version?: string;
};

export type BuildContextResult =
  | { ok: true; context: KompisWorkspaceContext }
  | { ok: false; code: string; message: string };

/**
 * Server-built minimal page context. Client has no authority over fields.
 * Never includes DOM, private messages, secrets, or hidden admin data.
 */
export function buildKompisWorkspaceContext(
  input: BuildKompisWorkspaceContextInput
): BuildContextResult {
  if (input.tenant_id !== input.contract.tenant_key) {
    return { ok: false, code: "tenant_mismatch", message: "Context tenant mismatch" };
  }

  const permissions = resolveKompisWorkspacePermissions({
    contract: input.contract,
    context: {
      surface: input.surface,
      route: input.route,
      module: input.module,
      user_role: input.user_role,
      access_tier: input.access_tier,
      entity_type: input.entity_type ?? null,
    },
    user_groups: input.user_groups,
  });

  if (!permissions.enabled) {
    return {
      ok: false,
      code: "context_denied",
      message: permissions.denied_reasons.join(",") || "Context denied",
    };
  }

  const allowedFields = permissions.allowed_context_fields.filter(
    (f) => !FORBIDDEN_CONTEXT_FIELDS.has(f)
  );

  if (input.proposed_fields) {
    for (const key of Object.keys(input.proposed_fields)) {
      if (FORBIDDEN_CONTEXT_FIELDS.has(key) || !allowedFields.includes(key)) {
        return { ok: false, code: "field_denied", message: `Context field not allowed: ${key}` };
      }
    }
  }

  const summary = input.safe_summary.trim().slice(0, 500);
  if (!summary) {
    return { ok: false, code: "summary_required", message: "safe_summary required" };
  }

  return {
    ok: true,
    context: {
      tenant_id: input.tenant_id,
      surface: input.surface,
      route: input.route,
      module: input.module,
      entity_type: input.entity_type ?? null,
      entity_id: input.entity_id ?? null,
      user_role: input.user_role,
      access_tier: input.access_tier,
      locale: input.locale,
      allowed_context_fields: allowedFields,
      allowed_tools: permissions.allowed_tools,
      current_status: input.current_status ?? null,
      safe_summary: summary,
      context_version: input.context_version ?? "1",
    },
  };
}
