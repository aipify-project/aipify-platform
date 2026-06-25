import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  listBookingAuditEvents,
  resetBookingAuditLogForTests,
} from "@/lib/companion-runtime/booking-audit";
import {
  buildBookingApprovalCanonicalPayload,
  computeBookingApprovalPayloadHash,
  recordBookingApprovalActionRequest,
  resolveBookingApprovalExpiresAt,
} from "@/lib/companion-runtime/booking-approval-bridge";
import { executeBookingWrite } from "@/lib/companion-runtime/booking-write-orchestrator";
import {
  bookingWriteProposalRequiresApproval,
  resolveBookingWriteActionOutcome,
} from "@/lib/integration-intelligence/booking/action-outcomes";
import {
  BOOKING_READ_OUTCOME_I18N_KEYS,
  BOOKING_WRITE_OUTCOME_I18N_KEYS,
} from "@/lib/integration-intelligence/booking/outcomes";
import { APPOINTMENT_BOOKING_SOURCE_MAP } from "@/lib/integration-intelligence/providers/appointment-booking/booking-source-map";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG_A = "org-booking-36b";

const permissionCtx = {
  organization_id: ORG_A,
  tenant_id: "tenant-a",
  user_role: "admin",
  app_suspended: false,
  provider_active: true,
  can_read_services: true,
  can_read_bookings: true,
  can_read_availability: true,
  can_write_booking: true,
  rate_limit_ok: true,
};

const writeRequestBase = {
  service_id: "svc_cut_color",
  resource_id: "emp_kari",
  customer_reference: "masked-customer",
  booking_id: null as string | null,
  start_at: "2026-06-24T09:00:00.000Z",
  end_at: "2026-06-24T10:30:00.000Z",
  idempotency_key: "idem-36b",
};

const providerWriteMissing = {
  write_source_available: false,
  requires_approval_before_execution: true,
};

const providerWriteWithApproval = {
  write_source_available: true,
  requires_approval_before_execution: true,
};

const providerWriteExecutable = {
  write_source_available: true,
  requires_approval_before_execution: false,
};

assert.equal(
  resolveBookingWriteActionOutcome({
    confirmed: false,
    provider_write: providerWriteMissing,
    blocked_by_policy: false,
  }),
  "confirmation_required",
);

assert.equal(
  resolveBookingWriteActionOutcome({
    confirmed: true,
    provider_write: providerWriteMissing,
    blocked_by_policy: false,
  }),
  "execution_source_missing",
);

assert.equal(
  resolveBookingWriteActionOutcome({
    confirmed: true,
    provider_write: providerWriteWithApproval,
    blocked_by_policy: false,
  }),
  "approval_required",
);

assert.equal(
  resolveBookingWriteActionOutcome({
    confirmed: true,
    provider_write: providerWriteExecutable,
    blocked_by_policy: false,
    execution_result: { executed: true, failure_reason: null },
  }),
  "executed",
);

assert.equal(
  resolveBookingWriteActionOutcome({
    confirmed: true,
    provider_write: providerWriteExecutable,
    blocked_by_policy: false,
    execution_result: { executed: false, failure_reason: "provider_rejected" },
  }),
  "failed",
);

assert.equal(
  bookingWriteProposalRequiresApproval({ provider_write: providerWriteMissing }),
  false,
);

assert.equal(
  bookingWriteProposalRequiresApproval({ provider_write: providerWriteWithApproval }),
  true,
);

const enDict = JSON.parse(
  fs.readFileSync(path.join(repoRoot, "locales/en/customer-app/companionPlatformKnowledge.json"), "utf8"),
);
const enBooking = enDict.companionPlatformKnowledge.booking;

const BOOKING_LOCALE_KEYS = [
  "sourceLabel",
  "privacyNote",
  ...Object.keys(enBooking.outcomes).map((key) => `outcomes.${key}`),
  ...Object.keys(enBooking.status).map((key) => `status.${key}`),
  ...Object.keys(enBooking.warnings).map((key) => `warnings.${key}`),
  ...Object.keys(enBooking.commandBrief).map((key) => `commandBrief.${key}`),
] as const;

function readBookingValue(booking: Record<string, unknown>, dottedKey: string): string {
  const [section, key] = dottedKey.includes(".") ? dottedKey.split(".") : ["", dottedKey];
  if (!section) return String(booking[dottedKey] ?? "");
  const group = booking[section] as Record<string, string> | undefined;
  return String(group?.[key ?? ""] ?? "");
}

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
  );
  const booking = dict.companionPlatformKnowledge.booking;
  assert.ok(booking, `${locale} booking namespace`);

  for (const dottedKey of BOOKING_LOCALE_KEYS) {
    const value = readBookingValue(booking, dottedKey);
    assert.ok(value.length > 0, `${locale} missing booking.${dottedKey}`);
    assert.equal(value.includes("customerApp."), false, `${locale} raw key ${dottedKey}`);
  }

  if (locale !== "en") {
    for (const dottedKey of [
      "outcomes.executionSourceMissing",
      "outcomes.confirmationRequired",
      "outcomes.noAvailability",
      "status.available",
      "status.busy",
      "warnings.writeExecutionSourceMissing",
      "commandBrief.bookingConflict",
    ]) {
      const localized = readBookingValue(booking, dottedKey);
      const english = readBookingValue(enBooking, dottedKey);
      assert.notEqual(localized, english, `${locale} still English for booking.${dottedKey}`);
    }
  }
}

for (const key of Object.values(BOOKING_READ_OUTCOME_I18N_KEYS)) {
  const leaf = key.split(".").pop() ?? "";
  assert.ok(enBooking.outcomes[leaf], `en read outcome leaf ${leaf}`);
}

for (const key of Object.values(BOOKING_WRITE_OUTCOME_I18N_KEYS)) {
  const leaf = key.split(".").pop() ?? "";
  assert.ok(enBooking.outcomes[leaf], `en write outcome leaf ${leaf}`);
}

resetBookingAuditLogForTests();

const bookingApprovalRequestBase = {
  capability_key: "booking.create" as const,
  service_id: "svc_cut_color",
  resource_id: "emp_kari",
  customer_reference: "masked-customer",
  booking_id: null as string | null,
  start_at: "2026-06-24T09:00:00.000Z",
  end_at: "2026-06-24T10:30:00.000Z",
  confirmed: true,
  idempotency_key: "idem-bridge-36b",
};

const stableBookingPayload = buildBookingApprovalCanonicalPayload(bookingApprovalRequestBase);
const stableBookingHash = computeBookingApprovalPayloadHash(stableBookingPayload);
const stableBookingHashRepeat = computeBookingApprovalPayloadHash(
  buildBookingApprovalCanonicalPayload(bookingApprovalRequestBase),
);
assert.equal(stableBookingHash, stableBookingHashRepeat);

const changedBookingPayload = buildBookingApprovalCanonicalPayload({
  ...bookingApprovalRequestBase,
  start_at: "2026-06-25T09:00:00.000Z",
});
assert.notEqual(stableBookingHash, computeBookingApprovalPayloadHash(changedBookingPayload));

async function runPhase36bAsyncTests() {
  const fixedNow = new Date("2026-06-24T08:00:00.000Z");
  const expectedExpiresAt = resolveBookingApprovalExpiresAt(fixedNow);
  const expectedPayloadHash = computeBookingApprovalPayloadHash(
    buildBookingApprovalCanonicalPayload({
      capability_key: "booking.create",
      ...writeRequestBase,
      confirmed: true,
      idempotency_key: "idem-approval",
    }),
  );

  const approvalBridgeCallCount = { value: 0 };
  let executeWriteCallCount = 0;

  const mockApprovalBridgeSuccess = async () => {
    approvalBridgeCallCount.value += 1;
    return {
      success: true,
      outcome_code: "BOOKING_ACTION_REQUESTED",
      action_request_id: "req-approval-001",
      payload_hash: expectedPayloadHash,
      idempotency_key: "idem-approval",
      expires_at: expectedExpiresAt,
      idempotent_replay: false,
    };
  };

  const createUnconfirmed = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteMissing,
    record_approval_request: mockApprovalBridgeSuccess,
    request: {
      capability_key: "booking.create",
      ...writeRequestBase,
      confirmed: false,
    },
  });
  assert.equal(createUnconfirmed.outcome, "confirmation_required");
  assert.equal(createUnconfirmed.booking, null);
  assert.equal(createUnconfirmed.proposal?.proposal_id ?? null, null);
  assert.ok(createUnconfirmed.proposal?.capability_key);
  assert.equal(approvalBridgeCallCount.value, 0);

  const createConfirmedNoSource = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteMissing,
    record_approval_request: mockApprovalBridgeSuccess,
    request: {
      capability_key: "booking.create",
      ...writeRequestBase,
      confirmed: true,
    },
  });
  assert.equal(createConfirmedNoSource.outcome, "execution_source_missing");
  assert.equal(createConfirmedNoSource.booking, null);
  assert.equal(createConfirmedNoSource.proposal?.requires_approval, false);
  assert.equal(createConfirmedNoSource.proposal?.proposal_id ?? null, null);
  assert.equal(approvalBridgeCallCount.value, 0);
  assert.ok(
    createConfirmedNoSource.limitations.some((entry) =>
      entry.includes("writeExecutionSourceMissing"),
    ),
  );

  const updateNoSource = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteMissing,
    request: {
      capability_key: "booking.update",
      ...writeRequestBase,
      booking_id: "apt_1001",
      confirmed: true,
    },
  });
  assert.equal(updateNoSource.outcome, "execution_source_missing");
  assert.equal(updateNoSource.booking, null);

  const cancelNoSource = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteMissing,
    request: {
      capability_key: "booking.cancel",
      ...writeRequestBase,
      booking_id: "apt_1001",
      confirmed: true,
    },
  });
  assert.equal(cancelNoSource.outcome, "execution_source_missing");
  assert.equal(cancelNoSource.booking, null);

  const approvalWhenSourceExists = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    record_approval_request: mockApprovalBridgeSuccess,
    execute_write: async () => {
      executeWriteCallCount += 1;
      return { executed: true, failure_reason: null };
    },
    request: {
      capability_key: "booking.create",
      ...writeRequestBase,
      idempotency_key: "idem-approval",
      confirmed: true,
    },
  });
  assert.equal(approvalWhenSourceExists.outcome, "approval_required");
  assert.equal(approvalWhenSourceExists.proposal?.requires_approval, true);
  assert.equal(approvalWhenSourceExists.proposal?.proposal_id, "req-approval-001");
  assert.equal(approvalWhenSourceExists.proposal?.proposal_id, approvalWhenSourceExists.action_request_id);
  assert.ok((approvalWhenSourceExists.proposal?.proposal_id?.length ?? 0) > 0);
  assert.equal(approvalWhenSourceExists.action_request_id, "req-approval-001");
  assert.equal(approvalWhenSourceExists.payload_hash, expectedPayloadHash);
  assert.equal(approvalWhenSourceExists.idempotency_key, "idem-approval");
  assert.equal(approvalWhenSourceExists.expires_at, expectedExpiresAt);
  assert.equal(approvalWhenSourceExists.idempotent_replay, false);
  assert.equal(approvalWhenSourceExists.booking, null);
  assert.equal(executeWriteCallCount, 0);
  assert.equal(approvalBridgeCallCount.value, 1);

  const approvalReplay = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    record_approval_request: async () => {
      approvalBridgeCallCount.value += 1;
      return {
        success: true,
        outcome_code: "IDEMPOTENT_REPLAY",
        action_request_id: "req-approval-001",
        payload_hash: expectedPayloadHash,
        idempotency_key: "idem-approval",
        expires_at: expectedExpiresAt,
        idempotent_replay: true,
      };
    },
    execute_write: async () => {
      executeWriteCallCount += 1;
      return { executed: true, failure_reason: null };
    },
    request: {
      capability_key: "booking.create",
      ...writeRequestBase,
      idempotency_key: "idem-approval",
      confirmed: true,
    },
  });
  assert.equal(approvalReplay.outcome, "approval_required");
  assert.equal(approvalReplay.action_request_id, "req-approval-001");
  assert.equal(approvalReplay.proposal?.proposal_id, "req-approval-001");
  assert.equal(approvalReplay.idempotent_replay, true);
  assert.equal(executeWriteCallCount, 0);

  const approvalConflict = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    record_approval_request: async () => ({
      success: false,
      outcome_code: "IDEMPOTENCY_CONFLICT",
      action_request_id: "req-approval-001",
      payload_hash: expectedPayloadHash,
      idempotency_key: "idem-approval-conflict",
      expires_at: expectedExpiresAt,
      idempotent_replay: false,
    }),
    execute_write: async () => {
      executeWriteCallCount += 1;
      return { executed: true, failure_reason: null };
    },
    request: {
      capability_key: "booking.create",
      ...writeRequestBase,
      idempotency_key: "idem-approval-conflict",
      start_at: "2026-06-25T09:00:00.000Z",
      confirmed: true,
    },
  });
  assert.equal(approvalConflict.outcome, "failed");
  assert.equal(approvalConflict.proposal, null);
  assert.equal(approvalConflict.action_request_id, "req-approval-001");
  assert.equal(approvalConflict.idempotent_replay, false);
  assert.equal(executeWriteCallCount, 0);

  const executedWithProvider = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteExecutable,
    execute_write: async () => ({ executed: true, failure_reason: null }),
    request: {
      capability_key: "booking.create",
      ...writeRequestBase,
      idempotency_key: "idem-executed",
      confirmed: true,
    },
  });
  assert.equal(executedWithProvider.outcome, "executed");
  assert.equal(executedWithProvider.booking, null);

  const auditEvents = listBookingAuditEvents(ORG_A);
  assert.ok(auditEvents.length >= 5);
  assert.ok(auditEvents.every((entry) => entry.booking_id === null));

  for (const capability of ["booking.create", "booking.update", "booking.cancel"] as const) {
    const source = APPOINTMENT_BOOKING_SOURCE_MAP.find((entry) => entry.capability_key === capability);
    assert.equal(source?.status, "missing", `${capability} readiness unchanged`);
    assert.equal(source?.source_id, "none");
  }

  const coverage = buildCompanionFoundationCoverageRegistry();
  const writeModule = coverage.find((entry) => entry.module_id === "service.booking_write");
  assert.equal(writeModule?.readiness, "source_missing");
  assert.equal(writeModule?.language_status, "complete");

  const coreOutcomeSource = fs.readFileSync(
    path.join(repoRoot, "lib/integration-intelligence/booking/action-outcomes.ts"),
    "utf8",
  );
  assert.equal(/appointment_booking|get_organization_appointment/i.test(coreOutcomeSource), false);

  const orchestratorSource = fs.readFileSync(
    path.join(repoRoot, "lib/companion-runtime/booking-write-orchestrator.ts"),
    "utf8",
  );
  assert.equal(/get_organization_appointment/i.test(orchestratorSource), false);
  assert.equal(/booking-proposal-\$\{Date\.now\(\)\}/.test(orchestratorSource), false);
  assert.equal(orchestratorSource.includes('proposal_id: ""'), false);

  const bridgeExpectedPayload = buildBookingApprovalCanonicalPayload(bookingApprovalRequestBase);
  const bridgeExpectedPayloadHash = computeBookingApprovalPayloadHash(bridgeExpectedPayload);

  let rpcCallCount = 0;

  const mockSupabase = {} as import("@supabase/supabase-js").SupabaseClient;

  const createResult = await recordBookingApprovalActionRequest(
    mockSupabase,
    bookingApprovalRequestBase,
    {
      now: () => fixedNow,
      rpcCaller: async (params) => {
        rpcCallCount += 1;
        assert.equal(params.action_key, "booking.create");
        assert.deepEqual(params.payload, bridgeExpectedPayload);
        assert.equal(params.payload_hash, bridgeExpectedPayloadHash);
        assert.equal(params.idempotency_key, "idem-bridge-36b");
        assert.equal(params.expires_at, expectedExpiresAt);
        return {
          data: {
            success: true,
            outcome_code: "BOOKING_ACTION_REQUESTED",
            action_request_id: "req-create-001",
            expires_at: params.expires_at,
            idempotent_replay: false,
          },
          error: null,
        };
      },
    },
  );

  assert.equal(createResult.success, true);
  assert.equal(createResult.outcome_code, "BOOKING_ACTION_REQUESTED");
  assert.equal(createResult.action_request_id, "req-create-001");
  assert.equal(createResult.payload_hash, bridgeExpectedPayloadHash);
  assert.equal(createResult.idempotency_key, "idem-bridge-36b");
  assert.equal(createResult.expires_at, expectedExpiresAt);
  assert.equal(createResult.idempotent_replay, false);

  const replayResult = await recordBookingApprovalActionRequest(
    mockSupabase,
    bookingApprovalRequestBase,
    {
      now: () => fixedNow,
      rpcCaller: async () => ({
        data: {
          success: true,
          outcome_code: "IDEMPOTENT_REPLAY",
          action_request_id: "req-create-001",
          expires_at: expectedExpiresAt,
          idempotent_replay: true,
        },
        error: null,
      }),
    },
  );

  assert.equal(replayResult.success, true);
  assert.equal(replayResult.outcome_code, "IDEMPOTENT_REPLAY");
  assert.equal(replayResult.action_request_id, "req-create-001");
  assert.equal(replayResult.idempotent_replay, true);

  const conflictResult = await recordBookingApprovalActionRequest(
    mockSupabase,
    {
      ...bookingApprovalRequestBase,
      start_at: "2026-06-25T09:00:00.000Z",
    },
    {
      now: () => fixedNow,
      rpcCaller: async () => ({
        data: {
          success: false,
          outcome_code: "IDEMPOTENCY_CONFLICT",
          action_request_id: "req-create-001",
          expires_at: expectedExpiresAt,
          idempotent_replay: false,
        },
        error: null,
      }),
    },
  );

  assert.equal(conflictResult.success, false);
  assert.equal(conflictResult.outcome_code, "IDEMPOTENCY_CONFLICT");
  assert.equal(conflictResult.action_request_id, "req-create-001");
  assert.equal(conflictResult.idempotent_replay, false);
  assert.equal(conflictResult.payload_hash, computeBookingApprovalPayloadHash(changedBookingPayload));

  const rpcFailureResult = await recordBookingApprovalActionRequest(
    mockSupabase,
    bookingApprovalRequestBase,
    {
      now: () => fixedNow,
      rpcCaller: async () => ({
        data: null,
        error: { message: "permission denied for function record_companion_booking_action_request" },
      }),
    },
  );

  assert.equal(rpcFailureResult.success, false);
  assert.equal(rpcFailureResult.outcome_code, "REQUEST_FAILED");
  assert.equal(rpcFailureResult.action_request_id, null);
  assert.equal(
    rpcFailureResult.outcome_code.includes("permission"),
    false,
    "RPC failure must not leak internal error text",
  );

  assert.equal(rpcCallCount, 1);

  console.log("phase36b.test.ts: all assertions passed");
}

runPhase36bAsyncTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
