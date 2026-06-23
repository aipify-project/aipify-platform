import { isHostsWriteSourceConnected } from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-source-map";
import {
  P1_07_PROBE_MARKER,
} from "@/lib/integration-intelligence/providers/aipify-hosts/hosts-write-provider-adapter";
import type { HostsPermissionContext } from "@/lib/integration-intelligence/hosts/permissions";
import { isHostsCapabilityBlocked } from "@/lib/integration-intelligence/hosts/types";
import { clearIdempotencyRegistryForTests } from "@/lib/companion-runtime/companion-action-idempotency";
import {
  listHostsAuditEvents,
  resetHostsAuditLogForTests,
} from "@/lib/companion-runtime/hosts-audit";
import { executeHostsWrite } from "@/lib/companion-runtime/hosts-write-orchestrator";
import { createHostsWriteProviderBridge } from "@/lib/companion-runtime/hosts-write-provider-bridge";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import type {
  P1_07LiveE2eCertificationFlowResult,
  P1_07LiveE2eCleanupResult,
  P1_07LiveE2eIdempotencyResult,
  P1_07LiveE2eTenantIsolationResult,
} from "./p1-07-live-app-hosts-task-write-e2e-types";

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_07LiveE2eCertificationFlowResult["source_classification"],
  status: P1_07LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_07LiveE2eCertificationFlowResult {
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
  status: P1_07LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_07LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function idempotencyResult(
  check_id: string,
  status: P1_07LiveE2eIdempotencyResult["status"],
  failure_reason: string | null = null,
): P1_07LiveE2eIdempotencyResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function cleanupResult(
  check_id: string,
  status: P1_07LiveE2eCleanupResult["status"],
  failure_reason: string | null = null,
): P1_07LiveE2eCleanupResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function writePermission(
  session: P1LiveE2eAuthenticatedSession,
  overrides: Partial<HostsPermissionContext> = {},
): HostsPermissionContext {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: true,
    can_read_portfolio: true,
    can_read_guests: true,
    can_read_finance: true,
    can_draft_guest_response: false,
    can_create_tasks: true,
    rate_limit_ok: true,
    ...overrides,
  };
}

export async function runP1_07LiveAppHostsTaskWriteE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_07LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_07LiveE2eTenantIsolationResult[];
  idempotency: P1_07LiveE2eIdempotencyResult[];
  cleanup: P1_07LiveE2eCleanupResult[];
  controlledProbeTasksCreated: number;
  cleanupCompleted: boolean;
}> {
  const flows: P1_07LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_07LiveE2eTenantIsolationResult[] = [];
  const idempotency: P1_07LiveE2eIdempotencyResult[] = [];
  const cleanup: P1_07LiveE2eCleanupResult[] = [];

  resetHostsAuditLogForTests();
  clearIdempotencyRegistryForTests();

  const orgId = input.session.organizationId!;
  const tenantId = input.session.tenantId ?? orgId;
  const bridge = createHostsWriteProviderBridge(input.session.supabase);
  const writeSource = "source_exact" as const;
  const permission = writePermission(input.session);
  const providerWrite = {
    write_source_available: true,
    requires_approval_before_execution: false,
  };

  let controlledProbeTasksCreated = 0;
  let createdHostTaskId: string | null = null;
  let createdMaintenanceId: string | null = null;

  const hostConnected = isHostsWriteSourceConnected("host_task.create");
  const cleaningConnected = isHostsWriteSourceConnected("cleaning_task.assign");
  const maintenanceConnected = isHostsWriteSourceConnected("maintenance_task.create");

  flows.push(
    flowResult(
      "write_source_host_task_live",
      "hosts.write.host_task",
      hostConnected ? writeSource : "source_unknown",
      hostConnected ? "pass" : "fail",
      hostConnected ? null : "create_aipify_hosts_task adapter not marked live.",
    ),
  );
  flows.push(
    flowResult(
      "write_source_cleaning_assign_live",
      "hosts.write.cleaning_assign",
      cleaningConnected ? writeSource : "source_unknown",
      cleaningConnected ? "pass" : "fail",
      cleaningConnected ? null : "perform_aipify_hosts_cleaning_action adapter not marked live.",
    ),
  );
  flows.push(
    flowResult(
      "write_source_maintenance_create_live",
      "hosts.write.maintenance_create",
      maintenanceConnected ? writeSource : "source_unknown",
      maintenanceConnected ? "pass" : "fail",
      maintenanceConnected ? null : "perform_aipify_hosts_maintenance_action adapter not marked live.",
    ),
  );

  const blockedCaps = [
    "guest_response.send",
    "reservation.cancel",
    "payment.refund",
    "pricing.change",
    "reservation.update",
  ] as const;
  flows.push(
    flowResult(
      "blocked_capabilities",
      "hosts.write.blocked",
      writeSource,
      blockedCaps.every((cap) => isHostsCapabilityBlocked(cap)) ? "pass" : "fail",
      blockedCaps.every((cap) => isHostsCapabilityBlocked(cap))
        ? null
        : "Forbidden Hosts write capabilities must remain blocked.",
    ),
  );

  const unconfirmed = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${P1_07_PROBE_MARKER} confirmation gate`,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: false,
      approved: false,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "confirmation_gate",
      "hosts.write.confirmation",
      writeSource,
      unconfirmed.outcome === "confirmation_required" ? "pass" : "fail",
      unconfirmed.outcome === "confirmation_required"
        ? null
        : `Expected confirmation_required, received ${unconfirmed.outcome}.`,
    ),
  );

  const approvalPending = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "short_term_operations",
    provider_write: {
      write_source_available: true,
      requires_approval_before_execution: true,
    },
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${P1_07_PROBE_MARKER} approval gate`,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: true,
      approved: false,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "approval_gate",
      "hosts.write.approval",
      writeSource,
      approvalPending.outcome === "approval_required" ? "pass" : "fail",
      approvalPending.outcome === "approval_required"
        ? null
        : `Expected approval_required, received ${approvalPending.outcome}.`,
    ),
  );

  const hostTaskTitle = `${P1_07_PROBE_MARKER}-${Date.now()}`;
  const hostIdempotencyKey = `p1-07-host-${Date.now()}`;
  const hostCreate = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    execute_write: () => bridge.createHostTask(hostTaskTitle),
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: hostTaskTitle,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: hostIdempotencyKey,
    },
  });
  createdHostTaskId = hostCreate.entity_id;
  if (hostCreate.outcome === "executed") controlledProbeTasksCreated += 1;
  flows.push(
    flowResult(
      "create_host_task_live",
      "hosts.write.host_task",
      writeSource,
      hostCreate.outcome === "executed" && hostCreate.entity_id ? "pass" : "fail",
      hostCreate.outcome === "executed" && hostCreate.entity_id
        ? null
        : `Host task create failed: ${hostCreate.outcome}.`,
    ),
  );

  const hostRetry = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    execute_write: () => bridge.createHostTask(`${hostTaskTitle}-retry`),
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${hostTaskTitle}-retry`,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: hostIdempotencyKey,
    },
  });
  idempotency.push(
    idempotencyResult(
      "duplicate_host_task_retry",
      hostRetry.outcome === "executed" ? "pass" : "fail",
      hostRetry.outcome === "executed" ? null : `Duplicate host task retry failed: ${hostRetry.outcome}.`,
    ),
  );

  const assignTargets = await bridge.resolveCleaningAssignTargets();
  if (!assignTargets.cleaning_task_id || !assignTargets.cleaner_id) {
    flows.push(
      flowResult(
        "assign_cleaning_live",
        "hosts.write.cleaning_assign",
        writeSource,
        "fail",
        assignTargets.failure_reason ?? "cleaning_assign_targets_unavailable",
      ),
    );
  } else {
    const cleaningAssign = await executeHostsWrite({
      organization_id: orgId,
      tenant_id: tenantId,
      user_role: input.session.userRole,
      permission,
      provider_key: "short_term_operations",
      provider_write: providerWrite,
      lookup_entity: (entityId) => bridge.lookupCleaningTask(entityId),
      execute_write: () =>
        bridge.assignCleaningTask({
          cleaning_task_id: assignTargets.cleaning_task_id!,
          cleaner_id: assignTargets.cleaner_id!,
        }),
      request: {
        capability_key: "cleaning_task.assign",
        entity_id: assignTargets.cleaning_task_id,
        draft_text: null,
        task_summary: P1_07_PROBE_MARKER,
        assignee_reference: assignTargets.cleaner_id,
        grounded_sources: [],
        confirmed: true,
        approved: true,
        idempotency_key: `p1-07-clean-${Date.now()}`,
      },
    });
    flows.push(
      flowResult(
        "assign_cleaning_live",
        "hosts.write.cleaning_assign",
        writeSource,
        cleaningAssign.outcome === "executed" ? "pass" : "fail",
        cleaningAssign.outcome === "executed"
          ? null
          : `Cleaning assign failed: ${cleaningAssign.outcome}.`,
      ),
    );
  }

  const maintenanceDescription = `${P1_07_PROBE_MARKER} maintenance probe`;
  const maintenanceCreate = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission,
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    execute_write: () => bridge.createMaintenanceTask(maintenanceDescription),
    request: {
      capability_key: "maintenance_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: maintenanceDescription,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: `p1-07-maint-${Date.now()}`,
    },
  });
  createdMaintenanceId = maintenanceCreate.entity_id;
  if (maintenanceCreate.outcome === "executed") controlledProbeTasksCreated += 1;
  flows.push(
    flowResult(
      "create_maintenance_live",
      "hosts.write.maintenance_create",
      writeSource,
      maintenanceCreate.outcome === "executed" && maintenanceCreate.entity_id ? "pass" : "fail",
      maintenanceCreate.outcome === "executed" && maintenanceCreate.entity_id
        ? null
        : `Maintenance create failed: ${maintenanceCreate.outcome}.`,
    ),
  );

  const deniedWrite = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: writePermission(input.session, { can_create_tasks: false }),
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${P1_07_PROBE_MARKER} denied`,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "permission_denied_create",
      "hosts.write.access",
      writeSource,
      deniedWrite.outcome === "permission_denied" ? "pass" : "fail",
      deniedWrite.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${deniedWrite.outcome}.`,
    ),
  );

  const suspendedWrite = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: writePermission(input.session, { app_suspended: true }),
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${P1_07_PROBE_MARKER} suspended`,
      assignee_reference: null,
      grounded_sources: [],
      confirmed: true,
      approved: true,
      idempotency_key: null,
    },
  });
  flows.push(
    flowResult(
      "suspended_app_denied",
      "hosts.write.access",
      writeSource,
      suspendedWrite.outcome === "activation_pending" ? "pass" : "fail",
      suspendedWrite.outcome === "activation_pending"
        ? null
        : `Expected activation_pending, received ${suspendedWrite.outcome}.`,
    ),
  );

  const crossTenant = await executeHostsWrite({
    organization_id: "00000000-0000-4000-8000-000000000001",
    tenant_id: "00000000-0000-4000-8000-000000000001",
    user_role: input.session.userRole,
    permission,
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    request: {
      capability_key: "host_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${P1_07_PROBE_MARKER} cross tenant`,
      assignee_reference: null,
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

  const missingEntitlement = await executeHostsWrite({
    organization_id: orgId,
    tenant_id: tenantId,
    user_role: input.session.userRole,
    permission: writePermission(input.session, {
      can_create_tasks: false,
      provider_active: false,
    }),
    provider_key: "short_term_operations",
    provider_write: providerWrite,
    request: {
      capability_key: "maintenance_task.create",
      entity_id: null,
      draft_text: null,
      task_summary: `${P1_07_PROBE_MARKER} entitlement`,
      assignee_reference: null,
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
    const foreignBridge = createHostsWriteProviderBridge(isolationSession.supabase);
    const foreignCreate = await foreignBridge.createHostTask(`${P1_07_PROBE_MARKER}-foreign-${Date.now()}`);
    if (foreignCreate.entity_id) {
      const foreignLookup = await bridge.lookupHostTask(foreignCreate.entity_id);
      tenantIsolation.push(
        isolationResult(
          "foreign_task_not_visible_in_primary_tenant",
          !foreignLookup.found ? "pass" : "fail",
          !foreignLookup.found
            ? null
            : "Foreign tenant Hosts task must not appear in primary tenant dashboard read.",
        ),
      );
      await foreignBridge.cleanupHostTask(foreignCreate.entity_id);
    }
  }

  const auditEvents = listHostsAuditEvents(orgId);
  const auditSerialized = JSON.stringify(auditEvents);
  flows.push(
    flowResult(
      "audit_without_pii",
      "hosts.write.audit",
      writeSource,
      auditEvents.length > 0 &&
        !auditSerialized.includes("@") &&
        !auditSerialized.includes("Maria") &&
        !auditSerialized.includes("Solberg")
        ? "pass"
        : "fail",
      auditEvents.length > 0 &&
        !auditSerialized.includes("@") &&
        !auditSerialized.includes("Maria")
        ? null
        : "Hosts audit must exclude contact details and guest names.",
    ),
  );

  if (createdHostTaskId) {
    const hostCleanup = await bridge.cleanupHostTask(createdHostTaskId);
    cleanup.push(
      cleanupResult(
        "host_task_probe_cancelled",
        hostCleanup.cleaned ? "pass" : "fail",
        hostCleanup.cleaned ? null : hostCleanup.failure_reason ?? "host_task_cleanup_failed",
      ),
    );
  } else {
    cleanup.push(
      cleanupResult("host_task_probe_cancelled", "fail", "No host probe task to clean up."),
    );
  }

  if (createdMaintenanceId) {
    const maintenanceCleanup = await bridge.cleanupMaintenanceWorkOrder(createdMaintenanceId);
    cleanup.push(
      cleanupResult(
        "maintenance_probe_closed",
        maintenanceCleanup.cleaned ? "pass" : "fail",
        maintenanceCleanup.cleaned
          ? null
          : maintenanceCleanup.failure_reason ?? "maintenance_cleanup_failed",
      ),
    );
  } else {
    cleanup.push(
      cleanupResult("maintenance_probe_closed", "fail", "No maintenance probe work order to clean up."),
    );
  }

  const cleanupCompleted = cleanup.every((entry) => entry.status === "pass");
  if (cleanupCompleted) {
    flows.push(
      flowResult("probe_cleanup_completed", "hosts.write.cleanup", writeSource, "pass"),
    );
  } else {
    flows.push(
      flowResult(
        "probe_cleanup_completed",
        "hosts.write.cleanup",
        writeSource,
        "fail",
        "One or more probe cleanup steps failed.",
      ),
    );
  }

  return {
    flows,
    tenantIsolation,
    idempotency,
    cleanup,
    controlledProbeTasksCreated,
    cleanupCompleted,
  };
}

export function collectP1_07CapabilityOutcomes(input: {
  flows: readonly P1_07LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_07LiveE2eTenantIsolationResult[];
  idempotency: readonly P1_07LiveE2eIdempotencyResult[];
  cleanup: readonly P1_07LiveE2eCleanupResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("hosts.write.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("hosts.write.isolation");
  }

  const idempotencyPassed = input.idempotency.every((check) => check.status === "pass");
  if (idempotencyPassed && input.idempotency.length > 0) {
    passed.add("hosts.write.idempotency");
  } else if (input.idempotency.some((check) => check.status === "fail")) {
    failed.add("hosts.write.idempotency");
  }

  const cleanupPassed = input.cleanup.every((check) => check.status === "pass");
  if (cleanupPassed && input.cleanup.length > 0) {
    passed.add("hosts.write.cleanup");
  } else if (input.cleanup.some((check) => check.status === "fail")) {
    failed.add("hosts.write.cleanup");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
