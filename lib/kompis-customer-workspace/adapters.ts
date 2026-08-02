import type { SupabaseClient } from "@supabase/supabase-js";
import { evaluateKompisConfirmationGate } from "./confirmation";
import { getKompisWorkspaceToolDefinition } from "./tool-registry";
import type { KompisConfirmationCard, KompisWorkspacePermissions } from "./types";

export type KompisAdapterContext = {
  supabase: SupabaseClient;
  permissions: KompisWorkspacePermissions;
  sessionId: string | null;
  organizationId: string;
  organizationName: string;
  userRole: string;
  locale: string;
  route: string;
};

export type KompisAdapterResult =
  | {
      ok: true;
      kind: "read" | "draft" | "confirmation_required" | "executed";
      tool_key: string;
      title: string;
      body: string;
      source?: string;
      draft_id?: string;
      confirmation?: KompisConfirmationCard;
      receipt?: Record<string, unknown>;
      executed: boolean;
    }
  | { ok: false; code: string; message: string };

function assertToolAllowed(
  permissions: KompisWorkspacePermissions,
  toolKey: string
): { ok: true } | { ok: false; code: string; message: string } {
  if (!permissions.enabled) {
    return { ok: false, code: "workspace_disabled", message: "Workspace assistant is not enabled" };
  }
  if (!permissions.allowed_tools.includes(toolKey)) {
    return { ok: false, code: "tool_denied", message: "Tool is not allowed for this user" };
  }
  const def = getKompisWorkspaceToolDefinition(toolKey);
  if (!def || !def.enabled || def.deprecated) {
    return { ok: false, code: "tool_unavailable", message: "Tool is unavailable" };
  }
  return { ok: true };
}

/** READ — tenant-bound organization access summary. No mutation. */
export async function executeKompisReadAccessStatus(
  ctx: KompisAdapterContext
): Promise<KompisAdapterResult> {
  const toolKey = "get_my_access_status";
  const allowed = assertToolAllowed(ctx.permissions, toolKey);
  if (!allowed.ok) return allowed;

  const { error } = await ctx.supabase.rpc("record_kompis_customer_workspace_tool_invocation", {
    p_session_id: ctx.sessionId,
    p_tool_key: toolKey,
    p_confirmation_level: "none",
    p_confirmation_id: null,
    p_outcome: "read_ok",
    p_denied_reason: null,
    p_metadata: {
      organization_id: ctx.organizationId,
      route: ctx.route,
    },
  });
  if (error) {
    return { ok: false, code: "audit_failed", message: error.message };
  }

  return {
    ok: true,
    kind: "read",
    tool_key: toolKey,
    title: "Access status",
    body: [
      `Organization: ${ctx.organizationName}`,
      `Role: ${ctx.userRole}`,
      `Locale: ${ctx.locale}`,
      `Route: ${ctx.route}`,
    ].join("\n"),
    source: "app_organization_context",
    executed: false,
  };
}

/** DRAFT — persists a customer-editable draft. Never executes a privileged action. */
export async function executeKompisCreateDraft(
  ctx: KompisAdapterContext,
  input: { title: string; body: string }
): Promise<KompisAdapterResult> {
  const toolKey = "create_draft";
  const allowed = assertToolAllowed(ctx.permissions, toolKey);
  if (!allowed.ok) return allowed;

  const title = input.title.trim().slice(0, 200);
  const body = input.body.trim().slice(0, 8000);
  if (!title || !body) {
    return { ok: false, code: "invalid_draft", message: "Draft title and body are required" };
  }

  const { data, error } = await ctx.supabase.rpc("create_kompis_customer_workspace_draft", {
    p_session_id: ctx.sessionId,
    p_tool_key: toolKey,
    p_title: title,
    p_body: body,
    p_metadata: { route: ctx.route, organization_id: ctx.organizationId },
  });
  if (error) {
    return { ok: false, code: "draft_failed", message: error.message };
  }

  const row = (data ?? {}) as { draft_id?: string; title?: string; body?: string };
  return {
    ok: true,
    kind: "draft",
    tool_key: toolKey,
    title: row.title ?? title,
    body: row.body ?? body,
    draft_id: row.draft_id,
    source: "kompis_customer_workspace_drafts",
    executed: false,
  };
}

/**
 * CONFIRMATION ACTION — create a pending confirmation for update_preference.
 * Does not execute until confirmKompisPrivilegedAction.
 */
export async function proposeKompisUpdatePreference(
  ctx: KompisAdapterContext,
  input: { preference_key: string; preference_value: string; idempotency_key?: string }
): Promise<KompisAdapterResult> {
  const toolKey = "update_preference";
  const allowed = assertToolAllowed(ctx.permissions, toolKey);
  if (!allowed.ok) return allowed;

  const preferenceKey = input.preference_key.trim().slice(0, 64) || "workspace_assist";
  const preferenceValue = input.preference_value.trim().slice(0, 128) || "enabled";
  const summary = `Update preference “${preferenceKey}” to “${preferenceValue}”.`;
  const consequences = [
    "This changes your workspace assistant preference for this organization.",
    "You can change it again later from Kompis admin controls.",
  ];

  const gate = evaluateKompisConfirmationGate({
    tool_key: toolKey,
    permissions: ctx.permissions,
    summary,
    consequences,
  });
  if (!gate.ok) {
    return { ok: false, code: gate.code, message: gate.message };
  }
  if (gate.level === "none") {
    return { ok: false, code: "confirmation_required", message: "Privileged actions require confirmation" };
  }

  const card = gate.card;
  const { data, error } = await ctx.supabase.rpc("create_kompis_customer_workspace_confirmation", {
    p_session_id: ctx.sessionId,
    p_confirmation_id: card.confirmation_id,
    p_tool_key: toolKey,
    p_summary: card.summary,
    p_consequences: card.consequences,
    p_level: card.level,
    p_payload: {
      preference_key: preferenceKey,
      preference_value: preferenceValue,
    },
    p_expires_at: card.expires_at,
    p_idempotency_key: input.idempotency_key ?? null,
  });
  if (error) {
    return { ok: false, code: "confirmation_create_failed", message: error.message };
  }

  const created = (data ?? {}) as { confirmation_id?: string; expires_at?: string };
  return {
    ok: true,
    kind: "confirmation_required",
    tool_key: toolKey,
    title: "Confirm preference update",
    body: summary,
    confirmation: {
      ...card,
      confirmation_id: created.confirmation_id ?? card.confirmation_id,
      expires_at: created.expires_at ?? card.expires_at,
    },
    executed: false,
  };
}

/** Execute a previously confirmed privileged action (server-validated). */
export async function confirmKompisPrivilegedAction(
  ctx: KompisAdapterContext,
  confirmationId: string,
  idempotencyKey?: string
): Promise<KompisAdapterResult> {
  const { data, error } = await ctx.supabase.rpc("confirm_kompis_customer_workspace_action", {
    p_confirmation_id: confirmationId,
    p_idempotency_key: idempotencyKey ?? null,
  });
  if (error) {
    const msg = error.message || "Confirmation failed";
    if (/expired/i.test(msg)) {
      return { ok: false, code: "stale_confirmation", message: msg };
    }
    return { ok: false, code: "confirm_failed", message: msg };
  }

  const row = (data ?? {}) as {
    confirmation_id?: string;
    executed?: boolean;
    receipt?: Record<string, unknown>;
    duplicate?: boolean;
  };

  return {
    ok: true,
    kind: "executed",
    tool_key: "update_preference",
    title: "Preference updated",
    body: row.duplicate
      ? "This confirmation was already completed."
      : "Your preference was updated successfully.",
    receipt: row.receipt,
    executed: row.executed === true,
  };
}
