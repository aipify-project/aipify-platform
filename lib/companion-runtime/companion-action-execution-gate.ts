import type { CompanionActionDefinition } from "./companion-action-definition";
import { isIrreversibleAction } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";
import type { CompanionApprovedActionRecord } from "./companion-action-approval-resolver";
import { isApprovalExpired } from "./companion-action-approval-resolver";
import {
  hasDuplicateIdempotencyKey,
  isValidIdempotencyKey,
} from "./companion-action-idempotency";
import { getExecutionAdapter } from "@/lib/aipify/execution/adapters";
import type { CompanionActionPlan } from "./companion-action-plan";

export type CompanionExecutionGateReason =
  | "app_suspended"
  | "entitlement_blocked"
  | "provider_unverified"
  | "capability_disabled"
  | "schema_validation"
  | "permission_denied"
  | "missing_policy"
  | "approval_missing"
  | "approval_expired"
  | "idempotency_invalid"
  | "duplicate_idempotency"
  | "irreversible_blocked"
  | "risk_too_high"
  | "forbidden_action"
  | "missing_adapter"
  | "emergency_stop"
  | "execution_disabled"
  | "blocked";

export type CompanionExecutionGateResult =
  | { allowed: true }
  | { allowed: false; reason: CompanionExecutionGateReason };

const FORBIDDEN_ACTION_PATTERN =
  /payment|bank|transfer|delete_user|change_permission|legal|refund|approve_payment/i;

const PHASE11_MAX_RISK_LEVEL = 2;

export function isPhase11ForbiddenAction(actionId: string): boolean {
  return FORBIDDEN_ACTION_PATTERN.test(actionId);
}

export function resolveWriteAdapterKey(actionId: string): string | null {
  const direct = getExecutionAdapter(actionId);
  if (direct) return actionId;

  const shortKey = actionId.split(".").pop() ?? actionId;
  if (getExecutionAdapter(shortKey)) return shortKey;

  return null;
}

export function evaluateCompanionExecutionGate(input: {
  definition: CompanionActionDefinition;
  plan: CompanionActionPlan;
  actionContext: CompanionActionContext;
  approvedRecord: CompanionApprovedActionRecord | null;
  hasPermission: boolean;
  schemaValid: boolean;
  providerVerified: boolean;
  executeIntent: boolean;
}): CompanionExecutionGateResult {
  if (!input.executeIntent) {
    return { allowed: false, reason: "blocked" };
  }

  if (input.actionContext.app_suspended) {
    return { allowed: false, reason: "app_suspended" };
  }

  if (!input.actionContext.execution_enabled || input.actionContext.automation_disabled) {
    return { allowed: false, reason: "execution_disabled" };
  }

  if (
    input.actionContext.emergency_state === "paused" ||
    input.actionContext.emergency_state === "emergency_shutdown"
  ) {
    return { allowed: false, reason: "emergency_stop" };
  }

  if (isPhase11ForbiddenAction(input.definition.action_id)) {
    return { allowed: false, reason: "forbidden_action" };
  }

  if (!input.definition.enabled) {
    return { allowed: false, reason: "capability_disabled" };
  }

  if (!input.hasPermission) {
    return { allowed: false, reason: "permission_denied" };
  }

  if (!input.schemaValid) {
    return { allowed: false, reason: "schema_validation" };
  }

  if (!input.providerVerified) {
    return { allowed: false, reason: "provider_unverified" };
  }

  if (input.actionContext.missing_policy && input.definition.source === "companion_policy") {
    return { allowed: false, reason: "missing_policy" };
  }

  if (input.definition.risk_level > PHASE11_MAX_RISK_LEVEL) {
    return { allowed: false, reason: "risk_too_high" };
  }

  if (!input.definition.reversible || isIrreversibleAction(input.definition)) {
    return { allowed: false, reason: "irreversible_blocked" };
  }

  if (!resolveWriteAdapterKey(input.definition.action_id)) {
    return { allowed: false, reason: "missing_adapter" };
  }

  const idempotencyKey = input.plan.validated_input.idempotency_key;
  if (idempotencyKey != null && idempotencyKey !== "" && !isValidIdempotencyKey(idempotencyKey)) {
    return { allowed: false, reason: "idempotency_invalid" };
  }

  if (
    hasDuplicateIdempotencyKey(
      input.plan.organization_id,
      typeof idempotencyKey === "string" ? idempotencyKey : null,
    )
  ) {
    return { allowed: false, reason: "duplicate_idempotency" };
  }

  const requiresExplicitApproval = input.definition.approval_required;

  if (requiresExplicitApproval) {
    if (!input.approvedRecord) {
      return { allowed: false, reason: "approval_missing" };
    }
    if (isApprovalExpired(input.approvedRecord)) {
      return { allowed: false, reason: "approval_expired" };
    }
    if (input.approvedRecord.status !== "approved" && input.plan.approval_status !== "approved") {
      return { allowed: false, reason: "approval_missing" };
    }
  }

  if (input.plan.approval_status === "blocked" || input.plan.approval_status === "prohibited") {
    return { allowed: false, reason: "blocked" };
  }

  return { allowed: true };
}

export function hasCompanionExecutionIntent(query: string): boolean {
  return /\b(execute|run|perform|carry out|utfør|kjør|genomför|udfør|ejecutar|wykonaj|виконай)\b/i.test(
    query,
  );
}
