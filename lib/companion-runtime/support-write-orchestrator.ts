import { supportWriteOutcomeKey } from "@/lib/integration-intelligence/support/outcomes";
import {
  assertSupportReadAllowed,
  assertSupportTenantScope,
  canProposeSupportWrite,
  type SupportPermissionContext,
} from "@/lib/integration-intelligence/support/permissions";
import {
  resolveSupportDraftOutcome,
  resolveSupportWriteActionOutcome,
  supportWriteProposalRequiresApproval,
  type SupportProviderWriteContext,
  type SupportWriteExecutionResult,
} from "@/lib/integration-intelligence/support/action-outcomes";
import { isSupportCapabilityBlocked } from "@/lib/integration-intelligence/support/types";
import type {
  SupportCapabilityKey,
  SupportCaseSummary,
  SupportWriteOutcome,
  SupportWriteProposal,
  SupportWriteResult as SupportWriteResultBase,
} from "@/lib/integration-intelligence/support/types";
import { isSupportWriteSourceConnected } from "@/lib/integration-intelligence/providers/support-operations/support-source-map";
import {
  hasDuplicateIdempotencyKey,
  recordIdempotentExecution,
} from "./companion-action-idempotency";
import type {
  SupportAssignApprovalBridgeResult,
  SupportAssignApprovalRequest,
} from "./support-approval-bridge";
import { createSupportAuditEvent } from "./support-audit";

export type SupportWriteResult = SupportWriteResultBase & {
  action_request_id: string | null;
};

export type SupportWriteRequest = {
  capability_key: Extract<
    SupportCapabilityKey,
    "support_response.draft" | "support_case.assign" | "support_case.escalate"
  >;
  case_id: string;
  draft_text: string | null;
  assignee_reference: string | null;
  escalation_reason: string | null;
  grounded_sources: readonly string[];
  confirmed: boolean;
  approved: boolean;
  idempotency_key: string | null;
};

export type SupportCaseLookupResult = {
  found: boolean;
  case_summary: SupportCaseSummary | null;
};

function emptyWriteResult(
  outcome: SupportWriteOutcome,
  limitations: readonly string[] = [],
  caseId: string | null = null,
): SupportWriteResult {
  return {
    outcome,
    proposal: null,
    case_id: caseId,
    outcome_key: supportWriteOutcomeKey(outcome),
    audit_id: null,
    action_request_id: null,
    limitations,
  };
}

function isBulkWriteAttempt(caseId: string): boolean {
  return caseId.includes(",") || caseId.includes(";") || caseId.trim().length === 0;
}

function canExecuteCapability(
  capabilityKey: SupportWriteRequest["capability_key"],
  permission: SupportPermissionContext,
): boolean {
  if (capabilityKey === "support_case.assign") return permission.can_assign_case;
  if (capabilityKey === "support_case.escalate") return permission.can_escalate_case;
  return permission.can_draft_response;
}

function buildApprovalProposal(input: {
  request: SupportWriteRequest;
  provider_write: SupportProviderWriteContext;
  limitations: readonly string[];
}): SupportWriteProposal {
  return {
    proposal_id: `support-proposal-${Date.now()}`,
    capability_key: input.request.capability_key,
    case_id: input.request.case_id,
    draft_text: null,
    assignee_reference: input.request.assignee_reference,
    escalation_reason: input.request.escalation_reason,
    requires_confirmation: true,
    requires_approval: supportWriteProposalRequiresApproval({
      provider_write: input.provider_write,
    }),
    grounded_sources: input.request.grounded_sources,
    limitations: input.limitations,
  };
}

export async function executeSupportWrite(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: SupportPermissionContext;
  provider_key: string;
  provider_write: SupportProviderWriteContext;
  lookup_case?: (caseId: string) => Promise<SupportCaseLookupResult>;
  execute_write?: () => Promise<SupportWriteExecutionResult>;
  record_assign_approval?: (
    request: SupportAssignApprovalRequest,
  ) => Promise<SupportAssignApprovalBridgeResult>;
  request: SupportWriteRequest;
}): Promise<SupportWriteResult> {
  if (isSupportCapabilityBlocked(input.request.capability_key)) {
    return emptyWriteResult("blocked_by_policy");
  }

  if (isBulkWriteAttempt(input.request.case_id)) {
    return emptyWriteResult("blocked_by_policy", [
      "customerApp.companionPlatformKnowledge.support.blockedOperationLead",
    ]);
  }

  if (
    !assertSupportTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyWriteResult("permission_denied", ["Cross-tenant support writes are forbidden."]);
  }

  const block = assertSupportReadAllowed(input.permission);
  if (block) return emptyWriteResult(block);

  if (!canProposeSupportWrite(input.permission)) {
    return emptyWriteResult("permission_denied");
  }

  if (!canExecuteCapability(input.request.capability_key, input.permission)) {
    return emptyWriteResult("permission_denied");
  }

  if (input.request.capability_key === "support_response.draft") {
    const draftOutcome = resolveSupportDraftOutcome({
      draft_text: input.request.draft_text,
    });
    const limitations =
      input.request.grounded_sources.length === 0
        ? ["customerApp.companionPlatformKnowledge.support.warnings.draftWithoutSources"]
        : [];

    const proposal: SupportWriteProposal | null =
      draftOutcome === "draft_created"
        ? {
            proposal_id: `support-draft-${Date.now()}`,
            capability_key: "support_response.draft",
            case_id: input.request.case_id,
            draft_text: input.request.draft_text,
            assignee_reference: null,
            escalation_reason: null,
            requires_confirmation: true,
            requires_approval: true,
            grounded_sources: input.request.grounded_sources,
            limitations,
          }
        : null;

    const audit = createSupportAuditEvent({
      organization_id: input.organization_id,
      tenant_id: input.tenant_id,
      user_role: input.user_role,
      capability_key: input.request.capability_key,
      outcome: draftOutcome,
      case_id: input.request.case_id,
      provider_key: input.provider_key,
    });

    return {
      outcome: draftOutcome,
      proposal,
      case_id: input.request.case_id,
      outcome_key: supportWriteOutcomeKey(draftOutcome),
      audit_id: audit.audit_id,
      action_request_id: null,
      limitations,
    };
  }

  let caseSummary: SupportCaseSummary | null = null;
  if (input.lookup_case) {
    const lookup = await input.lookup_case(input.request.case_id);
    if (!lookup.found) {
      const audit = createSupportAuditEvent({
        organization_id: input.organization_id,
        tenant_id: input.tenant_id,
        user_role: input.user_role,
        capability_key: input.request.capability_key,
        outcome: "failed",
        case_id: input.request.case_id,
        provider_key: input.provider_key,
      });
      return {
        outcome: "failed",
        proposal: null,
        case_id: input.request.case_id,
        outcome_key: supportWriteOutcomeKey("failed"),
        audit_id: audit.audit_id,
        action_request_id: null,
        limitations: ["customerApp.companionPlatformKnowledge.support.outcomes.noMatch"],
      };
    }
    caseSummary = lookup.case_summary;
  }

  const writeSourceConnected = isSupportWriteSourceConnected(input.request.capability_key);
  const providerWrite: SupportProviderWriteContext = {
    write_source_available: writeSourceConnected && input.provider_write.write_source_available,
    requires_approval_before_execution: input.provider_write.requires_approval_before_execution,
  };

  if (
    input.request.capability_key === "support_case.assign" &&
    input.request.confirmed &&
    !input.request.approved &&
    supportWriteProposalRequiresApproval({ provider_write: providerWrite })
  ) {
    const limitations = [
      "customerApp.companionPlatformKnowledge.support.humanOversightRequired",
    ];
    const assigneeUserId = input.request.assignee_reference?.trim() ?? "";
    const idempotencyKey = input.request.idempotency_key?.trim() ?? "";

    const approvalResult = input.record_assign_approval
      ? await input.record_assign_approval({
          case_id: input.request.case_id,
          assignee_user_id: assigneeUserId,
          idempotency_key: idempotencyKey,
        })
      : null;

    if (!approvalResult?.success || !approvalResult.action_request_id) {
      const audit = createSupportAuditEvent({
        organization_id: input.organization_id,
        tenant_id: input.tenant_id,
        user_role: input.user_role,
        capability_key: input.request.capability_key,
        outcome: "failed",
        case_id: input.request.case_id,
        provider_key: input.provider_key,
        case_summary: caseSummary,
      });

      return {
        outcome: "failed",
        proposal: null,
        case_id: input.request.case_id,
        outcome_key: supportWriteOutcomeKey("failed"),
        audit_id: audit.audit_id,
        action_request_id: null,
        limitations: ["customerApp.companionPlatformKnowledge.support.outcomes.noMatch"],
      };
    }

    const audit = createSupportAuditEvent({
      organization_id: input.organization_id,
      tenant_id: input.tenant_id,
      user_role: input.user_role,
      capability_key: input.request.capability_key,
      outcome: "approval_required",
      case_id: input.request.case_id,
      provider_key: input.provider_key,
      case_summary: caseSummary,
    });

    return {
      outcome: "approval_required",
      proposal: buildApprovalProposal({
        request: input.request,
        provider_write: providerWrite,
        limitations,
      }),
      case_id: input.request.case_id,
      outcome_key: supportWriteOutcomeKey("approval_required"),
      audit_id: audit.audit_id,
      action_request_id: approvalResult.action_request_id,
      limitations,
    };
  }

  let executionResult: SupportWriteExecutionResult | null = null;
  const idempotencyKey = input.request.idempotency_key;

  if (
    input.request.confirmed &&
    input.request.approved &&
    providerWrite.write_source_available &&
    !providerWrite.requires_approval_before_execution &&
    idempotencyKey &&
    hasDuplicateIdempotencyKey(input.organization_id, idempotencyKey)
  ) {
    executionResult = {
      executed: true,
      failure_reason: null,
      idempotent_replay: true,
      verified_after_reread: true,
    };
  } else if (
    input.request.confirmed &&
    input.request.approved &&
    providerWrite.write_source_available &&
    !providerWrite.requires_approval_before_execution &&
    input.execute_write
  ) {
    executionResult = await input.execute_write();
    if (executionResult.executed && idempotencyKey) {
      recordIdempotentExecution(
        input.organization_id,
        idempotencyKey,
        `support-write-${input.request.capability_key}-${input.request.case_id}`,
      );
    }
  }

  const outcome = resolveSupportWriteActionOutcome({
    confirmed: input.request.confirmed,
    provider_write: providerWrite,
    blocked_by_policy: false,
    execution_result: executionResult,
  });

  const limitations =
    outcome === "execution_source_missing"
      ? ["customerApp.companionPlatformKnowledge.support.warnings.writeExecutionSourceMissing"]
      : outcome === "confirmation_required"
        ? ["customerApp.companionPlatformKnowledge.support.warnings.writeBlocked"]
        : outcome === "approval_required"
          ? ["customerApp.companionPlatformKnowledge.support.humanOversightRequired"]
          : [];

  const proposal: SupportWriteProposal | null =
    outcome === "confirmation_required" ||
    outcome === "execution_source_missing" ||
    outcome === "approval_required"
      ? buildApprovalProposal({
          request: input.request,
          provider_write: providerWrite,
          limitations,
        })
      : null;

  const audit = createSupportAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.request.capability_key,
    outcome,
    case_id: input.request.case_id,
    provider_key: input.provider_key,
    case_summary: caseSummary,
  });

  return {
    outcome,
    proposal,
    case_id: input.request.case_id,
    outcome_key: supportWriteOutcomeKey(outcome),
    audit_id: audit.audit_id,
    action_request_id: null,
    limitations,
  };
}
