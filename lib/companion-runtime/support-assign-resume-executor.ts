import type { SupabaseClient } from "@supabase/supabase-js";
import {
  resolveSupportApprovalResume,
  type SupportApprovalResumeResult,
} from "@/lib/companion-runtime/support-approval-resume-resolver";

export const SUPPORT_ASSIGN_EXECUTE_RPC = "execute_companion_support_assign_write" as const;

const NIL_UUID = "00000000-0000-0000-0000-000000000000";
const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type SupportAssignResumeExecutorInput = {
  action_request_id: string;
};

export type SupportAssignResumeExecutorOutcome =
  | "executed"
  | "already_consumed"
  | "pending"
  | "rejected"
  | "expired"
  | "failed"
  | "not_found"
  | "verification_failed";

export type SupportAssignResumeExecutorResult = {
  outcome: SupportAssignResumeExecutorOutcome;
  action_request_id: string | null;
  receipt_id: string | null;
  idempotent_replay: boolean;
};

export type SupportAssignExecuteRpcCaller = (
  actionRequestId: string,
) => Promise<{ data: unknown; error: { message: string } | null }>;

export type SupportAssignResumeExecutorDeps = {
  resolve_approval_resume?: (actionRequestId: string) => Promise<SupportApprovalResumeResult>;
  execute_support_assign_write?: SupportAssignExecuteRpcCaller;
};

function normalizeActionRequestId(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

function normalizeReceiptId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed || !UUID_REGEX.test(trimmed) || trimmed.toLowerCase() === NIL_UUID) {
    return null;
  }

  return trimmed;
}

function executorResult(input: {
  outcome: SupportAssignResumeExecutorOutcome;
  action_request_id: string | null;
  receipt_id?: string | null;
  idempotent_replay?: boolean;
}): SupportAssignResumeExecutorResult {
  return {
    outcome: input.outcome,
    action_request_id: input.action_request_id,
    receipt_id: input.receipt_id ?? null,
    idempotent_replay: input.idempotent_replay ?? false,
  };
}

function bindMatchingActionRequestId(
  expectedId: string,
  rowValue: unknown,
): string | null {
  if (rowValue === undefined) {
    return expectedId;
  }

  if (typeof rowValue !== "string") {
    return null;
  }

  const normalized = normalizeActionRequestId(rowValue);
  if (!normalized || normalized !== expectedId) {
    return null;
  }

  return normalized;
}

function bindResolverActionRequestId(
  expectedId: string,
  candidate: string | null,
): string | null {
  if (candidate === null) {
    return null;
  }

  const normalized = normalizeActionRequestId(candidate);
  if (!normalized || normalized !== expectedId) {
    return null;
  }

  return normalized;
}

function verificationFailed(actionRequestId: string | null): SupportAssignResumeExecutorResult {
  return executorResult({
    outcome: "verification_failed",
    action_request_id: actionRequestId,
  });
}

function mapResolverOutcome(
  expectedId: string,
  resolution: SupportApprovalResumeResult,
): SupportAssignResumeExecutorResult | "approved" {
  switch (resolution.outcome) {
    case "approved": {
      const boundId = bindResolverActionRequestId(expectedId, resolution.action_request_id);
      if (!boundId) {
        return verificationFailed(expectedId);
      }

      return "approved";
    }
    case "already_consumed": {
      const boundId = bindResolverActionRequestId(expectedId, resolution.action_request_id);
      const receiptId = normalizeReceiptId(resolution.receipt_id);
      if (!boundId || !receiptId) {
        return verificationFailed(expectedId);
      }

      return executorResult({
        outcome: "already_consumed",
        action_request_id: boundId,
        receipt_id: receiptId,
        idempotent_replay: true,
      });
    }
    case "pending":
    case "rejected":
    case "expired":
    case "failed": {
      const boundId = bindResolverActionRequestId(expectedId, resolution.action_request_id);
      if (!boundId) {
        return verificationFailed(expectedId);
      }

      return executorResult({
        outcome: resolution.outcome,
        action_request_id: boundId,
      });
    }
    case "not_found":
      return executorResult({
        outcome: "not_found",
        action_request_id: null,
      });
    case "verification_failed":
      return verificationFailed(resolution.action_request_id);
    default:
      return verificationFailed(null);
  }
}

function mapExecuteRpcOutcome(input: {
  actionRequestId: string;
  data: unknown;
}): SupportAssignResumeExecutorResult {
  if (!input.data || typeof input.data !== "object") {
    return verificationFailed(input.actionRequestId);
  }

  const row = input.data as Record<string, unknown>;
  const outcomeCode =
    typeof row.outcome_code === "string" && row.outcome_code.length > 0
      ? row.outcome_code
      : null;

  if (row.success === true) {
    const boundActionRequestId = bindMatchingActionRequestId(
      input.actionRequestId,
      row.action_request_id,
    );
    const receiptId = normalizeReceiptId(row.receipt_id);
    if (!boundActionRequestId || !receiptId) {
      return verificationFailed(input.actionRequestId);
    }

    if (row.idempotent_replay === true) {
      return executorResult({
        outcome: "already_consumed",
        action_request_id: boundActionRequestId,
        receipt_id: receiptId,
        idempotent_replay: true,
      });
    }

    return executorResult({
      outcome: "executed",
      action_request_id: boundActionRequestId,
      receipt_id: receiptId,
      idempotent_replay: false,
    });
  }

  switch (outcomeCode) {
    case "NOT_FOUND":
      return executorResult({
        outcome: "not_found",
        action_request_id: null,
      });
    case "APPROVAL_EXPIRED":
      return executorResult({
        outcome: "expired",
        action_request_id: input.actionRequestId,
      });
    case "WRITE_FAILED":
      return executorResult({
        outcome: "failed",
        action_request_id: input.actionRequestId,
      });
    case "APPROVAL_INVALID":
      return verificationFailed(input.actionRequestId);
    default:
      return verificationFailed(input.actionRequestId);
  }
}

export async function executeSupportAssignResume(
  supabase: SupabaseClient,
  input: SupportAssignResumeExecutorInput,
  deps: SupportAssignResumeExecutorDeps = {},
): Promise<SupportAssignResumeExecutorResult> {
  const actionRequestId = normalizeActionRequestId(input.action_request_id);
  if (!actionRequestId) {
    return verificationFailed(null);
  }

  const resolveResume =
    deps.resolve_approval_resume ??
    ((requestId: string) =>
      resolveSupportApprovalResume(supabase, { action_request_id: requestId }));

  const resolution = await resolveResume(actionRequestId);
  const mapped = mapResolverOutcome(actionRequestId, resolution);

  if (mapped !== "approved") {
    return mapped;
  }

  const executeWrite =
    deps.execute_support_assign_write ??
    (async (requestId: string) => {
      const result = await supabase.rpc(SUPPORT_ASSIGN_EXECUTE_RPC, {
        p_action_request_id: requestId,
      });

      return {
        data: result.data,
        error: result.error ? { message: result.error.message } : null,
      };
    });

  const { data, error } = await executeWrite(actionRequestId);

  if (error) {
    return verificationFailed(null);
  }

  return mapExecuteRpcOutcome({ actionRequestId, data });
}
