import { hostsWriteOutcomeKey } from "@/lib/integration-intelligence/hosts/outcomes";
import {
  assertHostsReadAllowed,
  assertHostsTenantScope,
  canProposeHostsWrite,
  type HostsPermissionContext,
} from "@/lib/integration-intelligence/hosts/permissions";
import {
  resolveHostsDraftOutcome,
  resolveHostsWriteActionOutcome,
  type HostsProviderWriteContext,
  type HostsWriteExecutionResult,
} from "@/lib/integration-intelligence/hosts/action-outcomes";
import { isHostsCapabilityBlocked } from "@/lib/integration-intelligence/hosts/types";
import type {
  HostsCapabilityKey,
  HostsWriteOutcome,
  HostsWriteProposal,
  HostsWriteResult,
} from "@/lib/integration-intelligence/hosts/types";
import { isHostsWriteSourceConnected } from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-source-map";
import { createHostsAuditEvent } from "./hosts-audit";

export type HostsWriteRequest = {
  capability_key: Extract<
    HostsCapabilityKey,
    "guest_response.draft" | "host_task.create" | "cleaning_task.assign" | "maintenance_task.create"
  >;
  entity_id: string | null;
  draft_text: string | null;
  task_summary: string | null;
  assignee_reference: string | null;
  grounded_sources: readonly string[];
  confirmed: boolean;
  idempotency_key: string | null;
};

function emptyWriteResult(
  outcome: HostsWriteOutcome,
  limitations: readonly string[] = [],
): HostsWriteResult {
  return {
    outcome,
    proposal: null,
    entity_id: null,
    outcome_key: hostsWriteOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

export async function executeHostsWrite(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: HostsPermissionContext;
  provider_key: string;
  provider_write: HostsProviderWriteContext;
  execute_write?: () => Promise<HostsWriteExecutionResult>;
  request: HostsWriteRequest;
}): Promise<HostsWriteResult> {
  if (isHostsCapabilityBlocked(input.request.capability_key)) {
    return emptyWriteResult("blocked_by_policy");
  }

  if (
    !assertHostsTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyWriteResult("permission_denied", ["Cross-tenant Hosts writes are forbidden."]);
  }

  const block = assertHostsReadAllowed(input.permission);
  if (block) return emptyWriteResult(block);

  if (!canProposeHostsWrite(input.permission)) {
    return emptyWriteResult("permission_denied");
  }

  if (input.request.capability_key === "guest_response.draft") {
    const draftOutcome = resolveHostsDraftOutcome({ draft_text: input.request.draft_text });
    const limitations =
      input.request.grounded_sources.length === 0
        ? ["customerApp.companionPlatformKnowledge.hosts.warnings.draftWithoutSources"]
        : ["customerApp.companionPlatformKnowledge.hosts.warnings.autoMessageSendBlocked"];

    const proposal: HostsWriteProposal | null =
      draftOutcome === "draft_created"
        ? {
            proposal_id: `hosts-draft-${Date.now()}`,
            capability_key: "guest_response.draft",
            entity_id: input.request.entity_id,
            draft_text: input.request.draft_text,
            task_summary: null,
            assignee_reference: null,
            requires_confirmation: true,
            requires_approval: true,
            grounded_sources: input.request.grounded_sources,
            limitations,
          }
        : null;

    const audit = createHostsAuditEvent({
      organization_id: input.organization_id,
      tenant_id: input.tenant_id,
      user_role: input.user_role,
      capability_key: input.request.capability_key,
      outcome: draftOutcome,
      entity_id: input.request.entity_id,
      provider_key: input.provider_key,
    });

    return {
      outcome: draftOutcome,
      proposal,
      entity_id: input.request.entity_id,
      outcome_key: hostsWriteOutcomeKey(draftOutcome),
      audit_id: audit.audit_id,
      limitations,
    };
  }

  const writeSourceConnected = isHostsWriteSourceConnected(input.request.capability_key);
  const providerWrite: HostsProviderWriteContext = {
    write_source_available: writeSourceConnected && input.provider_write.write_source_available,
    requires_approval_before_execution: true,
  };

  let executionResult: HostsWriteExecutionResult | null = null;

  if (
    input.request.confirmed &&
    providerWrite.write_source_available &&
    !providerWrite.requires_approval_before_execution &&
    input.execute_write
  ) {
    executionResult = await input.execute_write();
  }

  const outcome = resolveHostsWriteActionOutcome({
    confirmed: input.request.confirmed,
    provider_write: providerWrite,
    blocked_by_policy: false,
    execution_result: executionResult,
  });

  const limitations =
    outcome === "execution_source_missing"
      ? ["customerApp.companionPlatformKnowledge.hosts.warnings.writeExecutionSourceMissing"]
      : outcome === "confirmation_required"
        ? ["customerApp.companionPlatformKnowledge.hosts.warnings.writeBlocked"]
        : [];

  const proposal: HostsWriteProposal | null =
    outcome === "confirmation_required" ||
    outcome === "execution_source_missing" ||
    outcome === "approval_required"
      ? {
          proposal_id: `hosts-proposal-${Date.now()}`,
          capability_key: input.request.capability_key,
          entity_id: input.request.entity_id,
          draft_text: null,
          task_summary: input.request.task_summary,
          assignee_reference: input.request.assignee_reference,
          requires_confirmation: true,
          requires_approval: true,
          grounded_sources: input.request.grounded_sources,
          limitations,
        }
      : null;

  const audit = createHostsAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.request.capability_key,
    outcome,
    entity_id: input.request.entity_id,
    provider_key: input.provider_key,
  });

  return {
    outcome,
    proposal,
    entity_id: input.request.entity_id,
    outcome_key: hostsWriteOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}
