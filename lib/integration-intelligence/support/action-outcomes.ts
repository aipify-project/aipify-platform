import type { SupportWriteOutcome } from "./types";

export type SupportProviderWriteContext = {
  write_source_available: boolean;
  requires_approval_before_execution: boolean;
};

export type SupportWriteExecutionResult = {
  executed: boolean;
  failure_reason: string | null;
  idempotent_replay?: boolean;
  verified_after_reread?: boolean;
};

export function resolveSupportWriteActionOutcome(input: {
  confirmed: boolean;
  provider_write: SupportProviderWriteContext;
  blocked_by_policy: boolean;
  execution_result?: SupportWriteExecutionResult | null;
}): SupportWriteOutcome {
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

export function supportWriteProposalRequiresApproval(input: {
  provider_write: SupportProviderWriteContext;
}): boolean {
  return (
    input.provider_write.write_source_available &&
    input.provider_write.requires_approval_before_execution
  );
}

export function resolveSupportDraftOutcome(input: {
  draft_text: string | null;
}): SupportWriteOutcome {
  if (!input.draft_text?.trim()) return "failed";
  return "draft_created";
}
