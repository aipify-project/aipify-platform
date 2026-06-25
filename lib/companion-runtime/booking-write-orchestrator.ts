import type { SupabaseClient } from "@supabase/supabase-js";
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
  BookingWriteOutcome,
  BookingWriteProposal,
  BookingWriteRequest,
  BookingWriteResult,
} from "@/lib/integration-intelligence/booking/types";
import {
  recordBookingApprovalActionRequest,
  type BookingApprovalBridgeDeps,
  type BookingApprovalBridgeResult,
} from "./booking-approval-bridge";
import { createBookingAuditEvent } from "./booking-audit";

export type { BookingWriteRequest } from "@/lib/integration-intelligence/booking/types";

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
    action_request_id: null,
    payload_hash: null,
    idempotency_key: null,
    expires_at: null,
    idempotent_replay: false,
  };
}

function mapApprovalBridgeToResult(input: {
  approval: BookingApprovalBridgeResult;
  request: BookingWriteRequest;
}): BookingWriteResult {
  const actionRequestId = input.approval.action_request_id;
  const governed =
    input.approval.success === true &&
    typeof actionRequestId === "string" &&
    actionRequestId.length > 0 &&
    (input.approval.outcome_code === "BOOKING_ACTION_REQUESTED" ||
      input.approval.outcome_code === "IDEMPOTENT_REPLAY");

  if (!governed) {
    return {
      outcome: "failed",
      proposal: null,
      booking: null,
      outcome_key: bookingWriteOutcomeKey("failed"),
      audit_id: null,
      limitations: [],
      action_request_id: actionRequestId,
      payload_hash: input.approval.payload_hash,
      idempotency_key: input.approval.idempotency_key,
      expires_at: input.approval.expires_at,
      idempotent_replay: false,
    };
  }

  const proposal: BookingWriteProposal = {
    proposal_id: actionRequestId,
    capability_key: input.request.capability_key,
    service_id: input.request.service_id,
    resource_id: input.request.resource_id,
    customer_reference: input.request.customer_reference,
    start_at: input.request.start_at,
    end_at: input.request.end_at,
    requires_confirmation: true,
    requires_approval: true,
    idempotency_key: input.approval.idempotency_key ?? input.request.idempotency_key,
    action_request_id: actionRequestId,
    payload_hash: input.approval.payload_hash,
    expires_at: input.approval.expires_at,
    idempotent_replay: input.approval.idempotent_replay,
    limitations: [],
  };

  return {
    outcome: "approval_required",
    proposal,
    booking: null,
    outcome_key: bookingWriteOutcomeKey("approval_required"),
    audit_id: null,
    limitations: [],
    action_request_id: actionRequestId,
    payload_hash: input.approval.payload_hash,
    idempotency_key: input.approval.idempotency_key,
    expires_at: input.approval.expires_at,
    idempotent_replay: input.approval.idempotent_replay,
  };
}

export async function executeBookingWrite(input: {
  organization_id: string;
  tenant_id: string;
  user_role: string;
  permission: BookingPermissionContext;
  provider_key: string;
  provider_write: BookingProviderWriteContext;
  supabase?: SupabaseClient;
  record_approval_request?: (
    request: BookingWriteRequest,
    deps?: BookingApprovalBridgeDeps,
  ) => Promise<BookingApprovalBridgeResult>;
  approval_bridge_deps?: BookingApprovalBridgeDeps;
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

  if (
    input.request.confirmed &&
    bookingWriteProposalRequiresApproval({ provider_write: input.provider_write })
  ) {
    const approvalResult = input.record_approval_request
      ? await input.record_approval_request(input.request, input.approval_bridge_deps)
      : input.supabase
        ? await recordBookingApprovalActionRequest(
            input.supabase,
            input.request,
            input.approval_bridge_deps,
          )
        : null;

    const mapped = mapApprovalBridgeToResult({
      approval: approvalResult ?? {
        success: false,
        outcome_code: "REQUEST_FAILED",
        action_request_id: null,
        payload_hash: null,
        idempotency_key: input.request.idempotency_key,
        expires_at: null,
        idempotent_replay: false,
      },
      request: input.request,
    });

    const audit = createBookingAuditEvent({
      organization_id: input.organization_id,
      tenant_id: input.tenant_id,
      user_role: input.user_role,
      capability_key: input.request.capability_key,
      outcome: mapped.outcome,
      booking_id: null,
      provider_key: input.provider_key,
      metadata: {
        action_request_id: mapped.action_request_id,
        confirmed: input.request.confirmed,
        write_source_available: input.provider_write.write_source_available,
        idempotent_replay: mapped.idempotent_replay,
      },
    });

    return { ...mapped, audit_id: audit.audit_id };
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
    outcome === "confirmation_required" || outcome === "execution_source_missing"
      ? {
          proposal_id: null,
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
          action_request_id: null,
          payload_hash: null,
          expires_at: null,
          idempotent_replay: false,
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
    action_request_id: null,
    payload_hash: null,
    idempotency_key: input.request.idempotency_key,
    expires_at: null,
    idempotent_replay: false,
  };
}
