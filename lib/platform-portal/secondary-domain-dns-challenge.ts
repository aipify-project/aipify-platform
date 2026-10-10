/**
 * Platform portal — secondary hostname DNS TXT challenge for existing installs.
 * Server DNS proof happens in Node; RPCs only bind after a matching presented token.
 */

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const IDEMPOTENCY_REGEX = /^[A-Za-z0-9._:-]{8,128}$/;

export const SECONDARY_DOMAIN_DNS_RECORD_PREFIX = "_aipify-domain-challenge." as const;

export type SecondaryDomainDnsChallengeErrorCode =
  | "invalid_customer"
  | "invalid_installation"
  | "invalid_hostname"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "invalid_challenge"
  | "invalid_ttl"
  | "customer_not_found"
  | "installation_not_eligible"
  | "website_kompis_not_entitled"
  | "hostname_already_verified"
  | "hostname_owned_by_other_tenant"
  | "challenge_not_found"
  | "challenge_expired"
  | "challenge_not_pending"
  | "challenge_already_verified"
  | "dns_proof_mismatch"
  | "dns_lookup_failed"
  | "dns_txt_missing"
  | "idempotency_conflict"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type IssueSecondaryDomainDnsChallengeInput = {
  customerId: string;
  installationId: string;
  hostname: string;
  internalReason: string;
  idempotencyKey: string;
  ttlHours?: number;
};

export type VerifySecondaryDomainDnsChallengeInput = {
  customerId: string;
  challengeId: string;
  presentedToken: string;
  internalReason: string;
  idempotencyKey: string;
};

export type SecondaryDomainDnsChallengeView = {
  id: string;
  status: string;
  hostname?: string | null;
  dnsRecordName: string | null;
  dnsTxtValue?: string | null;
  expiresAt: string | null;
  verifiedAt?: string | null;
  tokenReturned?: boolean;
  installationId?: string | null;
};

export type SecondaryDomainDnsDomainView = {
  id: string;
  hostname: string;
  status: string;
  verificationStatus: string;
  installationId: string | null;
  verifiedAt?: string | null;
};

export type IssueSecondaryDomainDnsChallengeResult = {
  ok: true;
  idempotentReplay: boolean;
  customerId: string;
  installationId: string;
  domain: SecondaryDomainDnsDomainView;
  challenge: SecondaryDomainDnsChallengeView;
  instructions: {
    recordType: string;
    recordName: string;
    recordValue: string | null;
    note: string;
  } | null;
  licenseDomainReferenceUnchanged: boolean;
  installationCreated: boolean;
};

export type VerifySecondaryDomainDnsChallengeResult = {
  ok: true;
  idempotentReplay: boolean;
  customerId: string;
  domain: SecondaryDomainDnsDomainView;
  challenge: SecondaryDomainDnsChallengeView;
  licenseDomainReferenceUnchanged: boolean;
  installationCreated: boolean;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

function asNullableTrimmedString(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asRequiredId(value: unknown): string | null {
  const id = asNullableTrimmedString(value);
  if (!id || !UUID_REGEX.test(id)) return null;
  return id;
}

function asStrictBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function createSecondaryDomainDnsIdempotencyKey(prefix = "sdns"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function buildSecondaryDomainDnsRecordName(hostname: string): string {
  const normalized = hostname.trim().toLowerCase().replace(/\.+$/, "");
  return `${SECONDARY_DOMAIN_DNS_RECORD_PREFIX}${normalized}`;
}

export function parseIssueSecondaryDomainDnsChallengeInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: IssueSecondaryDomainDnsChallengeInput }
  | { ok: false; code: SecondaryDomainDnsChallengeErrorCode } {
  if (!UUID_REGEX.test(customerId)) {
    return { ok: false, code: "invalid_customer" };
  }
  const row = asRecord(body);
  if (!row) return { ok: false, code: "unknown" };

  const installationId = asRequiredId(row.installationId ?? row.installation_id);
  const hostname = asNullableTrimmedString(row.hostname ?? row.domain);
  const internalReason = asNullableTrimmedString(
    row.internalReason ?? row.internal_reason,
  );
  const idempotencyKey = asNullableTrimmedString(
    row.idempotencyKey ?? row.idempotency_key,
  );

  if (!installationId) return { ok: false, code: "invalid_installation" };
  if (!hostname) return { ok: false, code: "invalid_hostname" };
  if (!internalReason || internalReason.length < 3) {
    return { ok: false, code: "invalid_internal_reason" };
  }
  if (!idempotencyKey || !IDEMPOTENCY_REGEX.test(idempotencyKey)) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  let ttlHours: number | undefined;
  const rawTtl = row.ttlHours ?? row.ttl_hours;
  if (rawTtl != null) {
    const n = typeof rawTtl === "number" ? rawTtl : Number(rawTtl);
    if (!Number.isInteger(n) || n < 1 || n > 168) {
      return { ok: false, code: "invalid_ttl" };
    }
    ttlHours = n;
  }

  return {
    ok: true,
    value: {
      customerId,
      installationId,
      hostname,
      internalReason,
      idempotencyKey,
      ttlHours,
    },
  };
}

export function parseVerifySecondaryDomainDnsChallengeInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: VerifySecondaryDomainDnsChallengeInput }
  | { ok: false; code: SecondaryDomainDnsChallengeErrorCode } {
  if (!UUID_REGEX.test(customerId)) {
    return { ok: false, code: "invalid_customer" };
  }
  const row = asRecord(body);
  if (!row) return { ok: false, code: "unknown" };

  const challengeId = asRequiredId(row.challengeId ?? row.challenge_id);
  const presentedToken = asNullableTrimmedString(
    row.presentedToken ?? row.presented_token ?? row.dnsTxtValue ?? row.dns_txt_value,
  );
  const internalReason = asNullableTrimmedString(
    row.internalReason ?? row.internal_reason,
  );
  const idempotencyKey = asNullableTrimmedString(
    row.idempotencyKey ?? row.idempotency_key,
  );

  if (!challengeId) return { ok: false, code: "invalid_challenge" };
  if (!presentedToken || presentedToken.length < 32) {
    return { ok: false, code: "dns_txt_missing" };
  }
  if (!internalReason || internalReason.length < 3) {
    return { ok: false, code: "invalid_internal_reason" };
  }
  if (!idempotencyKey || !IDEMPOTENCY_REGEX.test(idempotencyKey)) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  return {
    ok: true,
    value: {
      customerId,
      challengeId,
      presentedToken,
      internalReason,
      idempotencyKey,
    },
  };
}

function parseDomainView(raw: unknown): SecondaryDomainDnsDomainView | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const hostname = asNullableTrimmedString(row.hostname ?? row.domain);
  const status = asNullableTrimmedString(row.status);
  const verificationStatus = asNullableTrimmedString(
    row.verification_status ?? row.verificationStatus,
  );
  if (!id || !hostname || !status || !verificationStatus) return null;
  return {
    id,
    hostname,
    status,
    verificationStatus,
    installationId: asRequiredId(row.installation_id ?? row.installationId),
    verifiedAt: asNullableTrimmedString(row.verified_at ?? row.verifiedAt),
  };
}

function parseChallengeView(raw: unknown): SecondaryDomainDnsChallengeView | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const status = asNullableTrimmedString(row.status);
  if (!id || !status) return null;
  return {
    id,
    status,
    hostname: asNullableTrimmedString(row.hostname),
    dnsRecordName: asNullableTrimmedString(
      row.dns_record_name ?? row.dnsRecordName,
    ),
    dnsTxtValue: asNullableTrimmedString(row.dns_txt_value ?? row.dnsTxtValue),
    expiresAt: asNullableTrimmedString(row.expires_at ?? row.expiresAt),
    verifiedAt: asNullableTrimmedString(row.verified_at ?? row.verifiedAt),
    tokenReturned: asStrictBoolean(row.token_returned ?? row.tokenReturned, false),
    installationId: asRequiredId(row.installation_id ?? row.installationId),
  };
}

export function parseIssueSecondaryDomainDnsChallengeResult(
  raw: unknown,
): IssueSecondaryDomainDnsChallengeResult | null {
  const row = asRecord(raw);
  if (!row || row.ok !== true) return null;
  const customerId = asRequiredId(row.customer_id ?? row.customerId);
  const installationId = asRequiredId(row.installation_id ?? row.installationId);
  const domain = parseDomainView(row.domain);
  const challenge = parseChallengeView(row.challenge);
  if (!customerId || !installationId || !domain || !challenge) return null;

  const instructionsRow = asRecord(row.instructions);
  const instructions = instructionsRow
    ? {
        recordType:
          asNullableTrimmedString(instructionsRow.record_type ?? instructionsRow.recordType) ??
          "TXT",
        recordName:
          asNullableTrimmedString(instructionsRow.record_name ?? instructionsRow.recordName) ??
          challenge.dnsRecordName ??
          "",
        recordValue: asNullableTrimmedString(
          instructionsRow.record_value ?? instructionsRow.recordValue,
        ),
        note:
          asNullableTrimmedString(instructionsRow.note) ??
          "Publish the TXT record, wait for DNS propagation, then call verify.",
      }
    : null;

  return {
    ok: true,
    idempotentReplay: asStrictBoolean(
      row.idempotent_replay ?? row.idempotentReplay,
      false,
    ),
    customerId,
    installationId,
    domain,
    challenge,
    instructions,
    licenseDomainReferenceUnchanged: asStrictBoolean(
      row.license_domain_reference_unchanged ?? row.licenseDomainReferenceUnchanged,
      true,
    ),
    installationCreated: asStrictBoolean(
      row.installation_created ?? row.installationCreated,
      false,
    ),
  };
}

export function parseVerifySecondaryDomainDnsChallengeResult(
  raw: unknown,
): VerifySecondaryDomainDnsChallengeResult | null {
  const row = asRecord(raw);
  if (!row || row.ok !== true) return null;
  const customerId = asRequiredId(row.customer_id ?? row.customerId);
  const domain = parseDomainView(row.domain);
  const challenge = parseChallengeView(row.challenge);
  if (!customerId || !domain || !challenge) return null;

  return {
    ok: true,
    idempotentReplay: asStrictBoolean(
      row.idempotent_replay ?? row.idempotentReplay,
      false,
    ),
    customerId,
    domain,
    challenge,
    licenseDomainReferenceUnchanged: asStrictBoolean(
      row.license_domain_reference_unchanged ?? row.licenseDomainReferenceUnchanged,
      true,
    ),
    installationCreated: asStrictBoolean(
      row.installation_created ?? row.installationCreated,
      false,
    ),
  };
}

export function mapSecondaryDomainDnsChallengeRpcError(
  message: string | null | undefined,
): { status: number; code: SecondaryDomainDnsChallengeErrorCode } {
  const raw = (message ?? "").toUpperCase();
  const table: Array<[string, number, SecondaryDomainDnsChallengeErrorCode]> = [
    ["INVALID_CUSTOMER", 400, "invalid_customer"],
    ["INVALID_INSTALLATION", 400, "invalid_installation"],
    ["INVALID_HOSTNAME", 400, "invalid_hostname"],
    ["INVALID_INTERNAL_REASON", 400, "invalid_internal_reason"],
    ["INVALID_IDEMPOTENCY_KEY", 400, "invalid_idempotency_key"],
    ["INVALID_TTL", 400, "invalid_ttl"],
    ["INVALID_CHALLENGE", 400, "invalid_challenge"],
    ["INVALID_PRESENTED_TOKEN", 400, "dns_txt_missing"],
    ["CUSTOMER_NOT_FOUND", 404, "customer_not_found"],
    ["INSTALLATION_NOT_ELIGIBLE", 409, "installation_not_eligible"],
    ["WEBSITE_KOMPIS_NOT_ENTITLED", 409, "website_kompis_not_entitled"],
    ["HOSTNAME_ALREADY_VERIFIED", 409, "hostname_already_verified"],
    ["HOSTNAME_OWNED_BY_OTHER_TENANT", 409, "hostname_owned_by_other_tenant"],
    ["CHALLENGE_NOT_FOUND", 404, "challenge_not_found"],
    ["CHALLENGE_EXPIRED", 409, "challenge_expired"],
    ["CHALLENGE_NOT_PENDING", 409, "challenge_not_pending"],
    ["CHALLENGE_ALREADY_VERIFIED", 409, "challenge_already_verified"],
    ["DNS_PROOF_MISMATCH", 409, "dns_proof_mismatch"],
    ["IDEMPOTENCY_CONFLICT", 409, "idempotency_conflict"],
    ["IDEMPOTENCY_REPLAY_MISSING", 409, "idempotency_conflict"],
    ["SERVICE_ROLE_REQUIRED", 403, "forbidden"],
    ["BIND_ACTOR_REQUIRED", 403, "forbidden"],
    ["BIND_ACTOR_NOT_PLATFORM_ADMIN", 403, "forbidden"],
    ["HOSTNAME_MISMATCH", 409, "invalid_hostname"],
    ["ACCESS DENIED", 403, "forbidden"],
    ["PLATFORM ADMIN", 403, "forbidden"],
  ];

  for (const [needle, status, code] of table) {
    if (raw.includes(needle)) return { status, code };
  }
  return { status: 500, code: "unknown" };
}

/** Extract challenge token from TXT strings returned by DNS. */
export function extractSecondaryDomainDnsChallengeToken(
  txtRecords: string[][],
  expectedToken?: string | null,
): string | null {
  const flat = txtRecords
    .map((chunks) => chunks.join(""))
    .map((value) => value.trim().replace(/^"|"$/g, ""));

  if (expectedToken) {
    const match = flat.find((value) => value === expectedToken);
    if (match) return match;
  }

  for (const value of flat) {
    if (/^[a-f0-9]{64}$/i.test(value)) {
      return value.toLowerCase();
    }
    const prefixed = value.match(/^aipify-domain-v1=([a-f0-9]{64})$/i);
    if (prefixed?.[1]) {
      return prefixed[1].toLowerCase();
    }
  }
  return null;
}
