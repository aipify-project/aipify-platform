import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_CROSS_TENANT_SEARCH,
  COMPANION_EMPLOYEE_DIRECTORY_WRITE_ACTIONS,
  COMPANION_FUZZY_IDENTITY_MATCH,
  COMPANION_PERSON_SEARCH_AUDIT,
  COMPANION_PII_DEFAULT,
  COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE,
  companionDirectoryPolicyMetadata,
} from "@/lib/companion-runtime/companion-directory-policy";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import { buildCompanionFoundationCoverageRegistry } from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  buildDirectorySearchQueryFromIntent,
  collectDirectoryRelationshipDescriptorsFromManifests,
  resolveDirectorySemanticIntent,
} from "@/lib/companion-runtime/directory-semantic-intent";
import {
  createDirectorySearchAuditEvent,
  listDirectorySearchAuditEvents,
  resetDirectorySearchAuditLogForTests,
} from "@/lib/companion-runtime/directory-audit";
import {
  buildAppEmployeeCommandBriefSignals,
  countAppEmployeeCandidates,
  executeAppEmployeeDirectorySearch,
} from "@/lib/companion-runtime/app-employee-read-orchestrator";
import { collectCommandBriefSignalsFromDomainContexts } from "@/lib/companion-runtime/command-brief-signal-collector";
import { createEmptyCompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { createEmptyCompanionFinanceContext } from "@/lib/companion-runtime/companion-finance-context";
import { createEmptyCompanionHrContext } from "@/lib/companion-runtime/companion-hr-context";
import { createEmptyCompanionOperationalContext } from "@/lib/companion-runtime/companion-operational-context";
import { createEmptyCompanionProactiveContext } from "@/lib/companion-runtime/companion-proactive-context";
import { createEmptyCompanionSalesContext } from "@/lib/companion-runtime/companion-sales-context";
import { createEmptyCompanionSecurityContext } from "@/lib/companion-runtime/companion-security-context";
import { createEmptyCompanionWarehouseContext } from "@/lib/companion-runtime/companion-warehouse-context";
import { createEmptyCompanionSupportContext } from "@/lib/companion-runtime/companion-support-context";
import { createEmptyCompanionHostsContext } from "@/lib/companion-runtime/companion-hosts-context";
import { buildCompanionDirectoryContextFromManifests } from "@/lib/companion-runtime/companion-directory-context";
import { getCommandBriefCatalogEntry } from "@/lib/integration-intelligence/command-brief/signal-catalog";
import { DIRECTORY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/directory/manifests";
import {
  APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY,
  mapAppEmployeeDirectoryBundle,
  mapEffectivePermissions,
  resolveEmployeeRoleVsPermissions,
} from "@/lib/integration-intelligence/providers/app-employee-directory/app-employee-directory-contract";
import { APP_EMPLOYEE_DIRECTORY_SOURCE_MAP } from "@/lib/integration-intelligence/providers/app-employee-directory/app-employee-source-map";
import {
  buildAppEmployeePermissionContext,
} from "@/lib/integration-intelligence/providers/app-employee-directory/permissions";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG = "org-app-employee-40";
const ORG_OTHER = "org-other-tenant";

const employeePayload = {
  found: true,
  employees: [
    {
      employee_id: "e1",
      full_name: "Kari Hansen",
      email: "kari@example.com",
      phone: "+47 912 34 567",
      department_name: "Kundeservice",
      job_title: "Support Specialist",
      org_role: "employee",
      employee_status: "active",
      employee_number: "EMP-001",
      team_id: "team-1",
    },
    {
      employee_id: "e2",
      full_name: "Ola Nordmann",
      email: "ola@example.com",
      phone: "+4790011222",
      department_name: "Kundeservice",
      job_title: "Team Lead",
      org_role: "team_lead",
      employee_status: "active",
      employee_number: "EMP-002",
    },
    {
      employee_id: "e3",
      full_name: "Admin User",
      email: "admin@example.com",
      org_role: "administrator",
      employee_status: "active",
      department_name: "Ledelse",
    },
    {
      employee_id: "e4",
      full_name: "Inaktiv Ansatt",
      email: "inactive@example.com",
      employee_status: "disabled",
      department_name: "Finance",
    },
    {
      employee_id: "e5",
      full_name: "Kari Hanssen",
      email: "kari.h@example.com",
      employee_status: "active",
      department_name: "Support",
    },
  ],
};

const invitationsPayload = {
  found: true,
  invitations: [
    {
      id: "inv-1",
      email: "pending@example.com",
      full_name: "Pending Invite",
      org_role: "employee",
      status: "pending",
    },
  ],
};

const orgCenterPayload = {
  found: true,
  teams: [{ id: "team-1", name: "Frontline", department_name: "Kundeservice" }],
  departments: [
    {
      name: "Kundeservice",
      teams: [{ id: "team-1", name: "Frontline" }],
      employees: [{ employee_id: "e1", team_id: "team-1" }],
    },
  ],
};

const accessControlPayload = {
  found: true,
  role_grants: [{ module_key: "finance", role_key: "employee", can_view: false, can_manage: false }],
  user_grants: [{ module_key: "finance", user_id: "u1", can_view: true, can_manage: false }],
};

const bundle = mapAppEmployeeDirectoryBundle({
  organizationId: ORG,
  directoryData: employeePayload,
  invitationsData: invitationsPayload,
  organizationCenterData: orgCenterPayload,
  accessControlData: accessControlPayload,
});

assert.ok(bundle.source_exact);
assert.ok(bundle.candidates.length >= 6);
assert.equal(bundle.pending_invitation_count, 1);
assert.ok(bundle.candidates.some((row) => row.team === "Frontline"));

const descriptors = collectDirectoryRelationshipDescriptorsFromManifests(DIRECTORY_PROVIDER_MANIFESTS);
const appManifest = DIRECTORY_PROVIDER_MANIFESTS.find((m) => m.provider_key === "app_employee_directory");
assert.ok(appManifest);
assert.ok(appManifest?.capabilities.some((cap) => cap.capability_key === "employee.search" && cap.adapter_available));

assert.equal(companionDirectoryPolicyMetadata().employee_directory_write_actions, "disabled");
assert.equal(COMPANION_EMPLOYEE_DIRECTORY_WRITE_ACTIONS, "disabled");
assert.equal(COMPANION_PII_DEFAULT, "masked");
assert.equal(COMPANION_PERSON_SEARCH_AUDIT, "required");
assert.equal(COMPANION_CROSS_TENANT_SEARCH, "forbidden");
assert.equal(COMPANION_FUZZY_IDENTITY_MATCH, "clarification_required_when_uncertain");
assert.equal(COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE, "forbidden");

assert.ok(APP_EMPLOYEE_DIRECTORY_SOURCE_MAP.some((entry) => entry.source_id === "get_employee_directory"));
assert.equal(
  APP_EMPLOYEE_DIRECTORY_SOURCE_MAP.find((entry) => entry.capability_key === "employee.search")?.source_kind,
  "rpc",
);

function basePermission(overrides: Partial<Parameters<typeof buildAppEmployeePermissionContext>[0]> = {}) {
  return buildAppEmployeePermissionContext({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    has_organization_membership: true,
    ...overrides,
  });
}

async function searchBy(field: string, value: string, permission = basePermission()) {
  return executeAppEmployeeDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "employee",
      search_field: field as never,
      search_value: value,
      filters: {},
      requested_fields: [field as never],
      requested_detail_level: "summary",
      permission_scope: permission.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["employee.search"],
      locale: "no",
    },
    permission,
    user_role: permission.user_role,
    bundle,
  });
}

async function runPhase40AsyncTests() {
  resetDirectorySearchAuditLogForTests();

  const nameResult = await searchBy("name", "Kari Hansen");
  assert.equal(nameResult.outcome, "exact_match");
  assert.equal(nameResult.records[0]?.display_name, "Kari Hansen");

  const fuzzyResult = await searchBy("name", "Kari Han");
  assert.ok(["exact_match", "multiple_matches", "ambiguous_query"].includes(fuzzyResult.outcome));

  const emailResult = await searchBy("email", "ola@example.com");
  assert.equal(emailResult.outcome, "exact_match");

  const phoneResult = await searchBy("phone", "+4790011222");
  assert.equal(phoneResult.outcome, "exact_match");

  const roleResult = await searchBy("role", "administrator");
  assert.ok(roleResult.records.length >= 1);

  const deptResult = await searchBy("department", "Kundeservice");
  assert.ok(deptResult.records.length >= 2);

  const teamResult = await searchBy("team", "Frontline");
  assert.ok(teamResult.records.some((row) => row.team === "Frontline"));

  const activeResult = await searchBy("status", "active");
  assert.ok(activeResult.records.every((row) => row.status === "active"));

  const pendingResult = await searchBy("status", "pending_invitation");
  assert.ok(pendingResult.records.some((row) => row.status === "pending_invitation"));

  const inactiveResult = await searchBy("status", "disabled");
  assert.ok(inactiveResult.records.some((row) => row.status === "disabled"));

  const multiResult = await searchBy("name", "Kari");
  assert.ok(["multiple_matches", "ambiguous_query"].includes(multiResult.outcome));

  const noMatch = await searchBy("name", "Nobody Exists");
  assert.equal(noMatch.outcome, "no_match");

  const basicPermission = buildAppEmployeePermissionContext({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "staff",
    app_suspended: false,
    provider_active: true,
    has_organization_membership: true,
    can_search_directory_contact: false,
  });
  const maskedResult = await searchBy("name", "Kari Hansen", basicPermission);
  assert.ok(maskedResult.records[0]?.email_masked?.includes("*"));

  const contactPermission = basePermission({ can_search_directory_contact: true });
  const contactResult = await searchBy("email", "kari@example.com", contactPermission);
  assert.equal(contactResult.records[0]?.email_masked, "kari@example.com");

  const permissions = mapEffectivePermissions(accessControlPayload);
  const roleVsPerm = resolveEmployeeRoleVsPermissions({
    orgRole: "employee",
    permissions,
    moduleKey: "finance",
  });
  assert.equal(roleVsPerm.role_suggests_access, false);
  assert.equal(roleVsPerm.effective_access, true);

  const unsupported = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "company_name",
      search_value: "Acme",
      filters: {},
      requested_fields: ["company_name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: basePermission(),
    user_role: "owner",
    bundle,
  });
  assert.equal(unsupported.outcome, "unsupported_search_field");

  const denied = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "name",
      search_value: "Kari",
      filters: {},
      requested_fields: ["name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: basePermission({ has_organization_membership: false, can_view_employees: false }),
    user_role: "read_only",
    bundle,
  });
  assert.equal(denied.outcome, "permission_denied");

  const suspended = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "name",
      search_value: "Kari",
      filters: {},
      requested_fields: ["name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: basePermission({ app_suspended: true }),
    user_role: "owner",
    bundle,
  });
  assert.equal(suspended.outcome, "activation_pending");

  const crossTenant = await executeAppEmployeeDirectorySearch({
    query: {
      organization_id: ORG_OTHER,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "employee",
      search_field: "name",
      search_value: "Kari",
      filters: {},
      requested_fields: ["name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["employee.search"],
      locale: "en",
    },
    permission: basePermission(),
    user_role: "owner",
    bundle,
  });
  assert.equal(crossTenant.outcome, "permission_denied");

  const auditProbe = await searchBy("name", "Ola Nordmann");
  const audits = listDirectorySearchAuditEvents(ORG);
  assert.ok(audits.length > 0);
  assert.ok(audits.every((event) => !JSON.stringify(event).includes("ola@example.com")));
  assert.ok(audits.every((event) => event.provider_keys.includes(APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY)));

  const briefSignals = buildAppEmployeeCommandBriefSignals({ bundle, source_exact: true });
  assert.ok(briefSignals.some((signal) => signal.signal_key === "pending_employee_invitation"));
  assert.ok(briefSignals.some((signal) => signal.signal_key === "inactive_employee"));
  assert.equal(
    buildAppEmployeeCommandBriefSignals({ bundle: { ...bundle, source_exact: false }, source_exact: false }).length,
    0,
  );

  for (const key of [
    "pending_employee_invitation",
    "inactive_employee",
    "access_review_required",
    "missing_team_assignment",
  ]) {
    assert.ok(getCommandBriefCatalogEntry(key));
  }

  const directoryContext = buildCompanionDirectoryContextFromManifests({
    organization_id: ORG,
    tenant_id: ORG,
    manifests: DIRECTORY_PROVIDER_MANIFESTS,
    connectedProviders: [APP_EMPLOYEE_DIRECTORY_PROVIDER_KEY],
  });
  const briefCollected = collectCommandBriefSignalsFromDomainContexts({
    organization_id: ORG,
    contexts: {
      hrContext: createEmptyCompanionHrContext(),
      warehouseContext: createEmptyCompanionWarehouseContext(),
      financeContext: createEmptyCompanionFinanceContext(),
      salesContext: createEmptyCompanionSalesContext(),
      securityContext: createEmptyCompanionSecurityContext(),
      communityContext: createEmptyCompanionCommunityContext(),
      operationalContext: createEmptyCompanionOperationalContext(),
      proactiveContext: createEmptyCompanionProactiveContext(),
      supportContext: createEmptyCompanionSupportContext(),
      hostsContext: createEmptyCompanionHostsContext(),
    },
    directoryContext: {
      ...directoryContext,
      app_employee_source_exact: true,
      command_brief_signals: briefSignals,
    },
  });
  assert.ok(briefCollected.some((signal) => signal.source_module === "directory_employee"));
  assert.ok(
    briefCollected.some((signal) => signal.signal_id.includes("pending_employee_invitation")),
  );

  const employeeIntent = resolveDirectorySemanticIntent({
    query: "Finn den ansatte som heter Kari Hansen",
    locale: "no",
    descriptors,
  });
  assert.equal(employeeIntent.relationship_type, "employee");

  const deptIntent = resolveDirectorySemanticIntent({
    query: "Hvem jobber i kundeservice?",
    locale: "no",
    descriptors,
  });
  assert.equal(deptIntent.search_field, "department");

  const adminIntent = resolveDirectorySemanticIntent({
    query: "Hvem er administrator i organisasjonen?",
    locale: "no",
    descriptors,
  });
  assert.equal(adminIntent.search_field, "role");
  assert.equal(adminIntent.search_value, "administrator");

  const pendingIntent = resolveDirectorySemanticIntent({
    query: "Vis ansatte som venter på invitasjon",
    locale: "no",
    descriptors,
  });
  assert.equal(pendingIntent.search_field, "status");
  assert.equal(pendingIntent.search_value, "pending_invitation");

  const countActive = countAppEmployeeCandidates(bundle, { status: "active" });
  assert.ok(countActive >= 4);

  const queryFromIntent = buildDirectorySearchQueryFromIntent({
    intent: employeeIntent,
    organization_id: ORG,
    tenant_id: ORG,
    locale: "no",
    permission_scope: "basic",
  });
  assert.equal(queryFromIntent.relationship_type, "employee");

  const orchestratorSource = fs.readFileSync(
    path.join(repoRoot, "lib/companion-runtime/directory-search-orchestrator.ts"),
    "utf8",
  );
  assert.equal(orchestratorSource.includes("organization_employee_profiles"), false);
  assert.equal(orchestratorSource.includes("get_employee_directory"), false);

  const coverage = buildCompanionFoundationCoverageRegistry();
  const appEmployeeModule = coverage.find((entry) => entry.module_id === "directory.app_employee");
  assert.ok(appEmployeeModule);
  assert.equal(appEmployeeModule?.readiness, "connected_but_partial");
  assert.equal(appEmployeeModule?.provider_key, "app_employee_directory");
  assert.notEqual(appEmployeeModule?.readiness, "production_ready");

  for (const locale of COMPANION_COVERAGE_LOCALES) {
    const localeFile = path.join(repoRoot, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
    const raw = JSON.parse(fs.readFileSync(localeFile, "utf8"));
    assert.ok(raw.companionPlatformKnowledge.directory.appEmployee?.employee);
    assert.ok(raw.companionPlatformKnowledge.directory.providers.app_employee_directory);
    assert.ok(raw.companionPlatformKnowledge.directory.appEmployee.outcomes.noMatch);
  }

  assert.ok(fs.existsSync(path.join(repoRoot, "lib/companion-runtime/load-companion-directory-context.ts")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib/companion-runtime/phase40.test.ts")));
}

runPhase40AsyncTests()
  .then(() => {
    console.log("phase40.test.ts passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
