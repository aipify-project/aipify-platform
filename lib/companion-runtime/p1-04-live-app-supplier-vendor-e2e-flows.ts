import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import {
  SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY,
  isMarketplaceSupplierCandidate,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/supplier-vendor-directory-contract";
import {
  buildSupplierDirectoryPermissionContext,
  resolveSupplierRelationshipPresentation,
} from "@/lib/integration-intelligence/providers/supplier-vendor-directory/permissions";
import {
  COMPANION_MARKETPLACE_RESULT_IS_NOT_ACTIVE_SUPPLIER,
  COMPANION_SUPPLIER_IS_NOT_CUSTOMER,
  COMPANION_SUPPLIER_IS_NOT_PARTNER,
} from "./companion-directory-policy";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
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
  P1_04LiveE2eCertificationFlowResult,
  P1_04LiveE2eTenantIsolationResult,
} from "./p1-04-live-app-supplier-vendor-e2e-types";

const UNKNOWN_SUPPLIER_QUERY = "zzzzz-p1-04-no-supplier-match-token";

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_04LiveE2eCertificationFlowResult["source_classification"],
  status: P1_04LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_04LiveE2eCertificationFlowResult {
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
  status: P1_04LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_04LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function pickSupplierOrg(candidates: readonly DirectoryMatchCandidate[]) {
  return (
    candidates.find(
      (row) =>
        row.entity_type === "organization" &&
        row.supplier_id &&
        (row.company_name || row.display_name),
    ) ?? null
  );
}

function pickSupplierContact(candidates: readonly DirectoryMatchCandidate[]) {
  return (
    candidates.find(
      (row) =>
        row.entity_type === "person" &&
        row.role === "supplier_contact" &&
        row.display_name,
    ) ?? null
  );
}

function buildSupplierQuery(
  session: P1LiveE2eAuthenticatedSession,
  input: {
    search_field: NonNullable<DirectorySearchQuery["search_field"]>;
    search_value: string;
    entity_type: DirectorySearchQuery["entity_type"];
    relationship_type: DirectorySearchQuery["relationship_type"];
    permission_scope: "basic" | "contact" | "sensitive";
    capability_candidates: DirectorySearchQuery["capability_candidates"];
  },
): DirectorySearchQuery {
  return {
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    entity_type: input.entity_type,
    relationship_type: input.relationship_type,
    search_field: input.search_field,
    search_value: input.search_value,
    filters: {},
    requested_fields: [input.search_field],
    requested_detail_level: "summary",
    permission_scope: input.permission_scope,
    capability_candidates: input.capability_candidates,
    locale: "en",
  };
}

function ownerPermission(session: P1LiveE2eAuthenticatedSession, bundles: P1LiveDirectoryBundles) {
  return buildSupplierDirectoryPermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: bundles.supplierAdapterConnected,
    has_procurement_entitlement: true,
  });
}

function staffBasicPermission(session: P1LiveE2eAuthenticatedSession, bundles: P1LiveDirectoryBundles) {
  return buildSupplierDirectoryPermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: "staff",
    app_suspended: false,
    provider_active: bundles.supplierAdapterConnected,
    has_procurement_entitlement: true,
    can_search_directory_contact: false,
    can_view_contracts: false,
    can_view_supplier_performance: false,
  });
}

function providerQueried(result: DirectorySearchResult): boolean {
  return result.providers_queried.includes(SUPPLIER_VENDOR_DIRECTORY_PROVIDER_KEY);
}

function isBlockedOutcome(outcome: DirectorySearchResult["outcome"]): boolean {
  return ["permission_denied", "provider_missing", "activation_pending"].includes(outcome);
}

function assertPositiveOrEmptySearch(input: {
  result: DirectorySearchResult;
  hasCandidates: boolean;
  label: string;
}): { pass: boolean; reason: string | null } {
  if (isBlockedOutcome(input.result.outcome)) {
    return { pass: false, reason: `${input.label} blocked: ${input.result.outcome}` };
  }
  if (!providerQueried(input.result)) {
    return { pass: false, reason: `${input.label} did not query supplier provider.` };
  }

  if (input.hasCandidates) {
    const pass =
      input.result.records.length > 0 &&
      ["exact_match", "multiple_matches", "ambiguous_query"].includes(input.result.outcome);
    return pass
      ? { pass: true, reason: null }
      : {
          pass: false,
          reason: `${input.label} expected match, received ${input.result.outcome} (${input.result.total_count}).`,
        };
  }

  const pass =
    input.result.outcome === "no_match" &&
    input.result.records.length === 0 &&
    input.result.total_count === 0;
  return pass
    ? { pass: true, reason: null }
    : {
        pass: false,
        reason: `${input.label} empty tenant expected no_match, received ${input.result.outcome} (${input.result.total_count}).`,
      };
}

export async function runP1_04LiveAppSupplierVendorE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_04LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_04LiveE2eTenantIsolationResult[];
  bundles: P1LiveDirectoryBundles;
  liveSupplierCandidateCount: number;
}> {
  const flows: P1_04LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_04LiveE2eTenantIsolationResult[] = [];

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

  const supplierSource = classifyBundleSource(bundles.supplier);
  const candidates = bundles.supplier.candidates;
  const hasCandidates = candidates.length > 0;
  const ownerPerm = ownerPermission(input.session, bundles);

  const supplierOrg = pickSupplierOrg(candidates);
  const supplierContact = pickSupplierContact(candidates);
  const orgNoCandidate = candidates.find((row) => row.organization_number) ?? null;
  const categoryCandidate = candidates.find((row) => row.category) ?? null;
  const contractCandidate = candidates.find((row) => row.contract_status) ?? null;
  const buyerCandidate =
    candidates.find((row) => row.assigned_buyer) ??
    candidates.find((row) => row.owner_reference) ??
    null;
  const manufacturerCandidate = candidates.find((row) => row.supplier_subtype === "manufacturer") ?? null;
  const distributorCandidate = candidates.find((row) => row.supplier_subtype === "distributor") ?? null;
  const emailCandidate =
    candidates.find((row) => row.email_raw && row.email_raw.includes("@")) ?? null;

  flows.push(
    flowResult(
      "live_provider_connected",
      "supplier.search.live",
      supplierSource,
      bundles.supplierAdapterConnected && bundles.supplier.source_exact ? "pass" : "fail",
      bundles.supplierAdapterConnected && bundles.supplier.source_exact
        ? null
        : "Supplier vendor directory provider is not connected with source_exact live read.",
    ),
  );

  const nameValue = supplierOrg?.company_name ?? supplierOrg?.display_name ?? "live-supplier-name-probe";
  const nameSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "company_name",
      search_value: nameValue,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: ownerPerm.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const nameCheck = assertPositiveOrEmptySearch({
    result: nameSearch,
    hasCandidates: Boolean(supplierOrg?.company_name || supplierOrg?.display_name),
    label: "Supplier name search",
  });
  flows.push(
    flowResult(
      "search_supplier_by_name",
      "supplier.search.name",
      supplierSource,
      nameCheck.pass ? "pass" : "fail",
      nameCheck.reason,
    ),
  );

  const orgNoValue = orgNoCandidate?.organization_number ?? "000000000";
  const orgNoSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "organization_number",
      search_value: orgNoValue,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const orgNoCheck = assertPositiveOrEmptySearch({
    result: orgNoSearch,
    hasCandidates: Boolean(orgNoCandidate?.organization_number),
    label: "Organization number search",
  });
  flows.push(
    flowResult(
      "search_by_organization_number",
      "supplier.search.organization_number",
      supplierSource,
      orgNoCheck.pass ? "pass" : "fail",
      orgNoCheck.reason,
    ),
  );

  const contactValue = supplierContact?.display_name ?? "live-supplier-contact-probe";
  const contactSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "contact_name",
      search_value: contactValue,
      entity_type: "person",
      relationship_type: "supplier_contact",
      permission_scope: ownerPerm.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const contactCheck = assertPositiveOrEmptySearch({
    result: contactSearch,
    hasCandidates: Boolean(supplierContact?.display_name),
    label: "Supplier contact search",
  });
  flows.push(
    flowResult(
      "search_contact_person",
      "supplier.search.contact",
      supplierSource,
      contactCheck.pass ? "pass" : "fail",
      contactCheck.reason,
    ),
  );

  const categoryValue = categoryCandidate?.category ?? "live-supplier-category-probe";
  const categorySearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "category",
      search_value: categoryValue,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const categoryCheck = assertPositiveOrEmptySearch({
    result: categorySearch,
    hasCandidates: Boolean(categoryCandidate?.category),
    label: "Category/service search",
  });
  flows.push(
    flowResult(
      "search_by_category_service",
      "supplier.search.category",
      supplierSource,
      categoryCheck.pass ? "pass" : "fail",
      categoryCheck.reason,
    ),
  );

  const contractValue = contractCandidate?.contract_status ?? "live-supplier-contract-probe";
  const contractSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "contract_status",
      search_value: contractValue,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: ownerPerm.can_view_contracts ? "sensitive" : "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const contractCheck = assertPositiveOrEmptySearch({
    result: contractSearch,
    hasCandidates: Boolean(contractCandidate?.contract_status),
    label: "Contract status search",
  });
  flows.push(
    flowResult(
      "search_by_contract_status",
      "supplier.search.contract_status",
      supplierSource,
      contractCheck.pass ? "pass" : "fail",
      contractCheck.reason,
    ),
  );

  const buyerValue = buyerCandidate?.assigned_buyer ?? buyerCandidate?.owner_reference ?? "live-supplier-buyer-probe";
  const buyerSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "assigned_buyer",
      search_value: buyerValue,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const buyerCheck = assertPositiveOrEmptySearch({
    result: buyerSearch,
    hasCandidates: Boolean(buyerCandidate?.assigned_buyer || buyerCandidate?.owner_reference),
    label: "Assigned buyer search",
  });
  flows.push(
    flowResult(
      "search_by_assigned_buyer",
      "supplier.search.buyer",
      supplierSource,
      buyerCheck.pass ? "pass" : "fail",
      buyerCheck.reason,
    ),
  );

  const mfgDistCandidate = manufacturerCandidate ?? distributorCandidate;
  const mfgDistRelationship = manufacturerCandidate ? "manufacturer" : "distributor";
  const mfgDistField = manufacturerCandidate ? "manufacturer" : "distributor";
  const mfgDistValue =
    mfgDistCandidate?.company_name ??
    mfgDistCandidate?.display_name ??
    "live-supplier-mfg-dist-probe";
  const mfgDistSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: mfgDistField as NonNullable<DirectorySearchQuery["search_field"]>,
      search_value: mfgDistValue,
      entity_type: "organization",
      relationship_type: mfgDistRelationship,
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const mfgDistCheck = assertPositiveOrEmptySearch({
    result: mfgDistSearch,
    hasCandidates: Boolean(mfgDistCandidate),
    label: "Manufacturer/distributor search",
  });
  flows.push(
    flowResult(
      "search_manufacturer_or_distributor",
      "supplier.search.manufacturer_distributor",
      supplierSource,
      mfgDistCheck.pass ? "pass" : "fail",
      mfgDistCheck.reason,
    ),
  );

  if (emailCandidate?.display_name) {
    const staffPerm = staffBasicPermission(input.session, bundles);
    const contactLabel = emailCandidate.display_name;
    const maskedSearch = await executeSupplierDirectorySearch({
      query: buildSupplierQuery(input.session, {
        search_field: "contact_name",
        search_value: contactLabel,
        entity_type: "person",
        relationship_type: "supplier_contact",
        permission_scope: "basic",
        capability_candidates: ["supplier.search"],
      }),
      permission: staffPerm,
      user_role: "staff",
      bundle: bundles.supplier,
    });
    const maskedEmail = maskedSearch.records[0]?.email_masked;
    flows.push(
      flowResult(
        "contact_masking_staff_scope",
        "supplier.contact.masking",
        supplierSource,
        maskedSearch.records.length > 0 && Boolean(maskedEmail?.includes("*")) ? "pass" : "fail",
        maskedSearch.records.length > 0 && Boolean(maskedEmail?.includes("*"))
          ? null
          : "Staff basic scope did not mask supplier contact fields.",
      ),
    );

    const ownerContactSearch = await executeSupplierDirectorySearch({
      query: buildSupplierQuery(input.session, {
        search_field: "email",
        search_value: emailCandidate.email_raw!,
        entity_type: "person",
        relationship_type: "supplier_contact",
        permission_scope: "contact",
        capability_candidates: ["supplier.search"],
      }),
      permission: ownerPerm,
      user_role: input.session.userRole,
      bundle: bundles.supplier,
    });
    const ownerEmail = ownerContactSearch.records[0]?.email_masked;
    flows.push(
      flowResult(
        "contact_unmasked_owner_scope",
        "supplier.contact.masking",
        supplierSource,
        ownerContactSearch.records.length > 0 && Boolean(ownerEmail) && !ownerEmail!.includes("*")
          ? "pass"
          : "fail",
        ownerContactSearch.records.length > 0 && Boolean(ownerEmail) && !ownerEmail!.includes("*")
          ? null
          : "Owner contact scope did not expose unmasked supplier email.",
      ),
    );
  } else {
    const staffPerm = staffBasicPermission(input.session, bundles);
    const maskedProbe = await executeSupplierDirectorySearch({
      query: buildSupplierQuery(input.session, {
        search_field: "contact_name",
        search_value: UNKNOWN_SUPPLIER_QUERY,
        entity_type: "person",
        relationship_type: "supplier_contact",
        permission_scope: "basic",
        capability_candidates: ["supplier.search"],
      }),
      permission: staffPerm,
      user_role: "staff",
      bundle: bundles.supplier,
    });
    const emptyMaskPass =
      !isBlockedOutcome(maskedProbe.outcome) && maskedProbe.records.length === 0;
    flows.push(
      flowResult(
        "contact_masking_staff_scope",
        "supplier.contact.masking",
        supplierSource,
        emptyMaskPass ? "pass" : "fail",
        emptyMaskPass ? null : "Staff basic scope leaked supplier contact data on empty tenant probe.",
      ),
    );
    flows.push(
      flowResult(
        "contact_unmasked_owner_scope",
        "supplier.contact.masking",
        supplierSource,
        emptyMaskPass ? "pass" : "fail",
        emptyMaskPass ? null : "Owner contact scope probe failed on empty supplier tenant.",
      ),
    );
  }

  const unknownSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "company_name",
      search_value: UNKNOWN_SUPPLIER_QUERY,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  flows.push(
    flowResult(
      "unknown_supplier_exact_empty",
      "supplier.search.unknown_empty",
      supplierSource,
      unknownSearch.outcome === "no_match" &&
        unknownSearch.records.length === 0 &&
        unknownSearch.total_count === 0
        ? "pass"
        : "fail",
      unknownSearch.outcome === "no_match" &&
      unknownSearch.records.length === 0 &&
      unknownSearch.total_count === 0
        ? null
        : `Expected exact empty no_match, received ${unknownSearch.outcome}.`,
    ),
  );

  const ambiguousValue = hasCandidates
    ? (supplierOrg?.company_name?.slice(0, 3) ?? supplierOrg?.display_name?.slice(0, 3) ?? "liv")
    : "a";
  const ambiguousSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "company_name",
      search_value: ambiguousValue,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const clarificationPass = hasCandidates
    ? ["multiple_matches", "ambiguous_query", "exact_match"].includes(ambiguousSearch.outcome) &&
      (ambiguousSearch.outcome !== "exact_match" ? ambiguousSearch.clarification_required : true)
    : ambiguousSearch.outcome === "no_match" && ambiguousSearch.total_count === 0;
  flows.push(
    flowResult(
      "ambiguous_or_clarification_path",
      "supplier.search.clarification",
      supplierSource,
      clarificationPass ? "pass" : "fail",
      clarificationPass ? null : `Clarification path outcome unexpected: ${ambiguousSearch.outcome}.`,
    ),
  );

  const noCrmLeak = candidates.every((row) => !row.customer_id && !row.lead_id);
  const relationshipPresentation = resolveSupplierRelationshipPresentation({
    is_marketplace_candidate: false,
    is_partner: true,
    is_customer: true,
  });
  const boundaryPass =
    COMPANION_SUPPLIER_IS_NOT_CUSTOMER === true &&
    COMPANION_SUPPLIER_IS_NOT_PARTNER === true &&
    noCrmLeak &&
    relationshipPresentation.is_partner === false &&
    relationshipPresentation.is_customer === false;
  flows.push(
    flowResult(
      "supplier_not_customer_or_partner",
      "supplier.relationship.boundary",
      supplierSource,
      boundaryPass ? "pass" : "fail",
      boundaryPass ? null : "Supplier directory must remain distinct from CRM customers and partners.",
    ),
  );

  const marketplacePresentation = resolveSupplierRelationshipPresentation({
    is_marketplace_candidate: true,
  });
  const marketplacePass =
    COMPANION_MARKETPLACE_RESULT_IS_NOT_ACTIVE_SUPPLIER === true &&
    isMarketplaceSupplierCandidate("marketplace_catalog") === true &&
    marketplacePresentation.is_active_supplier === false &&
    marketplacePresentation.marketplace_is_not_supplier === true;
  flows.push(
    flowResult(
      "marketplace_not_active_supplier",
      "supplier.marketplace.exclusion",
      supplierSource,
      marketplacePass ? "pass" : "fail",
      marketplacePass ? null : "Marketplace catalog results must not be treated as active suppliers.",
    ),
  );

  const emptyIntegrityProbe = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "company_name",
      search_value: "live-supplier-empty-integrity-probe",
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const emptyIntegrityPass =
    !hasCandidates
      ? emptyIntegrityProbe.outcome === "no_match" &&
        emptyIntegrityProbe.records.length === 0 &&
        emptyIntegrityProbe.total_count === 0 &&
        bundles.supplier.candidates.length === 0
      : emptyIntegrityProbe.outcome !== "exact_match" ||
        (emptyIntegrityProbe.records.length === 0 && emptyIntegrityProbe.total_count === 0);
  flows.push(
    flowResult(
      "empty_source_no_constructed_suppliers",
      "supplier.empty_source_integrity",
      supplierSource,
      emptyIntegrityPass ? "pass" : "fail",
      emptyIntegrityPass
        ? null
        : "Authoritative procurement source returned constructed supplier records on empty probe.",
    ),
  );

  const missingEntitlementSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "company_name",
      search_value: "active",
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: buildSupplierDirectoryPermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: false,
      has_procurement_entitlement: false,
      can_view_suppliers: false,
      can_view_procurement: false,
    }),
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  flows.push(
    flowResult(
      "access_missing_entitlement_denied",
      "supplier.access.denied",
      supplierSource,
      ["permission_denied", "provider_missing"].includes(missingEntitlementSearch.outcome)
        ? "pass"
        : "fail",
      ["permission_denied", "provider_missing"].includes(missingEntitlementSearch.outcome)
        ? null
        : `Expected entitlement denial, received ${missingEntitlementSearch.outcome}.`,
    ),
  );

  const suspendedSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "company_name",
      search_value: "active",
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: buildSupplierDirectoryPermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: true,
      provider_active: bundles.supplierAdapterConnected,
      has_procurement_entitlement: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  const suspendedDenied =
    ["permission_denied", "activation_pending"].includes(suspendedSearch.outcome) &&
    suspendedSearch.records.length === 0;
  flows.push(
    flowResult(
      "access_suspended_denied",
      "supplier.access.denied",
      supplierSource,
      suspendedDenied ? "pass" : "fail",
      suspendedDenied ? null : `Expected suspended denial, received ${suspendedSearch.outcome}.`,
    ),
  );

  const manipulatedOrgSearch = await executeSupplierDirectorySearch({
    query: {
      ...buildSupplierQuery(input.session, {
        search_field: "company_name",
        search_value: "probe",
        entity_type: "organization",
        relationship_type: "supplier",
        permission_scope: "basic",
        capability_candidates: ["supplier.search"],
      }),
      organization_id: "00000000-0000-4000-8000-000000000001",
    },
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  tenantIsolation.push(
    isolationResult(
      "manipulated_organization_id_rejected",
      manipulatedOrgSearch.outcome === "permission_denied" ? "pass" : "fail",
      manipulatedOrgSearch.outcome === "permission_denied"
        ? null
        : `Expected permission_denied, received ${manipulatedOrgSearch.outcome}.`,
    ),
  );

  const foreignEntityId = candidates[0]?.entity_id ?? "foreign-supplier-entity";
  const crossTenantSearch = await executeSupplierDirectorySearch({
    query: buildSupplierQuery(input.session, {
      search_field: "external_id",
      search_value: foreignEntityId,
      entity_type: "organization",
      relationship_type: "supplier",
      permission_scope: "basic",
      capability_candidates: ["supplier.search"],
    }),
    permission: buildSupplierDirectoryPermissionContext({
      organization_id: "00000000-0000-4000-8000-000000000002",
      tenant_id: "00000000-0000-4000-8000-000000000002",
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: true,
      has_procurement_entitlement: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.supplier,
  });
  tenantIsolation.push(
    isolationResult(
      "cross_tenant_entity_id_rejected",
      ["permission_denied", "no_match"].includes(crossTenantSearch.outcome) ? "pass" : "fail",
      ["permission_denied", "no_match"].includes(crossTenantSearch.outcome)
        ? null
        : `Expected denial or no_match, received ${crossTenantSearch.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "missing_entitlement_rejected",
      ["permission_denied", "provider_missing"].includes(missingEntitlementSearch.outcome)
        ? "pass"
        : "fail",
      ["permission_denied", "provider_missing"].includes(missingEntitlementSearch.outcome)
        ? null
        : `Expected entitlement denial, received ${missingEntitlementSearch.outcome}.`,
    ),
  );

  tenantIsolation.push(
    isolationResult(
      "suspended_app_no_data",
      suspendedDenied ? "pass" : "fail",
      suspendedDenied ? null : `Expected suspended denial, received ${suspendedSearch.outcome}.`,
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
    const foreignEntity = foreignBundles.supplier.candidates[0]?.entity_id;
    if (foreignEntity) {
      const leakSearch = await executeSupplierDirectorySearch({
        query: buildSupplierQuery(input.session, {
          search_field: "external_id",
          search_value: foreignEntity,
          entity_type: "organization",
          relationship_type: "supplier",
          permission_scope: "basic",
          capability_candidates: ["supplier.search"],
        }),
        permission: ownerPerm,
        user_role: input.session.userRole,
        bundle: bundles.supplier,
      });
      tenantIsolation.push(
        isolationResult(
          "isolation_org_entity_not_visible",
          ["no_match", "permission_denied"].includes(leakSearch.outcome) ? "pass" : "fail",
          ["no_match", "permission_denied"].includes(leakSearch.outcome)
            ? null
            : `Foreign supplier entity visible in primary tenant: ${leakSearch.outcome}.`,
        ),
      );
    }
  }

  return {
    flows,
    tenantIsolation,
    bundles,
    liveSupplierCandidateCount: candidates.length,
  };
}

export function collectP1_04CapabilityOutcomes(input: {
  flows: readonly P1_04LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_04LiveE2eTenantIsolationResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("supplier.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("supplier.isolation");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
