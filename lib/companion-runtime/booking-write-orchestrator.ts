import { bookingWriteOutcomeKey } from "@/lib/integration-intelligence/booking/outcomes";
import {
  assertBookingReadAllowed,
  assertBookingTenantScope,
  canProposeBookingWrite,
  type BookingPermissionContext,
} from "@/lib/integration-intelligence/booking/permissions";
import {
  bookingWriteProposalRequiresApproval,
  resolveBookingWriteActionOutcome,
  type BookingProviderWriteContext,
  type BookingWriteExecutionResult,
} from "@/lib/integration-intelligence/booking/action-outcomes";
import { isBookingCapabilityBlocked } from "@/lib/integration-intelligence/booking/types";
import type {
  BookingCapabilityKey,
  BookingWriteOutcome,
  BookingWriteProposal,
  BookingWriteResult,
} from "@/lib/integration-intelligence/booking/types";
import { createBookingAuditEvent } from "./booking-audit";

export type BookingWriteRequest = {
  capability_key: Extract<BookingCapabilityKey, "booking.create" | "booking.update" | "booking.cancel">;
  service_id: string | null;
  resource_id: string | null;
  customer_reference: string | null;
  booking_id: string | null;
  start_at: string | null;
  end_at: string | null;
  confirmed: boolean;
  idempotency_key: string | null;
};

function emptyWriteResult(
  outcome: BookingWriteOutcome,
  limitations: readonly string[] = [],
): BookingWriteResult {
  return {
    outcome,
    proposal: null,
    booking: null,
    outcome_key: bookingWriteOutcomeKey(outcome),
    audit_id: null,
    limitations,
  };
}

export async function executeBookingWrite(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: BookingPermissionContext;
  provider_key: string;
  provider_write: BookingProviderWriteContext;
  execute_write?: () => Promise<BookingWriteExecutionResult>;
  request: BookingWriteRequest;
}): Promise<BookingWriteResult> {
  if (isBookingCapabilityBlocked(input.request.capability_key)) {
    return emptyWriteResult("blocked_by_policy");
  }

  if (
    !assertBookingTenantScope({
      queryOrganizationId: input.organization_id,
      sessionOrganizationId: input.permission.organization_id,
    })
  ) {
    return emptyWriteResult("permission_denied", ["Cross-tenant booking writes are forbidden."]);
  }

  const block = assertBookingReadAllowed(input.permission);
  if (block) return emptyWriteResult(block);

  if (!canProposeBookingWrite(input.permission)) {
    return emptyWriteResult("permission_denied");
  }

  let executionResult: BookingWriteExecutionResult | null = null;

  if (
    input.request.confirmed &&
    input.provider_write.write_source_available &&
    !input.provider_write.requires_approval_before_execution &&
    input.execute_write
  ) {
    executionResult = await input.execute_write();
  }

  const outcome = resolveBookingWriteActionOutcome({
    confirmed: input.request.confirmed,
    provider_write: input.provider_write,
    blocked_by_policy: false,
    execution_result: executionResult,
  });

  const limitations =
    outcome === "execution_source_missing"
      ? [
          "customerApp.companionPlatformKnowledge.booking.warnings.writeExecutionSourceMissing",
        ]
      : outcome === "confirmation_required"
        ? ["customerApp.companionPlatformKnowledge.booking.warnings.writeBlocked"]
        : [];

  const proposal: BookingWriteProposal | null =
    outcome === "confirmation_required" ||
    outcome === "execution_source_missing" ||
    outcome === "approval_required"
      ? {
          proposal_id: `booking-proposal-${Date.now()}`,
          capability_key: input.request.capability_key,
          service_id: input.request.service_id,
          resource_id: input.request.resource_id,
          customer_reference: input.request.customer_reference,
          start_at: input.request.start_at,
          end_at: input.request.end_at,
          requires_confirmation: true,
          requires_approval: bookingWriteProposalRequiresApproval({
            provider_write: input.provider_write,
          }),
          idempotency_key: input.request.idempotency_key,
          limitations,
        }
      : null;

  const audit = createBookingAuditEvent({
    organization_id: input.organization_id,
    tenant_id: input.tenant_id,
    user_role: input.user_role,
    capability_key: input.request.capability_key,
    outcome,
    booking_id: null,
    provider_key: input.provider_key,
    metadata: {
      proposal_id: proposal?.proposal_id ?? null,
      confirmed: input.request.confirmed,
      write_source_available: input.provider_write.write_source_available,
      executed: executionResult?.executed ?? false,
    },
  });

  return {
    outcome,
    proposal,
    booking: null,
    outcome_key: bookingWriteOutcomeKey(outcome),
    audit_id: audit.audit_id,
    limitations,
  };
}
