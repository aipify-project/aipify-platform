import { bookingWriteOutcomeKey } from "@/lib/integration-intelligence/booking/outcomes";
import {
  assertBookingReadAllowed,
  assertBookingTenantScope,
  canProposeBookingWrite,
  type BookingPermissionContext,
} from "@/lib/integration-intelligence/booking/permissions";
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
  provider_write_ready: boolean;
  request: BookingWriteRequest;
}): Promise<BookingWriteResult> {
  if (isBookingCapabilityBlocked(input.request.capability_key)) {
    return emptyWriteResult("blocked_by_governance");
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

  if (!input.provider_write_ready) {
    const proposal: BookingWriteProposal = {
      proposal_id: `booking-proposal-${Date.now()}`,
      capability_key: input.request.capability_key,
      service_id: input.request.service_id,
      resource_id: input.request.resource_id,
      customer_reference: input.request.customer_reference,
      start_at: input.request.start_at,
      end_at: input.request.end_at,
      requires_confirmation: true,
      requires_approval: true,
      idempotency_key: input.request.idempotency_key,
      limitations: [
        "No live booking write RPC is connected — proposal only.",
        "Availability recheck and idempotent create require provider write adapter.",
      ],
    };

    const outcome: BookingWriteOutcome = input.request.confirmed
      ? "approval_required"
      : "confirmation_required";

    const audit = createBookingAuditEvent({
      organization_id: input.organization_id,
      tenant_id: input.tenant_id,
      user_role: input.user_role,
      capability_key: input.request.capability_key,
      outcome,
      booking_id: input.request.booking_id,
      provider_key: input.provider_key,
      metadata: {
        proposal_id: proposal.proposal_id,
        confirmed: input.request.confirmed,
        write_ready: false,
      },
    });

    return {
      outcome,
      proposal,
      booking: null,
      outcome_key: bookingWriteOutcomeKey(outcome),
      audit_id: audit.audit_id,
      limitations: proposal.limitations,
    };
  }

  return emptyWriteResult("source_missing", ["Provider write path not implemented in Phase 36 V1."]);
}
