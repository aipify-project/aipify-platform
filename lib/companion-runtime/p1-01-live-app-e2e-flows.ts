import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { buildAppEmployeePermissionContext } from "@/lib/integration-intelligence/providers/app-employee-directory/permissions";
import { buildCrmDirectoryPermissionContext } from "@/lib/integration-intelligence/providers/crm-customer-directory/permissions";
import { buildSupplierDirectoryPermissionContext } from "@/lib/integration-intelligence/providers/supplier-vendor-directory/permissions";
import { executeAppEmployeeDirectorySearch } from "./app-employee-read-orchestrator";
import { executeCrmDirectorySearch } from "./crm-customer-read-orchestrator";
import { executeSupplierDirectorySearch } from "./supplier-vendor-read-orchestrator";
import {
  classifyBundleSource,
  loadP1LiveDirectoryBundles,
  type P1LiveDirectoryBundles,
} from "./p1-01-live-app-e2e-directory";
import type { P1LiveE2eEnvConfig } from "./p1-01-live-app-e2e-env";
import {
  createP1IsolationSession,
  redactSecretsFromMessage,
  type P1LiveE2eAuthenticatedSession,
} from "./p1-01-live-app-e2e-session";
import type {
  P1LiveE2eCertificationFlowResult,
  P1LiveE2eTenantIsolationResult,
} from "./p1-01-live-app-e2e-types";

const LIVE_READ_CLASSIFICATIONS = new Set(["source_exact", "source_compatible", "source_partial"]);

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1LiveE2eCertificationFlowResult["source_classification"],
  status: P1LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1LiveE2eCertificationFlowResult {
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
  status: P1LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

async function fetchCompanionViaHttp(
  config: P1LiveE2eEnvConfig,
  session: P1LiveE2eAuthenticatedSession,
): Promise<{ ok: boolean; reason: string | null }> {
  if (!config.baseUrl) {
    return { ok: true, reason: null };
  }

  const projectRef = new URL(config.supabaseUrl).hostname.split(".")[0];
  const cookieName = `sb-${projectRef}-auth-token`;
  const cookieValue = encodeURIComponent(
    JSON.stringify({
      access_token: session.session.access_token,
      refresh_token: session.session.refresh_token,
      expires_at: session.session.expires_at,
      expires_in: session.session.expires_in,
      token_type: session.session.token_type,
    }),
  );

  const response = await fetch(
    `${config.baseUrl.replace(/\/$/, "")}/api/aipify/support-assistant/search?q=help&locale=en`,
    {
      headers: {
        Cookie: `${cookieName}=${cookieValue}`,
      },
    },
  );

  if (!response.ok) {
    return { ok: false, reason: `Companion HTTP entry returned ${response.status}.` };
  }

  return { ok: true, reason: null };
}

export async function runP1LiveAppE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1LiveE2eCertificationFlowResult[];
  tenantIsolation: P1LiveE2eTenantIsolationResult[];
  bundles: P1LiveDirectoryBundles;
  organizationContextState: string;
}> {
  const flows: P1LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1LiveE2eTenantIsolationResult[] = [];

  flows.push(
    flowResult("auth_login", "core.session", "source_exact", "pass"),
  );

  const { data: contextRaw, error: contextError } = await input.session.supabase.rpc(
    "get_app_organization_context",
  );
  if (contextError) {
    flows.push(
      flowResult(
        "organization_context",
        "core.organization_context",
        "source_unknown",
        "fail",
        contextError.message,
      ),
    );
    throw new Error(redactSecretsFromMessage(contextError.message));
  }

  const organizationContext = parseAppOrganizationContext(contextRaw);
  const organizationContextState = organizationContext.state;

  flows.push(
    flowResult(
      "organization_context",
      "core.organization_context",
      organizationContext.state === "ready" ? "source_exact" : "source_partial",
      organizationContext.state === "ready" ? "pass" : "fail",
      organizationContext.state === "ready" ? null : `Organization context state: ${organizationContext.state}`,
    ),
  );

  const entitlementOk =
    organizationContext.has_app_access &&
    organizationContext.has_organization_membership &&
    !["subscription_inactive", "license_inactive", "entitlement_missing", "access_denied"].includes(
      organizationContext.state,
    );

  flows.push(
    flowResult(
      "entitlement_permissions",
      "core.entitlement",
      entitlementOk ? "source_exact" : "source_partial",
      entitlementOk ? "pass" : "fail",
      entitlementOk ? null : `Entitlement not ready: ${organizationContext.state}`,
    ),
  );

  const { data: companionBriefing, error: companionError } = await input.session.supabase.rpc(
    "get_companion_context_briefing",
    { p_context: "app" },
  );
  const companionRpcOk = !companionError && companionBriefing != null;
  flows.push(
    flowResult(
      "companion_context",
      "companion.context_briefing",
      companionRpcOk ? "source_exact" : "source_unknown",
      companionRpcOk ? "pass" : "fail",
      companionError?.message ?? null,
    ),
  );

  const companionHttp = await fetchCompanionViaHttp(input.config, input.session);
  if (input.config.baseUrl) {
    flows.push(
      flowResult(
        "companion_http_entry",
        "companion.query",
        companionHttp.ok ? "source_exact" : "source_unknown",
        companionHttp.ok ? "pass" : "fail",
        companionHttp.reason,
      ),
    );
  }

  const { data: commandBrief, error: commandBriefError } = await input.session.supabase.rpc(
    "get_app_portal_command_center_briefing",
  );
  const commandBriefOk = !commandBriefError && commandBrief != null;
  flows.push(
    flowResult(
      "command_brief",
      "command_brief.read",
      commandBriefOk ? "source_exact" : "source_unknown",
      commandBriefOk ? "pass" : "fail",
      commandBriefError?.message ?? null,
    ),
  );

  const bundles = await loadP1LiveDirectoryBundles({
    supabase: input.session.supabase,
    organizationId: input.session.organizationId!,
    subscriptionStatus: organizationContext.license_status,
    hasOrganizationMembership: organizationContext.has_organization_membership,
  });

  const employeePermission = buildAppEmployeePermissionContext({
    organization_id: input.session.organizationId!,
    tenant_id: input.session.tenantId ?? input.session.organizationId!,
    user_role: input.session.userRole,
    app_suspended: false,
    provider_active: bundles.employeeAdapterConnected,
    has_organization_membership: organizationContext.has_organization_membership,
  });

  const employeeSearch = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "status",
      search_value: "active",
      filters: {},
      requested_fields: ["status"],
      requested_detail_level: "summary",
      permission_scope: employeePermission.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: employeePermission,
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });

  const employeeSource = classifyBundleSource(bundles.employee);
  const employeePass =
    bundles.employeeAdapterConnected &&
    !["permission_denied", "provider_missing"].includes(employeeSearch.outcome);
  flows.push(
    flowResult(
      "employee_directory_search",
      "employee.search",
      employeeSource,
      employeePass ? "pass" : "fail",
      employeePass ? null : `Employee directory outcome: ${employeeSearch.outcome}`,
    ),
  );

  const crmPermission = buildCrmDirectoryPermissionContext({
    organization_id: input.session.organizationId!,
    tenant_id: input.session.tenantId ?? input.session.organizationId!,
    user_role: input.session.userRole,
    app_suspended: false,
    provider_active: bundles.crmAdapterConnected,
    has_crm_entitlement: true,
  });

  const crmSearch = await executeCrmDirectorySearch({
    query: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "person",
      relationship_type: "customer",
      search_field: "status",
      search_value: "active",
      filters: {},
      requested_fields: ["status"],
      requested_detail_level: "summary",
      permission_scope: crmPermission.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["customer.search"],
      locale: "en",
    },
    permission: crmPermission,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });

  const crmSource = classifyBundleSource(bundles.crm);
  const crmPass =
    bundles.crmAdapterConnected && !["permission_denied", "provider_missing"].includes(crmSearch.outcome);
  flows.push(
    flowResult(
      "crm_directory_search",
      "customer.search",
      crmSource,
      crmPass ? "pass" : "fail",
      crmPass ? null : `CRM directory outcome: ${crmSearch.outcome}`,
    ),
  );

  const supplierPermission = buildSupplierDirectoryPermissionContext({
    organization_id: input.session.organizationId!,
    tenant_id: input.session.tenantId ?? input.session.organizationId!,
    user_role: input.session.userRole,
    app_suspended: false,
    provider_active: bundles.supplierAdapterConnected,
    has_procurement_entitlement: true,
  });

  const supplierSearch = await executeSupplierDirectorySearch({
    query: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "organization",
      relationship_type: "supplier",
      search_field: "status",
      search_value: "active",
      filters: {},
      requested_fields: ["status"],
      requested_detail_level: "summary",
      permission_scope: supplierPermission.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["supplier.search"],
      locale: "en",
    },
    permission: supplierPermission,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });

  const supplierSource = classifyBundleSource(bundles.supplier);
  const supplierPass =
    bundles.supplierAdapterConnected &&
    !["permission_denied", "provider_missing"].includes(supplierSearch.outcome);
  flows.push(
    flowResult(
      "supplier_directory_search",
      "supplier.search",
      supplierSource,
      supplierPass ? "pass" : "fail",
      supplierPass ? null : `Supplier directory outcome: ${supplierSearch.outcome}`,
    ),
  );

  const exactRead =
    [employeeSource, crmSource, supplierSource].some((classification) =>
      LIVE_READ_CLASSIFICATIONS.has(classification),
    ) &&
    (bundles.employee.source_exact ||
      bundles.crm.source_exact ||
      bundles.supplier.source_exact ||
      bundles.employee.candidates.length > 0 ||
      bundles.crm.candidates.length > 0 ||
      bundles.supplier.candidates.length > 0);

  flows.push(
    flowResult(
      "exact_compatible_live_read",
      "directory.read",
      bundles.employee.source_exact
        ? "source_exact"
        : bundles.crm.source_exact
          ? "source_exact"
          : "source_compatible",
      exactRead ? "pass" : "fail",
      exactRead ? null : "No exact or compatible live directory read was verified.",
    ),
  );

  const freshnessOk = [bundles.employee, bundles.crm, bundles.supplier].some(
    (bundle) => bundle.freshness && bundle.freshness !== "unknown",
  );
  flows.push(
    flowResult(
      "source_freshness",
      "directory.freshness",
      freshnessOk ? "source_exact" : "source_compatible",
      freshnessOk ? "pass" : "fail",
      freshnessOk ? null : "Directory freshness metadata missing on live bundles.",
    ),
  );

  const manipulatedOrgSearch = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: "00000000-0000-4000-8000-000000000001",
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "status",
      search_value: "active",
      filters: {},
      requested_fields: ["status"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: employeePermission,
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  tenantIsolation.push(
    isolationResult(
      "manipulated_organization_id_rejected",
      manipulatedOrgSearch.outcome === "permission_denied" ? "pass" : "fail",
      manipulatedOrgSearch.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${manipulatedOrgSearch.outcome}`,
    ),
  );

  const foreignEntityId =
    bundles.employee.candidates[0]?.entity_id ?? "foreign-entity-id-for-isolation-check";
  const crossTenantSearch = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "external_id",
      search_value: foreignEntityId,
      filters: {},
      requested_fields: ["external_id"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: buildAppEmployeePermissionContext({
      organization_id: "00000000-0000-4000-8000-000000000002",
      tenant_id: "00000000-0000-4000-8000-000000000002",
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: true,
      has_organization_membership: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  tenantIsolation.push(
    isolationResult(
      "cross_tenant_entity_id_rejected",
      ["permission_denied", "no_match"].includes(crossTenantSearch.outcome) ? "pass" : "fail",
      ["permission_denied", "no_match"].includes(crossTenantSearch.outcome)
        ? null
        : `Expected denial or no_match, received ${crossTenantSearch.outcome}`,
    ),
  );

  const missingMembershipSearch = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "status",
      search_value: "active",
      filters: {},
      requested_fields: ["status"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: buildAppEmployeePermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: true,
      has_organization_membership: false,
    }),
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  tenantIsolation.push(
    isolationResult(
      "missing_membership_rejected",
      missingMembershipSearch.outcome === "permission_denied" ? "pass" : "fail",
      missingMembershipSearch.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${missingMembershipSearch.outcome}`,
    ),
  );

  const suspendedSearch = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "status",
      search_value: "active",
      filters: {},
      requested_fields: ["status"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: buildAppEmployeePermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: true,
      provider_active: true,
      has_organization_membership: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_data",
      suspendedSearch.outcome === "permission_denied" && suspendedSearch.records.length === 0
        ? "pass"
        : "fail",
      suspendedSearch.outcome === "permission_denied"
        ? null
        : `Expected suspended denial, received ${suspendedSearch.outcome}`,
    ),
  );

  const isolationSession = await createP1IsolationSession(input.config);
  if (isolationSession && isolationSession.organizationId !== input.session.organizationId) {
    const foreignBundles = await loadP1LiveDirectoryBundles({
      supabase: isolationSession.supabase,
      organizationId: isolationSession.organizationId!,
      subscriptionStatus: null,
      hasOrganizationMembership: true,
    });
    const foreignEntity = foreignBundles.employee.candidates[0]?.entity_id;
    if (foreignEntity) {
      const leakSearch = await executeAppEmployeeDirectorySearch({
        query: {
          organization_id: input.session.organizationId!,
          tenant_id: input.session.tenantId ?? input.session.organizationId!,
          entity_type: "person",
          relationship_type: "employee",
          search_field: "external_id",
          search_value: foreignEntity,
          filters: {},
          requested_fields: ["external_id"],
          requested_detail_level: "summary",
          permission_scope: "basic",
          capability_candidates: ["employee.search"],
          locale: "en",
        },
        permission: employeePermission,
        user_role: input.session.userRole,
        bundle: bundles.employee,
      });
      tenantIsolation.push(
        isolationResult(
          "isolation_org_entity_not_visible",
          ["no_match", "permission_denied"].includes(leakSearch.outcome) ? "pass" : "fail",
          ["no_match", "permission_denied"].includes(leakSearch.outcome)
            ? null
            : `Foreign entity visible in primary tenant: ${leakSearch.outcome}`,
        ),
      );
    }
  }

  return {
    flows,
    tenantIsolation,
    bundles,
    organizationContextState,
  };
}

export function collectP1CapabilityOutcomes(
  flows: readonly P1LiveE2eCertificationFlowResult[],
): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
