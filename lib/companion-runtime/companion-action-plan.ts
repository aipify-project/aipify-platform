import type { ActionLevel } from "@/lib/trust-action/levels";
import { aiExecutionProhibited, approvalRequiredForLevel } from "@/lib/trust-action/levels";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { CompanionActionDefinition } from "./companion-action-definition";
import { validateCompanionActionInput } from "./companion-action-definition";
import type { CompanionActionContext } from "./companion-action-context";
import {
  companionActionExecutionAllowedInPhase10,
  evaluateCompanionActionSafety,
  type CompanionActionBlockReason,
} from "./companion-action-governance";

export type CompanionActionPlanApprovalStatus =
  | "pending"
  | "approved"
  | "not_required"
  | "blocked"
  | "prohibited";

export type CompanionActionPlan = {
  action_id: string;
  requested_by: string | null;
  organization_id: string | null;
  validated_input: Record<string, unknown>;
  risk_level: ActionLevel;
  approval_status: CompanionActionPlanApprovalStatus;
  approval_required: boolean;
  reversible: boolean;
  warnings: string[];
  source_reference: string | null;
  created_at: string;
};

function mapBlockReasonToApprovalStatus(
  reason: CompanionActionBlockReason | null,
): CompanionActionPlanApprovalStatus {
  if (reason === "critical_prohibited" || reason === "policy_prohibited") return "prohibited";
  if (reason) return "blocked";
  return "not_required";
}

export type BuildCompanionActionPlanInput = {
  definition: CompanionActionDefinition;
  actionContext: CompanionActionContext;
  organizationId: string | null;
  requestedBy: string | null;
  rawInput?: Record<string, unknown>;
  connectedProviders?: string[];
  effectivePermissions?: string[];
};

export function buildCompanionActionPlan(input: BuildCompanionActionPlanInput): CompanionActionPlan {
  const validation = validateCompanionActionInput(
    input.definition,
    {
      action_id: input.definition.action_id,
      ...input.rawInput,
    },
  );

  const permission =
    !input.definition.required_permission ||
    (input.effectivePermissions ?? []).includes(input.definition.required_permission);

  const providerVerified =
    input.definition.source === "companion_policy" ||
    !input.definition.provider_key ||
    input.definition.provider_key === "schema" ||
    (input.connectedProviders ?? []).includes(input.definition.provider_key);

  const safety = evaluateCompanionActionSafety(input.definition, input.actionContext, {
    hasPermission: permission,
    schemaValid: validation.ok,
    providerVerified,
  });

  const warnings: string[] = [];
  if (!validation.ok) warnings.push("invalid_input");
  if (!permission) warnings.push("permission_denied");
  if (!providerVerified) warnings.push("provider_unverified");
  if (input.actionContext.emergency_state !== "normal") warnings.push("emergency_stop");
  if (input.actionContext.app_suspended) warnings.push("app_suspended");
  if (aiExecutionProhibited(input.definition.risk_level)) warnings.push("critical_prohibited");
  if (!input.definition.reversible) warnings.push("irreversible");

  let approvalStatus: CompanionActionPlanApprovalStatus = "not_required";
  if (safety.blocked) {
    approvalStatus = mapBlockReasonToApprovalStatus(safety.reason);
  } else if (input.definition.approval_required || approvalRequiredForLevel(input.definition.risk_level)) {
    approvalStatus = "pending";
  }

  return {
    action_id: input.definition.action_id,
    requested_by: input.requestedBy,
    organization_id: input.organizationId,
    validated_input: validation.ok ? validation.validated : { action_id: input.definition.action_id },
    risk_level: input.definition.risk_level,
    approval_status: approvalStatus,
    approval_required:
      input.definition.approval_required || approvalRequiredForLevel(input.definition.risk_level),
    reversible: input.definition.reversible,
    warnings,
    source_reference: input.actionContext.latest_audit_reference,
    created_at: new Date().toISOString(),
  };
}

export async function prepareCompanionActionApproval(
  supabase: SupabaseClient,
  plan: CompanionActionPlan,
  definition: CompanionActionDefinition,
  explanation: string,
): Promise<CompanionActionPlan> {
  if (companionActionExecutionAllowedInPhase10()) {
    return plan;
  }

  if (plan.approval_status !== "pending") {
    return plan;
  }

  const { data, error } = await supabase.rpc("create_action_request", {
    p_skill_key: "companion",
    p_action_name: definition.action_id,
    p_description: explanation.slice(0, 500),
    p_risk_level: Math.min(definition.risk_level, 3),
    p_resource_type: definition.entity,
    p_resource_id: String(plan.validated_input.target ?? definition.capability_id),
    p_explanation: explanation.slice(0, 500),
    p_confidence_score: 70,
    p_supporting_events: [
      {
        source: "companion_runtime",
        action_id: definition.action_id,
        idempotency_key: plan.validated_input.idempotency_key ?? null,
      },
    ],
    p_undo_available: definition.reversible,
  });

  if (error || !data) {
    return {
      ...plan,
      approval_status: "blocked",
      warnings: [...plan.warnings, "approval_create_failed"],
    };
  }

  return {
    ...plan,
    approval_status: "pending",
    source_reference: String(data),
  };
}
