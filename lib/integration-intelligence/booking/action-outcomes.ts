import type { BookingWriteOutcome } from "./types";

export type BookingProviderWriteContext = {
  /** Provider declares whether a reversible write RPC/adapter is connected. */
  write_source_available: boolean;
  /** Provider declares whether governance requires approval before execution. */
  requires_approval_before_execution: boolean;
};

export type BookingWriteExecutionResult = {
  executed: boolean;
  failure_reason: string | null;
};

export function resolveBookingWriteActionOutcome(input: {
  confirmed: boolean;
  provider_write: BookingProviderWriteContext;
  blocked_by_policy: boolean;
  execution_result?: BookingWriteExecutionResult | null;
}): BookingWriteOutcome {
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

export function bookingWriteProposalRequiresApproval(input: {
  provider_write: BookingProviderWriteContext;
}): boolean {
  return (
    input.provider_write.write_source_available &&
    input.provider_write.requires_approval_before_execution
  );
}
