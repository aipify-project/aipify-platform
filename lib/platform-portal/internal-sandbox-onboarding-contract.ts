/**
 * D2D — Internal sandbox identity & admin onboarding contract (prepare only).
 *
 * Captures owner-intended INTERNAL SANDBOX onboarding for Aipify Group AS
 * without executing create, invite, membership, acceptance, or Bedrift grant.
 *
 * Never invents organization numbers. Never treats invite stubs as success.
 * Never claims INTERNAL / DEMO / NOT BILLABLE controls are live unless Core
 * actually enforces them.
 */

import {
  AIPIFY_INTERNAL_PROVISION_EMAIL,
  AIPIFY_OWNED_EMAIL_DOMAINS,
  extractEmailDomain,
  isOwnedAipifyEmailDomain,
  isValidEmailFormat,
  normalizeEmail,
} from "@/lib/aipify-domain-ownership";
import {
  CUSTOMER_CREATE_EXECUTE_ENABLED,
  CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST,
} from "./create-customer-prepare";
import {
  ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
  ADMIN_PROVISION_OWNER_ALLOWLIST,
} from "./admin-provisioning";
import {
  KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST,
} from "./kompis-bedrift-activation";
import {
  PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
} from "./legal-acceptance-evidence-contract";
import { isReservedCustomerSlug, normalizeCustomerSlug } from "./create-customer";

/** Stable contract id — prepare documentation only. */
export const INTERNAL_SANDBOX_ONBOARDING_CONTRACT_ID =
  "platform_internal_sandbox_onboarding_v1" as const;

/** Live onboarding execute stays off until a named owner authorization job. */
export const INTERNAL_SANDBOX_ONBOARDING_EXECUTE_ENABLED = false;

/** Owner-stated legal display name (not yet orgnr-verified). */
export const INTERNAL_SANDBOX_INTENDED_LEGAL_NAME = "Aipify Group AS" as const;

/**
 * Owner-stated admin email for this prepare job.
 * Domain ownership still requires verification — `aipify.tech` is not in
 * AIPIFY_OWNED_EMAIL_DOMAINS today (primary owned domain is aipify.ai).
 */
export const INTERNAL_SANDBOX_INTENDED_ADMIN_EMAIL =
  "admin@aipify.tech" as const;

/** Classification label for owner decisions — not a live Core enum value. */
export const INTERNAL_SANDBOX_CLASSIFICATION = "INTERNAL_SANDBOX" as const;

export type InternalSandboxPendingCode =
  | "organization_number_owner_verification"
  | "admin_email_domain_ownership"
  | "admin_auth_identity_absent"
  | "legal_policy_internal_sandbox"
  | "sandbox_classification_controls"
  | "customer_create_execute_authorization"
  | "invite_delivery_and_accept_contract"
  | "bedrift_activate_authorization"
  | "slug_owner_choice";

export type InternalSandboxControlStatus =
  | "enforced"
  | "not_enforced"
  | "proposed_not_approved";

export type InternalSandboxLegalPolicyOption =
  | "require_verified_acceptance_source"
  | "explicit_internal_sandbox_exception_proposal";

/**
 * Minimal policy proposal — NOT APPROVED, NOT APPLIED.
 * Requires separate owner (+ legal counsel as needed) authorization.
 */
export const INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL = {
  status: "PROPOSED_NOT_APPROVED" as const,
  title: "Internal sandbox legal handling exception (proposal only)",
  scope: [
    "Single named ordinary customer org created for Aipify Group AS internal Bedrift testing / later sales demos",
    "No public website, no customer traffic, no Stripe/subscription/invoice automation",
    "Does not claim AGREEMENT_VERIFIED or flip PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED",
  ],
  authorizationRequired: [
    "Owner written approval of this exception id and expiry",
    "Legal counsel confirmation when treating sandbox as non-MSA internal use",
  ],
  auditRequirements: [
    "Every create/invite/activate job references this exception id in internalReason",
    "Platform UI continues to surface AGREEMENT_UNVERIFIED for MSA evidence probe",
  ],
  expiry: "Must include an explicit review/expiry date in the approving job",
  billingDisabled: true,
  protections: [
    "Empty execute allowlists until named customer id is approved",
    "No UnoNight mutation",
    "No cross-tenant auto-link",
    "No fabricated acceptance evidence",
  ],
} as const;

export type InternalSandboxCreatePayloadPreview = {
  country: "NO";
  organizationNumber: null;
  organizationNumberStatus: "UNKNOWN_PENDING_OWNER";
  legalName: typeof INTERNAL_SANDBOX_INTENDED_LEGAL_NAME;
  displayName: typeof INTERNAL_SANDBOX_INTENDED_LEGAL_NAME;
  /** Owner must choose a non-reserved slug; aipify-group is reserved / platform. */
  slug: null;
  slugStatus: "PENDING_OWNER_CHOICE";
  verificationSource: "operator";
  classification: typeof INTERNAL_SANDBOX_CLASSIFICATION;
  /** create_platform_portal_customer currently hardcodes environment_type. */
  environmentTypeIfCreatedToday: "production";
  desiredEnvironmentType: "internal";
  environmentControlStatus: InternalSandboxControlStatus;
  billableControlStatus: InternalSandboxControlStatus;
  notPublicWebsite: true;
  notPayingCustomer: true;
};

export type InternalSandboxAdminHandshake = {
  intendedEmail: string;
  emailNormalized: string;
  emailFormatOk: boolean;
  domain: string | null;
  domainOwnedPerPolicy: boolean;
  /** Canonical internal provision email in domain ownership module. */
  canonicalInternalProvisionEmail: typeof AIPIFY_INTERNAL_PROVISION_EMAIL;
  ownedDomainsToday: readonly string[];
  authIdentityPresent: boolean | null;
  inviteOrganizationUserIsStub: true;
  inviteDeliveryConnected: boolean;
  acceptanceHandshakeRequired: [
    "verified_identity",
    "token_or_invite_recipient_binding",
    "explicit_recipient_accept",
    "auditable_organization_users_membership",
    "role_assignment_after_permission_checks",
  ];
  rejectedPatterns: [
    "cross_tenant_auto_link",
    "proxy_identity",
    "fabricated_invite_success",
    "grant_by_email_alone",
    "unauthorized_membership_write",
  ];
};

export type InternalSandboxOnboardingPreparePacket = {
  contractId: typeof INTERNAL_SANDBOX_ONBOARDING_CONTRACT_ID;
  mode: "prepare";
  dryRun: true;
  executeEnabled: false;
  classification: typeof INTERNAL_SANDBOX_CLASSIFICATION;
  intendedLegalName: typeof INTERNAL_SANDBOX_INTENDED_LEGAL_NAME;
  pending: Array<{ code: InternalSandboxPendingCode; detail: string }>;
  createPayloadPreview: InternalSandboxCreatePayloadPreview;
  adminHandshake: InternalSandboxAdminHandshake;
  legal: {
    sourceConnected: boolean;
    agreementStatus: "AGREEMENT_UNVERIFIED";
    policyOptions: InternalSandboxLegalPolicyOption[];
    exceptionProposalStatus: typeof INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL.status;
    proxiesAreNotEvidence: true;
  };
  gates: {
    customerCreateExecuteEnabled: boolean;
    customerCreateAllowlistSize: number;
    adminProvisionAllowlistSize: number;
    inviteDeliveryConnected: boolean;
    bedriftActivateAllowlistSize: number;
    platformCompanySlugReserved: true;
    existingPlatformAipifyGroupIsNotSandboxTenant: true;
  };
  sideEffects: {
    createsCustomer: false;
    createsAuthUser: false;
    sendsEmail: false;
    writesMembership: false;
    recordsAcceptance: false;
    grantsKompisBedrift: false;
    mutatesUnoNight: false;
    appliesSql: false;
  };
  futureApprovalCheckpoints: Array<{
    id: string;
    requiresSeparateOwnerJob: true;
  }>;
  successEvidenceWhenLaterExecuted: string[];
  abortConditions: string[];
};

export function buildInternalSandboxCreatePayloadPreview(): InternalSandboxCreatePayloadPreview {
  return {
    country: "NO",
    organizationNumber: null,
    organizationNumberStatus: "UNKNOWN_PENDING_OWNER",
    legalName: INTERNAL_SANDBOX_INTENDED_LEGAL_NAME,
    displayName: INTERNAL_SANDBOX_INTENDED_LEGAL_NAME,
    slug: null,
    slugStatus: "PENDING_OWNER_CHOICE",
    verificationSource: "operator",
    classification: INTERNAL_SANDBOX_CLASSIFICATION,
    environmentTypeIfCreatedToday: "production",
    desiredEnvironmentType: "internal",
    environmentControlStatus: "not_enforced",
    billableControlStatus: "not_enforced",
    notPublicWebsite: true,
    notPayingCustomer: true,
  };
}

export function buildInternalSandboxAdminHandshake(input?: {
  authIdentityPresent?: boolean | null;
}): InternalSandboxAdminHandshake {
  const emailNormalized = normalizeEmail(INTERNAL_SANDBOX_INTENDED_ADMIN_EMAIL);
  const domain = extractEmailDomain(emailNormalized);
  return {
    intendedEmail: INTERNAL_SANDBOX_INTENDED_ADMIN_EMAIL,
    emailNormalized,
    emailFormatOk: isValidEmailFormat(emailNormalized),
    domain,
    domainOwnedPerPolicy: domain ? isOwnedAipifyEmailDomain(domain) : false,
    canonicalInternalProvisionEmail: AIPIFY_INTERNAL_PROVISION_EMAIL,
    ownedDomainsToday: AIPIFY_OWNED_EMAIL_DOMAINS,
    authIdentityPresent:
      input?.authIdentityPresent === undefined ? null : input.authIdentityPresent,
    inviteOrganizationUserIsStub: true,
    inviteDeliveryConnected: ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
    acceptanceHandshakeRequired: [
      "verified_identity",
      "token_or_invite_recipient_binding",
      "explicit_recipient_accept",
      "auditable_organization_users_membership",
      "role_assignment_after_permission_checks",
    ],
    rejectedPatterns: [
      "cross_tenant_auto_link",
      "proxy_identity",
      "fabricated_invite_success",
      "grant_by_email_alone",
      "unauthorized_membership_write",
    ],
  };
}

export function buildInternalSandboxOnboardingPreparePacket(input?: {
  authIdentityPresent?: boolean | null;
  proposedSlug?: string | null;
}): InternalSandboxOnboardingPreparePacket {
  const adminHandshake = buildInternalSandboxAdminHandshake({
    authIdentityPresent: input?.authIdentityPresent,
  });
  const pending: Array<{ code: InternalSandboxPendingCode; detail: string }> = [
    {
      code: "organization_number_owner_verification",
      detail:
        "Owner must provide the verified Norwegian organization number for Aipify Group AS. Do not invent or silently look up and treat as approved.",
    },
    {
      code: "slug_owner_choice",
      detail:
        "Owner must choose a non-reserved ordinary-customer slug. Reserved/internal slugs (aipify, aipify-group, aipify-internal) and the existing is_platform company must not be reused as the Bedrift sandbox tenant.",
    },
    {
      code: "admin_email_domain_ownership",
      detail:
        "admin@aipify.tech is not in AIPIFY_OWNED_EMAIL_DOMAINS (only aipify.ai today). Owner must either prove ownership and authorize adding aipify.tech, or switch to an owned-domain identity (e.g. admin@aipify.ai).",
    },
    {
      code: "legal_policy_internal_sandbox",
      detail:
        "Choose require_verified_acceptance_source OR explicitly approve INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL. No automatic waiver.",
    },
    {
      code: "sandbox_classification_controls",
      detail:
        "INTERNAL / DEMO / NOT BILLABLE are not enforced by create_platform_portal_customer today (environment_type hardcodes production; no billable flag). Separate schema/policy job required before claiming enforced controls.",
    },
    {
      code: "customer_create_execute_authorization",
      detail:
        "CUSTOMER_CREATE_EXECUTE_ENABLED is false and allowlist is empty until a named owner create job.",
    },
    {
      code: "invite_delivery_and_accept_contract",
      detail:
        "invite_organization_user is a stub; ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED is false. Real invite+accept Core contract required in a separate job.",
    },
    {
      code: "bedrift_activate_authorization",
      detail:
        "KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST is empty. Bedrift grant requires a separate named activate job after customer+admin exist.",
    },
  ];

  if (adminHandshake.authIdentityPresent === false) {
    pending.push({
      code: "admin_auth_identity_absent",
      detail:
        "Read-only Core probe found 0 auth.users for admin@aipify.tech. Identity must be created/invited via an authorized job — not assumed present.",
    });
  }

  const proposed = input?.proposedSlug
    ? normalizeCustomerSlug(input.proposedSlug)
    : null;
  if (proposed && isReservedCustomerSlug(proposed)) {
    pending.push({
      code: "slug_owner_choice",
      detail: `Proposed slug "${proposed}" is reserved and cannot be used for the ordinary sandbox customer.`,
    });
  }

  return {
    contractId: INTERNAL_SANDBOX_ONBOARDING_CONTRACT_ID,
    mode: "prepare",
    dryRun: true,
    executeEnabled: false,
    classification: INTERNAL_SANDBOX_CLASSIFICATION,
    intendedLegalName: INTERNAL_SANDBOX_INTENDED_LEGAL_NAME,
    pending,
    createPayloadPreview: buildInternalSandboxCreatePayloadPreview(),
    adminHandshake,
    legal: {
      sourceConnected: PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
      agreementStatus: "AGREEMENT_UNVERIFIED",
      policyOptions: [
        "require_verified_acceptance_source",
        "explicit_internal_sandbox_exception_proposal",
      ],
      exceptionProposalStatus: INTERNAL_SANDBOX_LEGAL_EXCEPTION_PROPOSAL.status,
      proxiesAreNotEvidence: true,
    },
    gates: {
      customerCreateExecuteEnabled: CUSTOMER_CREATE_EXECUTE_ENABLED,
      customerCreateAllowlistSize: CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST.size,
      adminProvisionAllowlistSize: ADMIN_PROVISION_OWNER_ALLOWLIST.size,
      inviteDeliveryConnected: ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
      bedriftActivateAllowlistSize: KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.size,
      platformCompanySlugReserved: true,
      existingPlatformAipifyGroupIsNotSandboxTenant: true,
    },
    sideEffects: {
      createsCustomer: false,
      createsAuthUser: false,
      sendsEmail: false,
      writesMembership: false,
      recordsAcceptance: false,
      grantsKompisBedrift: false,
      mutatesUnoNight: false,
      appliesSql: false,
    },
    futureApprovalCheckpoints: [
      { id: "schema_sql_sandbox_classification_or_legal_source", requiresSeparateOwnerJob: true },
      { id: "customer_create_execute", requiresSeparateOwnerJob: true },
      { id: "auth_invite_membership_accept", requiresSeparateOwnerJob: true },
      { id: "kompis_bedrift_activate", requiresSeparateOwnerJob: true },
    ],
    successEvidenceWhenLaterExecuted: [
      "ordinary_customer_row_with_owner_verified_orgnr_and_chosen_slug",
      "environment_or_billing_controls_match_approved_policy",
      "auth_user_exists_for_approved_admin_email",
      "organization_users_membership_after_explicit_accept",
      "tenant_modules_kompis_bedrift_licensed_enabled_only_after_activate_job",
      "agreement_probe_still_honest_unless_legal_source_connected",
    ],
    abortConditions: [
      "organization_number_unknown_or_unverified",
      "slug_reserved_or_duplicate",
      "admin_domain_not_owned_and_not_authorized",
      "invite_stub_treated_as_success",
      "unonight_used_as_bedrift_tenant",
      "platform_company_reused_as_sandbox_tenant",
      "legal_exception_claimed_without_owner_approval",
      "any_production_write_without_named_checkpoint",
    ],
  };
}

export function assertInternalSandboxPrepareHasNoSideEffects(
  packet: InternalSandboxOnboardingPreparePacket,
): boolean {
  return (
    packet.mode === "prepare" &&
    packet.dryRun === true &&
    packet.executeEnabled === false &&
    INTERNAL_SANDBOX_ONBOARDING_EXECUTE_ENABLED === false &&
    packet.sideEffects.createsCustomer === false &&
    packet.sideEffects.createsAuthUser === false &&
    packet.sideEffects.sendsEmail === false &&
    packet.sideEffects.writesMembership === false &&
    packet.sideEffects.recordsAcceptance === false &&
    packet.sideEffects.grantsKompisBedrift === false &&
    packet.sideEffects.mutatesUnoNight === false &&
    packet.sideEffects.appliesSql === false
  );
}

export function isInternalSandboxSlugAllowed(slug: string): boolean {
  const normalized = normalizeCustomerSlug(slug);
  if (!normalized) return false;
  if (isReservedCustomerSlug(normalized)) return false;
  return true;
}
