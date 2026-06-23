import { isSupportWriteSourceConnected } from "@/lib/integration-intelligence/providers/support-operations/support-source-map";
import {
  createSupportProbeCase,
} from "@/lib/integration-intelligence/providers/support-operations/support-write-provider-adapter";
import type { SupportPermissionContext } from "@/lib/integration-intelligence/support/permissions";
import { isSupportCapabilityBlocked } from "@/lib/integration-intelligence/support/types";
import { clearIdempotencyRegistryForTests } from "@/lib/companion-runtime/companion-action-idempotency";
import {
  listSupportAuditEvents,
  resetSupportAuditLogForTests,
} from "@/lib/companion-runtime/support-audit";
import { executeSupportWrite } from "@/lib/companion-runtime/support-write-orchestrator";
import { createSupportWriteProviderBridge, resolveSupportAssigneeUserId } from "@/lib/companion-runtime/support-write-provider-bridge";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import type {
  P1_06LiveE2eCertificationFlowResult,
  P1_06LiveE2eIdempotencyResult,
  P1_06LiveE2eTenantIsolationResult,
} from "./p1-06-live-app-support-case-write-e2e-types";

const PROBE_SUBJECT_PREFIX = "[p1-06-e2e-probe]";

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_06LiveE2eCertificationFlowResult["source_classification"],
  status: P1_06LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_06LiveE2eCertificationFlowResult {
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
  status: P1_06LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_06LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function idempotencyResult(
  check_id: string,
  status: P1_06LiveE2eIdempotencyResult["status"],
  failure_reason: string | null = null,
): P1_06LiveE2eIdempotencyResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function writePermission(
  session: P1LiveE2eAuthenticatedSession,
  overrides: Partial<SupportPermissionContext> = {},
): SupportPermissionContext {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: true,
    can_read_queue: true,
    can_read_cases: true,
    can_read_sla: false,
    can_draft_response: false,
    can_assign_case: true,
    can_escalate_case: true,
    rate_limit_ok: true,
    ...overrides,
  };
}

export async function runP1_06LiveAppSupportCaseWriteE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_06LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_06LiveE2eTenantIsolationResult[];
  idempotency: P1_06LiveE2eIdempotencyResult[];
  controlledProbeCaseCreated: boolean;
}> {
  const flows: P1_06LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_06LiveE2eTenantIsolationResult[] = [];
  const idempotency: P1_06LiveE2eIdempotencyResult[] = [];

  resetSupportAuditLogForTests();
  clearIdempotencyRegistryForTests();

  const orgId = input.session.organizationId!;
  const tenantId = input.session.tenantId ?? orgId;
  const bridge = createSupportWriteProviderBridge(input.session.supabase);
  const assigneeUserId =
    (await resolveSupportAssigneeUserId(
      input.session.supabase,
      input.session.session.user.id,
    )) ?? input.session.session.user.id;
  const writeSource = "source_exact" as const;

  const assignConnected = isSupportWriteSourceConnected("support_case.assign");
  const escalateConnected = isSupportWriteSourceConnected("support_case.escalate");

  flows.push(
    flowResult(
      "write_source_assign_live",
      "support.write.assign",
      assignConnected ? writeSource : "source_unknown",
      assignConnected ? "pass" : "fail",
      assignConnected ? null : "assign_support_case adapter not marked live.",
    ),
  );
  flows.push(
    flowResult(
      "write_source_escalate_live",
      "support.write.escalate",
      escalateConnected ? writeSource : "source_unknown",
      escalateConnected ? "pass" : "fail",
      escalateConnected ? null : "escalate_support_case adapter not marked live.",
    ),
  );

  const blockedCaps = [
    "support_response.send",
    "support_case.close",
    "support_case.delete",
  ] as const;
  const blockedPass = blockedCaps.every((cap) => isSupportCapabilityBlocked(cap));
  flows.push(
    flowResult(
      "blocked_capabilities",
      "support.write.blocked",
      writeSource,
      blockedPass ? "pass" : "fail",
      blockedPass ? null : "Forbidden support write capabilities must remain blocked.",
    ),
  );

  const probeSubject = `${PROBE_SUBJECT_PREFIX}-${Date.now()}`;
  const probe = await createSupportProbeCase(
    {
      rpc: async (fn, params) => {
        const result = await input.session.supabase.rpc(fn, params ?? {});
        return { data: result.data, error: result.error };
      },
    },
    probeSubject,
  );

  const controlledProbeCaseCreated = Boolean(probe.case_id);
  if (!probe.case_id) {
    flows.push(
      flowResult(
        "assign_live",
        "support.write.assign",
        writeSource,
        "fail",
        probe.failure_reason ?? "probe_case_create_failed",
      ),
    );
    flows.push(
      flowResult(
        "escalate_live",
        "support.write.escalate",
        writeSource,
        "fail",
        probe.failure_reason ?? "probe_case_create_failed",
      ),
    );
    return { flows, tenantIsolation, idempotency, controlledProbeCaseCreated };
  }

  const caseId = probe.case_id;
  const permission = writePermission(input.session);
  const providerWrite = {
    write_source_available: true,
    requires_approval_before_execution: false,
  };

  const unconfirmed = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: false,
      approved: false,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "confirmation_gate",
      "support.write.confirmation",
      writeSource,
      unconfirmed.outcome === "confirmation_required" ? "pass" : "fail",
      unconfirmed.outcome === "confirmation_required"
        ? null
        : `Expected confirmation_required, received ${unconfirmed.outcome}.`,
    ),
  );

  const approvalPending = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "support_ai_engine",
    provider_write: {
      write_source_available: true,
      requires_approval_before_execution: true,
    },
    lookup_case: (id) => bridge.lookupCase(id),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: false,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "approval_gate",
      "support.write.approval",
      writeSource,
      approvalPending.outcome === "approval_required" ? "pass" : "fail",
      approvalPending.outcome === "approval_required"
        ? null
        : `Expected approval_required, received ${approvalPending.outcome}.`,
    ),
  );

  const assignIdempotencyKey = `p1-06-assign-${Date.now()}`;
  const assignWrite = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    execute_write: () =>
      bridge.assignCase({ case_id: caseId, assignee_user_id: assigneeUserId }),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: assignIdempotencyKey,
    },
  });
  flows.push(
    flowResult(
      "assign_live",
      "support.write.assign",
      writeSource,
      assignWrite.outcome === "executed" ? "pass" : "fail",
      assignWrite.outcome === "executed" ? null : `Assign write failed: ${assignWrite.outcome}.`,
    ),
  );

  const assignRetry = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    execute_write: () =>
      bridge.assignCase({ case_id: caseId, assignee_user_id: assigneeUserId }),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: assignIdempotencyKey,
    },
  });
  idempotency.push(
    idempotencyResult(
      "duplicate_assign_retry",
      assignRetry.outcome === "executed" ? "pass" : "fail",
      assignRetry.outcome === "executed" ? null : `Duplicate assign retry failed: ${assignRetry.outcome}.`,
    ),
  );

  const escalateProbe = await createSupportProbeCase(
    {
      rpc: async (fn, params) => {
        const result = await input.session.supabase.rpc(fn, params ?? {});
        return { data: result.data, error: result.error };
      },
    },
    `${PROBE_SUBJECT_PREFIX}-escalate-${Date.now()}`,
  );

  if (!escalateProbe.case_id) {
    flows.push(
      flowResult(
        "escalate_live",
        "support.write.escalate",
        writeSource,
        "fail",
        escalateProbe.failure_reason ?? "escalate_probe_create_failed",
      ),
    );
  } else {
    const escalateWrite = await executeSupportWrite({
      organization_id: orgId,
      tenant_id: tenantId,
      user_role: input.session.userRole,
      permission,
      provider_key: "support_ai_engine",
      provider_write: providerWrite,
      lookup_case: (id) => bridge.lookupCase(id),
      execute_write: () =>
        bridge.escalateCase({
          case_id: escalateProbe.case_id!,
          escalation_reason: "P1.06 controlled escalation probe",
        }),
      request: {
        capability_key: "support_case.escalate",
        case_id: escalateProbe.case_id!,
        draft_text: null,
        assignee_reference: null,
        escalation_reason: "P1.06 controlled escalation probe",
        grounded_sources: [],
        confirmed: true,
        approved: true,
        idempotency_key: `p1-06-escalate-${Date.now()}`,
      },
    });
    flows.push(
      flowResult(
        "escalate_live",
        "support.write.escalate",
        writeSource,
        escalateWrite.outcome === "executed" ? "pass" : "fail",
        escalateWrite.outcome === "executed"
          ? null
          : `Escalate write failed: ${escalateWrite.outcome}.`,
      ),
    );
  }

  const deniedAssign = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: writePermission(input.session, { can_assign_case: false }),
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "permission_denied_assign",
      "support.write.access",
      writeSource,
      deniedAssign.outcome === "permission_denied" ? "pass" : "fail",
      deniedAssign.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${deniedAssign.outcome}.`,
    ),
  );

  const suspendedWrite = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: writePermission(input.session, { app_suspended: true }),
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "suspended_app_denied",
      "support.write.access",
      writeSource,
      suspendedWrite.outcome === "activation_pending" ? "pass" : "fail",
      suspendedWrite.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedWrite.outcome}.`,
    ),
  );

  const crossTenant = await executeSupportWrite({
    organization_id: "00000000-0000-4000-8000-000000000001",
    tenant_id: "00000000-0000-4000-8000-000000000001",
    user_role: input.session.userRole,
    permission,
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    request: {
      capability_key: "support_case.assign",
      case_id: caseId,
      draft_text: null,
      assignee_reference: assigneeUserId,
      escalation_reason: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: null,
    },
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

  const missingEntitlement = await executeSupportWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: writePermission(input.session, {
      can_assign_case: false,
      can_escalate_case: false,
      provider_active: false,
    }),
    provider_key: "support_ai_engine",
    provider_write: providerWrite,
    lookup_case: (id) => bridge.lookupCase(id),
    request: {
      capability_key: "support_case.escalate",
      case_id: caseId,
      draft_text: null,
      assignee_reference: null,
      escalation_reason: "probe",
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: null,
    },
  });
  tenantIsolation.push(
    isolationResult(
      "missing_entitlement_rejected",
      ["permission_denied", "provider_missing"].includes(missingEntitlement.outcome)
        ? "pass"
        : "fail",
      ["permission_denied", "provider_missing"].includes(missingEntitlement.outcome)
        ? null
        : `Expected permission_denied or provider_missing, received ${missingEntitlement.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_write",
      suspendedWrite.outcome === "activation_pending" ? "pass" : "fail",
      suspendedWrite.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedWrite.outcome}.`,
    ),
  );

  const isolationSession = await createP1IsolationSession(input.config);
  if (isolationSession && isolationSession.organizationId !== input.session.organizationId) {
    const foreignProbe = await createSupportProbeCase(
      {
        rpc: async (fn, params) => {
          const result = await isolationSession.supabase.rpc(fn, params ?? {});
          return { data: result.data, error: result.error };
        },
      },
      `${PROBE_SUBJECT_PREFIX}-foreign-${Date.now()}`,
    );
    if (foreignProbe.case_id) {
      const foreignLookup = await bridge.lookupCase(foreignProbe.case_id);
      tenantIsolation.push(
        isolationResult(
          "foreign_case_not_visible_in_primary_tenant",
          !foreignLookup.found ? "pass" : "fail",
          !foreignLookup.found
            ? null
            : "Foreign tenant support case must not appear in primary tenant dashboard read.",
        ),
      );
    }
  }

  const auditEvents = listSupportAuditEvents(orgId);
  const auditSerialized = JSON.stringify(auditEvents);
  const auditPass =
    auditEvents.length > 0 &&
    !auditSerialized.includes(probeSubject) &&
    !auditSerialized.includes("@");
  flows.push(
    flowResult(
      "audit_without_pii",
      "support.write.audit",
      writeSource,
      auditPass ? "pass" : "fail",
      auditPass ? null : "Support audit must exclude probe subject and contact details.",
    ),
  );

  return { flows, tenantIsolation, idempotency, controlledProbeCaseCreated };
}

export function collectP1_06CapabilityOutcomes(input: {
  flows: readonly P1_06LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_06LiveE2eTenantIsolationResult[];
  idempotency: readonly P1_06LiveE2eIdempotencyResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("support.write.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("support.write.isolation");
  }

  const idempotencyPassed = input.idempotency.every((check) => check.status === "pass");
  if (idempotencyPassed && input.idempotency.length > 0) {
    passed.add("support.write.idempotency");
  } else if (input.idempotency.some((check) => check.status === "fail")) {
    failed.add("support.write.idempotency");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
