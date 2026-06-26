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
  executeCompanionBookingWrite,
  type BookingWriteAdapterResult,
} from "@/lib/integration-intelligence/providers/appointment-booking/booking-write-adapter";
import {
  buildBookingApprovalCanonicalPayload,
  computeBookingApprovalPayloadHash,
  recordBookingApprovalActionRequest,
  type BookingApprovalBridgeDeps,
  type BookingApprovalBridgeResult,
} from "./booking-approval-bridge";
import {
  resolveBookingApprovalRequest,
  type BookingApprovalRequestResolution,
} from "./booking-approval-request-resolver";
import { createBookingAuditEvent } from "./booking-audit";

export type { BookingWriteRequest } from "@/lib/integration-intelligence/booking/types";

const EMPTY_EXECUTION_FIELDS = {
  outcome_code: null,
  appointment_id: null,
  appointment_key: null,
  previous_status: null,
  current_status: null,
  execution_starts_at: null,
  execution_ends_at: null,
  write_audit_id: null,
  channel_key: null,
} as const;

function writeResult(
  partial: Omit<BookingWriteResult, keyof typeof EMPTY_EXECUTION_FIELDS> &
    Partial<Pick<BookingWriteResult, keyof typeof EMPTY_EXECUTION_FIELDS>>,
): BookingWriteResult {
  return { ...EMPTY_EXECUTION_FIELDS, ...partial };
}

function emptyWriteResult(
  outcome: BookingWriteOutcome,
  limitations: readonly string[] = [],
): BookingWriteResult {
  return writeResult({
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
  });
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
    return writeResult({
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
    });
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

  return writeResult({
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
  });
}

const WRITE_EXECUTION_SOURCE_MISSING_LIMITATION =
  "customerApp.companionPlatformKnowledge.booking.warnings.writeExecutionSourceMissing";

function buildWriteProposalFromRequest(
  request: BookingWriteRequest,
  overrides: Partial<BookingWriteProposal> = {},
): BookingWriteProposal {
  return {
    proposal_id: null,
    capability_key: request.capability_key,
    service_id: request.service_id,
    resource_id: request.resource_id,
    customer_reference: request.customer_reference,
    start_at: request.start_at,
    end_at: request.end_at,
    requires_confirmation: true,
    requires_approval: true,
    idempotency_key: request.idempotency_key,
    action_request_id: null,
    payload_hash: null,
    expires_at: null,
    idempotent_replay: false,
    limitations: [],
    ...overrides,
  };
}

function mapApprovalResolverToResult(input: {
  resolution: BookingApprovalRequestResolution;
  request: BookingWriteRequest;
  actionRequestId: string;
}): BookingWriteResult {
  const payloadHash = computeBookingApprovalPayloadHash(
    buildBookingApprovalCanonicalPayload(input.request),
  );

  if (input.resolution.outcome === "approval_pending") {
    const proposal = buildWriteProposalFromRequest(input.request, {
      proposal_id: input.actionRequestId,
      action_request_id: input.actionRequestId,
      payload_hash: payloadHash,
      requires_approval: true,
    });

    return writeResult({
      outcome: "approval_required",
      proposal,
      booking: null,
      outcome_key: bookingWriteOutcomeKey("approval_required"),
      audit_id: null,
      limitations: [],
      action_request_id: input.actionRequestId,
      payload_hash: payloadHash,
      idempotency_key: input.request.idempotency_key,
      expires_at: null,
      idempotent_replay: false,
    });
  }

  if (input.resolution.outcome === "approved") {
    const proposal = buildWriteProposalFromRequest(input.request, {
      requires_approval: true,
      action_request_id: input.resolution.action_request_id,
      payload_hash: input.resolution.payload_hash,
      idempotency_key: input.resolution.idempotency_key,
      limitations: [WRITE_EXECUTION_SOURCE_MISSING_LIMITATION],
    });

    return writeResult({
      outcome: "execution_source_missing",
      proposal,
      booking: null,
      outcome_key: bookingWriteOutcomeKey("execution_source_missing"),
      audit_id: null,
      limitations: [WRITE_EXECUTION_SOURCE_MISSING_LIMITATION],
      action_request_id: input.resolution.action_request_id,
      payload_hash: input.resolution.payload_hash,
      idempotency_key: input.resolution.idempotency_key,
      expires_at: null,
      idempotent_replay: false,
    });
  }

  return writeResult({
    outcome: "failed",
    proposal: null,
    booking: null,
    outcome_key: bookingWriteOutcomeKey("failed"),
    audit_id: null,
    limitations: [],
    action_request_id: input.actionRequestId,
    payload_hash: null,
    idempotency_key: input.request.idempotency_key,
    expires_at: null,
    idempotent_replay: false,
  });
}

function mapAdapterExecutionToResult(input: {
  adapter: BookingWriteAdapterResult;
  resolution: Extract<BookingApprovalRequestResolution, { outcome: "approved" }>;
}): BookingWriteResult {
  const outcome: BookingWriteOutcome = input.adapter.executed ? "executed" : "failed";

  return writeResult({
    outcome,
    proposal: null,
    booking: null,
    outcome_key: bookingWriteOutcomeKey(outcome),
    audit_id: null,
    limitations: [],
    action_request_id: input.resolution.action_request_id,
    payload_hash: input.resolution.payload_hash,
    idempotency_key: input.resolution.idempotency_key,
    expires_at: null,
    idempotent_replay: input.adapter.idempotent_replay,
    outcome_code: input.adapter.outcome_code,
    appointment_id: input.adapter.appointment_id,
    appointment_key: input.adapter.appointment_key,
    previous_status: input.adapter.previous_status,
    current_status: input.adapter.current_status,
    execution_starts_at: input.adapter.starts_at,
    execution_ends_at: input.adapter.ends_at,
    write_audit_id: input.adapter.audit_id,
    channel_key: input.adapter.channel_key,
  });
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
  resolve_approval_request?: (
    actionRequestId: string,
    request: BookingWriteRequest,
  ) => Promise<BookingApprovalRequestResolution>;
  execute_booking_write?: (actionRequestId: string) => Promise<BookingWriteAdapterResult>;
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

  const existingActionRequestId = input.request.action_request_id?.trim() || null;
  const governedApprovalPath =
    input.request.confirmed &&
    input.provider_write.requires_approval_before_execution &&
    (bookingWriteProposalRequiresApproval({ provider_write: input.provider_write }) ||
      Boolean(existingActionRequestId));

  if (governedApprovalPath) {
    if (existingActionRequestId) {
      let resolution = input.resolve_approval_request
        ? await input.resolve_approval_request(existingActionRequestId, input.request)
        : input.supabase
          ? await resolveBookingApprovalRequest(input.supabase, {
              action_request_id: existingActionRequestId,
              request: input.request,
            })
          : { outcome: "not_found" as const };

      if (
        resolution.outcome === "approved" &&
        resolution.action_request_id !== existingActionRequestId
      ) {
        resolution = { outcome: "verification_failed" };
      }

      let mapped: BookingWriteResult;
      let adapterResult: BookingWriteAdapterResult | null = null;

      if (
        resolution.outcome === "approved" &&
        resolution.action_request_id.length > 0 &&
        input.provider_write.write_source_available
      ) {
        const executeBookingWriteFn =
          input.execute_booking_write ??
          (input.supabase
            ? (actionRequestId: string) => executeCompanionBookingWrite(input.supabase!, actionRequestId)
            : null);
        adapterResult = executeBookingWriteFn
          ? await executeBookingWriteFn(resolution.action_request_id)
          : { executed: false, outcome_code: "WRITE_FAILED", appointment_id: null, appointment_key: null, previous_status: null, current_status: null, starts_at: null, ends_at: null, audit_id: null, idempotent_replay: false, channel_key: null };
        mapped = mapAdapterExecutionToResult({ adapter: adapterResult, resolution });
      } else {
        mapped = mapApprovalResolverToResult({
          resolution,
          request: input.request,
          actionRequestId: existingActionRequestId,
        });
      }

      const audit = createBookingAuditEvent({
        organization_id: input.organization_id,
        tenant_id: input.tenant_id,
        user_role: input.user_role,
        capability_key: input.request.capability_key,
        outcome: mapped.outcome,
        booking_id: mapped.appointment_key,
        provider_key: input.provider_key,
        metadata: {
          action_request_id: mapped.action_request_id,
          confirmed: input.request.confirmed,
          write_source_available: input.provider_write.write_source_available,
          resolver_outcome: resolution.outcome,
          write_outcome_code: mapped.outcome_code,
          executed: adapterResult?.executed ?? false,
          idempotent_replay: mapped.idempotent_replay,
        },
      });

      return { ...mapped, audit_id: audit.audit_id };
    }

    if (bookingWriteProposalRequiresApproval({ provider_write: input.provider_write })) {
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
      ? [WRITE_EXECUTION_SOURCE_MISSING_LIMITATION]
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

  return writeResult({
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
  });
}
