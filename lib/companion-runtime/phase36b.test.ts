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
import { resolveBookingApprovalRequest } from "@/lib/companion-runtime/booking-approval-request-resolver";
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
import {
  BOOKING_WRITE_RPC,
  executeCompanionBookingWrite,
} from "@/lib/integration-intelligence/providers/appointment-booking/booking-write-adapter";

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

  const approvalResolverCallCount = { value: 0 };
  const resolverOrchestratorRequest = {
    capability_key: "booking.create" as const,
    ...writeRequestBase,
    idempotency_key: "idem-resolver-orchestrator",
    action_request_id: "req-resolver-existing",
    confirmed: true,
  };
  const resolverOrchestratorHash = computeBookingApprovalPayloadHash(
    buildBookingApprovalCanonicalPayload(resolverOrchestratorRequest),
  );
  const bridgeCountBeforeResolverCases = approvalBridgeCallCount.value;

  const resolverWriteGate = async () => {
    executeWriteCallCount += 1;
    return { executed: true, failure_reason: null };
  };

  const pendingExistingId = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    record_approval_request: async () => {
      approvalBridgeCallCount.value += 1;
      throw new Error("bridge must not run when action_request_id is set");
    },
    resolve_approval_request: async (actionRequestId) => {
      approvalResolverCallCount.value += 1;
      assert.equal(actionRequestId, "req-resolver-existing");
      return { outcome: "approval_pending" };
    },
    execute_write: resolverWriteGate,
    request: resolverOrchestratorRequest,
  });
  assert.equal(pendingExistingId.outcome, "approval_required");
  assert.equal(pendingExistingId.action_request_id, "req-resolver-existing");
  assert.equal(approvalBridgeCallCount.value, bridgeCountBeforeResolverCases);
  assert.equal(approvalResolverCallCount.value, 1);

  const approvedExistingId = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    record_approval_request: async () => {
      approvalBridgeCallCount.value += 1;
      throw new Error("bridge must not run when action_request_id is set");
    },
    resolve_approval_request: async () => {
      approvalResolverCallCount.value += 1;
      return {
        outcome: "approved",
        action_request_id: "req-resolver-existing",
        payload_hash: resolverOrchestratorHash,
        idempotency_key: "idem-resolver-orchestrator",
      };
    },
    execute_write: resolverWriteGate,
    request: resolverOrchestratorRequest,
  });
  assert.equal(approvedExistingId.outcome, "execution_source_missing");
  assert.equal(approvedExistingId.action_request_id, "req-resolver-existing");
  assert.equal(approvedExistingId.payload_hash, resolverOrchestratorHash);
  assert.equal(approvedExistingId.idempotency_key, "idem-resolver-orchestrator");
  assert.ok(
    approvedExistingId.limitations.some((entry) => entry.includes("writeExecutionSourceMissing")),
  );
  assert.equal(approvalBridgeCallCount.value, bridgeCountBeforeResolverCases);

  for (const [resolverOutcome, label] of [
    ["approval_rejected", "rejected"],
    ["approval_changes_requested", "changes requested"],
    ["approval_expired", "expired"],
  ] as const) {
    const result = await executeBookingWrite({
      organization_id: ORG_A,
      tenant_id: "tenant-a",
      user_role: "admin",
      permission: permissionCtx,
      provider_key: "appointment_booking",
      provider_write: providerWriteWithApproval,
      record_approval_request: async () => {
        approvalBridgeCallCount.value += 1;
        throw new Error("bridge must not run when action_request_id is set");
      },
      resolve_approval_request: async () => {
        approvalResolverCallCount.value += 1;
        return { outcome: resolverOutcome };
      },
      execute_write: resolverWriteGate,
      request: resolverOrchestratorRequest,
    });
    assert.equal(result.outcome, "failed", label);
    assert.equal(result.proposal, null, label);
  }

  for (const [resolverOutcome, label] of [
    ["already_consumed", "consumed"],
    ["verification_failed", "verification failed"],
    ["not_found", "not found"],
  ] as const) {
    const result = await executeBookingWrite({
      organization_id: ORG_A,
      tenant_id: "tenant-a",
      user_role: "admin",
      permission: permissionCtx,
      provider_key: "appointment_booking",
      provider_write: providerWriteWithApproval,
      resolve_approval_request: async () => {
        approvalResolverCallCount.value += 1;
        return { outcome: resolverOutcome };
      },
      execute_write: resolverWriteGate,
      request: resolverOrchestratorRequest,
    });
    assert.equal(result.outcome, "failed", label);
  }

  const mismatchApproved = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    resolve_approval_request: async () => {
      approvalResolverCallCount.value += 1;
      return { outcome: "verification_failed" };
    },
    execute_write: resolverWriteGate,
    request: resolverOrchestratorRequest,
  });
  assert.equal(mismatchApproved.outcome, "failed");

  const resolverCountBeforeUnconfirmed = approvalResolverCallCount.value;

  const unconfirmedWithExistingId = await executeBookingWrite({
    organization_id: ORG_A,
    tenant_id: "tenant-a",
    user_role: "admin",
    permission: permissionCtx,
    provider_key: "appointment_booking",
    provider_write: providerWriteWithApproval,
    record_approval_request: async () => {
      approvalBridgeCallCount.value += 1;
      throw new Error("bridge must not run for unconfirmed request");
    },
    resolve_approval_request: async () => {
      approvalResolverCallCount.value += 1;
      throw new Error("resolver must not run for unconfirmed request");
    },
    execute_write: resolverWriteGate,
    request: {
      ...resolverOrchestratorRequest,
      confirmed: false,
    },
  });
  assert.equal(unconfirmedWithExistingId.outcome, "confirmation_required");
  assert.equal(approvalBridgeCallCount.value, bridgeCountBeforeResolverCases);
  assert.equal(approvalResolverCallCount.value, resolverCountBeforeUnconfirmed);
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

  const resolverRequest = {
    ...bookingApprovalRequestBase,
    idempotency_key: "idem-resolver-36b",
  };
  const resolverExpectedHash = computeBookingApprovalPayloadHash(
    buildBookingApprovalCanonicalPayload(resolverRequest),
  );
  const resolverInput = {
    action_request_id: "req-resolver-001",
    request: resolverRequest,
  };

  function buildResolverRpcRow(overrides: Record<string, unknown> = {}) {
    return {
      success: true,
      outcome_code: "BOOKING_ACTION_REQUEST_FOUND",
      action_request_id: resolverInput.action_request_id,
      action_key: "booking.create",
      approval_status: "approved",
      lifecycle_status: "approved",
      execution_status: "none",
      payload_hash: resolverExpectedHash,
      idempotency_key: resolverRequest.idempotency_key,
      capability_key: "booking.create",
      provider_key: "appointment_booking",
      requested_action: "create",
      expired: false,
      consumed: false,
      ...overrides,
    };
  }

  const mockResolverSupabase = {} as import("@supabase/supabase-js").SupabaseClient;
  let resolverRpcCallCount = 0;

  const approvedMatch = await resolveBookingApprovalRequest(mockResolverSupabase, resolverInput, {
    rpcReader: async (actionRequestId) => {
      resolverRpcCallCount += 1;
      assert.equal(actionRequestId, resolverInput.action_request_id);
      return { data: buildResolverRpcRow(), error: null };
    },
  });
  assert.equal(approvedMatch.outcome, "approved");
  if (approvedMatch.outcome === "approved") {
    assert.equal(approvedMatch.action_request_id, resolverInput.action_request_id);
    assert.equal(approvedMatch.payload_hash, resolverExpectedHash);
    assert.equal(approvedMatch.idempotency_key, resolverRequest.idempotency_key);
  }

  for (const [overrides, expectedOutcome] of [
    [{ approval_status: "pending", lifecycle_status: "awaiting_approval" }, "approval_pending"],
    [
      {
        approval_status: "rejected",
        lifecycle_status: "rejected",
        execution_status: "cancelled",
      },
      "approval_rejected",
    ],
    [{ approval_status: "changes_requested", lifecycle_status: "proposed" }, "approval_changes_requested"],
    [{ approval_status: "pending", expired: true }, "approval_expired"],
    [
      {
        approval_status: "approved",
        lifecycle_status: "completed",
        execution_status: "completed",
        consumed: true,
      },
      "already_consumed",
    ],
  ] as const) {
    const result = await resolveBookingApprovalRequest(mockResolverSupabase, resolverInput, {
      rpcReader: async () => ({ data: buildResolverRpcRow(overrides), error: null }),
    });
    assert.equal(result.outcome, expectedOutcome);
  }

  for (const [overrides, label] of [
    [{ payload_hash: "0".repeat(64) }, "hash mismatch"],
    [{ idempotency_key: "other-idempotency-key" }, "idempotency mismatch"],
    [
      {
        action_key: "booking.update",
        capability_key: "booking.update",
        requested_action: "update",
        provider_key: "other_provider",
      },
      "capability/provider mismatch",
    ],
  ] as const) {
    const result = await resolveBookingApprovalRequest(mockResolverSupabase, resolverInput, {
      rpcReader: async () => ({ data: buildResolverRpcRow(overrides), error: null }),
    });
    assert.equal(result.outcome, "verification_failed", label);
  }

  const notFoundResult = await resolveBookingApprovalRequest(mockResolverSupabase, resolverInput, {
    rpcReader: async () => ({
      data: { success: false, outcome_code: "NOT_FOUND" },
      error: null,
    }),
  });
  assert.equal(notFoundResult.outcome, "not_found");

  const rpcErrorResult = await resolveBookingApprovalRequest(mockResolverSupabase, resolverInput, {
    rpcReader: async () => ({
      data: null,
      error: { message: "Permission denied: appointments.manage" },
    }),
  });
  assert.equal(rpcErrorResult.outcome, "not_found");
  assert.equal(JSON.stringify(rpcErrorResult).includes("Permission denied"), false);

  const malformedRpcResult = await resolveBookingApprovalRequest(mockResolverSupabase, resolverInput, {
    rpcReader: async () => ({
      data: { success: true, outcome_code: "BOOKING_ACTION_REQUEST_FOUND" },
      error: null,
    }),
  });
  assert.equal(malformedRpcResult.outcome, "verification_failed");

  assert.equal(resolverRpcCallCount, 1);

  const writeAdapterActionRequestId = "req-write-adapter-001";
  const writeAdapterAppointmentId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee";
  const writeAdapterAppointmentKey = "apt_write_adapter_001";
  const writeAdapterAuditId = "bbbbbbbb-cccc-dddd-eeee-ffffffffffff";
  const writeAdapterStartsAt = "2026-06-24T09:00:00.000Z";
  const writeAdapterEndsAt = "2026-06-24T10:30:00.000Z";

  function buildWriteAdapterRpcRow(overrides: Record<string, unknown> = {}) {
    return {
      success: true,
      outcome_code: "BOOKING_CREATED",
      appointment_id: writeAdapterAppointmentId,
      appointment_key: writeAdapterAppointmentKey,
      previous_status: null,
      current_status: "confirmed",
      starts_at: writeAdapterStartsAt,
      ends_at: writeAdapterEndsAt,
      audit_id: writeAdapterAuditId,
      idempotent_replay: false,
      channel_key: "companion",
      ...overrides,
    };
  }

  const mockWriteAdapterSupabase = {} as import("@supabase/supabase-js").SupabaseClient;

  const createdWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: buildWriteAdapterRpcRow(),
        error: null,
      }),
    },
  );
  assert.equal(createdWrite.executed, true);
  assert.equal(createdWrite.outcome_code, "BOOKING_CREATED");
  assert.equal(createdWrite.appointment_id, writeAdapterAppointmentId);
  assert.equal(createdWrite.appointment_key, writeAdapterAppointmentKey);
  assert.equal(createdWrite.previous_status, null);
  assert.equal(createdWrite.current_status, "confirmed");
  assert.equal(createdWrite.starts_at, writeAdapterStartsAt);
  assert.equal(createdWrite.ends_at, writeAdapterEndsAt);
  assert.equal(createdWrite.audit_id, writeAdapterAuditId);
  assert.equal(createdWrite.idempotent_replay, false);
  assert.equal(createdWrite.channel_key, "companion");

  const updatedWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: buildWriteAdapterRpcRow({
          outcome_code: "BOOKING_UPDATED",
          previous_status: "confirmed",
          current_status: "confirmed",
          starts_at: "2026-06-25T09:00:00.000Z",
          ends_at: "2026-06-25T10:30:00.000Z",
        }),
        error: null,
      }),
    },
  );
  assert.equal(updatedWrite.executed, true);
  assert.equal(updatedWrite.outcome_code, "BOOKING_UPDATED");
  assert.equal(updatedWrite.appointment_id, writeAdapterAppointmentId);
  assert.equal(updatedWrite.appointment_key, writeAdapterAppointmentKey);
  assert.equal(updatedWrite.previous_status, "confirmed");
  assert.equal(updatedWrite.starts_at, "2026-06-25T09:00:00.000Z");
  assert.equal(updatedWrite.ends_at, "2026-06-25T10:30:00.000Z");

  const cancelledWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: buildWriteAdapterRpcRow({
          outcome_code: "BOOKING_CANCELLED",
          previous_status: "confirmed",
          current_status: "cancelled",
          starts_at: writeAdapterStartsAt,
          ends_at: writeAdapterEndsAt,
        }),
        error: null,
      }),
    },
  );
  assert.equal(cancelledWrite.executed, true);
  assert.equal(cancelledWrite.outcome_code, "BOOKING_CANCELLED");
  assert.equal(cancelledWrite.appointment_id, writeAdapterAppointmentId);
  assert.equal(cancelledWrite.current_status, "cancelled");

  const replayWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: buildWriteAdapterRpcRow({
          idempotent_replay: true,
        }),
        error: null,
      }),
    },
  );
  assert.equal(replayWrite.executed, true);
  assert.equal(replayWrite.appointment_id, writeAdapterAppointmentId);
  assert.equal(replayWrite.appointment_key, writeAdapterAppointmentKey);
  assert.equal(replayWrite.idempotent_replay, true);

  const overlapWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: {
          success: false,
          outcome_code: "OVERLAP_CONFLICT",
          idempotent_replay: false,
        },
        error: null,
      }),
    },
  );
  assert.equal(overlapWrite.executed, false);
  assert.equal(overlapWrite.outcome_code, "OVERLAP_CONFLICT");
  assert.equal(overlapWrite.appointment_id, null);

  const approvalInvalidWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: {
          success: false,
          outcome_code: "APPROVAL_INVALID",
          idempotent_replay: false,
        },
        error: null,
      }),
    },
  );
  assert.equal(approvalInvalidWrite.executed, false);
  assert.equal(approvalInvalidWrite.outcome_code, "APPROVAL_INVALID");
  assert.equal(approvalInvalidWrite.appointment_id, null);

  const rpcFailureWrite = await executeCompanionBookingWrite(
    mockWriteAdapterSupabase,
    writeAdapterActionRequestId,
    {
      rpcCaller: async () => ({
        data: null,
        error: { message: "permission denied for function execute_apt610_companion_booking_write" },
      }),
    },
  );
  assert.equal(rpcFailureWrite.executed, false);
  assert.equal(rpcFailureWrite.outcome_code, "WRITE_FAILED");
  assert.equal(rpcFailureWrite.appointment_id, null);
  assert.equal(
    rpcFailureWrite.outcome_code.includes("permission"),
    false,
    "RPC failure must not leak internal error text",
  );

  let writeAdapterRpcCallCount = 0;
  let writeAdapterRpcParams: { p_action_request_id: string } | null = null;

  await executeCompanionBookingWrite(mockWriteAdapterSupabase, writeAdapterActionRequestId, {
    rpcCaller: async (params) => {
      writeAdapterRpcCallCount += 1;
      writeAdapterRpcParams = params;
      assert.equal(Object.keys(params).length, 1);
      assert.equal(params.p_action_request_id, writeAdapterActionRequestId);
      return {
        data: buildWriteAdapterRpcRow(),
        error: null,
      };
    },
  });

  assert.equal(writeAdapterRpcCallCount, 1);
  assert.ok(writeAdapterRpcParams);
  assert.deepEqual(writeAdapterRpcParams, {
    p_action_request_id: writeAdapterActionRequestId,
  });
  assert.equal(BOOKING_WRITE_RPC, "execute_apt610_companion_booking_write");

  const writeAdapterSource = fs.readFileSync(
    path.join(
      repoRoot,
      "lib/integration-intelligence/providers/appointment-booking/booking-write-adapter.ts",
    ),
    "utf8",
  );
  assert.equal(writeAdapterSource.includes("booking-approval-bridge"), false);
  assert.equal(writeAdapterSource.includes("booking-write-orchestrator"), false);
  assert.equal(writeAdapterSource.includes("recordBookingApprovalActionRequest"), false);
  assert.equal(writeAdapterSource.includes("resolveBookingApprovalRequest"), false);
  assert.equal(writeAdapterSource.includes("record_companion_booking_action_request"), false);
  assert.equal(writeAdapterSource.includes("get_companion_booking_action_request"), false);
  assert.equal(/Phase 346|phase.?346/i.test(writeAdapterSource), false);

  console.log("phase36b.test.ts: all assertions passed");
}

runPhase36bAsyncTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
