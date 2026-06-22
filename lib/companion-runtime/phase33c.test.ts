import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_CROSS_TENANT_SEARCH,
  COMPANION_DIRECTORY_CORE,
  COMPANION_DIRECTORY_EXPORT,
  COMPANION_DIRECTORY_SEARCH,
  COMPANION_FUZZY_IDENTITY_MATCH,
  COMPANION_PERSON_SEARCH_AUDIT,
  COMPANION_PII_DEFAULT,
  COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE,
  companionDirectoryPolicyMetadata,
} from "@/lib/companion-runtime/companion-directory-policy";
import {
  buildCompanionDirectoryContextFromManifests,
} from "@/lib/companion-runtime/companion-directory-context";
import {
  createDirectorySearchAuditEvent,
  listDirectorySearchAuditEvents,
  resetDirectorySearchAuditLogForTests,
} from "@/lib/companion-runtime/directory-audit";
import { dedupeDirectoryRecords } from "@/lib/companion-runtime/directory-dedupe";
import {
  buildDirectorySearchQueryFromIntent,
  collectDirectoryRelationshipDescriptorsFromManifests,
  resolveDirectorySemanticIntent,
  type DirectoryRelationshipAliasDescriptor,
} from "@/lib/companion-runtime/directory-semantic-intent";
import { executeDirectorySearch } from "@/lib/companion-runtime/directory-search-orchestrator";
import { COMPANION_COVERAGE_LOCALES } from "@/lib/companion-runtime/companion-foundation-coverage-i18n";
import {
  buildCompanionFoundationCoverageRegistry,
} from "@/lib/companion-runtime/companion-foundation-coverage-registry";
import {
  classifyDirectoryMatches,
  matchDirectoryRecord,
} from "@/lib/integration-intelligence/directory/matching";
import {
  detectDirectorySearchField,
  normalizeDirectoryEmail,
  normalizeDirectoryOrganizationNumber,
  normalizeDirectoryPhone,
} from "@/lib/integration-intelligence/directory/normalization";
import {
  maskDirectoryEmail,
  maskDirectoryPhone,
  sanitizeDirectoryRecordForAudit,
} from "@/lib/integration-intelligence/directory/masking";
import { DIRECTORY_OUTCOME_I18N_KEYS } from "@/lib/integration-intelligence/directory/outcomes";
import { DIRECTORY_PROVIDER_MANIFESTS } from "@/lib/integration-intelligence/directory/manifests";
import { DIRECTORY_RELATIONSHIP_TYPES, normalizeDirectoryRelationshipType } from "@/lib/integration-intelligence/directory/relationship-types";
import {
  UNONIGHT_DIRECTORY_MEMBER_CONTRACT,
  mapUnonightMemberDirectoryFields,
} from "@/lib/unonight/provider-adapter/directory-member-contract";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG_A = "org-tenant-a";
const ORG_B = "org-tenant-b";

const testDescriptors: DirectoryRelationshipAliasDescriptor[] = [
  {
    relationship_type: "customer",
    entity_type: "person",
    capability_key: "customer.search",
    aliases: { no: ["kunde", "kunden"], en: ["customer"] },
  },
  {
    relationship_type: "member",
    entity_type: "person",
    capability_key: "member.search",
    aliases: { no: ["medlem", "medlemmer"], en: ["member"] },
  },
  {
    relationship_type: "employee",
    entity_type: "person",
    capability_key: "employee.search",
    aliases: { no: ["ansatt", "ansatte"], en: ["employee"] },
  },
  {
    relationship_type: "lead",
    entity_type: "person",
    capability_key: "lead.search",
    aliases: { no: ["lead", "leads"], en: ["lead"] },
  },
  {
    relationship_type: "partner",
    entity_type: "organization",
    capability_key: "partner.search",
    aliases: { no: ["partner"], en: ["partner"] },
  },
  {
    relationship_type: "supplier",
    entity_type: "organization",
    capability_key: "supplier.search",
    aliases: { no: ["leverand"], en: ["supplier"] },
  },
];

assert.equal(companionDirectoryPolicyMetadata().directory_search, COMPANION_DIRECTORY_SEARCH);
assert.equal(COMPANION_DIRECTORY_CORE, "provider_agnostic");
assert.equal(COMPANION_PII_DEFAULT, "masked");
assert.equal(COMPANION_PERSON_SEARCH_AUDIT, "required");
assert.equal(COMPANION_CROSS_TENANT_SEARCH, "forbidden");
assert.equal(COMPANION_FUZZY_IDENTITY_MATCH, "clarification_required_when_uncertain");
assert.equal(COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE, "forbidden");
assert.equal(COMPANION_DIRECTORY_EXPORT, "approval_or_disabled");

assert.ok(DIRECTORY_RELATIONSHIP_TYPES.includes("customer"));
assert.ok(DIRECTORY_RELATIONSHIP_TYPES.includes("member"));
assert.equal(normalizeDirectoryRelationshipType("client"), "customer");
assert.equal(normalizeDirectoryRelationshipType("vendor"), "supplier");

assert.equal(detectDirectorySearchField("ola.nordmann@example.com"), "email");
assert.equal(detectDirectorySearchField("+47 912 34 567"), "phone");
assert.equal(detectDirectorySearchField("923456789"), "organization_number");
assert.equal(normalizeDirectoryEmail("Ola@Test.COM"), "ola@test.com");
assert.equal(normalizeDirectoryPhone("+47 912 34 567"), "+4791234567");
assert.equal(normalizeDirectoryOrganizationNumber("923 456 789"), "923456789");
assert.equal(maskDirectoryEmail("ola.nordmann@example.com"), "o***********@example.com");
assert.ok(maskDirectoryPhone("+4791234567")?.endsWith("4567"));

const exactNameMatch = matchDirectoryRecord({
  field: "name",
  queryValue: "Ola Nordmann",
  candidate: {
    entity_id: "p1",
    entity_type: "person",
    display_name: "Ola Nordmann",
    company_name: null,
  },
  baseRecord: {
    entity_id: "p1",
    entity_type: "person",
    display_name: "Ola Nordmann",
    company_name: null,
    role: null,
    status: "active",
    department: null,
    team: null,
    email_masked: null,
    phone_masked: null,
    organization_number: null,
    relationship_type: "customer",
    source_provider: "crm_customer_directory",
    source_reference: "crm:1",
    organization_id: ORG_A,
    freshness: "fresh",
    completeness: "complete",
    permission_scope: "basic",
  },
});
assert.ok(exactNameMatch);
assert.equal(exactNameMatch?.match_confidence, "high");

const fuzzyLow = matchDirectoryRecord({
  field: "name",
  queryValue: "Ola N",
  candidate: {
    entity_id: "p2",
    entity_type: "person",
    display_name: "Ole Nord",
    company_name: null,
  },
  baseRecord: {
    entity_id: "p2",
    entity_type: "person",
    display_name: "Ole Nord",
    company_name: null,
    role: null,
    status: "active",
    department: null,
    team: null,
    email_masked: null,
    phone_masked: null,
    organization_number: null,
    relationship_type: "customer",
    source_provider: "crm_customer_directory",
    source_reference: "crm:2",
    organization_id: ORG_A,
    freshness: "fresh",
    completeness: "partial",
    permission_scope: "basic",
  },
});
if (fuzzyLow) {
  const classified = classifyDirectoryMatches([fuzzyLow]);
  assert.ok(classified.clarification_required || classified.outcome !== "exact_match");
}

const customerIntent = resolveDirectorySemanticIntent({
  query: "Finn kunden Ola Nordmann",
  locale: "no",
  descriptors: testDescriptors,
});
assert.equal(customerIntent.relationship_type, "customer");
assert.equal(customerIntent.entity_type, "person");

const companyIntent = resolveDirectorySemanticIntent({
  query: "Søk etter firmaet Nordlys AS",
  locale: "no",
  descriptors: [
    ...testDescriptors,
    {
      relationship_type: "customer",
      entity_type: "organization",
      capability_key: "customer.search",
      aliases: { no: ["firma", "firmaet"], en: ["company"] },
    },
  ],
});
assert.equal(companyIntent.entity_type, "organization");

const employeeIntent = resolveDirectorySemanticIntent({
  query: "Har vi en ansatt som heter Kari?",
  locale: "no",
  descriptors: testDescriptors,
});
assert.equal(employeeIntent.relationship_type, "employee");

const phoneIntent = resolveDirectorySemanticIntent({
  query: "Finn medlemmet med telefonnummeret +47 912 34 567",
  locale: "no",
  descriptors: testDescriptors,
});
assert.equal(phoneIntent.search_field, "phone");

const emailIntent = resolveDirectorySemanticIntent({
  query: "Finn kunden med denne e-postadressen ola@test.com",
  locale: "no",
  descriptors: testDescriptors,
});
assert.equal(emailIntent.search_field, "email");

const leadIntent = resolveDirectorySemanticIntent({
  query: "Vis leads fra Bergen",
  locale: "no",
  descriptors: testDescriptors,
});
assert.equal(leadIntent.relationship_type, "lead");

const query = buildDirectorySearchQueryFromIntent({
  intent: customerIntent,
  organization_id: ORG_A,
  tenant_id: ORG_A,
  locale: "no",
  permission_scope: "basic",
});
assert.equal(query.organization_id, ORG_A);

resetDirectorySearchAuditLogForTests();

const sharedCandidates = [
  {
    entity_id: "crm-1",
    entity_type: "person" as const,
    display_name: "Ola Nordmann",
    company_name: "Nordlys AS",
    email_raw: "ola.nordmann@example.com",
    phone_raw: "+4791234567",
    email_masked: "o************@example.com",
    phone_masked: "*******4567",
    organization_number: "923456789",
  },
  {
    entity_id: "hr-1",
    entity_type: "person" as const,
    display_name: "Kari Hansen",
    company_name: null,
    email_raw: "kari@example.com",
    phone_raw: null,
    email_masked: "k***@example.com",
    phone_masked: null,
    organization_number: null,
  },
  {
    entity_id: "crm-2",
    entity_type: "person" as const,
    display_name: "Ola Nordmann",
    company_name: "Other AS",
    email_raw: "ola.other@example.com",
    phone_raw: "+4799999999",
    email_masked: "o*********@example.com",
    phone_masked: "*******9999",
    organization_number: null,
  },
];

const providers = [
  {
    provider_key: "crm_customer_directory",
    active: true,
    supported_fields: ["name", "email", "phone", "company_name", "organization_number"] as const,
    search: async () => sharedCandidates,
  },
  {
    provider_key: "hr_employee_directory",
    active: true,
    supported_fields: ["name", "email"] as const,
    search: async () => [sharedCandidates[1]],
  },
];

async function runPhase33cAsyncTests() {
const exactEmailResult = await executeDirectorySearch({
  query: {
    ...query,
    search_field: "email",
    search_value: "ola.nordmann@example.com",
    relationship_type: "customer",
    permission_scope: "contact",
  },
  permission: {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    field_access: "directory.search.contact",
    rate_limit_ok: true,
  },
  user_role: "owner",
  providers,
  candidatesByProvider: {
    crm_customer_directory: sharedCandidates,
    hr_employee_directory: [sharedCandidates[1]],
  },
});
assert.equal(exactEmailResult.outcome, "exact_match");
assert.ok(exactEmailResult.audit_id);
assert.ok(exactEmailResult.records[0]?.email_masked?.includes("*"));

const multipleNameResult = await executeDirectorySearch({
  query: {
    ...query,
    search_field: "name",
    search_value: "Ola Nordmann",
  },
  permission: {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    field_access: "directory.search.basic",
    rate_limit_ok: true,
  },
  user_role: "owner",
  providers,
  candidatesByProvider: {
    crm_customer_directory: sharedCandidates,
    hr_employee_directory: [sharedCandidates[1]],
  },
});
assert.equal(multipleNameResult.outcome, "multiple_matches");
assert.ok(multipleNameResult.clarification_required);

const noMatchResult = await executeDirectorySearch({
  query: {
    ...query,
    search_field: "name",
    search_value: "Ukjent Person",
  },
  permission: {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    field_access: "directory.search.basic",
    rate_limit_ok: true,
  },
  user_role: "owner",
  providers,
  candidatesByProvider: { crm_customer_directory: sharedCandidates },
});
assert.equal(noMatchResult.outcome, "no_match");

const permissionDenied = await executeDirectorySearch({
  query: {
    ...query,
    search_field: "email",
    search_value: "ola.nordmann@example.com",
    permission_scope: "contact",
  },
  permission: {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: true,
    provider_active: true,
    field_access: "directory.search.contact",
    rate_limit_ok: true,
  },
  user_role: "owner",
  providers,
});
assert.equal(permissionDenied.outcome, "activation_pending");

const crossTenant = await executeDirectorySearch({
  query: {
    ...query,
    organization_id: ORG_B,
    tenant_id: ORG_B,
    search_field: "email",
    search_value: "ola.nordmann@example.com",
    permission_scope: "contact",
  },
  permission: {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    field_access: "directory.search.basic",
    rate_limit_ok: true,
  },
  user_role: "owner",
  providers,
});
assert.equal(crossTenant.outcome, "permission_denied");

const providerMissing = await executeDirectorySearch({
  query: {
    ...query,
    search_field: "name",
    search_value: "Ola Nordmann",
  },
  permission: {
    organization_id: ORG_A,
    tenant_id: ORG_A,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    field_access: "directory.search.basic",
    rate_limit_ok: true,
  },
  user_role: "owner",
  providers: [],
});
assert.equal(providerMissing.outcome, "provider_missing");

const deduped = dedupeDirectoryRecords([
  exactEmailResult.records[0],
  {
    ...exactEmailResult.records[0],
    entity_id: "crm-dup",
    source_provider: "hr_employee_directory",
  },
]);
assert.equal(deduped.length, 1);

const audit = listDirectorySearchAuditEvents(ORG_A);
assert.ok(audit.length > 0);
const auditPayload = JSON.stringify(audit);
assert.doesNotMatch(auditPayload, /ola\.nordmann@example.com/);
assert.doesNotMatch(auditPayload, /\+4791234567/);

const sanitized = sanitizeDirectoryRecordForAudit(exactEmailResult.records[0]!);
assert.equal(sanitized.has_email, true);
assert.equal((sanitized as { email_masked?: string }).email_masked, undefined);

const directoryContext = buildCompanionDirectoryContextFromManifests({
  organization_id: ORG_A,
  tenant_id: ORG_A,
  manifests: DIRECTORY_PROVIDER_MANIFESTS,
});
assert.ok(directoryContext.capabilities.some((cap) => cap.capability_key === "directory.search"));
assert.equal(directoryContext.export_blocked, true);

const coverage = buildCompanionFoundationCoverageRegistry();
assert.ok(coverage.some((entry) => entry.module_id === "directory.core_search"));
assert.ok(coverage.some((entry) => entry.module_id === "directory.unonight_member"));
assert.notEqual(UNONIGHT_DIRECTORY_MEMBER_CONTRACT.readiness, "production_ready");
assert.equal(UNONIGHT_DIRECTORY_MEMBER_CONTRACT.exposes_member_list, false);
assert.equal(mapUnonightMemberDirectoryFields({
  member_id: "m1",
  display_name: "Member One",
  membership_status: "active",
  verification_status: "verified",
}).entity_id, "m1");

const coreSources = [
  "lib/companion-runtime/directory-search-orchestrator.ts",
  "lib/companion-runtime/directory-semantic-intent.ts",
  "lib/integration-intelligence/directory/matching.ts",
].map((file) => fs.readFileSync(path.join(repoRoot, file), "utf8"));
for (const source of coreSources) {
  assert.doesNotMatch(source, /unonight_member_id/i);
  assert.doesNotMatch(source, /get_unonight_/i);
}

const unonightContract = fs.readFileSync(
  path.join(repoRoot, "lib/unonight/provider-adapter/directory-member-contract.ts"),
  "utf8",
);
assert.match(unonightContract, /mapUnonightMemberDirectoryFields/);

for (const locale of COMPANION_COVERAGE_LOCALES) {
  const dict = JSON.parse(
    fs.readFileSync(path.join(repoRoot, `locales/${locale}/customer-app/companionPlatformKnowledge.json`), "utf8"),
  );
  const directory = dict.companionPlatformKnowledge.directory;
  assert.ok(directory?.outcomes?.exactMatch, `${locale} directory outcomes`);
  assert.ok(directory?.masking?.email, `${locale} directory masking`);
}

for (const key of Object.values(DIRECTORY_OUTCOME_I18N_KEYS)) {
  assert.ok(key.startsWith("customerApp.companionPlatformKnowledge.directory."), key);
}

assert.ok(collectDirectoryRelationshipDescriptorsFromManifests(DIRECTORY_PROVIDER_MANIFESTS).length > 0);
}

runPhase33cAsyncTests()
  .then(() => {
    console.log("phase33c.test.ts: all assertions passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
