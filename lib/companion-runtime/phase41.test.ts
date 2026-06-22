import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_CRM_DIRECTORY_WRITE_ACTIONS,
  COMPANION_CROSS_TENANT_SEARCH,
  COMPANION_CUSTOMER_OWNERSHIP,
  COMPANION_PARTNER_ATTRIBUTION_IS_NOT_OWNERSHIP,
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
  listDirectorySearchAuditEvents,
  resetDirectorySearchAuditLogForTests,
} from "@/lib/companion-runtime/directory-audit";
import { dedupeDirectoryRecords } from "@/lib/companion-runtime/directory-dedupe";
import {
  buildCrmDirectoryCommandBriefSignals,
  countCrmCandidates,
  executeCrmDirectorySearch,
} from "@/lib/companion-runtime/crm-customer-read-orchestrator";
import { collectCommandBriefSignalsFromDomainContexts } from "@/lib/companion-runtime/command-brief-signal-collector";
import { createEmptyCompanionCommunityContext } from "@/lib/companion-runtime/companion-community-context";
import { createEmptyCompanionFinanceContext } from "@/lib/companion-runtime/companion-finance-context";
import { createEmptyCompanionHrContext } from "@/lib/companion-runtime/companion-hr-context";
import { createEmptyCompanionOperationalContext } from "@/lib/companion-runtime/companion-operational-context";
import { createEmptyCompanionProactiveContext } from "@/lib/companion-runtime/companion-proactive-context";
import { createEmptyCompanionSalesContext } from "@/lib/companion-runtime/companion-sales-context";
import { createEmptyCompanionSecurityContext } from "@/lib/companion-runtime/companion-security-context";
import { createEmptyCompanionSupportContext } from "@/lib/companion-runtime/companion-support-context";
import { createEmptyCompanionHostsContext } from "@/lib/companion-runtime/companion-hosts-context";
import { buildCompanionDirectoryContextFromManifests } from "@/lib/companion-runtime/companion-directory-context";
import { getCommandBriefCatalogEntry } from "@/lib/integration-intelligence/command-brief/signal-catalog";
import { DIRECTORY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/directory/manifests";
import {
  CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
  classifyCrmRelationship,
  mapCrmDirectoryBundle,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/crm-customer-directory-contract";
import { CRM_CUSTOMER_DIRECTORY_SOURCE_MAP } from "@/lib/integration-intelligence/providers/crm-customer-directory/crm-source-map";
import {
  buildCrmDirectoryPermissionContext,
  resolveCrmOwnershipPresentation,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/permissions";
import type { DirectoryRecord } from "@/lib/integration-intelligence/directory/types";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG = "org-crm-41";
const ORG_OTHER = "org-other-crm";

const relationshipPayload = {
  found: true,
  overview: {
    follow_ups_due: 2,
    at_risk: 1,
    open_leads: 3,
  },
  customers: [
    {
      id: "cust-1",
      customer_number: "C-1001",
      customer_type: "business",
      name: "Ola Nordmann",
      company_name: "Nordlys AS",
      email: "ola.nordmann@nordlys.no",
      phone: "+47 912 34 567",
      organization_number: "923456789",
      status: "active",
      assigned_employee_name: "Kari Seller",
      health_status: "healthy",
    },
    {
      id: "cust-2",
      customer_type: "individual",
      name: "Anna Kunde",
      email: "anna@example.com",
      phone: "+4790011222",
      status: "active",
    },
    {
      id: "cust-3",
      customer_type: "business",
      name: "Risk Corp",
      company_name: "Risk Corp",
      email: "risk@corp.no",
      status: "at_risk",
      health_status: "at_risk",
    },
  ],
  prospects: [
    {
      id: "prosp-1",
      name: "Future Client",
      company_name: "Future AS",
      email: "future@as.no",
      status: "prospect",
    },
  ],
  contacts: [
    {
      id: "contact-1",
      customer_id: "cust-1",
      customer_name: "Nordlys AS",
      full_name: "Per Kontakt",
      email: "per.kontakt@nordlys.no",
      phone: "+47 900 00 001",
      contact_role: "Technical contact",
    },
  ],
  leads: [
    {
      id: "lead-1",
      lead_number: "L-00001",
      company_name: "Beta Lead AS",
      contact_name: "Lead Person",
      email: "lead@beta.no",
      status: "open",
      lead_source: "website",
      follow_up_date: "2026-06-20",
    },
  ],
  organizations: [
    {
      id: "cust-1",
      customer_type: "enterprise",
      name: "Nordlys AS",
      company_name: "Nordlys AS",
      organization_number: "923456789",
      status: "active",
      assigned_employee_name: "Kari Seller",
    },
  ],
  opportunities: [
    {
      id: "opp-1",
      customer_id: "cust-1",
      stage: "proposal",
      partner_owned: true,
      status: "open",
    },
  ],
};

const leadCenterPayload = {
  found: true,
  leads: [
    {
      id: "lead-2",
      lead_number: "L-00002",
      company_name: "Gamma Lead",
      contact_name: "Gamma Contact",
      email: "gamma@lead.no",
      status: "open",
      lead_source: "referral",
    },
  ],
};

const bundle = mapCrmDirectoryBundle({
  organizationId: ORG,
  relationshipCenterData: relationshipPayload,
  leadCenterData: leadCenterPayload,
});

assert.ok(bundle.source_exact);
assert.ok(bundle.candidates.length >= 6);
assert.ok(bundle.candidates.some((row) => row.lead_id === "lead-1"));
assert.ok(bundle.candidates.some((row) => row.status === "prospect"));

const ownership = resolveCrmOwnershipPresentation({
  customer_type: "partner",
  partner_owned: true,
  assigned_seller: "Kari Seller",
  partner_attribution: "Growth Partner AS",
});
assert.equal(ownership.platform_ownership, true);
assert.equal(ownership.partner_is_owner, false);
assert.ok(ownership.attribution_reference);

assert.equal(companionDirectoryPolicyMetadata().crm_directory_write_actions, "disabled");
assert.equal(COMPANION_CRM_DIRECTORY_WRITE_ACTIONS, "disabled");
assert.equal(COMPANION_CUSTOMER_OWNERSHIP, "platform");
assert.equal(COMPANION_PARTNER_ATTRIBUTION_IS_NOT_OWNERSHIP, true);
assert.equal(COMPANION_PII_DEFAULT, "masked");
assert.equal(COMPANION_PERSON_SEARCH_AUDIT, "required");
assert.equal(COMPANION_CROSS_TENANT_SEARCH, "forbidden");
assert.equal(COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE, "forbidden");

assert.ok(
  CRM_CUSTOMER_DIRECTORY_SOURCE_MAP.some((entry) => entry.source_id === "get_customer_relationship_center"),
);
assert.equal(
  CRM_CUSTOMER_DIRECTORY_SOURCE_MAP.find((entry) => entry.capability_key === "customer.search")?.source_kind,
  "rpc",
);

const crmManifest = DIRECTORY_PROVIDER_MANIFESTS.find((m) => m.provider_key === "crm_customer_directory");
assert.ok(crmManifest);
assert.ok(crmManifest?.capabilities.some((cap) => cap.capability_key === "customer.search" && cap.adapter_available));

const descriptors = collectDirectoryRelationshipDescriptorsFromManifests(DIRECTORY_PROVIDER_MANIFESTS);

function basePermission(overrides: Partial<Parameters<typeof buildCrmDirectoryPermissionContext>[0]> = {}) {
  return buildCrmDirectoryPermissionContext({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    has_crm_entitlement: true,
    ...overrides,
  });
}

async function searchBy(
  field: string,
  value: string,
  relationshipType: string | null = "customer",
  permission = basePermission(),
) {
  return executeCrmDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: field === "company_name" || field === "organization_number" ? "organization" : "person",
      relationship_type: relationshipType as never,
      search_field: field as never,
      search_value: value,
      filters: {},
      requested_fields: [field as never],
      requested_detail_level: "summary",
      permission_scope: permission.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: relationshipType === "lead" ? ["lead.search"] : ["customer.search"],
      locale: "no",
    },
    permission,
    user_role: permission.user_role,
    bundle,
  });
}

async function runPhase41AsyncTests() {
  resetDirectorySearchAuditLogForTests();

  const customerName = await searchBy("name", "Ola Nordmann");
  assert.equal(customerName.outcome, "exact_match");

  const companyName = await searchBy("company_name", "Nordlys AS", "customer");
  assert.ok(["exact_match", "multiple_matches"].includes(companyName.outcome));

  const emailResult = await searchBy("email", "ola.nordmann@nordlys.no");
  assert.equal(emailResult.outcome, "exact_match");

  const phoneResult = await searchBy("phone", "+4791234567");
  assert.equal(phoneResult.outcome, "exact_match");

  const orgNoResult = await searchBy("organization_number", "923456789", "customer");
  assert.equal(orgNoResult.outcome, "exact_match");

  const externalId = await searchBy("external_id", "C-1001");
  assert.equal(externalId.outcome, "exact_match");

  const customerId = await searchBy("customer_id", "cust-1");
  assert.equal(customerId.outcome, "exact_match");

  const leadSearch = await searchBy("email", "lead@beta.no", "lead");
  assert.equal(leadSearch.outcome, "exact_match");

  const leadIdSearch = await searchBy("lead_id", "lead-1", "lead");
  assert.equal(leadIdSearch.outcome, "exact_match");

  const prospectSearch = await searchBy("name", "Future Client", "prospect");
  assert.equal(prospectSearch.outcome, "exact_match");

  const contactSearch = await searchBy("name", "Per Kontakt", "contact");
  assert.equal(contactSearch.outcome, "exact_match");
  assert.ok(contactSearch.records[0]?.company_name?.includes("Nordlys"));

  const ownerSearch = await searchBy("owner", "Kari Seller");
  assert.ok(ownerSearch.records.length >= 1);

  const leadSourceSearch = await searchBy("lead_source", "website", "lead");
  assert.ok(leadSourceSearch.records.length >= 1);

  const multiResult = await searchBy("name", "Ola");
  assert.ok(["multiple_matches", "ambiguous_query", "exact_match"].includes(multiResult.outcome));

  const noMatch = await searchBy("name", "Nobody CRM");
  assert.equal(noMatch.outcome, "no_match");

  const staffPermission = buildCrmDirectoryPermissionContext({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "staff",
    app_suspended: false,
    provider_active: true,
    has_crm_entitlement: true,
    can_search_directory_contact: false,
    can_view_customer_health: false,
    can_view_attribution: false,
  });
  const maskedResult = await searchBy("name", "Anna Kunde", "customer", staffPermission);
  assert.ok(maskedResult.records[0]?.email_masked?.includes("*"));

  const contactPermission = basePermission({ can_search_directory_contact: true });
  const fullContact = await searchBy("email", "anna@example.com", "customer", contactPermission);
  assert.equal(fullContact.records[0]?.email_masked, "anna@example.com");

  const noEntitlement = await executeCrmDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "customer",
      search_field: "name",
      search_value: "Ola",
      filters: {},
      requested_fields: ["name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
      locale: "en",
    },
    permission: basePermission({ has_crm_entitlement: false, provider_active: false }),
    user_role: "owner",
    bundle,
  });
  assert.equal(noEntitlement.outcome, "provider_missing");

  const suspended = await searchBy("name", "Ola", "customer", basePermission({ app_suspended: true }));
  assert.equal(suspended.outcome, "activation_pending");

  const crossTenant = await executeCrmDirectorySearch({
    query: {
      organization_id: ORG_OTHER,
      tenant_id: ORG,
      entity_type: "person",
      relationship_type: "customer",
      search_field: "name",
      search_value: "Ola",
      filters: {},
      requested_fields: ["name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
      locale: "en",
    },
    permission: basePermission(),
    user_role: "owner",
    bundle,
  });
  assert.equal(crossTenant.outcome, "permission_denied");

  await searchBy("name", "Nordlys AS", "customer");
  const audits = listDirectorySearchAuditEvents(ORG);
  assert.ok(audits.length > 0);
  assert.ok(audits.every((event) => !JSON.stringify(event).includes("ola.nordmann@nordlys.no")));
  assert.ok(audits.some((event) => event.provider_keys.includes(CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY)));

  const duplicateRecords: DirectoryRecord[] = [
    {
      entity_id: "cust-a",
      entity_type: "person",
      display_name: "Shared Email",
      company_name: null,
      role: null,
      status: "active",
      department: null,
      team: null,
      email_masked: "shared@example.com",
      phone_masked: null,
      organization_number: null,
      relationship_type: "customer",
      source_provider: CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
      source_reference: "crm:1",
      organization_id: ORG,
      freshness: "fresh",
      completeness: "partial",
      permission_scope: "basic",
      match_kind: "exact",
      match_confidence: "high",
    },
    {
      entity_id: "lead-b",
      entity_type: "person",
      display_name: "Shared Email Lead",
      company_name: null,
      role: null,
      status: "open",
      department: null,
      team: null,
      email_masked: "shared@example.com",
      phone_masked: null,
      organization_number: null,
      relationship_type: "lead",
      source_provider: CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
      source_reference: "crm:2",
      organization_id: ORG,
      freshness: "fresh",
      completeness: "partial",
      permission_scope: "basic",
      match_kind: "exact",
      match_confidence: "high",
    },
  ];
  const deduped = dedupeDirectoryRecords(duplicateRecords);
  assert.equal(deduped.length, 1);

  const briefSignals = buildCrmDirectoryCommandBriefSignals({ bundle, source_exact: true });
  assert.ok(briefSignals.some((signal) => signal.signal_key === "lead_without_follow_up"));
  assert.ok(briefSignals.some((signal) => signal.signal_key === "customer_health_warning"));

  for (const key of ["new_lead", "lead_without_follow_up", "churn_risk", "unassigned_customer"]) {
    assert.ok(getCommandBriefCatalogEntry(key));
  }

  const directoryContext = buildCompanionDirectoryContextFromManifests({
    organization_id: ORG,
    tenant_id: ORG,
    manifests: DIRECTORY_PROVIDER_MANIFESTS,
    connectedProviders: [CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY],
  });
  const briefCollected = collectCommandBriefSignalsFromDomainContexts({
    organization_id: ORG,
    contexts: {
      hrContext: createEmptyCompanionHrContext(),
      warehouseContext: createEmptyCompanionHrContext() as never,
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
      crm_source_exact: true,
      crm_command_brief_signals: briefSignals,
    },
  });
  assert.ok(briefCollected.some((signal) => signal.source_module === "directory_crm"));

  const customerIntent = resolveDirectorySemanticIntent({
    query: "Finn kunden Ola Nordmann",
    locale: "no",
    descriptors,
  });
  assert.equal(customerIntent.relationship_type, "customer");

  const companyIntent = resolveDirectorySemanticIntent({
    query: "Har vi en kunde som heter Nordlys AS?",
    locale: "no",
    descriptors,
  });
  assert.equal(companyIntent.search_field, "company_name");

  const leadIntent = resolveDirectorySemanticIntent({
    query: "Finn leadet med denne e-postadressen lead@beta.no",
    locale: "no",
    descriptors,
  });
  assert.equal(leadIntent.search_field, "email");

  const followUpIntent = resolveDirectorySemanticIntent({
    query: "Vis leads uten oppfølging",
    locale: "no",
    descriptors,
  });
  assert.equal(followUpIntent.search_field, "status");

  const churnIntent = resolveDirectorySemanticIntent({
    query: "Hvilke kunder har høy churn-risiko?",
    locale: "no",
    descriptors,
  });
  assert.equal(churnIntent.search_value, "at_risk");

  assert.equal(classifyCrmRelationship(bundle.candidates.find((row) => row.lead_id === "lead-1")!), "lead");
  assert.equal(countCrmCandidates(bundle, { relationship_type: "lead" }), 2);

  const orchestratorSource = fs.readFileSync(
    path.join(repoRoot, "lib/companion-runtime/directory-search-orchestrator.ts"),
    "utf8",
  );
  assert.equal(orchestratorSource.includes("organization_crm_customers"), false);

  const coverage = buildCompanionFoundationCoverageRegistry();
  for (const moduleId of [
    "directory.crm_customer",
    "directory.crm_lead",
    "directory.crm_contact",
    "directory.crm_organization",
  ]) {
    const entry = coverage.find((row) => row.module_id === moduleId);
    assert.ok(entry, moduleId);
    assert.equal(entry?.readiness, "connected_but_partial");
    assert.notEqual(entry?.readiness, "production_ready");
  }

  for (const locale of COMPANION_COVERAGE_LOCALES) {
    const localeFile = path.join(repoRoot, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
    const raw = JSON.parse(fs.readFileSync(localeFile, "utf8"));
    assert.ok(raw.companionPlatformKnowledge.directory.crm?.customer);
    assert.ok(raw.companionPlatformKnowledge.directory.crm.outcomes.noMatch);
  }

  assert.ok(fs.existsSync(path.join(repoRoot, "lib/companion-runtime/crm-customer-read-orchestrator.ts")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib/companion-runtime/phase41.test.ts")));
}

runPhase41AsyncTests()
  .then(() => {
    console.log("phase41.test.ts passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
