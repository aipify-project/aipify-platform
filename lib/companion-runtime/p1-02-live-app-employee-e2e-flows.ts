import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { buildAppEmployeePermissionContext } from "@/lib/integration-intelligence/providers/app-employee-directory/permissions";
import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectorySearchQuery } from "@/lib/integration-intelligence/directory/types";
import { executeAppEmployeeDirectorySearch } from "./app-employee-read-orchestrator";
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
  P1_02LiveE2eCertificationFlowResult,
  P1_02LiveE2eTenantIsolationResult,
} from "./p1-02-live-app-employee-e2e-types";

const UNKNOWN_EMPLOYEE_QUERY = "zzzzz-p1-02-no-employee-match-token";

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_02LiveE2eCertificationFlowResult["source_classification"],
  status: P1_02LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_02LiveE2eCertificationFlowResult {
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
  status: P1_02LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_02LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function pickSampleEmployee(candidates: readonly DirectoryMatchCandidate[]): DirectoryMatchCandidate | null {
  return (
    candidates.find(
      (row) =>
        row.entity_type === "person" &&
        row.display_name &&
        row.status !== "pending_invitation" &&
        row.status !== "disabled",
    ) ??
    candidates.find((row) => row.entity_type === "person" && row.display_name) ??
    null
  );
}

function buildEmployeeQuery(
  session: P1LiveE2eAuthenticatedSession,
  input: {
    search_field: NonNullable<DirectorySearchQuery["search_field"]>;
    search_value: string;
    permission_scope: "basic" | "contact" | "sensitive";
    filters?: Record<string, string>;
  },
): DirectorySearchQuery {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    entity_type: "person",
    relationship_type: "employee",
    search_field: input.search_field,
    search_value: input.search_value,
    filters: input.filters ?? {},
    requested_fields: [input.search_field],
    requested_detail_level: "summary",
    permission_scope: input.permission_scope,
    capability_candidates: ["employee.search"],
    locale: "en",
  };
}

function ownerPermission(
  session: P1LiveE2eAuthenticatedSession,
  bundles: P1LiveDirectoryBundles,
  hasMembership = true,
) {
  return buildAppEmployeePermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: bundles.employeeAdapterConnected,
    has_organization_membership: hasMembership,
  });
}

function staffBasicPermission(session: P1LiveE2eAuthenticatedSession, bundles: P1LiveDirectoryBundles) {
  return buildAppEmployeePermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: "staff",
    app_suspended: false,
    provider_active: bundles.employeeAdapterConnected,
    has_organization_membership: true,
    can_search_directory_contact: false,
  });
}

export async function runP1_02LiveAppEmployeeE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_02LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_02LiveE2eTenantIsolationResult[];
  bundles: P1LiveDirectoryBundles;
}> {
  const flows: P1_02LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_02LiveE2eTenantIsolationResult[] = [];

  const { data: contextRaw, error: contextError } = await input.session.supabase.rpc(
    "get_app_organization_context",
  );
  if (contextError) {
    throw new Error(redactSecretsFromMessage(contextError.message));
  }

  const organizationContext = parseAppOrganizationContext(contextRaw);
  const bundles = await loadP1LiveDirectoryBundles({
    supabase: input.session.supabase,
    organizationId: input.session.organizationId!,
    subscriptionStatus: organizationContext.license_status,
    hasOrganizationMembership: organizationContext.has_organization_membership,
  });

  const employeeSource = classifyBundleSource(bundles.employee);
  const sampleEmployee = pickSampleEmployee(bundles.employee.candidates);
  const ownerPerm = ownerPermission(input.session, bundles);

  flows.push(
    flowResult(
      "live_provider_connected",
      "employee.search.live",
      employeeSource,
      bundles.employeeAdapterConnected && bundles.employee.source_exact ? "pass" : "fail",
      bundles.employeeAdapterConnected && bundles.employee.source_exact
        ? null
        : "APP employee directory provider is not connected with source_exact live read.",
    ),
  );

  if (!sampleEmployee?.display_name) {
    flows.push(
      flowResult(
        "search_by_name",
        "employee.search.live",
        employeeSource,
        "fail",
        "Live employee directory has no searchable employee candidates.",
      ),
    );
  } else {
    const nameSearch = await executeAppEmployeeDirectorySearch({
      query: buildEmployeeQuery(input.session, {
        search_field: "name",
        search_value: sampleEmployee.display_name,
        permission_scope: ownerPerm.can_search_directory_contact ? "contact" : "basic",
      }),
      permission: ownerPerm,
      user_role: input.session.userRole,
      bundle: bundles.employee,
    });
    const namePass =
      !["permission_denied", "provider_missing", "no_match"].includes(nameSearch.outcome) &&
      nameSearch.records.length > 0;
    flows.push(
      flowResult(
        "search_by_name",
        "employee.search.live",
        employeeSource,
        namePass ? "pass" : "fail",
        namePass ? null : `Name search outcome: ${nameSearch.outcome}`,
      ),
    );
  }

  const roleValue = sampleEmployee?.role ?? sampleEmployee?.status ?? "active";
  const roleField = sampleEmployee?.role ? "role" : "status";
  const roleSearch = await executeAppEmployeeDirectorySearch({
    query: buildEmployeeQuery(input.session, {
      search_field: roleField,
      search_value: roleValue,
      permission_scope: "basic",
      filters: roleField === "status" ? { status: roleValue } : {},
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  const rolePass =
    !["permission_denied", "provider_missing"].includes(roleSearch.outcome) &&
    roleSearch.records.length > 0;
  flows.push(
    flowResult(
      "search_by_role_or_status",
      "employee.search.role_status",
      employeeSource,
      rolePass ? "pass" : "fail",
      rolePass ? null : `Role/status search outcome: ${roleSearch.outcome}`,
    ),
  );

  const teamCandidate =
    bundles.employee.candidates.find((row) => row.team) ??
    bundles.employee.candidates.find((row) => row.department);
  if (teamCandidate?.team) {
    const teamSearch = await executeAppEmployeeDirectorySearch({
      query: buildEmployeeQuery(input.session, {
        search_field: "team",
        search_value: teamCandidate.team!,
        permission_scope: "basic",
      }),
      permission: ownerPerm,
      user_role: input.session.userRole,
      bundle: bundles.employee,
    });
    const teamPass =
      !["permission_denied", "provider_missing"].includes(teamSearch.outcome) &&
      teamSearch.records.length > 0;
    flows.push(
      flowResult(
        "search_by_team",
        "employee.search.role_status",
        employeeSource,
        teamPass ? "pass" : "fail",
        teamPass ? null : `Team search outcome: ${teamSearch.outcome}`,
      ),
    );
  } else if (teamCandidate?.department) {
    const deptSearch = await executeAppEmployeeDirectorySearch({
      query: buildEmployeeQuery(input.session, {
        search_field: "department",
        search_value: teamCandidate.department!,
        permission_scope: "basic",
      }),
      permission: ownerPerm,
      user_role: input.session.userRole,
      bundle: bundles.employee,
    });
    const deptPass =
      !["permission_denied", "provider_missing"].includes(deptSearch.outcome) &&
      deptSearch.records.length > 0;
    flows.push(
      flowResult(
        "search_by_department",
        "employee.search.role_status",
        employeeSource,
        deptPass ? "pass" : "fail",
        deptPass ? null : `Department search outcome: ${deptSearch.outcome}`,
      ),
    );
  } else {
    flows.push(
      flowResult(
        "search_by_team_or_department",
        "employee.search.role_status",
        employeeSource,
        rolePass ? "pass" : "fail",
        rolePass ? null : "No team or department metadata available on live employee records.",
      ),
    );
  }

  const emailCandidate =
    bundles.employee.candidates.find((row) => row.email_raw && row.email_raw.includes("@")) ?? null;

  if (emailCandidate?.display_name) {
    const staffPerm = staffBasicPermission(input.session, bundles);
    const maskedSearch = await executeAppEmployeeDirectorySearch({
      query: buildEmployeeQuery(input.session, {
        search_field: "name",
        search_value: emailCandidate.display_name,
        permission_scope: "basic",
      }),
      permission: staffPerm,
      user_role: "staff",
      bundle: bundles.employee,
    });
    const maskedEmail = maskedSearch.records[0]?.email_masked;
    const maskingPass =
      maskedSearch.records.length > 0 &&
      Boolean(maskedEmail?.includes("*"));
    flows.push(
      flowResult(
        "contact_masking_staff_scope",
        "employee.contact.masking",
        employeeSource,
        maskingPass ? "pass" : "fail",
        maskingPass ? null : "Staff basic scope did not mask employee contact fields.",
      ),
    );

    const ownerContactSearch = await executeAppEmployeeDirectorySearch({
      query: buildEmployeeQuery(input.session, {
        search_field: "email",
        search_value: emailCandidate.email_raw!,
        permission_scope: "contact",
      }),
      permission: ownerPerm,
      user_role: input.session.userRole,
      bundle: bundles.employee,
    });
    const ownerEmail = ownerContactSearch.records[0]?.email_masked;
    const unmaskedPass =
      ownerContactSearch.records.length > 0 &&
      Boolean(ownerEmail) &&
      !ownerEmail!.includes("*");
    flows.push(
      flowResult(
        "contact_unmasked_owner_scope",
        "employee.contact.masking",
        employeeSource,
        unmaskedPass ? "pass" : "fail",
        unmaskedPass ? null : "Owner contact scope did not expose unmasked employee email.",
      ),
    );
  } else {
    flows.push(
      flowResult(
        "contact_masking_staff_scope",
        "employee.contact.masking",
        employeeSource,
        "fail",
        "Live employee directory has no email-bearing records for masking verification.",
      ),
    );
    flows.push(
      flowResult(
        "contact_unmasked_owner_scope",
        "employee.contact.masking",
        employeeSource,
        "fail",
        "Live employee directory has no email-bearing records for owner contact verification.",
      ),
    );
  }

  const ownerOrAdmin = ["owner", "admin", "administrator"].includes(
    input.session.userRole.toLowerCase(),
  );
  const ownerSearch = await executeAppEmployeeDirectorySearch({
    query: buildEmployeeQuery(input.session, {
      search_field: "status",
      search_value: "active",
      permission_scope: ownerPerm.can_search_directory_contact ? "contact" : "basic",
      filters: { status: "active" },
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  const ownerAdminPass =
    ownerOrAdmin &&
    !["permission_denied", "provider_missing"].includes(ownerSearch.outcome);
  flows.push(
    flowResult(
      "owner_admin_permission",
      "employee.permission.owner_admin",
      employeeSource,
      ownerAdminPass ? "pass" : "fail",
      ownerAdminPass
        ? null
        : ownerOrAdmin
          ? `Owner/admin search outcome: ${ownerSearch.outcome}`
          : `Live session role is not owner/admin: ${input.session.userRole}`,
    ),
  );

  const unknownSearch = await executeAppEmployeeDirectorySearch({
    query: buildEmployeeQuery(input.session, {
      search_field: "name",
      search_value: UNKNOWN_EMPLOYEE_QUERY,
      permission_scope: "basic",
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  const unknownPass =
    unknownSearch.outcome === "no_match" &&
    unknownSearch.records.length === 0 &&
    unknownSearch.total_count === 0;
  flows.push(
    flowResult(
      "unknown_employee_exact_empty",
      "employee.search.unknown_empty",
      employeeSource,
      unknownPass ? "pass" : "fail",
      unknownPass
        ? null
        : `Expected exact empty no_match, received ${unknownSearch.outcome} (${unknownSearch.total_count} records).`,
    ),
  );

  const missingMembershipSearch = await executeAppEmployeeDirectorySearch({
    query: buildEmployeeQuery(input.session, {
      search_field: "status",
      search_value: "active",
      permission_scope: "basic",
      filters: { status: "active" },
    }),
    permission: buildAppEmployeePermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: bundles.employeeAdapterConnected,
      has_organization_membership: false,
    }),
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  flows.push(
    flowResult(
      "access_missing_membership_denied",
      "employee.access.denied",
      employeeSource,
      missingMembershipSearch.outcome === "permission_denied" ? "pass" : "fail",
      missingMembershipSearch.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${missingMembershipSearch.outcome}`,
    ),
  );

  const suspendedSearch = await executeAppEmployeeDirectorySearch({
    query: buildEmployeeQuery(input.session, {
      search_field: "status",
      search_value: "active",
      permission_scope: "basic",
      filters: { status: "active" },
    }),
    permission: buildAppEmployeePermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: true,
      provider_active: bundles.employeeAdapterConnected,
      has_organization_membership: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.employee,
  });
  const suspendedDenied =
    ["permission_denied", "activation_pending"].includes(suspendedSearch.outcome) &&
    suspendedSearch.records.length === 0;
  flows.push(
    flowResult(
      "access_suspended_denied",
      "employee.access.denied",
      employeeSource,
      suspendedDenied ? "pass" : "fail",
      suspendedDenied
        ? null
        : `Expected suspended denial, received ${suspendedSearch.outcome}`,
    ),
  );

  const manipulatedOrgSearch = await executeAppEmployeeDirectorySearch({
    query: {
      ...buildEmployeeQuery(input.session, {
        search_field: "status",
        search_value: "active",
        permission_scope: "basic",
        filters: { status: "active" },
      }),
      organization_id: "00000000-0000-4000-8000-000000000001",
    },
    permission: ownerPerm,
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
    query: buildEmployeeQuery(input.session, {
      search_field: "external_id",
      search_value: foreignEntityId,
      permission_scope: "basic",
    }),
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

  tenantIsolation.push(
    isolationResult(
      "missing_membership_rejected",
      missingMembershipSearch.outcome === "permission_denied" ? "pass" : "fail",
      missingMembershipSearch.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${missingMembershipSearch.outcome}`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_data",
      suspendedDenied ? "pass" : "fail",
      suspendedDenied ? null : `Expected suspended denial, received ${suspendedSearch.outcome}`,
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
        query: buildEmployeeQuery(input.session, {
          search_field: "external_id",
          search_value: foreignEntity,
          permission_scope: "basic",
        }),
        permission: ownerPerm,
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

  return { flows, tenantIsolation, bundles };
}

export function collectP1_02CapabilityOutcomes(input: {
  flows: readonly P1_02LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_02LiveE2eTenantIsolationResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("employee.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("employee.isolation");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
