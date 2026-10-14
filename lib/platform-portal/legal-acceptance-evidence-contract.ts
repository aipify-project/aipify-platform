/**
 * D2B — Platform customer legal acceptance evidence contract (prepare).
 *
 * Defines the canonical, auditable evidence shape for business-customer
 * agreement acceptance. Read-only probe only: Core does not yet expose a
 * Platform-customer legal acceptance / e-sign source.
 *
 * Never invents evidence from subscriptions, Business Pack legal rows,
 * Growth Partner agreements, registration checkboxes, or operator audit.
 */

/**
 * Core does not expose Platform-customer legal acceptance / e-sign evidence.
 * Do not invent verification from checkboxes, drafts, or operator audit alone.
 * Flip only in a separately authorized Core connection job.
 */
export const PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED = false;

/** Stable contract id for Platform customer MSA / legal acceptance evidence. */
export const PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_EVIDENCE_CONTRACT_ID =
  "platform_customer_legal_acceptance_evidence_v1" as const;

/**
 * Document identity placeholder until owner approves a real agreement text.
 * Not a live legal version — never treat as accepted.
 */
export const PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN =
  "UNKNOWN_UNTIL_OWNER_APPROVES_AGREEMENT_TEXT" as const;

export type LegalAcceptanceAction =
  | "accept"
  | "reaccept"
  | "countersign";

/**
 * Independently verifiable acceptance evidence row — only populated when a
 * Core-backed source is connected and returns a matching record.
 */
export type PlatformCustomerLegalAcceptanceEvidence = {
  actorId: string;
  customerLegalEntityId: string;
  agreementId: string;
  agreementVersion: string;
  /** SHA-256 hex of the exact accepted agreement content. */
  agreementContentHash: string;
  acceptanceAction: LegalAcceptanceAction;
  acceptedAtUtc: string;
  /** Collected only when legitimately captured by the authorized source. */
  ipAddress: string | null;
  userAgent: string | null;
  auditRecordId: string;
};

export type RejectedLegalEvidenceSource =
  | "subscriptions_overview"
  | "business_pack_legal_acceptances"
  | "growth_partner_agreements"
  | "registration_terms_checkbox"
  | "operator_audit"
  | "unrelated_tenant_row"
  | "forged_or_mismatched_actor"
  | "mismatched_customer_entity"
  | "unverified_agreement_version"
  | "duplicate_acceptance_event"
  | "missing_content_hash"
  | "claimed_without_source";

export type LegalAcceptanceEvidenceDenialCode =
  | "platform_customer_legal_acceptance_source_missing"
  | "forged_or_mismatched_actor"
  | "mismatched_customer_entity"
  | "unverified_agreement_version"
  | "duplicate_acceptance_event"
  | "unrelated_tenant"
  | "missing_required_evidence_fields"
  | "ineligible_proxy_source";

export type LegalAcceptanceEvidenceProbeResult = {
  contractId: typeof PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_EVIDENCE_CONTRACT_ID;
  sourceConnected: boolean;
  verificationStatus: "AGREEMENT_UNVERIFIED";
  reasonCode: LegalAcceptanceEvidenceDenialCode;
  evidence: PlatformCustomerLegalAcceptanceEvidence | null;
  independentlyVerifiableEvidence: false;
  rejectedSources: RejectedLegalEvidenceSource[];
  denialCodes: LegalAcceptanceEvidenceDenialCode[];
  canExecute: false;
  canActivate: false;
  canCreateCustomer: false;
  canAcceptOnBehalf: false;
  agreementIdentity: typeof PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN;
  privacyNote: "ip_ua_only_when_legitimately_collected_by_authorized_source";
};

export type LegalAcceptanceEvidenceCandidateContext = {
  /** Candidate organisation number (not yet a Core customer id). */
  candidateOrganizationNumber: string | null;
  candidateSlug: string | null;
  /** If present, must never be trusted without a connected Core source. */
  claimedEvidence?: Partial<PlatformCustomerLegalAcceptanceEvidence> | null;
  /** Explicitly rejected proxy rows offered by callers (tests / future adapters). */
  offeredProxySources?: RejectedLegalEvidenceSource[];
};

const REQUIRED_EVIDENCE_FIELDS: Array<keyof PlatformCustomerLegalAcceptanceEvidence> =
  [
    "actorId",
    "customerLegalEntityId",
    "agreementId",
    "agreementVersion",
    "agreementContentHash",
    "acceptanceAction",
    "acceptedAtUtc",
    "auditRecordId",
  ];

const DEFAULT_REJECTED_SOURCES: RejectedLegalEvidenceSource[] = [
  "subscriptions_overview",
  "business_pack_legal_acceptances",
  "growth_partner_agreements",
  "registration_terms_checkbox",
  "operator_audit",
];

function text(value: unknown): string | null {
  const result = value == null ? "" : String(value).trim();
  return result || null;
}

function isSha256Hex(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function isIsoUtc(value: string): boolean {
  if (!value) return false;
  const ms = Date.parse(value);
  return Number.isFinite(ms);
}

/**
 * Validate a claimed evidence object for structural completeness.
 * Does not mark acceptance as verified — source must still be connected.
 */
export function validateClaimedLegalAcceptanceEvidence(
  claimed: Partial<PlatformCustomerLegalAcceptanceEvidence> | null | undefined,
): {
  ok: boolean;
  denialCodes: LegalAcceptanceEvidenceDenialCode[];
  rejectedSources: RejectedLegalEvidenceSource[];
} {
  if (!claimed || typeof claimed !== "object") {
    return {
      ok: false,
      denialCodes: ["missing_required_evidence_fields"],
      rejectedSources: ["claimed_without_source"],
    };
  }

  const denialCodes: LegalAcceptanceEvidenceDenialCode[] = [];
  const rejectedSources: RejectedLegalEvidenceSource[] = [];

  for (const field of REQUIRED_EVIDENCE_FIELDS) {
    if (!text(claimed[field])) {
      denialCodes.push("missing_required_evidence_fields");
      break;
    }
  }

  const hash = text(claimed.agreementContentHash);
  if (hash && !isSha256Hex(hash)) {
    denialCodes.push("missing_required_evidence_fields");
    rejectedSources.push("missing_content_hash");
  } else if (!hash) {
    rejectedSources.push("missing_content_hash");
  }

  const acceptedAt = text(claimed.acceptedAtUtc);
  if (acceptedAt && !isIsoUtc(acceptedAt)) {
    denialCodes.push("missing_required_evidence_fields");
  }

  if (denialCodes.length === 0 && !PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED) {
    denialCodes.push("platform_customer_legal_acceptance_source_missing");
    rejectedSources.push("claimed_without_source");
  }

  return {
    ok: denialCodes.length === 0,
    denialCodes: [...new Set(denialCodes)],
    rejectedSources: [...new Set(rejectedSources)],
  };
}

/**
 * Deny forged / mismatched claims against the prepare candidate.
 * Always fail-closed while the Core source is disconnected.
 */
export function denyMismatchedLegalAcceptanceClaim(input: {
  claimed: Partial<PlatformCustomerLegalAcceptanceEvidence>;
  expectedCustomerLegalEntityId: string | null;
  expectedActorId: string | null;
  expectedAgreementVersion: string | null;
  unrelatedTenantId?: string | null;
}): {
  denied: true;
  denialCodes: LegalAcceptanceEvidenceDenialCode[];
  rejectedSources: RejectedLegalEvidenceSource[];
} {
  const denialCodes: LegalAcceptanceEvidenceDenialCode[] = [];
  const rejectedSources: RejectedLegalEvidenceSource[] = [];

  if (!PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED) {
    denialCodes.push("platform_customer_legal_acceptance_source_missing");
  }

  const claimedActor = text(input.claimed.actorId);
  if (
    input.expectedActorId &&
    claimedActor &&
    claimedActor !== input.expectedActorId
  ) {
    denialCodes.push("forged_or_mismatched_actor");
    rejectedSources.push("forged_or_mismatched_actor");
  }

  const claimedEntity = text(input.claimed.customerLegalEntityId);
  if (
    input.expectedCustomerLegalEntityId &&
    claimedEntity &&
    claimedEntity !== input.expectedCustomerLegalEntityId
  ) {
    denialCodes.push("mismatched_customer_entity");
    rejectedSources.push("mismatched_customer_entity");
  }

  const claimedVersion = text(input.claimed.agreementVersion);
  if (
    !claimedVersion ||
    claimedVersion === PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN ||
    (input.expectedAgreementVersion &&
      claimedVersion !== input.expectedAgreementVersion)
  ) {
    denialCodes.push("unverified_agreement_version");
    rejectedSources.push("unverified_agreement_version");
  }

  if (input.unrelatedTenantId && claimedEntity === input.unrelatedTenantId) {
    denialCodes.push("unrelated_tenant");
    rejectedSources.push("unrelated_tenant_row");
  }

  if (denialCodes.length === 0) {
    // Still never accept without a connected source.
    denialCodes.push("platform_customer_legal_acceptance_source_missing");
  }

  return {
    denied: true,
    denialCodes: [...new Set(denialCodes)],
    rejectedSources: [...new Set(rejectedSources)],
  };
}

/**
 * Reject known non-legal proxy sources. Never promote them to evidence.
 */
export function rejectIneligibleLegalEvidenceProxy(
  source: RejectedLegalEvidenceSource,
): {
  accepted: false;
  denialCode: LegalAcceptanceEvidenceDenialCode;
  source: RejectedLegalEvidenceSource;
} {
  return {
    accepted: false,
    denialCode:
      source === "duplicate_acceptance_event"
        ? "duplicate_acceptance_event"
        : "ineligible_proxy_source",
    source,
  };
}

/**
 * Read-only probe for Platform customer legal acceptance evidence readiness.
 * Always returns AGREEMENT_UNVERIFIED until a Core source is connected.
 */
export function probePlatformCustomerLegalAcceptanceEvidence(
  context: LegalAcceptanceEvidenceCandidateContext = {
    candidateOrganizationNumber: null,
    candidateSlug: null,
  },
): LegalAcceptanceEvidenceProbeResult {
  const rejectedSources = new Set<RejectedLegalEvidenceSource>(
    DEFAULT_REJECTED_SOURCES,
  );
  const denialCodes = new Set<LegalAcceptanceEvidenceDenialCode>([
    "platform_customer_legal_acceptance_source_missing",
  ]);

  for (const proxy of context.offeredProxySources ?? []) {
    const rejected = rejectIneligibleLegalEvidenceProxy(proxy);
    rejectedSources.add(rejected.source);
    denialCodes.add(rejected.denialCode);
  }

  if (context.claimedEvidence) {
    const structural = validateClaimedLegalAcceptanceEvidence(
      context.claimedEvidence,
    );
    for (const code of structural.denialCodes) denialCodes.add(code);
    for (const source of structural.rejectedSources) rejectedSources.add(source);

    const mismatch = denyMismatchedLegalAcceptanceClaim({
      claimed: context.claimedEvidence,
      expectedCustomerLegalEntityId: context.candidateOrganizationNumber,
      expectedActorId: null,
      expectedAgreementVersion: null,
    });
    for (const code of mismatch.denialCodes) denialCodes.add(code);
    for (const source of mismatch.rejectedSources) rejectedSources.add(source);
  }

  // Missing candidate entity → still AGREEMENT_UNVERIFIED / BLOCKED, never READY.
  if (
    !text(context.candidateOrganizationNumber) &&
    !text(context.candidateSlug)
  ) {
    denialCodes.add("missing_required_evidence_fields");
  }

  return {
    contractId: PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_EVIDENCE_CONTRACT_ID,
    sourceConnected: PLATFORM_CUSTOMER_LEGAL_ACCEPTANCE_SOURCE_CONNECTED,
    verificationStatus: "AGREEMENT_UNVERIFIED",
    reasonCode: "platform_customer_legal_acceptance_source_missing",
    evidence: null,
    independentlyVerifiableEvidence: false,
    rejectedSources: [...rejectedSources],
    denialCodes: [...denialCodes],
    canExecute: false,
    canActivate: false,
    canCreateCustomer: false,
    canAcceptOnBehalf: false,
    agreementIdentity: PLATFORM_CUSTOMER_AGREEMENT_IDENTITY_UNKNOWN,
    privacyNote: "ip_ua_only_when_legitimately_collected_by_authorized_source",
  };
}

export function assertNoLegalAcceptanceSideEffects(probe: LegalAcceptanceEvidenceProbeResult): boolean {
  return (
    probe.evidence === null &&
    probe.independentlyVerifiableEvidence === false &&
    probe.canExecute === false &&
    probe.canActivate === false &&
    probe.canCreateCustomer === false &&
    probe.canAcceptOnBehalf === false &&
    probe.verificationStatus === "AGREEMENT_UNVERIFIED"
  );
}
