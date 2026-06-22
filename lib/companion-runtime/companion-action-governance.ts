import { aiExecutionProhibited } from "@/lib/trust-action/levels";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { isIrreversibleAction } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";

export type CompanionActionBlockReason =
  | "critical_prohibited"
  | "irreversible_blocked"
  | "permission_denied"
  | "entitlement_blocked"
  | "emergency_stop"
  | "missing_policy"
  | "policy_prohibited"
  | "provider_unverified"
  | "schema_validation"
  | "write_boundary";

export function companionActionExecutionAllowedInPhase10(): boolean {
  return false;
}

export function evaluateCompanionActionSafety(
  definition: CompanionActionDefinition,
  actionContext: CompanionActionContext,
  options?: { hasPermission?: boolean; schemaValid?: boolean; providerVerified?: boolean },
): { allowed: boolean; blocked: boolean; reason: CompanionActionBlockReason | null } {
  if (aiExecutionProhibited(definition.risk_level)) {
    return { allowed: false, blocked: true, reason: "critical_prohibited" };
  }

  if (isIrreversibleAction(definition) && definition.risk_level >= 3) {
    return { allowed: false, blocked: true, reason: "irreversible_blocked" };
  }

  if (actionContext.app_suspended) {
    return { allowed: false, blocked: true, reason: "entitlement_blocked" };
  }

  if (
    actionContext.emergency_state === "paused" ||
    actionContext.emergency_state === "emergency_shutdown"
  ) {
    return { allowed: false, blocked: true, reason: "emergency_stop" };
  }

  if (actionContext.missing_policy && definition.source === "companion_policy") {
    return { allowed: false, blocked: true, reason: "missing_policy" };
  }

  if (!definition.enabled) {
    if (definition.risk_level >= 4) {
      return { allowed: false, blocked: true, reason: "policy_prohibited" };
    }
    if (options?.hasPermission === false) {
      return { allowed: false, blocked: true, reason: "permission_denied" };
    }
    return { allowed: false, blocked: true, reason: "write_boundary" };
  }

  if (options?.hasPermission === false) {
    return { allowed: false, blocked: true, reason: "permission_denied" };
  }

  if (options?.schemaValid === false) {
    return { allowed: false, blocked: true, reason: "schema_validation" };
  }

  if (options?.providerVerified === false) {
    return { allowed: false, blocked: true, reason: "provider_unverified" };
  }

  return { allowed: true, blocked: false, reason: null };
}

export function shouldAutoExecuteCompanionAction(): boolean {
  return false;
}

export function secretsAllowedInActionPayload(): boolean {
  return false;
}
