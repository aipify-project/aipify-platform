import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
  COMPANION_CROSS_TENANT_SEARCH,
  COMPANION_DIRECTORY_SEARCH,
  COMPANION_FUZZY_IDENTITY_MATCH,
  COMPANION_MARKETPLACE_RESULT_IS_NOT_ACTIVE_SUPPLIER,
  COMPANION_PERSON_SEARCH_AUDIT,
  COMPANION_PII_DEFAULT,
  COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE,
  COMPANION_SUPPLIER_DIRECTORY_WRITE_ACTIONS,
  COMPANION_SUPPLIER_IS_NOT_CUSTOMER,
  COMPANION_SUPPLIER_IS_NOT_PARTNER,
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
  buildSupplierDirectoryCommandBriefSignals,
  countSupplierCandidates,
  executeSupplierDirectorySearch,
} from "@/lib/companion-runtime/supplier-vendor-read-orchestrator";
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
  SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
  classifySupplierCandidateRelationship,
  classifySupplierRelationship,
  isMarketplaceSupplierCandidate,
  mapSupplierDirectoryBundle,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/supplier-vendor-directory-contract";
import { SUPPLIER_VENDOR_DIRECTORY_SOURCE_MAP } from "@/lib/integration-intelligence/providers/supplier-vendor-directory/supplier-source-map";
import {
  buildSupplierDirectoryPermissionContext,
  resolveSupplierRelationshipPresentation,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/permissions";
import type { DirectoryRecord } from "@/lib/integration-intelligence/directory/types";
import type { Vendor } from "@/lib/procurement-operations/types";

const repoRoot = path.join(import.meta.dirname, "..", "..");
const ORG = "org-supplier-42";
const ORG_OTHER = "org-other-supplier";

const procurementPayload = {
  found: true,
  overview: {
    expiring_contracts_30d: 2,
    high_risk_suppliers: 1,
    pending_receiving: 1,
    orders_in_transit: 3,
  },
  vendors: [
    {
      id: "sup-1",
      vendor_number: "V-1001",
      vendor_name: "Nordisk Engros AS",
      contact_person: "Erik Leverandør",
      email: "erik@nordisk-engros.no",
      phone: "+47 900 11 222",
      organization_number: "912345678",
      country: "NO",
      category_key: "wholesale",
      services: "grossist engros",
      status: "active",
      is_preferred: true,
      health_status: "healthy",
    },
    {
      id: "sup-2",
      vendor_number: "V-1002",
      vendor_name: "Svensk Produsent AB",
      contact_person: "Anna Produsent",
      email: "anna@produsent.se",
      phone: "+46 70 123 4567",
      country: "SE",
      category_key: "manufacturer",
      services: "manufacturer produsent",
      status: "active",
      is_preferred: false,
    },
    {
      id: "sup-3",
      vendor_name: "Rengjøring Service AS",
      category_key: "service",
      services: "rengjøring cleaning",
      status: "active",
      is_preferred: false,
    },
    {
      id: "sup-4",
      vendor_name: "Nord Distribution",
      category_key: "distributor",
      services: "distributor grossist",
      country: "NO",
      status: "active",
      is_preferred: true,
      health_status: "high_risk",
      risk_status: "high",
    },
    {
      id: "sup-5",
      vendor_name: "Duplicate Org AS",
      organization_number: "999888777",
      status: "active",
      is_preferred: false,
    },
    {
      id: "sup-6",
      vendor_name: "Duplicate Org Twin",
      organization_number: "999888777",
      status: "active",
      is_preferred: false,
    },
  ],
  contracts: [
    {
      id: "c-1",
      contract_name: "Nordisk",
      vendor_name: "Nordisk Engros AS",
      status: "active",
      contract_value: 100,
      currency: "NOK",
    },
    {
      id: "c-2",
      contract_name: "Expired",
      vendor_name: "Rengjøring Service AS",
      status: "expired",
      contract_value: 50,
      currency: "NOK",
    },
  ],
};

const bundle = mapSupplierDirectoryBundle({
  organizationId: ORG,
  procurementCenterData: procurementPayload,
});

assert.ok(bundle.source_exact);
assert.ok(bundle.candidates.length >= 6);
assert.ok(bundle.candidates.some((row) => row.supplier_id === "sup-1"));
assert.ok(bundle.candidates.some((row) => row.role === "supplier_contact"));

const manufacturerVendor = procurementPayload.vendors[1] as Vendor;
assert.equal(classifySupplierRelationship(manufacturerVendor), "manufacturer");

const serviceVendor = procurementPayload.vendors[2] as Vendor;
assert.equal(classifySupplierRelationship(serviceVendor), "service_provider");

const presentation = resolveSupplierRelationshipPresentation({
  is_marketplace_candidate: true,
  is_partner: true,
  is_customer: true,
});
assert.equal(presentation.is_active_supplier, false);
assert.equal(presentation.is_partner, false);
assert.equal(presentation.is_customer, false);
assert.equal(presentation.marketplace_is_not_supplier, true);

assert.equal(companionDirectoryPolicyMetadata().supplier_directory_write_actions, "disabled");
assert.equal(COMPANION_SUPPLIER_DIRECTORY_WRITE_ACTIONS, "disabled");
assert.equal(COMPANION_SUPPLIER_IS_NOT_CUSTOMER, true);
assert.equal(COMPANION_SUPPLIER_IS_NOT_PARTNER, true);
assert.equal(COMPANION_MARKETPLACE_RESULT_IS_NOT_ACTIVE_SUPPLIER, true);
assert.equal(COMPANION_DIRECTORY_SEARCH, "tenant_scoped");
assert.equal(COMPANION_PII_DEFAULT, "masked");
assert.equal(COMPANION_PERSON_SEARCH_AUDIT, "required");
assert.equal(COMPANION_CROSS_TENANT_SEARCH, "forbidden");
assert.equal(COMPANION_PROVIDER_FIELD_MAPPING_IN_CORE, "forbidden");
assert.equal(COMPANION_FUZZY_IDENTITY_MATCH, "clarification_required_when_uncertain");

assert.ok(
  SUPPLIER_VENDOR_DIRECTORY_SOURCE_MAP.some(
    (entry) => entry.source_id === "get_procurement_operations_center",
  ),
);
assert.equal(
  SUPPLIER_VENDOR_DIRECTORY_SOURCE_MAP.find((entry) => entry.capability_key === "supplier.search")?.status,
  "live",
);

const supplierManifest = DIRECTORY_PROVIDER_MANIFESTS.find(
  (m) => m.provider_key === SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
);
assert.ok(supplierManifest);
assert.ok(
  supplierManifest?.capabilities.some((cap) => cap.capability_key === "supplier.search" && cap.adapter_available),
);

const descriptors = collectDirectoryRelationshipDescriptorsFromManifests(DIRECTORY_PROVIDER_MANIFESTS);

function basePermission(
  overrides: Partial<Parameters<typeof buildSupplierDirectoryPermissionContext>[0]> = {},
) {
  return buildSupplierDirectoryPermissionContext({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "owner",
    app_suspended: false,
    provider_active: true,
    has_procurement_entitlement: true,
    ...overrides,
  });
}

async function searchBy(
  field: string,
  value: string,
  relationshipType: string | null = "supplier",
  permission = basePermission(),
) {
  return executeSupplierDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type:
        [
          "company_name",
          "organization_number",
          "supplier_id",
          "category",
          "product",
          "service",
          "country",
          "preferred_supplier",
          "contract_status",
          "manufacturer",
          "distributor",
        ].includes(field)
          ? "organization"
          : "person",
      relationship_type: relationshipType as never,
      search_field: field as never,
      search_value: value,
      filters: {},
      requested_fields: [field as never],
      requested_detail_level: "summary",
      permission_scope: permission.can_search_directory_contact ? "contact" : "basic",
      capability_candidates:
        relationshipType === "manufacturer"
          ? ["manufacturer.search"]
          : relationshipType === "distributor"
            ? ["distributor.search"]
            : relationshipType === "supplier_contact"
              ? ["supplier_contact.search"]
              : ["supplier.search"],
      locale: "no",
    },
    permission,
    user_role: permission.user_role,
    bundle,
  });
}

async function runPhase42AsyncTests() {
  resetDirectorySearchAuditLogForTests();

  const companyName = await searchBy("company_name", "Nordisk Engros AS");
  assert.ok(["exact_match", "multiple_matches"].includes(companyName.outcome));

  const contactName = await searchBy("contact_name", "Erik", "supplier_contact");
  assert.ok(contactName.records.length >= 1);

  const emailResult = await searchBy("email", "erik@nordisk-engros.no", "supplier_contact");
  assert.equal(emailResult.outcome, "exact_match");

  const phoneResult = await searchBy("phone", "+47900112222", "supplier_contact");
  assert.ok(["exact_match", "no_match", "multiple_matches"].includes(phoneResult.outcome));

  const orgNoResult = await searchBy("organization_number", "912345678", "supplier");
  assert.equal(orgNoResult.outcome, "exact_match");

  const supplierId = await searchBy("supplier_id", "sup-1", "supplier");
  assert.equal(supplierId.outcome, "exact_match");

  const externalId = await searchBy("external_id", "V-1001", "supplier");
  assert.equal(externalId.outcome, "exact_match");

  const categorySearch = await searchBy("category", "wholesale", "supplier");
  assert.ok(categorySearch.records.length >= 1);

  const serviceSearch = await searchBy("service", "rengjøring", "service_provider");
  assert.ok(serviceSearch.records.length >= 1);

  const manufacturerSearch = await searchBy("company_name", "Svensk Produsent", "manufacturer");
  assert.ok(manufacturerSearch.records.length >= 1);

  const distributorSearch = await searchBy("company_name", "Nord Distribution", "distributor");
  assert.ok(distributorSearch.records.length >= 1);

  const countrySearch = await searchBy("country", "SE", "supplier");
  assert.ok(countrySearch.records.length >= 1);

  const preferredSearch = await searchBy("preferred_supplier", "true", "supplier");
  assert.ok(preferredSearch.records.length >= 1);

  const contractSearch = await searchBy("contract_status", "active", "supplier");
  assert.ok(contractSearch.records.length >= 1);

  const multiResult = await searchBy("company_name", "Nord");
  assert.ok(["multiple_matches", "ambiguous_query", "exact_match"].includes(multiResult.outcome));

  const noMatch = await searchBy("company_name", "Nobody Supplier");
  assert.equal(noMatch.outcome, "no_match");

  const staffPermission = buildSupplierDirectoryPermissionContext({
    organization_id: ORG,
    tenant_id: ORG,
    user_role: "staff",
    app_suspended: false,
    provider_active: true,
    has_procurement_entitlement: true,
    can_search_directory_contact: false,
    can_view_contracts: false,
    can_view_supplier_performance: false,
  });
  const maskedResult = await searchBy("contact_name", "Anna Produsent", "supplier_contact", staffPermission);
  assert.ok(maskedResult.records.length >= 1);
  assert.ok(maskedResult.records[0]?.email_masked?.includes("*"));

  const contactPermission = basePermission({ can_search_directory_contact: true });
  const fullContact = await searchBy("email", "anna@produsent.se", "supplier_contact", contactPermission);
  assert.equal(fullContact.records[0]?.email_masked, "anna@produsent.se");

  const noEntitlement = await executeSupplierDirectorySearch({
    query: {
      organization_id: ORG,
      tenant_id: ORG,
      entity_type: "organization",
      relationship_type: "supplier",
      search_field: "company_name",
      search_value: "Nordisk",
      filters: {},
      requested_fields: ["company_name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
      locale: "en",
    },
    permission: basePermission({ has_procurement_entitlement: false, provider_active: false }),
    user_role: "owner",
    bundle,
  });
  assert.equal(noEntitlement.outcome, "provider_missing");

  const suspended = await searchBy(
    "company_name",
    "Nordisk",
    "supplier",
    basePermission({ app_suspended: true }),
  );
  assert.equal(suspended.outcome, "activation_pending");

  const crossTenant = await executeSupplierDirectorySearch({
    query: {
      organization_id: ORG_OTHER,
      tenant_id: ORG,
      entity_type: "organization",
      relationship_type: "supplier",
      search_field: "company_name",
      search_value: "Nordisk",
      filters: {},
      requested_fields: ["company_name"],
      requested_detail_level: "summary",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
      locale: "en",
    },
    permission: basePermission(),
    user_role: "owner",
    bundle,
  });
  assert.equal(crossTenant.outcome, "permission_denied");

  await searchBy("company_name", "Nordisk Engros AS");
  const audits = listDirectorySearchAuditEvents(ORG);
  assert.ok(audits.length > 0);
  assert.ok(audits.every((event) => !JSON.stringify(event).includes("erik@nordisk-engros.no")));
  assert.ok(audits.some((event) => event.provider_keys.includes(SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY)));

  assert.equal(isMarketplaceSupplierCandidate("commerce_marketplace"), true);
  assert.equal(isMarketplaceSupplierCandidate(SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY), false);

  const duplicateRecords: DirectoryRecord[] = [
    {
      entity_id: "sup-a",
      entity_type: "organization",
      display_name: "Shared Org AS",
      company_name: "Shared Org AS",
      role: null,
      status: "active",
      department: null,
      team: null,
      email_masked: null,
      phone_masked: null,
      organization_number: "111222333",
      relationship_type: "supplier",
      source_provider: SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
      source_reference: "proc:1",
      organization_id: ORG,
      freshness: "fresh",
      completeness: "partial",
      permission_scope: "basic",
      match_kind: "exact",
      match_confidence: "high",
    },
    {
      entity_id: "sup-b",
      entity_type: "organization",
      display_name: "Shared Org Twin",
      company_name: "Shared Org Twin",
      role: null,
      status: "active",
      department: null,
      team: null,
      email_masked: null,
      phone_masked: null,
      organization_number: "111222333",
      relationship_type: "supplier",
      source_provider: SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
      source_reference: "proc:2",
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

  const briefSignals = buildSupplierDirectoryCommandBriefSignals({ bundle, source_exact: true });
  assert.ok(briefSignals.some((signal) => signal.signal_key === "supplier_contract_expiring"));
  assert.ok(briefSignals.some((signal) => signal.signal_key === "supplier_contact_missing"));

  for (const key of [
    "supplier_contract_expiring",
    "supplier_delivery_delay",
    "duplicate_supplier_candidate",
    "purchase_order_attention",
  ]) {
    assert.ok(getCommandBriefCatalogEntry(key));
  }

  const directoryContext = buildCompanionDirectoryContextFromManifests({
    organization_id: ORG,
    tenant_id: ORG,
    manifests: DIRECTORY_PROVIDER_MANIFESTS,
    connectedProviders: [SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY],
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
      supplier_source_exact: true,
      supplier_command_brief_signals: briefSignals,
    },
  });
  assert.ok(briefCollected.some((signal) => signal.source_module === "directory_supplier"));

  const supplierIntent = resolveDirectorySemanticIntent({
    query: "Finn leverandøren Nordisk Engros",
    locale: "no",
    descriptors,
  });
  assert.equal(supplierIntent.relationship_type, "supplier");

  const contractIntent = resolveDirectorySemanticIntent({
    query: "Hvilke leverandører har aktiv kontrakt?",
    locale: "no",
    descriptors,
  });
  assert.equal(contractIntent.search_field, "contract_status");

  const preferredIntent = resolveDirectorySemanticIntent({
    query: "Vis foretrukne leverandører",
    locale: "no",
    descriptors,
  });
  assert.equal(preferredIntent.search_field, "preferred_supplier");

  const approvedIntent = resolveDirectorySemanticIntent({
    query: "Hvilke leverandører er godkjent?",
    locale: "no",
    descriptors,
  });
  assert.equal(approvedIntent.search_field, "status");

  const manufacturerIntent = resolveDirectorySemanticIntent({
    query: "Finn produsenter i Sverige",
    locale: "no",
    descriptors,
  });
  assert.equal(manufacturerIntent.relationship_type, "manufacturer");

  const contactIntent = resolveDirectorySemanticIntent({
    query: "Finn leverandørkontakten hos Nordisk Engros",
    locale: "no",
    descriptors,
  });
  assert.equal(contactIntent.relationship_type, "supplier_contact");

  assert.equal(
    classifySupplierCandidateRelationship(bundle.candidates.find((row) => row.supplier_id === "sup-2")!),
    "manufacturer",
  );
  assert.equal(countSupplierCandidates(bundle, { relationship_type: "manufacturer" }), 1);

  const orchestratorSource = fs.readFileSync(
    path.join(repoRoot, "lib/companion-runtime/directory-search-orchestrator.ts"),
    "utf8",
  );
  assert.equal(orchestratorSource.includes("organization_procurement_vendors"), false);

  const coverage = buildCompanionFoundationCoverageRegistry();
  for (const moduleId of [
    "directory.supplier",
    "directory.vendor",
    "directory.supplier_contact",
    "directory.manufacturer",
    "directory.distributor",
    "directory.subcontractor",
  ]) {
    const entry = coverage.find((row) => row.module_id === moduleId);
    assert.ok(entry, moduleId);
    assert.ok(
      ["connected_but_partial", "production_ready_candidate"].includes(entry!.readiness),
      `${moduleId} readiness should reflect live E2E state, received ${entry!.readiness}`,
    );
    assert.notEqual(entry?.readiness, "production_ready");
  }

  for (const locale of COMPANION_COVERAGE_LOCALES) {
    const localeFile = path.join(repoRoot, "locales", locale, "customer-app", "companionPlatformKnowledge.json");
    const raw = JSON.parse(fs.readFileSync(localeFile, "utf8"));
    assert.ok(raw.companionPlatformKnowledge.directory.supplier?.supplier);
    assert.ok(raw.companionPlatformKnowledge.directory.supplier.outcomes.noMatch);
  }

  const intent = resolveDirectorySemanticIntent({
    query: "Finn leverandøren Nordisk Engros",
    locale: "no",
    descriptors,
  });
  const queryFromIntent = buildDirectorySearchQueryFromIntent({
    intent,
    organization_id: ORG,
    tenant_id: ORG,
    locale: "no",
    permission_scope: "basic",
  });
  assert.equal(queryFromIntent.organization_id, ORG);

  assert.ok(fs.existsSync(path.join(repoRoot, "lib/companion-runtime/supplier-vendor-read-orchestrator.ts")));
  assert.ok(fs.existsSync(path.join(repoRoot, "lib/companion-runtime/phase42.test.ts")));
}

runPhase42AsyncTests()
  .then(() => {
    console.log("phase42.test.ts passed");
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
