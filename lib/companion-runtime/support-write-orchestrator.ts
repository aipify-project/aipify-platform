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
  type SupportProviderWriteContext,
  type SupportWriteExecutionResult,
} from "@/lib/integration-intelligence/support/action-outcomes";
import { isSupportCapabilityBlocked } from "@/lib/integration-intelligence/support/types";
import type {
  SupportCapabilityKey,
  SupportWriteOutcome,
  SupportWriteProposal,
  SupportWriteResult,
} from "@/lib/integration-intelligence/support/types";
import { isSupportWriteSourceConnected } from "@/lib/integration-intelligence/providers/support-operations/support-source-map";
import { createSupportAuditEvent } from "./support-audit";

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
  idempotency_key: string | null;
};

function emptyWriteResult(
  outcome: SupportWriteOutcome,
  limitations: readonly string[] = [],
): SupportWriteResult {
  return {
    outcome,
    proposal: null,
    case_id: null,
    outcome_key: supportWriteOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

export async function executeSupportWrite(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: SupportPermissionContext;
  provider_key: string;
  provider_write: SupportProviderWriteContext;
  execute_write?: () => Promise<SupportWriteExecutionResult>;
  request: SupportWriteRequest;
}): Promise<SupportWriteResult> {
  if (isSupportCapabilityBlocked(input.request.capability_key)) {
    return emptyWriteResult("blocked_by_policy");
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
      limitations,
    };
  }

  const writeSourceConnected = isSupportWriteSourceConnected(input.request.capability_key);
  const providerWrite: SupportProviderWriteContext = {
    write_source_available: writeSourceConnected && input.provider_write.write_source_available,
    requires_approval_before_execution: true,
  };

  let executionResult: SupportWriteExecutionResult | null = null;

  if (
    input.request.confirmed &&
    providerWrite.write_source_available &&
    !providerWrite.requires_approval_before_execution &&
    input.execute_write
  ) {
    executionResult = await input.execute_write();
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
        : [];

  const proposal: SupportWriteProposal | null =
    outcome === "confirmation_required" ||
    outcome === "execution_source_missing" ||
    outcome === "approval_required"
      ? {
          proposal_id: `support-proposal-${Date.now()}`,
          capability_key: input.request.capability_key,
          case_id: input.request.case_id,
          draft_text: null,
          assignee_reference: input.request.assignee_reference,
          escalation_reason: input.request.escalation_reason,
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
    outcome,
    case_id: input.request.case_id,
    provider_key: input.provider_key,
  });

  return {
    outcome,
    proposal,
    case_id: input.request.case_id,
    outcome_key: supportWriteOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}
