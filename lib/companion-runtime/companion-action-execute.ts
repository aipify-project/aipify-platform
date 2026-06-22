import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import type { CompanionActionDefinition } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";
import type { CompanionApprovedActionRecord } from "./companion-action-approval-resolver";
import {
  findApprovedActionRecord,
  isApprovalExpired,
} from "./companion-action-approval-resolver";
import type { CompanionActionPlan } from "./companion-action-plan";
import { dispatchCompanionWriteAction } from "./companion-action-dispatch";
import {
  evaluateCompanionExecutionGate,
  hasCompanionExecutionIntent,
} from "./companion-action-execution-gate";
import {
  createEmptyCompanionActionExecutionResult,
  type CompanionActionExecutionResult,
} from "./companion-action-execution-result";
import {
  getIdempotentExecutionId,
  recordIdempotentExecution,
} from "./companion-action-idempotency";

export type ExecuteCompanionActionInput = {
  query: string;
  definition: CompanionActionDefinition;
  plan: CompanionActionPlan;
  actionContext: CompanionActionContext;
  hasPermission: boolean;
  schemaValid: boolean;
  providerVerified: boolean;
  supabase?: SupabaseClient | null;
};

function resolveApprovedRecord(
  definition: CompanionActionDefinition,
  plan: CompanionActionPlan,
  actionContext: CompanionActionContext,
): CompanionApprovedActionRecord | null {
  if (plan.source_reference) {
    const byRequest = actionContext.approved_records.find(
      (record) => record.request_id === plan.source_reference,
    );
    if (byRequest) return byRequest;
  }
  return findApprovedActionRecord(definition.action_id, actionContext.approved_records);
}

async function recordExecutionAudit(
  supabase: SupabaseClient | null | undefined,
  requestId: string | null,
  eventType: string,
  details: Record<string, unknown>,
): Promise<string | null> {
  if (!supabase || !requestId) return null;

  const { error } = await supabase.rpc("log_action_audit", {
    p_action_request_id: requestId,
    p_event_type: eventType,
    p_performed_by: "companion_runtime",
    p_details: details,
  });

  if (error) return null;
  return requestId;
}

export async function executeCompanionAction(
  input: ExecuteCompanionActionInput,
): Promise<CompanionActionExecutionResult> {
  const executeIntent = hasCompanionExecutionIntent(input.query);
  const approvedRecord = resolveApprovedRecord(
    input.definition,
    input.plan,
    input.actionContext,
  );

  const gate = evaluateCompanionExecutionGate({
    definition: input.definition,
    plan: input.plan,
    actionContext: input.actionContext,
    approvedRecord,
    hasPermission: input.hasPermission,
    schemaValid: input.schemaValid,
    providerVerified: input.providerVerified,
    executeIntent,
  });

  if (!gate.allowed) {
    return createEmptyCompanionActionExecutionResult({
      execution_id: randomUUID(),
      action_id: input.definition.action_id,
      capability_id: input.definition.capability_id,
      provider_key: input.definition.provider_key,
      status: gate.reason === "approval_missing" ? "awaiting_approval" : "blocked",
      reversible: input.definition.reversible,
      error_code: gate.reason,
      warnings: gate.reason ? [gate.reason] : [],
      source_reference: input.plan.source_reference,
    });
  }

  const idempotencyKey =
    typeof input.plan.validated_input.idempotency_key === "string"
      ? input.plan.validated_input.idempotency_key
      : null;

  if (idempotencyKey) {
    const existing = getIdempotentExecutionId(input.plan.organization_id, idempotencyKey);
    if (existing) {
      return createEmptyCompanionActionExecutionResult({
        execution_id: existing,
        action_id: input.definition.action_id,
        capability_id: input.definition.capability_id,
        provider_key: input.definition.provider_key,
        status: "blocked",
        completed_at: new Date().toISOString(),
        reversible: input.definition.reversible,
        error_code: "duplicate_idempotency",
        warnings: ["duplicate_idempotency"],
        source_reference: input.plan.source_reference,
      });
    }
  }

  if (approvedRecord && isApprovalExpired(approvedRecord)) {
    return createEmptyCompanionActionExecutionResult({
      execution_id: randomUUID(),
      action_id: input.definition.action_id,
      capability_id: input.definition.capability_id,
      provider_key: input.definition.provider_key,
      status: "blocked",
      error_code: "approval_expired",
      warnings: ["approval_expired"],
      source_reference: approvedRecord.request_id,
    });
  }

  const executionId = randomUUID();
  const startedAt = new Date().toISOString();

  const dispatch = dispatchCompanionWriteAction(
    input.definition,
    input.plan.validated_input,
  );

  if (!dispatch.ok) {
    await recordExecutionAudit(input.supabase, input.plan.source_reference, "failed", {
      action_id: input.definition.action_id,
      error_code: dispatch.code,
    });

    return createEmptyCompanionActionExecutionResult({
      execution_id: executionId,
      action_id: input.definition.action_id,
      capability_id: input.definition.capability_id,
      provider_key: input.definition.provider_key,
      status: "failed",
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      reversible: input.definition.reversible,
      rollback_available: false,
      error_code: dispatch.code,
      warnings: [dispatch.code],
      source_reference: input.plan.source_reference,
    });
  }

  const auditReference =
    (await recordExecutionAudit(input.supabase, input.plan.source_reference, "completed", {
      action_id: input.definition.action_id,
      execution_id: executionId,
      adapter_key: dispatch.adapter_key,
      partial: dispatch.partial,
    })) ?? executionId;

  if (idempotencyKey) {
    recordIdempotentExecution(input.plan.organization_id, idempotencyKey, executionId);
  }

  const status = dispatch.partial ? "partially_completed" : "completed";

  return createEmptyCompanionActionExecutionResult({
    execution_id: executionId,
    action_id: input.definition.action_id,
    capability_id: input.definition.capability_id,
    provider_key: input.definition.provider_key,
    status,
    started_at: startedAt,
    completed_at: new Date().toISOString(),
    result: dispatch.result,
    source_reference: input.plan.source_reference ?? approvedRecord?.request_id ?? null,
    audit_reference: auditReference,
    reversible: input.definition.reversible,
    rollback_available: dispatch.rollback_available,
    warnings: dispatch.warnings,
  });
}

export function shouldAttemptCompanionExecution(
  query: string,
  plan: CompanionActionPlan,
): boolean {
  if (!hasCompanionExecutionIntent(query)) return false;
  if (plan.approval_status === "prohibited" || plan.approval_status === "blocked") return false;
  return true;
}
