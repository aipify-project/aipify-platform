import type { DirectoryMatchCandidate } from "@/lib/integration-intelligence/directory/matching";
import type { DirectorySearchQuery, DirectorySearchResult } from "@/lib/integration-intelligence/directory/types";
import {
  CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/crm-customer-directory-contract";
import {
  buildCrmDirectoryPermissionContext,
  resolveCrmOwnershipPresentation,
} from "@/lib/integration-intelligence/providers/crm-customer-directory/permissions";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { executeCrmDirectorySearch } from "./crm-customer-read-orchestrator";
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
  P1_03LiveE2eCertificationFlowResult,
  P1_03LiveE2eTenantIsolationResult,
} from "./p1-03-live-app-crm-customer-e2e-types";

const UNKNOWN_CRM_QUERY = "zzzzz-p1-03-no-crm-match-token";

function flowResult(
  flow_id: string,
  capability: string,
  source_classification: P1_03LiveE2eCertificationFlowResult["source_classification"],
  status: P1_03LiveE2eCertificationFlowResult["status"],
  failure_reason: string | null = null,
): P1_03LiveE2eCertificationFlowResult {
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
  status: P1_03LiveE2eTenantIsolationResult["status"],
  failure_reason: string | null = null,
): P1_03LiveE2eTenantIsolationResult {
  return {
    check_id,
    status,
    failure_reason: failure_reason ? redactSecretsFromMessage(failure_reason) : null,
  };
}

function pickCustomer(candidates: readonly DirectoryMatchCandidate[]) {
  return (
    candidates.find(
      (row) => row.customer_id && !row.lead_id && row.entity_type === "person" && row.display_name,
    ) ?? null
  );
}

function pickOrganization(candidates: readonly DirectoryMatchCandidate[]) {
  return (
    candidates.find(
      (row) =>
        row.entity_type === "organization" &&
        (row.company_name || row.display_name),
    ) ??
    candidates.find((row) => row.company_name && row.customer_id && !row.lead_id) ??
    null
  );
}

function pickLead(candidates: readonly DirectoryMatchCandidate[]) {
  return candidates.find((row) => row.lead_id) ?? null;
}

function pickProspect(candidates: readonly DirectoryMatchCandidate[]) {
  return candidates.find((row) => row.status === "prospect") ?? null;
}

function pickContact(candidates: readonly DirectoryMatchCandidate[]) {
  return (
    candidates.find(
      (row) =>
        row.customer_id &&
        row.role &&
        !row.lead_id &&
        row.entity_id !== row.customer_id &&
        row.display_name,
    ) ?? null
  );
}

function buildCrmQuery(
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
  return buildCrmDirectoryPermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: session.userRole,
    app_suspended: false,
    provider_active: bundles.crmAdapterConnected,
    has_crm_entitlement: true,
  });
}

function staffBasicPermission(session: P1LiveE2eAuthenticatedSession, bundles: P1LiveDirectoryBundles) {
  return buildCrmDirectoryPermissionContext({
    organization_id: session.organizationId!,
    tenant_id: session.tenantId ?? session.organizationId!,
    user_role: "staff",
    app_suspended: false,
    provider_active: bundles.crmAdapterConnected,
    has_crm_entitlement: true,
    can_search_directory_contact: false,
    can_view_customer_health: false,
    can_view_attribution: false,
  });
}

function providerQueried(result: DirectorySearchResult): boolean {
  return result.providers_queried.includes(CRM_CUSTOMER_DIRECTORY_PROVIDER_KEY);
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
    return { pass: false, reason: `${input.label} did not query CRM provider.` };
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

export async function runP1_03LiveAppCrmCustomerE2eFlows(input: {
  config: P1LiveE2eEnvConfig;
  session: P1LiveE2eAuthenticatedSession;
}): Promise<{
  flows: P1_03LiveE2eCertificationFlowResult[];
  tenantIsolation: P1_03LiveE2eTenantIsolationResult[];
  bundles: P1LiveDirectoryBundles;
  liveCrmCandidateCount: number;
}> {
  const flows: P1_03LiveE2eCertificationFlowResult[] = [];
  const tenantIsolation: P1_03LiveE2eTenantIsolationResult[] = [];

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

  const crmSource = classifyBundleSource(bundles.crm);
  const candidates = bundles.crm.candidates;
  const hasCandidates = candidates.length > 0;
  const ownerPerm = ownerPermission(input.session, bundles);

  const customer = pickCustomer(candidates);
  const organization = pickOrganization(candidates);
  const lead = pickLead(candidates);
  const prospect = pickProspect(candidates);
  const contact = pickContact(candidates);
  const emailCandidate =
    candidates.find((row) => row.email_raw && row.email_raw.includes("@")) ?? null;
  const phoneCandidate =
    candidates.find((row) => row.phone_raw && row.phone_raw.replace(/\D/g, "").length >= 8) ?? null;
  const orgNoCandidate = candidates.find((row) => row.organization_number) ?? null;
  const ownerCandidate = candidates.find((row) => row.owner_reference) ?? null;

  flows.push(
    flowResult(
      "live_provider_connected",
      "customer.search.live",
      crmSource,
      bundles.crmAdapterConnected && bundles.crm.source_exact ? "pass" : "fail",
      bundles.crmAdapterConnected && bundles.crm.source_exact
        ? null
        : "CRM customer directory provider is not connected with source_exact live read.",
    ),
  );

  const nameValue = customer?.display_name ?? "live-crm-name-probe";
  const nameSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: nameValue,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: ownerPerm.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const nameCheck = assertPositiveOrEmptySearch({
    result: nameSearch,
    hasCandidates: Boolean(customer?.display_name),
    label: "Customer name search",
  });
  flows.push(
    flowResult(
      "search_customer_by_name",
      "customer.search.live",
      crmSource,
      nameCheck.pass ? "pass" : "fail",
      nameCheck.reason,
    ),
  );

  const companyValue = organization?.company_name ?? organization?.display_name ?? "live-crm-company-probe";
  const companySearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "company_name",
      search_value: companyValue,
      entity_type: "organization",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const companyCheck = assertPositiveOrEmptySearch({
    result: companySearch,
    hasCandidates: Boolean(organization?.company_name || organization?.display_name),
    label: "Company name search",
  });
  flows.push(
    flowResult(
      "search_company_by_name",
      "customer.search.company",
      crmSource,
      companyCheck.pass ? "pass" : "fail",
      companyCheck.reason,
    ),
  );

  const emailValue = emailCandidate?.email_raw ?? "missing@example.com";
  const emailSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "email",
      search_value: emailValue,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: ownerPerm.can_search_directory_contact ? "contact" : "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const emailCheck = assertPositiveOrEmptySearch({
    result: emailSearch,
    hasCandidates: Boolean(emailCandidate?.email_raw),
    label: "Email search",
  });
  flows.push(
    flowResult(
      "search_by_email",
      "customer.search.email",
      crmSource,
      emailCheck.pass ? "pass" : "fail",
      emailCheck.reason,
    ),
  );

  const phoneDigits = phoneCandidate?.phone_raw?.replace(/\D/g, "") ?? "4799999999";
  const phoneSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "phone",
      search_value: phoneDigits,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const phoneCheck = assertPositiveOrEmptySearch({
    result: phoneSearch,
    hasCandidates: Boolean(phoneCandidate?.phone_raw),
    label: "Phone search",
  });
  flows.push(
    flowResult(
      "search_by_phone",
      "customer.search.phone",
      crmSource,
      phoneCheck.pass ? "pass" : "fail",
      phoneCheck.reason,
    ),
  );

  const orgNoValue = orgNoCandidate?.organization_number ?? "000000000";
  const orgNoSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "organization_number",
      search_value: orgNoValue,
      entity_type: "organization",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const orgNoCheck = assertPositiveOrEmptySearch({
    result: orgNoSearch,
    hasCandidates: Boolean(orgNoCandidate?.organization_number),
    label: "Organization number search",
  });
  flows.push(
    flowResult(
      "search_by_organization_number",
      "customer.search.organization_number",
      crmSource,
      orgNoCheck.pass ? "pass" : "fail",
      orgNoCheck.reason,
    ),
  );

  const leadTarget = lead ?? prospect;
  const leadRelationship = lead ? "lead" : "prospect";
  const leadValue = leadTarget?.display_name ?? leadTarget?.company_name ?? "live-crm-lead-probe";
  const leadSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: leadValue,
      entity_type: leadTarget?.entity_type ?? "person",
      relationship_type: leadRelationship,
      permission_scope: "basic",
      capability_candidates: lead ? ["lead.search"] : ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const leadCheck = assertPositiveOrEmptySearch({
    result: leadSearch,
    hasCandidates: Boolean(leadTarget),
    label: "Lead/prospect search",
  });
  flows.push(
    flowResult(
      "search_lead_or_prospect",
      "customer.search.lead_prospect",
      crmSource,
      leadCheck.pass ? "pass" : "fail",
      leadCheck.reason,
    ),
  );

  const contactValue = contact?.display_name ?? "live-crm-contact-probe";
  const contactSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: contactValue,
      entity_type: "person",
      relationship_type: "contact",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const contactPass = (() => {
    const base = assertPositiveOrEmptySearch({
      result: contactSearch,
      hasCandidates: Boolean(contact?.display_name),
      label: "Contact search",
    });
    if (!base.pass) return base;
    if (contact?.company_name && contactSearch.records.length > 0) {
      const linked = contactSearch.records.some((row) =>
        row.company_name?.toLowerCase().includes(contact.company_name!.toLowerCase()),
      );
      return linked
        ? { pass: true, reason: null }
        : { pass: false, reason: "Contact search did not retain company linkage." };
    }
    return base;
  })();
  flows.push(
    flowResult(
      "search_contact_company_link",
      "customer.search.contact_company",
      crmSource,
      contactPass.pass ? "pass" : "fail",
      contactPass.reason,
    ),
  );

  const ownerValue = ownerCandidate?.owner_reference ?? "live-crm-owner-probe";
  const ownerSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "owner",
      search_value: ownerValue,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: ownerPerm.can_view_attribution ? "sensitive" : "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const ownerCheck = assertPositiveOrEmptySearch({
    result: ownerSearch,
    hasCandidates: Boolean(ownerCandidate?.owner_reference),
    label: "Owner search",
  });
  flows.push(
    flowResult(
      "search_by_owner",
      "customer.search.owner",
      crmSource,
      ownerCheck.pass ? "pass" : "fail",
      ownerCheck.reason,
    ),
  );

  const partnerOwnership = resolveCrmOwnershipPresentation({
    customer_type: "partner",
    partner_owned: true,
    assigned_seller: ownerCandidate?.owner_reference ?? "assigned_seller_ref",
    partner_attribution: "growth_partner_attribution_ref",
  });
  const liveAttribution = candidates.find((row) => row.attribution_reference);
  const partnerPass =
    partnerOwnership.platform_ownership === true &&
    partnerOwnership.partner_is_owner === false &&
    Boolean(partnerOwnership.attribution_reference) &&
    (liveAttribution ? liveAttribution.attribution_reference !== liveAttribution.owner_reference : true);
  flows.push(
    flowResult(
      "partner_attribution_not_ownership",
      "customer.partner.attribution",
      crmSource,
      partnerPass ? "pass" : "fail",
      partnerPass ? null : "Partner attribution must remain metadata — platform retains ownership.",
    ),
  );

  if (emailCandidate?.display_name) {
    const staffPerm = staffBasicPermission(input.session, bundles);
    const maskedSearch = await executeCrmDirectorySearch({
      query: buildCrmQuery(input.session, {
        search_field: "name",
        search_value: emailCandidate.display_name,
        entity_type: "person",
        relationship_type: "customer",
        permission_scope: "basic",
        capability_candidates: ["customer.search"],
      }),
      permission: staffPerm,
      user_role: "staff",
      bundle: bundles.crm,
    });
    const maskedEmail = maskedSearch.records[0]?.email_masked;
    flows.push(
      flowResult(
        "contact_masking_staff_scope",
        "customer.contact.masking",
        crmSource,
        maskedSearch.records.length > 0 && Boolean(maskedEmail?.includes("*")) ? "pass" : "fail",
        maskedSearch.records.length > 0 && Boolean(maskedEmail?.includes("*"))
          ? null
          : "Staff basic scope did not mask CRM contact fields.",
      ),
    );

    const ownerContactSearch = await executeCrmDirectorySearch({
      query: buildCrmQuery(input.session, {
        search_field: "email",
        search_value: emailCandidate.email_raw!,
        entity_type: "person",
        relationship_type: "customer",
        permission_scope: "contact",
        capability_candidates: ["customer.search"],
      }),
      permission: ownerPerm,
      user_role: input.session.userRole,
      bundle: bundles.crm,
    });
    const ownerEmail = ownerContactSearch.records[0]?.email_masked;
    flows.push(
      flowResult(
        "contact_unmasked_owner_scope",
        "customer.contact.masking",
        crmSource,
        ownerContactSearch.records.length > 0 && Boolean(ownerEmail) && !ownerEmail!.includes("*")
          ? "pass"
          : "fail",
        ownerContactSearch.records.length > 0 && Boolean(ownerEmail) && !ownerEmail!.includes("*")
          ? null
          : "Owner contact scope did not expose unmasked CRM email.",
      ),
    );
  } else {
    const staffPerm = staffBasicPermission(input.session, bundles);
    const maskedProbe = await executeCrmDirectorySearch({
      query: buildCrmQuery(input.session, {
        search_field: "name",
        search_value: UNKNOWN_CRM_QUERY,
        entity_type: "person",
        relationship_type: "customer",
        permission_scope: "basic",
        capability_candidates: ["customer.search"],
      }),
      permission: staffPerm,
      user_role: "staff",
      bundle: bundles.crm,
    });
    const emptyMaskPass =
      !isBlockedOutcome(maskedProbe.outcome) &&
      maskedProbe.records.length === 0;
    flows.push(
      flowResult(
        "contact_masking_staff_scope",
        "customer.contact.masking",
        crmSource,
        emptyMaskPass ? "pass" : "fail",
        emptyMaskPass
          ? null
          : "Staff basic scope leaked CRM contact data on empty tenant probe.",
      ),
    );
    flows.push(
      flowResult(
        "contact_unmasked_owner_scope",
        "customer.contact.masking",
        crmSource,
        emptyMaskPass ? "pass" : "fail",
        emptyMaskPass
          ? null
          : "Owner contact scope probe failed on empty CRM tenant.",
      ),
    );
  }

  const unknownSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: UNKNOWN_CRM_QUERY,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  flows.push(
    flowResult(
      "unknown_customer_exact_empty",
      "customer.search.unknown_empty",
      crmSource,
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
    ? (customer?.display_name?.slice(0, 3) ?? "liv")
    : "a";
  const ambiguousSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: ambiguousValue,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const clarificationPass = hasCandidates
    ? ["multiple_matches", "ambiguous_query", "exact_match"].includes(ambiguousSearch.outcome) &&
      (ambiguousSearch.outcome !== "exact_match" ? ambiguousSearch.clarification_required : true)
    : ambiguousSearch.outcome === "no_match" && ambiguousSearch.total_count === 0;
  flows.push(
    flowResult(
      "ambiguous_or_clarification_path",
      "customer.search.clarification",
      crmSource,
      clarificationPass ? "pass" : "fail",
      clarificationPass
        ? null
        : `Clarification path outcome unexpected: ${ambiguousSearch.outcome}.`,
    ),
  );

  const missingEntitlementSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: "active",
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: buildCrmDirectoryPermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: false,
      has_crm_entitlement: false,
      can_view_customers: false,
      can_view_sales: false,
    }),
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  flows.push(
    flowResult(
      "access_missing_entitlement_denied",
      "customer.access.denied",
      crmSource,
      ["permission_denied", "provider_missing"].includes(missingEntitlementSearch.outcome)
        ? "pass"
        : "fail",
      ["permission_denied", "provider_missing"].includes(missingEntitlementSearch.outcome)
        ? null
        : `Expected entitlement denial, received ${missingEntitlementSearch.outcome}.`,
    ),
  );

  const suspendedSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "name",
      search_value: "active",
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: buildCrmDirectoryPermissionContext({
      organization_id: input.session.organizationId!,
      tenant_id: input.session.tenantId ?? input.session.organizationId!,
      user_role: input.session.userRole,
      app_suspended: true,
      provider_active: bundles.crmAdapterConnected,
      has_crm_entitlement: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.crm,
  });
  const suspendedDenied =
    ["permission_denied", "activation_pending"].includes(suspendedSearch.outcome) &&
    suspendedSearch.records.length === 0;
  flows.push(
    flowResult(
      "access_suspended_denied",
      "customer.access.denied",
      crmSource,
      suspendedDenied ? "pass" : "fail",
      suspendedDenied ? null : `Expected suspended denial, received ${suspendedSearch.outcome}.`,
    ),
  );

  const manipulatedOrgSearch = await executeCrmDirectorySearch({
    query: {
      ...buildCrmQuery(input.session, {
        search_field: "name",
        search_value: "probe",
        entity_type: "person",
        relationship_type: "customer",
        permission_scope: "basic",
        capability_candidates: ["customer.search"],
      }),
      organization_id: "00000000-0000-4000-8000-000000000001",
    },
    permission: ownerPerm,
    user_role: input.session.userRole,
    bundle: bundles.crm,
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

  const foreignEntityId = candidates[0]?.entity_id ?? "foreign-crm-entity";
  const crossTenantSearch = await executeCrmDirectorySearch({
    query: buildCrmQuery(input.session, {
      search_field: "external_id",
      search_value: foreignEntityId,
      entity_type: "person",
      relationship_type: "customer",
      permission_scope: "basic",
      capability_candidates: ["customer.search"],
    }),
    permission: buildCrmDirectoryPermissionContext({
      organization_id: "00000000-0000-4000-8000-000000000002",
      tenant_id: "00000000-0000-4000-8000-000000000002",
      user_role: input.session.userRole,
      app_suspended: false,
      provider_active: true,
      has_crm_entitlement: true,
    }),
    user_role: input.session.userRole,
    bundle: bundles.crm,
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
    const foreignEntity = foreignBundles.crm.candidates[0]?.entity_id;
    if (foreignEntity) {
      const leakSearch = await executeCrmDirectorySearch({
        query: buildCrmQuery(input.session, {
          search_field: "external_id",
          search_value: foreignEntity,
          entity_type: "person",
          relationship_type: "customer",
          permission_scope: "basic",
          capability_candidates: ["customer.search"],
        }),
        permission: ownerPerm,
        user_role: input.session.userRole,
        bundle: bundles.crm,
      });
      tenantIsolation.push(
        isolationResult(
          "isolation_org_entity_not_visible",
          ["no_match", "permission_denied"].includes(leakSearch.outcome) ? "pass" : "fail",
          ["no_match", "permission_denied"].includes(leakSearch.outcome)
            ? null
            : `Foreign CRM entity visible in primary tenant: ${leakSearch.outcome}.`,
        ),
      );
    }
  }

  return {
    flows,
    tenantIsolation,
    bundles,
    liveCrmCandidateCount: candidates.length,
  };
}

export function collectP1_03CapabilityOutcomes(input: {
  flows: readonly P1_03LiveE2eCertificationFlowResult[];
  tenantIsolation: readonly P1_03LiveE2eTenantIsolationResult[];
}): { passed: string[]; failed: string[] } {
  const passed = new Set<string>();
  const failed = new Set<string>();

  for (const flow of input.flows) {
    if (flow.status === "pass") passed.add(flow.capability);
    if (flow.status === "fail") failed.add(flow.capability);
  }

  const isolationPassed = input.tenantIsolation.every((check) => check.status === "pass");
  if (isolationPassed && input.tenantIsolation.length > 0) {
    passed.add("customer.isolation");
  } else if (input.tenantIsolation.some((check) => check.status === "fail")) {
    failed.add("customer.isolation");
  }

  return {
    passed: [...passed].sort(),
    failed: [...failed].sort(),
  };
}
