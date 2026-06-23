import type { HostsWriteOutcome } from "./types";

export type HostsProviderWriteContext = {
  write_source_available: boolean;
  requires_approval_before_execution: boolean;
};

export type HostsWriteExecutionResult = {
  executed: boolean;
  failure_reason: string | null;
  idempotent_replay?: boolean;
  verified_after_reread?: boolean;
  entity_id?: string | null;
};

export function resolveHostsWriteActionOutcome(input: {
  confirmed: boolean;
  provider_write: HostsProviderWriteContext;
  blocked_by_policy: boolean;
  execution_result?: HostsWriteExecutionResult | null;
}): HostsWriteOutcome {
  if (input.blocked_by_policy) return "blocked_by_policy";
  if (!input.confirmed) return "confirmation_required";

  if (!input.provider_write.write_source_available) {
    return "execution_source_missing";
  }

  if (input.execution_result?.executed) {
    return "executed";
  }

  if (input.execution_result && !input.execution_result.executed) {
    return "failed";
  }

  if (input.provider_write.requires_approval_before_execution) {
    return "approval_required";
  }

  return "execution_source_missing";
}

export function hostsWriteProposalRequiresApproval(input: {
  provider_write: HostsProviderWriteContext;
}): boolean {
  return (
    input.provider_write.write_source_available &&
    input.provider_write.requires_approval_before_execution
  );
}

export function resolveHostsDraftOutcome(input: { draft_text: string | null }): HostsWriteOutcome {
  if (!input.draft_text?.trim()) return "failed";
  return "draft_created";
}
