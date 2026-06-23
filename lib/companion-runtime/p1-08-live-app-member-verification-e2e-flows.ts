import { isMemberVerificationReadSourceConnected } from "@/lib/integration-intelligence/providers/member-verification/member-verification-source-map";
import {
  mapMemberVerificationCenterPayload,
  MEMBER_VERIFICATION_READ_RPC,
} from "@/lib/integration-intelligence/providers/member-verification/member-verification-read-provider-adapter";
import type { VerificationPermissionContext } from "@/lib/integration-intelligence/verification/permissions";
import { isVerificationCapabilityBlocked } from "@/lib/integration-intelligence/verification/types";
import type { VerificationQueueSummary } from "@/lib/integration-intelligence/verification/types";
import {
  buildVerificationCommandBriefSignals,
  executeVerificationCaseRead,
  executeVerificationQueueRead,
} from "./verification-read-orchestrator";
import {
  listVerificationAuditEvents,
  resetVerificationAuditLogForTests,
} from "./verification-audit";
import { createVerificationReadProviderBridge } from "./verification-read-provider-bridge";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { P1_08_AUTHORITATIVE_VERIFICATION_SOURCE } from "./p1-08-live-app-member-verification-e2e-types";
import type {
  P1_08LiveE2eCertificationFlowResult,
  P1_08LiveE2eTenantIsolationResult,
} from "./p1-08-live-app-member-verification-e2e-types";

const VALID_STATUSES = new Set([
  "pending",
  "in_review",
  "needs_information",
  "approved",
  "rejected",
  "expired",
  "cancelled",
]);

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_08LiveE2eCertificationFlowResult["source_classification"],
  status: P1_08LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_08LiveE2eCertificationFlowResult {
  return {
    flow_id,
    capability,
    source_classification,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function isolationResult(
  check_id: string,
  status: P1_08LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_08LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function ownerPermission(
  session: P1LiveE2eAuthenticatedSession,
  providerActive: boolean,
  overrides: Partial<VerificationPermissionContext> = {},
): VerificationPermissionContext {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: providerActive,
    can_view_queue: true,
    can_view_case: true,
    rate_limit_ok: true,
    ...overrides,
  };
}

export async function runP1_08LiveAppMemberVerificationE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_08LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_08LiveE2eTenantIsolationResult[];
  livePendingCount: number;
  rpcPayload: unknown;
}> {
  const flows: P1_08LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_08LiveE2eTenantIsolationResult[] = [];

  resetVerificationAuditLogForTests();

  const orgId = input.session.organizationId!;
  const tenantId = input.session.tenantId ?? orgId;
  const bridge = createVerificationReadProviderBridge(input.session.supabase);
  const writeSource = "source_exact" as const;

  const queueConnected = isMemberVerificationReadSourceConnected("verification_queue.read");
  const caseConnected = isMemberVerificationReadSourceConnected("verification_case.read");
  const statusConnected = isMemberVerificationReadSourceConnected("verification_status.read");

  flows.push(
    flowResult(
      "provider_connected",
      "verification.provider.connected",
      queueConnected ? writeSource : "source_unknown",
      queueConnected && caseConnected && statusConnected ? "pass" : "fail",
      queueConnected && caseConnected && statusConnected
        ? null
        : "Member verification authoritative source must be marked live.",
    ),
  );

  const { data: rpcPayload, error: rpcError } = await input.session.supabase.rpc(
    P1_08_AUTHORITATIVE_VERIFICATION_SOURCE,
    { p_section: "queue", p_case_id: null },
  );
  if (rpcError) {
    throw new Error(redactSecretsFromMessage(rpcError.message));
  }

  const bundle = mapMemberVerificationCenterPayload(rpcPayload);
  const record =
    rpcPayload && typeof rpcPayload === "object" ? (rpcPayload as Record<string, unknown>) : null;
  const hasCustomer = record?.found === true;
  const livePendingCount = bundle.queue?.total_pending ?? 0;

  flows.push(
    flowResult(
      "live_verification_source_available",
      "verification.queue.live",
      bundle.source_exact ? writeSource : "source_partial",
      hasCustomer && bundle.source_exact ? "pass" : "fail",
      hasCustomer && bundle.source_exact
        ? null
        : "Authoritative verification block missing from get_customer_member_verification_center.",
    ),
  );

  const statusMappingPass = bundle.cases.every((entry) => VALID_STATUSES.has(entry.status));
  flows.push(
    flowResult(
      "case_status_mapping",
      "verification.case.status",
      bundle.source_exact ? writeSource : "source_partial",
      statusMappingPass ? "pass" : "fail",
      statusMappingPass ? null : "Verification status must map to canonical normalized statuses only.",
    ),
  );

  flows.push(
    flowResult(
      "queue_status_fields",
      "verification.queue.status",
      bundle.source_exact ? writeSource : "source_partial",
      bundle.queue != null ? "pass" : "fail",
      bundle.queue != null ? null : "Queue summary must be present from authoritative source.",
    ),
  );

  const priorityPass = bundle.cases.every(
    (entry) => entry.priority === null || ["low", "normal", "high"].includes(entry.priority),
  );
  flows.push(
    flowResult(
      "queue_priority_fields",
      "verification.queue.priority",
      bundle.source_exact ? writeSource : "source_partial",
      priorityPass ? "pass" : "fail",
      priorityPass ? null : "Priority must map to low/normal/high only.",
    ),
  );

  const needsInfoCount = bundle.cases.filter((entry) => entry.status === "needs_information").length;
  const needsInfoPass =
    bundle.queue != null ? bundle.queue.needs_information === needsInfoCount : needsInfoCount === 0;
  flows.push(
    flowResult(
      "needs_information_count",
      "verification.queue.needs_information",
      bundle.source_exact ? writeSource : "source_partial",
      needsInfoPass ? "pass" : "fail",
      needsInfoPass ? null : "needs_information count must match authoritative case rows.",
    ),
  );

  const proxyPartial: VerificationQueueSummary = {
    total_pending: 1,
    needs_information: 0,
    in_review: 0,
    high_priority: 0,
    oldest_pending_at: null,
    generated_at: new Date().toISOString(),
    source_reference: "rpc:get_customer_community_network_center:best_practices",
    freshness: "fresh",
    completeness: "partial",
    permission_scope: "queue",
  };
  const noFabricationPass =
    bundle.source_exact &&
    proxyPartial.completeness === "partial" &&
    (livePendingCount === 0
      ? bundle.cases.length === 0
      : bundle.cases.every((entry) => entry.completeness === "complete"));
  flows.push(
    flowResult(
      "no_fabricated_cases",
      "verification.queue.no_fabrication",
      bundle.source_exact ? writeSource : "source_partial",
      noFabricationPass ? "pass" : "fail",
      noFabricationPass
        ? null
        : "Verification cases must come from authoritative RPC only — not community proxy.",
    ),
  );

  const emptyPass =
    livePendingCount === 0
      ? bundle.cases.length === 0 && (bundle.queue?.total_pending ?? 0) === 0
      : bundle.cases.length === livePendingCount;
  flows.push(
    flowResult(
      "empty_source_exact_empty",
      "verification.queue.empty_source",
      bundle.source_exact ? writeSource : "source_partial",
      emptyPass ? "pass" : "fail",
      emptyPass ? null : "Empty verification queue must not inject synthetic cases or counts.",
    ),
  );

  const briefPartial = buildVerificationCommandBriefSignals({
    queue: proxyPartial,
    source_exact: false,
  });
  const briefExact = buildVerificationCommandBriefSignals({
    queue: bundle.queue,
    source_exact: bundle.source_exact,
  });
  const expectedExactSignals =
    bundle.source_exact && bundle.queue
      ? (bundle.queue.total_pending > 0 ? 1 : 0) +
        (bundle.queue.needs_information > 0 ? 1 : 0) +
        (bundle.queue.high_priority > 0 ? 1 : 0) +
        (bundle.queue.oldest_pending_at ? 1 : 0)
      : 0;
  const briefPass =
    briefPartial.length === 0 && briefExact.length === expectedExactSignals;
  flows.push(
    flowResult(
      "command_brief_verification_signals_exact_only",
      "verification.command_brief.exact_only",
      bundle.source_exact ? writeSource : "source_partial",
      briefPass ? "pass" : "fail",
      briefPass
        ? null
        : "Verification Command Brief signals require source_exact — partial proxy counts excluded.",
    ),
  );

  flows.push(
    flowResult(
      "verification_status_exact",
      "verification.status.exact",
      statusConnected ? writeSource : "source_unknown",
      bundle.source_exact && bundle.queue != null ? "pass" : "fail",
      bundle.source_exact && bundle.queue != null
        ? null
        : "verification_status.read must use exact queue summary only.",
    ),
  );

  const permission = ownerPermission(input.session, bundle.source_exact);
  const provider = bridge.buildProviderReader(bundle);
  const queueRead = await executeVerificationQueueRead({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    providers: [provider],
  });
  flows.push(
    flowResult(
      "orchestrator_queue_read",
      "verification.queue.live",
      bundle.source_exact ? writeSource : "source_partial",
      ["exact_match", "empty_queue"].includes(queueRead.outcome) ? "pass" : "fail",
      ["exact_match", "empty_queue"].includes(queueRead.outcome)
        ? null
        : `Queue orchestrator read failed: ${queueRead.outcome}.`,
    ),
  );

  const sampleCaseId = bundle.cases[0]?.case_id ?? null;
  if (sampleCaseId) {
    const caseRead = await executeVerificationCaseRead({
      organization_id: orgId,
      tenant_id: tenantId,
      user_role: input.session.userRole,
      case_id: sampleCaseId,
      permission,
      providers: [provider],
    });
    flows.push(
      flowResult(
        "orchestrator_case_read",
        "verification.case.live",
        bundle.source_exact ? writeSource : "source_partial",
        caseRead.outcome === "exact_match" ? "pass" : "fail",
        caseRead.outcome === "exact_match"
          ? null
          : `Case orchestrator read failed: ${caseRead.outcome}.`,
      ),
    );

    const serializedCase = JSON.stringify(caseRead.case_summary ?? {});
    flows.push(
      flowResult(
        "case_no_documents",
        "verification.case.no_documents",
        bundle.source_exact ? writeSource : "source_partial",
        !serializedCase.includes("document") &&
          !serializedCase.includes("id_number") &&
          !serializedCase.includes("@")
          ? "pass"
          : "fail",
        "Case metadata must not expose documents or identity numbers.",
      ),
    );
  } else {
    flows.push(
      flowResult(
        "orchestrator_case_read",
        "verification.case.live",
        bundle.source_exact ? writeSource : "source_partial",
        livePendingCount === 0 ? "pass" : "fail",
        livePendingCount === 0 ? null : "Expected at least one case for case read when queue is non-empty.",
      ),
    );
    flows.push(
      flowResult(
        "case_no_documents",
        "verification.case.no_documents",
        writeSource,
        "pass",
        null,
      ),
    );
  }

  const deniedRead = await executeVerificationQueueRead({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: ownerPermission(input.session, true, { can_view_queue: false }),
    providers: [provider],
  });
  flows.push(
    flowResult(
      "permission_denied_read",
      "verification.queue.access",
      writeSource,
      deniedRead.outcome === "permission_denied" ? "pass" : "fail",
      deniedRead.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${deniedRead.outcome}.`,
    ),
  );

  const suspendedRead = await executeVerificationQueueRead({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: ownerPermission(input.session, true, { app_suspended: true }),
    providers: [provider],
  });
  flows.push(
    flowResult(
      "suspended_app_denied",
      "verification.queue.access",
      writeSource,
      suspendedRead.outcome === "activation_pending" ? "pass" : "fail",
      suspendedRead.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedRead.outcome}.`,
    ),
  );

  const crossTenant = await executeVerificationQueueRead({
    organization_id: "00000000-0000-4000-8000-000000000001",
    tenant_id: "00000000-0000-4000-8000-000000000001",
    user_role: input.session.userRole,
    permission,
    providers: [provider],
  });
  tenantIsolation.push(
    isolationResult(
      "manipulated_organization_id_rejected",
      crossTenant.outcome === "permission_denied" ? "pass" : "fail",
      crossTenant.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${crossTenant.outcome}.`,
    ),
  );

  const inactiveProvider = await executeVerificationQueueRead({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: ownerPermission(input.session, false),
    providers: [provider],
  });
  tenantIsolation.push(
    isolationResult(
      "inactive_provider_rejected",
      inactiveProvider.outcome === "provider_missing" ? "pass" : "fail",
      inactiveProvider.outcome === "provider_missing"
        ? null
        : `Expected provider_missing, received ${inactiveProvider.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_read",
      suspendedRead.outcome === "activation_pending" ? "pass" : "fail",
      suspendedRead.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedRead.outcome}.`,
    ),
  );

  const isolationSession = await createP1IsolationSession(input.config);
  if (isolationSession && isolationSession.organizationId !== input.session.organizationId) {
    const foreignBridge = createVerificationReadProviderBridge(isolationSession.supabase);
    const foreignBundle = await foreignBridge.fetchQueue();
    const primaryBridge = createVerificationReadProviderBridge(input.session.supabase);
    if (foreignBundle.cases[0]?.case_id) {
      const foreignCaseId = foreignBundle.cases[0].case_id;
      const primaryLookup = await primaryBridge.fetchCase(foreignCaseId);
      tenantIsolation.push(
        isolationResult(
          "foreign_case_not_visible_in_primary_tenant",
          !primaryLookup.cases.some((entry) => entry.case_id === foreignCaseId) ? "pass" : "fail",
          !primaryLookup.cases.some((entry) => entry.case_id === foreignCaseId)
            ? null
            : "Foreign tenant verification case must not appear in primary tenant read.",
        ),
      );
    }
  }

  const blockedCaps = [
    "verification.auto_approve",
    "verification.auto_reject",
    "verification_review.create",
  ] as const;
  flows.push(
    flowResult(
      "blocked_capabilities",
      "verification.blocked",
      writeSource,
      blockedCaps.every((cap) => isVerificationCapabilityBlocked(cap)) ? "pass" : "fail",
      blockedCaps.every((cap) => isVerificationCapabilityBlocked(cap))
        ? null
        : "Forbidden verification write capabilities must remain blocked.",
    ),
  );

  const auditEvents = listVerificationAuditEvents(orgId);
  const auditSerialized = JSON.stringify(auditEvents);
  flows.push(
    flowResult(
      "audit_without_pii",
      "verification.audit",
      writeSource,
      auditEvents.length > 0 &&
        !auditSerialized.includes("@") &&
        !auditSerialized.includes("document_url") &&
        !auditSerialized.includes("id_number")
        ? "pass"
        : "fail",
      auditEvents.length > 0 &&
        !auditSerialized.includes("@") &&
        !auditSerialized.includes("document_url")
        ? null
        : "Verification audit must exclude contact details and document fields.",
    ),
  );

  return {
    flows,
    tenantIsolation,
    livePendingCount,
    rpcPayload,
  };
}

export function collectP1_08CapabilityOutcomes(input: {
  flows: readonly P1_08LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_08LiveE2eTenantIsolationResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("verification.queue.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("verification.queue.isolation");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
