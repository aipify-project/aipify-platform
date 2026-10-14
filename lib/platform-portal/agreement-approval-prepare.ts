/**
 * D2 — Platform agreement & owner-approval prepare / dry-run for a NEW
 * Bedrift test customer candidate.
 *
 * Read-only. Never creates customers, never binds commercial plans, never
 * writes legal acceptance, never invites admins, never grants kompis_bedrift.
 *
 * Legal e-sign / acceptance for Platform customers is not present in Core —
 * readiness therefore surfaces AGREEMENT_UNVERIFIED until a named owner job
 * provides an independently verifiable acceptance source.
 */

import {
  isReservedCustomerSlug,
  parseCustomerCreationInput,
  type PlatformPortalCustomerCreationErrorCode,
} from "./create-customer";
import type { PlatformPortalCommercialPlan } from "./types";
import type { PlatformPortalCustomerCreationInput } from "./types";
import {
  CUSTOMER_CREATE_EXECUTE_ENABLED,
  CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST,
  scanRegistryForCustomerConflicts,
  type RegistryCustomerScanRow,
} from "./create-customer-prepare";

const SECRET_REASON =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

/** Empty — D2 must not enable agreement/commercial execute. */
export const AGREEMENT_APPROVAL_EXECUTE_OWNER_ALLOWLIST: ReadonlySet<string> =
  new Set();

/** Live D2 execute path stays off until a named owner job. */
export const AGREEMENT_APPROVAL_EXECUTE_ENABLED = false;

/**
 * Core does not expose Platform-customer legal acceptance / e-sign evidence.
 * Do not invent verification from checkboxes, drafts, or operator audit alone.
 */
export const PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = false;

export type AgreementApprovalReadinessStatus =
  | "NOT_FOUND"
  | "NEEDS_REVIEW"
  | "READY_FOR_OWNER_DECISION"
  | "AGREEMENT_UNVERIFIED";

export type AgreementApprovalPrepareErrorCode =
  | PlatformPortalCustomerCreationErrorCode
  | "confirmation_required"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "invalid_proposed_plan_key"
  | "owner_agreement_authorization_required"
  | "agreement_execute_not_enabled"
  | "agreement_unverified";

export type AgreementApprovalBlockReason = {
  code: string;
  severity: "block" | "advisory";
  satisfied: boolean;
};

export type AgreementApprovalPreparePlan = {
  mode: "prepare";
  dryRun: true;
  readinessStatus: AgreementApprovalReadinessStatus;
  /** Always false in D2 — execute stays fail-closed and legal proof is missing. */
  readyToExecute: false;
  readyForOwnerDecision: boolean;
  candidateIdentity: PlatformPortalCustomerCreationInput;
  candidateProvenance: {
    source: "platform_operator_input";
    emailNotUsedAsTenantLink: true;
    notUnoNight: true;
    adminAipifyTechNotPrefill: true;
  };
  agreement: {
    verificationStatus: "AGREEMENT_UNVERIFIED";
    reasonCode: "platform_customer_legal_acceptance_source_missing";
    sourceConnected: false;
    agreementId: string | null;
    agreementVersion: string | null;
    acceptanceActor: string | null;
    acceptanceAt: string | null;
    independentlyVerifiableEvidence: false;
    commercialCatalogAvailable: boolean;
    proposedPlanKey: string | null;
    proposedPlanId: string | null;
    note: "subscriptions_and_operator_audit_are_not_legal_acceptance";
  };
  blockReasons: AgreementApprovalBlockReason[];
  missingConditions: string[];
  productSeparation: {
    noCustomerCreate: true;
    noAdminAttach: true;
    noEmailAsTenantLink: true;
    noKompisBedriftGrant: true;
    noUnoNightMutation: true;
    noMembership: true;
    noCommercialPlanWrite: true;
    noLegalAcceptanceWrite: true;
    noPayment: true;
  };
  sideEffects: {
    createsCompany: false;
    createsCustomer: false;
    createsOrganization: false;
    createsAuthUser: false;
    sendsEmail: false;
    writesMembership: false;
    writesAgreement: false;
    writesLegalAcceptance: false;
    setsCommercialPlan: false;
    grantsKompisBedrift: false;
    mutatesUnoNight: false;
  };
  duplicateProbe: {
    source: "platform_customers_registry_scan";
    authoritative: false;
    organizationNumberMatchCustomerId: string | null;
    slugMatchCustomerId: string | null;
  };
  priorGatesIntact: {
    d1CreateExecuteEnabled: boolean;
    d1CreateOwnerAllowlistEmpty: boolean;
    d3AdminProvisionAllowlistEmpty: boolean;
    d4BedriftActivateAllowlistEmpty: boolean;
  };
  executeBlockedReasons: string[];
  ownerApprovalRequired: true;
  candidateIdempotencyKey: string;
  internalReason: string;
  ownerDecisionPacket: {
    legalEntity: "UNKNOWN_REQUIRES_OWNER";
    agreementRequired: "UNKNOWN_UNTIL_LEGAL_SOURCE_CONNECTED";
    acceptanceProofRequired: true;
    recordLocation: "not_available_platform_customer_legal_acceptance";
    nextAuthorizedJobs: ["D1_or_existing_create_when_owner_authorized", "D3_admin", "D4_bedrift"];
    blockedUntil: string[];
  };
};

export function createAgreementApprovalIdempotencyKey(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `aap-${suffix}`;
}

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string | null {
  const result = value == null ? "" : String(value).trim();
  return result || null;
}

export function parseAgreementApprovalPrepareInput(
  body: unknown,
):
  | {
      ok: true;
      value: {
        input: PlatformPortalCustomerCreationInput;
        internalReason: string;
        confirmation: boolean;
        idempotencyKey: string;
        proposedPlanKey: string | null;
        mode: "prepare" | "execute";
      };
    }
  | { ok: false; code: AgreementApprovalPrepareErrorCode } {
  const row = record(body) ?? {};
  const modeRaw = (text(row.mode) ?? "prepare").toLowerCase();
  const mode = modeRaw === "execute" ? "execute" : "prepare";

  const identityBody = { ...row };
  delete identityBody.mode;
  delete identityBody.internalReason;
  delete identityBody.internal_reason;
  delete identityBody.confirmation;
  delete identityBody.idempotencyKey;
  delete identityBody.idempotency_key;
  delete identityBody.proposedPlanKey;
  delete identityBody.proposed_plan_key;

  const parsed = parseCustomerCreationInput(identityBody);
  if (!parsed.ok) return { ok: false, code: parsed.code };

  const internalReason = text(row.internalReason ?? row.internal_reason);
  const idempotencyKey = text(row.idempotencyKey ?? row.idempotency_key);
  if (
    !internalReason ||
    internalReason.length < 3 ||
    internalReason.length > 500 ||
    SECRET_REASON.test(internalReason)
  ) {
    return { ok: false, code: "invalid_internal_reason" };
  }
  if (row.confirmation !== true) {
    return { ok: false, code: "confirmation_required" };
  }
  if (
    !idempotencyKey ||
    idempotencyKey.length < 8 ||
    idempotencyKey.length > 128 ||
    !idempotencyKey.startsWith("aap-")
  ) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  const proposedPlanKey = text(row.proposedPlanKey ?? row.proposed_plan_key);
  if (proposedPlanKey && !/^[a-z0-9][a-z0-9_-]{1,63}$/i.test(proposedPlanKey)) {
    return { ok: false, code: "invalid_proposed_plan_key" };
  }

  return {
    ok: true,
    value: {
      input: parsed.value,
      internalReason,
      confirmation: true,
      idempotencyKey,
      proposedPlanKey,
      mode,
    },
  };
}

export function buildAgreementApprovalPreparePlan(input: {
  creation: PlatformPortalCustomerCreationInput;
  registryRows: RegistryCustomerScanRow[];
  commercialPlans: PlatformPortalCommercialPlan[];
  internalReason: string;
  idempotencyKey: string;
  proposedPlanKey: string | null;
  adminProvisionAllowlistEmpty: boolean;
  bedriftActivateAllowlistEmpty: boolean;
}): AgreementApprovalPreparePlan {
  const conflicts = scanRegistryForCustomerConflicts(
    input.registryRows,
    input.creation,
  );

  const slugOk =
    Boolean(input.creation.slug) &&
    !isReservedCustomerSlug(input.creation.slug);
  const orgOk = Boolean(input.creation.organizationNumber);
  const nameOk = Boolean(input.creation.displayName || input.creation.legalName);

  const proposed =
    input.proposedPlanKey == null
      ? null
      : input.commercialPlans.find(
          (plan) =>
            plan.active &&
            (plan.key === input.proposedPlanKey ||
              plan.id === input.proposedPlanKey),
        ) ?? null;

  const catalogAvailable = input.commercialPlans.some((plan) => plan.active);

  const blockReasons: AgreementApprovalBlockReason[] = [
    {
      code: "organization_identity_present",
      severity: "block",
      satisfied: orgOk,
    },
    {
      code: "display_or_legal_name_present",
      severity: "block",
      satisfied: nameOk,
    },
    {
      code: "slug_normalized_and_not_reserved",
      severity: "block",
      satisfied: slugOk,
    },
    {
      code: "organization_number_unique_in_registry_scan",
      severity: "advisory",
      satisfied: !conflicts.organizationNumberMatchCustomerId,
    },
    {
      code: "slug_unique_in_registry_scan",
      severity: "advisory",
      satisfied: !conflicts.slugMatchCustomerId,
    },
    {
      code: "commercial_plan_catalog_readable",
      severity: "advisory",
      satisfied: catalogAvailable,
    },
    {
      code: "proposed_plan_resolves_when_provided",
      severity: "block",
      satisfied: input.proposedPlanKey == null || proposed != null,
    },
    {
      code: "platform_customer_legal_acceptance_source",
      severity: "block",
      satisfied: PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
    },
    {
      code: "independently_verifiable_acceptance_evidence",
      severity: "block",
      satisfied: false,
    },
  ];

  const hardBlocks = blockReasons.filter(
    (reason) => reason.severity === "block" && !reason.satisfied,
  );
  const advisoryConflicts = Boolean(
    conflicts.organizationNumberMatchCustomerId ||
      conflicts.slugMatchCustomerId,
  );

  const missingConditions = hardBlocks.map((reason) => reason.code);
  if (advisoryConflicts) {
    missingConditions.push("registry_scan_conflict_advisory");
  }
  if (!catalogAvailable) {
    missingConditions.push("commercial_plan_catalog_empty");
  }

  let readinessStatus: AgreementApprovalReadinessStatus = "AGREEMENT_UNVERIFIED";
  if (!orgOk && !nameOk && !slugOk) {
    readinessStatus = "NOT_FOUND";
  } else if (hardBlocks.length > 0 || advisoryConflicts) {
    // Legal source missing is a hard block → keep AGREEMENT_UNVERIFIED when
    // identity is otherwise coherent; otherwise NEEDS_REVIEW for identity gaps.
    const onlyLegalMissing =
      hardBlocks.every(
        (reason) =>
          reason.code === "platform_customer_legal_acceptance_source" ||
          reason.code === "independently_verifiable_acceptance_evidence",
      ) &&
      orgOk &&
      nameOk &&
      slugOk &&
      (input.proposedPlanKey == null || proposed != null);
    readinessStatus = onlyLegalMissing
      ? "AGREEMENT_UNVERIFIED"
      : hardBlocks.some(
            (reason) =>
              reason.code === "organization_identity_present" ||
              reason.code === "display_or_legal_name_present" ||
              reason.code === "slug_normalized_and_not_reserved",
          )
        ? "NEEDS_REVIEW"
        : "AGREEMENT_UNVERIFIED";
  }

  // READY_FOR_OWNER_DECISION only when identity is coherent and catalog is
  // readable — still never READY_TO_EXECUTE; legal remains unverified.
  const readyForOwnerDecision =
    orgOk &&
    nameOk &&
    slugOk &&
    !advisoryConflicts &&
    (input.proposedPlanKey == null || proposed != null) &&
    catalogAvailable;

  if (readyForOwnerDecision && readinessStatus === "AGREEMENT_UNVERIFIED") {
    // Keep AGREEMENT_UNVERIFIED as primary status (legal missing). Surface
    // readyForOwnerDecision separately so UI can invite a decision without
    // implying execute readiness.
  } else if (readyForOwnerDecision && hardBlocks.length === 0) {
    readinessStatus = "READY_FOR_OWNER_DECISION";
  }

  const executeBlockedReasons: string[] = [
    "owner_agreement_authorization_required",
    "agreement_execute_not_enabled",
    "d2_prepare_only_no_agreement_write",
    "platform_customer_legal_acceptance_source_missing",
    "d1_customer_create_not_authorized",
  ];
  if (hardBlocks.length > 0) {
    executeBlockedReasons.push("prepare_hard_blocks_present");
  }
  if (advisoryConflicts) {
    executeBlockedReasons.push("registry_scan_conflict_advisory");
  }

  return {
    mode: "prepare",
    dryRun: true,
    readinessStatus,
    readyToExecute: false,
    readyForOwnerDecision,
    candidateIdentity: input.creation,
    candidateProvenance: {
      source: "platform_operator_input",
      emailNotUsedAsTenantLink: true,
      notUnoNight: true,
      adminAipifyTechNotPrefill: true,
    },
    agreement: {
      verificationStatus: "AGREEMENT_UNVERIFIED",
      reasonCode: "platform_customer_legal_acceptance_source_missing",
      sourceConnected: false,
      agreementId: null,
      agreementVersion: null,
      acceptanceActor: null,
      acceptanceAt: null,
      independentlyVerifiableEvidence: false,
      commercialCatalogAvailable: catalogAvailable,
      proposedPlanKey: proposed?.key ?? input.proposedPlanKey,
      proposedPlanId: proposed?.id ?? null,
      note: "subscriptions_and_operator_audit_are_not_legal_acceptance",
    },
    blockReasons,
    missingConditions,
    productSeparation: {
      noCustomerCreate: true,
      noAdminAttach: true,
      noEmailAsTenantLink: true,
      noKompisBedriftGrant: true,
      noUnoNightMutation: true,
      noMembership: true,
      noCommercialPlanWrite: true,
      noLegalAcceptanceWrite: true,
      noPayment: true,
    },
    sideEffects: {
      createsCompany: false,
      createsCustomer: false,
      createsOrganization: false,
      createsAuthUser: false,
      sendsEmail: false,
      writesMembership: false,
      writesAgreement: false,
      writesLegalAcceptance: false,
      setsCommercialPlan: false,
      grantsKompisBedrift: false,
      mutatesUnoNight: false,
    },
    duplicateProbe: {
      source: "platform_customers_registry_scan",
      authoritative: false,
      organizationNumberMatchCustomerId:
        conflicts.organizationNumberMatchCustomerId,
      slugMatchCustomerId: conflicts.slugMatchCustomerId,
    },
    priorGatesIntact: {
      d1CreateExecuteEnabled: CUSTOMER_CREATE_EXECUTE_ENABLED,
      d1CreateOwnerAllowlistEmpty:
        CUSTOMER_CREATE_EXECUTE_OWNER_ALLOWLIST.size === 0,
      d3AdminProvisionAllowlistEmpty: input.adminProvisionAllowlistEmpty,
      d4BedriftActivateAllowlistEmpty: input.bedriftActivateAllowlistEmpty,
    },
    executeBlockedReasons,
    ownerApprovalRequired: true,
    candidateIdempotencyKey: input.idempotencyKey,
    internalReason: input.internalReason,
    ownerDecisionPacket: {
      legalEntity: "UNKNOWN_REQUIRES_OWNER",
      agreementRequired: "UNKNOWN_UNTIL_LEGAL_SOURCE_CONNECTED",
      acceptanceProofRequired: true,
      recordLocation: "not_available_platform_customer_legal_acceptance",
      nextAuthorizedJobs: [
        "D1_or_existing_create_when_owner_authorized",
        "D3_admin",
        "D4_bedrift",
      ],
      blockedUntil: [
        "owner_names_real_legal_test_entity",
        "platform_customer_legal_acceptance_source_connected",
        "independently_verifiable_acceptance_evidence",
        "named_owner_authorization_for_create_and_commercial_bind",
      ],
    },
  };
}

export function mapAgreementApprovalPrepareError(
  code: AgreementApprovalPrepareErrorCode,
): { status: number; code: AgreementApprovalPrepareErrorCode } {
  switch (code) {
    case "unauthorized":
      return { status: 401, code };
    case "forbidden":
    case "owner_agreement_authorization_required":
    case "agreement_execute_not_enabled":
    case "agreement_unverified":
      return { status: 403, code };
    case "duplicate_organization_number":
    case "duplicate_slug":
      return { status: 409, code };
    case "unknown":
      return { status: 500, code };
    default:
      return { status: 400, code };
  }
}

export function assertNoHardcodedAgreementTestTarget(source: string): boolean {
  return !/admin@aipify\.tech/i.test(source);
}

export type AgreementApprovalPrepareLabels = {
  sectionTitle: string;
  sectionBody: string;
  prepareAction: string;
  prepareRunning: string;
  reasonLabel: string;
  proposedPlanKey: string;
  proposedPlanKeyHelp: string;
  statusNotFound: string;
  statusNeedsReview: string;
  statusReadyForOwnerDecision: string;
  statusAgreementUnverified: string;
  readyToExecuteNever: string;
  sideEffectsNone: string;
  legalSourceMissing: string;
  commercialCatalogNote: string;
  ownerPacketTitle: string;
  executeLocked: string;
  executeUnavailable: string;
  error: string;
  unauthorized: string;
  forbidden: string;
};
