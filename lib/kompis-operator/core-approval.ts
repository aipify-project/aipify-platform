import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildKompisCoreApprovalScope,
  toolRequiresCoreApproval,
  type KompisCoreApprovalScope,
} from "./core-approval-policy";

export type KompisCoreApprovalResult =
  | {
      ok: true;
      required: boolean;
      bindingId?: string;
      actionRequestId?: string;
      consumed?: boolean;
    }
  | {
      ok: false;
      errorCode:
        | "core_approval_required"
        | "core_approval_rejected"
        | "core_approval_expired"
        | "core_approval_cancelled"
        | "core_approval_already_used"
        | "scope_mismatch"
        | "stale_expected_version"
        | "core_approval_error";
      actionRequestId?: string | null;
    };

function mapCoreApprovalError(message: string | null | undefined): KompisCoreApprovalResult {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("CORE_APPROVAL_REJECTED")) {
    return { ok: false, errorCode: "core_approval_rejected" };
  }
  if (raw.includes("CORE_APPROVAL_EXPIRED")) {
    return { ok: false, errorCode: "core_approval_expired" };
  }
  if (raw.includes("CORE_APPROVAL_CANCELLED") || raw.includes("CORE_APPROVAL_CANCELED")) {
    return { ok: false, errorCode: "core_approval_cancelled" };
  }
  if (raw.includes("CORE_APPROVAL_ALREADY_USED")) {
    return { ok: false, errorCode: "core_approval_already_used" };
  }
  if (raw.includes("STALE_EXPECTED_VERSION")) {
    return { ok: false, errorCode: "stale_expected_version" };
  }
  if (raw.includes("SCOPE_MISMATCH")) {
    return { ok: false, errorCode: "scope_mismatch" };
  }
  if (raw.includes("CORE_APPROVAL_REQUIRED")) {
    return { ok: false, errorCode: "core_approval_required" };
  }
  return { ok: false, errorCode: "core_approval_error" };
}

export async function requestKompisCoreApproval(
  supabase: SupabaseClient,
  input: {
    runId: string;
    stepId?: string | null;
    toolKey: string;
    scope?: KompisCoreApprovalScope;
  },
): Promise<KompisCoreApprovalResult & { actionRequestId?: string | null }> {
  if (!toolRequiresCoreApproval(input.toolKey)) {
    return { ok: true, required: false };
  }
  const { data, error } = await supabase.rpc("request_kompis_operator_core_approval", {
    p_run_id: input.runId,
    p_step_id: input.stepId ?? null,
    p_tool_key: input.toolKey,
    p_scope: buildKompisCoreApprovalScope(input.scope ?? {}),
  });
  if (error) {
    return mapCoreApprovalError(error.message);
  }
  const row = (data ?? {}) as Record<string, unknown>;
  return {
    ok: true,
    required: true,
    bindingId: typeof row.id === "string" ? row.id : undefined,
    actionRequestId: typeof row.action_request_id === "string" ? row.action_request_id : undefined,
  };
}

export async function assertKompisCoreApprovalReady(
  supabase: SupabaseClient,
  input: {
    runId: string;
    stepId?: string | null;
    toolKey: string;
    scope?: KompisCoreApprovalScope;
  },
): Promise<KompisCoreApprovalResult> {
  if (!toolRequiresCoreApproval(input.toolKey)) {
    return { ok: true, required: false };
  }
  const { data, error } = await supabase.rpc("assert_kompis_operator_core_approval_ready", {
    p_run_id: input.runId,
    p_step_id: input.stepId ?? null,
    p_tool_key: input.toolKey,
    p_scope: buildKompisCoreApprovalScope(input.scope ?? {}),
  });
  if (error) {
    const mapped = mapCoreApprovalError(error.message);
    if (mapped.ok === false && mapped.errorCode === "core_approval_required") {
      const requested = await requestKompisCoreApproval(supabase, input);
      if (requested.ok === false) return requested;
      return {
        ok: false,
        errorCode: "core_approval_required",
        actionRequestId: requested.actionRequestId ?? null,
      };
    }
    return mapped;
  }
  const row = (data ?? {}) as Record<string, unknown>;
  return {
    ok: true,
    required: row.required === true,
    bindingId: typeof row.binding_id === "string" ? row.binding_id : undefined,
    actionRequestId: typeof row.action_request_id === "string" ? row.action_request_id : undefined,
  };
}

export async function consumeKompisCoreApproval(
  supabase: SupabaseClient,
  input: {
    runId: string;
    stepId?: string | null;
    toolKey: string;
    scope?: KompisCoreApprovalScope;
  },
): Promise<KompisCoreApprovalResult> {
  if (!toolRequiresCoreApproval(input.toolKey)) {
    return { ok: true, required: false };
  }
  const { data, error } = await supabase.rpc("consume_kompis_operator_core_approval", {
    p_run_id: input.runId,
    p_step_id: input.stepId ?? null,
    p_tool_key: input.toolKey,
    p_scope: buildKompisCoreApprovalScope(input.scope ?? {}),
  });
  if (error) {
    return mapCoreApprovalError(error.message);
  }
  const row = (data ?? {}) as Record<string, unknown>;
  return {
    ok: true,
    required: true,
    consumed: row.consumed === true,
    bindingId: typeof row.binding_id === "string" ? row.binding_id : undefined,
    actionRequestId: typeof row.action_request_id === "string" ? row.action_request_id : undefined,
  };
}
