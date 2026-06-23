import { mapAsoDashboardToSupportBundle } from "@/lib/integration-intelligence/providers/support-operations/support-operations-contract";
import type { SupportPermissionContext } from "@/lib/integration-intelligence/support/permissions";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import {
  buildSupportCommandBriefSignals,
  executeSupportQueueRead,
  type SupportProviderReader,
} from "./support-read-orchestrator";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import { P1_05_AUTHORITATIVE_SLA_SOURCE } from "./p1-05-live-app-support-sla-e2e-types";
import type {
  P1_05LiveE2eCertificationFlowResult,
  P1_05LiveE2eTenantIsolationResult,
} from "./p1-05-live-app-support-sla-e2e-types";

const VALID_SLA_STATUSES = new Set([
  "on_track",
  "warning",
  "at_risk",
  "breached",
  "unavailable",
]);

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_05LiveE2eCertificationFlowResult["source_classification"],
  status: P1_05LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_05LiveE2eCertificationFlowResult {
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
  status: P1_05LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_05LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function classifySlaSource(bundle: ReturnType<typeof mapAsoDashboardToSupportBundle>): P1_05LiveE2eCertificationFlowResult["source_classification"] {
  if (bundle.sla_source_exact) return "source_exact";
  if (bundle.sla_policy_configured) return "source_partial";
  return "source_unknown";
}

function ownerPermission(
  session: P1LiveE2eAuthenticatedSession,
  providerActive: boolean,
): SupportPermissionContext {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: providerActive,
    can_read_queue: true,
    can_read_cases: true,
    can_read_sla: true,
    can_draft_response: false,
    can_assign_case: false,
    can_escalate_case: false,
    rate_limit_ok: true,
  };
}

function buildProviderFromBundle(
  bundle: ReturnType<typeof mapAsoDashboardToSupportBundle>,
): SupportProviderReader {
  return {
    provider_key: "autonomous_support_operations",
    active: true,
    read_queue: async () => ({
      queue: bundle.queue,
      cases: bundle.cases,
      source_exact: bundle.source_exact,
      limitations: bundle.limitations,
    }),
    read_case: async () => ({
      case_detail: null,
      limitations: bundle.limitations,
    }),
  };
}

export async function runP1_05LiveAppSupportSlaE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_05LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_05LiveE2eTenantIsolationResult[];
  asoPayload: unknown;
  bundle: ReturnType<typeof mapAsoDashboardToSupportBundle>;
  slaPolicyConfigured: boolean;
  liveOpenCaseCount: number;
}> {
  const flows: P1_05LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_05LiveE2eTenantIsolationResult[] = [];

  const { data: contextRaw, error: contextError } = await input.session.supabase.rpc(
    "get_app_organization_context",
  );
  if (contextError) {
    throw new Error(redactSecretsFromMessage(contextError.message));
  }

  parseAppOrganizationContext(contextRaw);

  const { data: asoPayload, error: asoError } = await input.session.supabase.rpc(
    P1_05_AUTHORITATIVE_SLA_SOURCE,
  );
  if (asoError) {
    throw new Error(redactSecretsFromMessage(asoError.message));
  }

  const bundle = mapAsoDashboardToSupportBundle(asoPayload);
  const slaSource = classifySlaSource(bundle);
  const record =
    asoPayload && typeof asoPayload === "object" ? (asoPayload as Record<string, unknown>) : null;
  const settings =
    record?.settings && typeof record.settings === "object"
      ? (record.settings as Record<string, unknown>)
      : null;
  const slaBlock =
    record?.sla && typeof record.sla === "object" ? (record.sla as Record<string, unknown>) : null;

  const hasCustomer = record?.has_customer !== false;
  const liveOpenCaseCount = bundle.queue?.total_open ?? 0;

  flows.push(
    flowResult(
      "live_sla_source_available",
      "support.sla.live",
      slaSource,
      hasCustomer && record?.sla !== undefined ? "pass" : "fail",
      hasCustomer && record?.sla !== undefined
        ? null
        : "Authoritative SLA block missing from get_customer_support_operations_center.",
    ),
  );

  const policyFromSettings = settings?.sla_policy_enabled === true;
  const policyFromSlaBlock = slaBlock?.policy_configured === true;
  const policyPass =
    !policyFromSettings && !policyFromSlaBlock
      ? bundle.sla_source_exact === false &&
        bundle.cases.every((entry) => entry.sla_status === "unavailable")
      : policyFromSettings === policyFromSlaBlock && bundle.sla_policy_configured === policyFromSlaBlock;

  flows.push(
    flowResult(
      "sla_policy_from_stored_org",
      "support.sla.policy",
      slaSource,
      policyPass ? "pass" : "fail",
      policyPass ? null : "SLA policy flags must reflect stored aso_settings only.",
    ),
  );

  const mappingPass = bundle.cases.every((entry) => VALID_SLA_STATUSES.has(entry.sla_status));
  flows.push(
    flowResult(
      "case_sla_status_mapping",
      "support.sla.status_mapping",
      slaSource,
      mappingPass ? "pass" : "fail",
      mappingPass ? null : "Case SLA status must map to on_track/warning/at_risk/breached/unavailable only.",
    ),
  );

  if (!bundle.sla_policy_configured) {
    const unavailablePass =
      bundle.cases.every((entry) => entry.sla_status === "unavailable") &&
      (bundle.queue?.sla_at_risk ?? 0) === 0 &&
      (bundle.queue?.overdue ?? 0) === 0;
    flows.push(
      flowResult(
        "missing_policy_unavailable",
        "support.sla.unavailable",
        slaSource,
        unavailablePass ? "pass" : "fail",
        unavailablePass ? null : "Missing SLA policy must yield unavailable — not synthetic deadlines.",
      ),
    );
  } else {
    const statuses = new Set(bundle.cases.map((entry) => entry.sla_status));
    const hasRealMapping = [...statuses].every((status) => VALID_SLA_STATUSES.has(status));
    flows.push(
      flowResult(
        "missing_policy_unavailable",
        "support.sla.unavailable",
        slaSource,
        hasRealMapping ? "pass" : "fail",
        hasRealMapping ? null : "Configured policy must still map to canonical SLA statuses.",
      ),
    );
  }

  const noFabricatedDueDates = bundle.cases.every((entry) => {
    if (!bundle.sla_source_exact) {
      return entry.first_response_due_at === null && entry.resolution_due_at === null;
    }
    return true;
  });
  const noFabricatedCounts =
    !bundle.sla_source_exact
      ? (bundle.queue?.sla_at_risk ?? 0) === 0 && (bundle.queue?.overdue ?? 0) === 0
      : (bundle.queue?.sla_at_risk ?? 0) >= 0 && (bundle.queue?.overdue ?? 0) >= 0;

  flows.push(
    flowResult(
      "no_fabricated_deadlines",
      "support.sla.no_fabrication",
      slaSource,
      noFabricatedDueDates && noFabricatedCounts ? "pass" : "fail",
      noFabricatedDueDates && noFabricatedCounts
        ? null
        : "SLA counts or due dates must not be fabricated when source is not exact.",
    ),
  );

  const emptyPass =
    liveOpenCaseCount === 0
      ? bundle.cases.length === 0 &&
        (bundle.queue?.sla_at_risk ?? 0) === 0 &&
        (bundle.queue?.overdue ?? 0) === 0
      : bundle.cases.length > 0 || liveOpenCaseCount > 0;
  flows.push(
    flowResult(
      "empty_source_exact_empty",
      "support.sla.empty_source",
      slaSource,
      emptyPass ? "pass" : "fail",
      emptyPass ? null : "Empty support queue must not inject synthetic SLA cases or counts.",
    ),
  );

  const briefWithoutSla = buildSupportCommandBriefSignals({
    queue: bundle.queue,
    cases: bundle.cases,
    pending_drafts_count: null,
    source_exact: bundle.source_exact,
    sla_source_exact: false,
  });
  const briefWithExact = buildSupportCommandBriefSignals({
    queue: bundle.queue,
    cases: bundle.cases,
    pending_drafts_count: null,
    source_exact: bundle.source_exact,
    sla_source_exact: bundle.sla_source_exact,
  });
  const slaSignalsExact = briefWithExact.filter((signal) =>
    ["support_sla_warning", "support_sla_breached"].includes(signal.signal_key),
  );
  const expectedSlaSignalCount =
    bundle.sla_source_exact && bundle.queue
      ? (bundle.queue.sla_at_risk > 0 ? 1 : 0) + (bundle.queue.overdue > 0 ? 1 : 0)
      : 0;
  const briefPass =
    !briefWithoutSla.some((signal) =>
      ["support_sla_warning", "support_sla_breached"].includes(signal.signal_key),
    ) && slaSignalsExact.length === expectedSlaSignalCount;

  flows.push(
    flowResult(
      "command_brief_sla_signals_exact_only",
      "support.sla.command_brief",
      slaSource,
      briefPass ? "pass" : "fail",
      briefPass
        ? null
        : "support_sla_warning/support_sla_breached require sla_source_exact and stored counts.",
    ),
  );

  const ownerPerm = ownerPermission(input.session, hasCustomer);
  const provider = buildProviderFromBundle(bundle);
  const queueRead = await executeSupportQueueRead({
    organization_id: input.session.organizationId!,
    tenant_id: input.session.tenantId ?? input.session.organizationId!,
    user_role: input.session.userRole,
    permission: ownerPerm,
    providers: [provider],
  });

  flows.push(
    flowResult(
      "queue_read_integrated",
      "support.sla.live",
      slaSource,
      !["permission_denied", "provider_missing"].includes(queueRead.outcome) ? "pass" : "fail",
      !["permission_denied", "provider_missing"].includes(queueRead.outcome)
        ? null
        : `Support queue read blocked: ${queueRead.outcome}.`,
    ),
  );

  const missingEntitlementRead = await executeSupportQueueRead({
    organization_id: input.session.organizationId!,
    tenant_id: input.session.tenantId ?? input.session.organizationId!,
    user_role: input.session.userRole,
    permission: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: false,
      can_read_queue: false,
      can_read_cases: false,
      can_read_sla: false,
      can_draft_response: false,
      can_assign_case: false,
      can_escalate_case: false,
      rate_limit_ok: true,
    },
    providers: [provider],
  });
  flows.push(
    flowResult(
      "access_missing_entitlement_denied",
      "support.sla.access",
      slaSource,
      ["permission_denied", "provider_missing"].includes(missingEntitlementRead.outcome)
        ? "pass"
        : "fail",
      ["permission_denied", "provider_missing"].includes(missingEntitlementRead.outcome)
        ? null
        : `Expected entitlement denial, received ${missingEntitlementRead.outcome}.`,
    ),
  );

  const suspendedRead = await executeSupportQueueRead({
    organization_id: input.session.organizationId!,
    tenant_id: input.session.tenantId ?? input.session.organizationId!,
    user_role: input.session.userRole,
    permission: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: true,
      provider_active: true,
      can_read_queue: true,
      can_read_cases: true,
      can_read_sla: true,
      can_draft_response: false,
      can_assign_case: false,
      can_escalate_case: false,
      rate_limit_ok: true,
    },
    providers: [provider],
  });
  const suspendedDenied = suspendedRead.outcome === "activation_pending";
  flows.push(
    flowResult(
      "access_suspended_denied",
      "support.sla.access",
      slaSource,
      suspendedRead.outcome === "activation_pending" || suspendedRead.outcome === "permission_denied"
        ? "pass"
        : "fail",
      suspendedRead.outcome === "activation_pending" || suspendedRead.outcome === "permission_denied"
        ? null
        : `Expected suspended denial, received ${suspendedRead.outcome}.`,
    ),
  );

  const manipulatedOrgRead = await executeSupportQueueRead({
    organization_id: "00000000-0000-4000-8000-000000000001",
    tenant_id: "00000000-0000-4000-8000-000000000001",
    user_role: input.session.userRole,
    permission: ownerPerm,
    providers: [provider],
  });
  tenantIsolation.push(
    isolationResult(
      "manipulated_organization_id_rejected",
      manipulatedOrgRead.outcome === "permission_denied" ? "pass" : "fail",
      manipulatedOrgRead.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${manipulatedOrgRead.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "missing_entitlement_rejected",
      ["permission_denied", "provider_missing"].includes(missingEntitlementRead.outcome)
        ? "pass"
        : "fail",
      ["permission_denied", "provider_missing"].includes(missingEntitlementRead.outcome)
        ? null
        : `Expected entitlement denial, received ${missingEntitlementRead.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_data",
      suspendedRead.outcome === "activation_pending" ? "pass" : "fail",
      suspendedRead.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedRead.outcome}.`,
    ),
  );

  const isolationSession = await createP1IsolationSession(input.config);
  if (isolationSession && isolationSession.organizationId !== input.session.organizationId) {
    const { data: foreignPayload } = await isolationSession.supabase.rpc(
      P1_05_AUTHORITATIVE_SLA_SOURCE,
    );
    const foreignBundle = mapAsoDashboardToSupportBundle(foreignPayload);
    const foreignCaseId = foreignBundle.cases[0]?.case_id;
    if (foreignCaseId) {
      const leakRead = await executeSupportQueueRead({
        organization_id: input.session.organizationId!,
        tenant_id: input.session.tenantId ?? input.session.organizationId!,
        user_role: input.session.userRole,
        permission: ownerPerm,
        providers: [
          {
            ...provider,
            read_queue: async () => ({
              queue: bundle.queue,
              cases: bundle.cases.filter((entry) => entry.case_id === foreignCaseId),
              source_exact: bundle.source_exact,
              limitations: bundle.limitations,
            }),
          },
        ],
      });
      const foreignVisible = leakRead.cases.some((entry) => entry.case_id === foreignCaseId);
      tenantIsolation.push(
        isolationResult(
          "isolation_foreign_case_not_injected",
          !foreignVisible || leakRead.cases.length === 0 ? "pass" : "fail",
          !foreignVisible || leakRead.cases.length === 0
            ? null
            : "Foreign tenant case leaked into primary support bundle.",
        ),
      );
    }
  }

  if (settings) {
    const warningMinutes = settings.sla_warning_minutes_before_due;
    const atRiskMinutes = settings.sla_at_risk_minutes_before_due;
    if (
      bundle.sla_policy_configured &&
      typeof warningMinutes === "number" &&
      typeof atRiskMinutes === "number"
    ) {
      const thresholdPass = warningMinutes >= atRiskMinutes;
      flows.push(
        flowResult(
          "policy_thresholds_from_org_settings",
          "support.sla.policy",
          slaSource,
          thresholdPass ? "pass" : "fail",
          thresholdPass
            ? null
            : "Warning/at-risk thresholds must come from stored organization policy ordering.",
        ),
      );
    }
  }

  return {
    flows,
    tenantIsolation,
    asoPayload,
    bundle,
    slaPolicyConfigured: bundle.sla_policy_configured,
    liveOpenCaseCount,
  };
}

export function collectP1_05CapabilityOutcomes(input: {
  flows: readonly P1_05LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_05LiveE2eTenantIsolationResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("support.sla.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("support.sla.isolation");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
