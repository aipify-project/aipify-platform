import {
  evaluateCustomerContactEmail,
  extractEmailDomain,
  isInternalAipifyCustomerSlug,
  normalizeEmail,
} from "@/lib/aipify-domain-ownership";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const IDEMPOTENCY_REGEX = /^[A-Za-z0-9._:-]{8,128}$/;

export type PlatformCustomerIdentityErrorCode =
  | "invalid_customer"
  | "invalid_email"
  | "invalid_expected_email"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "confirmation_required"
  | "customer_not_found"
  | "expected_email_mismatch"
  | "email_conflict"
  | "aipify_com_not_owned"
  | "internal_aipify_requires_owned_domain"
  | "idempotency_conflict"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type PlatformCustomerIdentityPayload = {
  customerId: string;
  organizationId: string;
  slug: string | null;
  companyName: string | null;
  contactEmail: string | null;
  emailDomain: string | null;
  isInternalAipifyIdentity: boolean;
  forbiddenUnownedDomain: boolean;
  ownedAipifyDomain: boolean;
  updatedAt: string | null;
};

export type UpdatePlatformCustomerContactEmailInput = {
  customerId: string;
  email: string;
  expectedCurrentEmail: string;
  confirmation: boolean;
  reason: string;
  idempotencyKey: string;
};

export type UpdatePlatformCustomerContactEmailResult = {
  ok: true;
  result: "updated" | "idempotent_replay";
  customerId: string;
  organizationId: string;
  previousEmail: string;
  newEmail: string;
  previousEmailDomain: string;
  newEmailDomain: string;
  idempotencyKey: string;
  writeId: string | null;
  authUnchanged: boolean;
  billingUnchanged: boolean;
  emailSent: boolean;
  notificationSent: boolean;
};

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

function asText(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asBool(value: unknown): boolean {
  return value === true;
}

export function parsePlatformCustomerIdentityPayload(
  value: unknown,
): PlatformCustomerIdentityPayload | null {
  const row = asRecord(value);
  if (!row) return null;
  const customerId = asText(row.customer_id ?? row.customerId);
  const organizationId = asText(row.organization_id ?? row.organizationId) ?? customerId;
  if (!customerId || !UUID_REGEX.test(customerId)) return null;

  const contactEmail = asText(row.contact_email ?? row.contactEmail);
  const slug = asText(row.slug);
  return {
    customerId,
    organizationId: organizationId && UUID_REGEX.test(organizationId) ? organizationId : customerId,
    slug,
    companyName: asText(row.company_name ?? row.companyName),
    contactEmail,
    emailDomain: asText(row.email_domain ?? row.emailDomain) ?? (contactEmail ? extractEmailDomain(contactEmail) : null),
    isInternalAipifyIdentity:
      asBool(row.is_internal_aipify_identity ?? row.isInternalAipifyIdentity) ||
      isInternalAipifyCustomerSlug(slug),
    forbiddenUnownedDomain: asBool(row.forbidden_unowned_domain ?? row.forbiddenUnownedDomain),
    ownedAipifyDomain: asBool(row.owned_aipify_domain ?? row.ownedAipifyDomain),
    updatedAt: asText(row.updated_at ?? row.updatedAt),
  };
}

export function parseUpdateCustomerContactEmailInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: UpdatePlatformCustomerContactEmailInput }
  | { ok: false; code: PlatformCustomerIdentityErrorCode } {
  if (!UUID_REGEX.test(customerId)) {
    return { ok: false, code: "invalid_customer" };
  }
  const row = asRecord(body);
  if (!row) return { ok: false, code: "unknown" };

  if (row.confirmation !== true) {
    return { ok: false, code: "confirmation_required" };
  }

  const email = asText(row.email);
  const expected = asText(row.expectedCurrentEmail ?? row.expected_current_email);
  const reason = asText(row.reason ?? row.internalReason ?? row.internal_reason);
  const idempotencyKey = asText(row.idempotencyKey ?? row.idempotency_key);

  if (!email) return { ok: false, code: "invalid_email" };
  if (!expected) return { ok: false, code: "invalid_expected_email" };
  if (!reason || reason.length < 3 || reason.length > 500) {
    return { ok: false, code: "invalid_internal_reason" };
  }
  if (!idempotencyKey || !IDEMPOTENCY_REGEX.test(idempotencyKey)) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  return {
    ok: true,
    value: {
      customerId,
      email: normalizeEmail(email),
      expectedCurrentEmail: normalizeEmail(expected),
      confirmation: true,
      reason,
      idempotencyKey,
    },
  };
}

export function parseUpdateCustomerContactEmailResult(
  value: unknown,
): UpdatePlatformCustomerContactEmailResult | null {
  const row = asRecord(value);
  if (!row || row.ok !== true) return null;
  const resultRaw = asText(row.result);
  if (resultRaw !== "updated" && resultRaw !== "idempotent_replay") return null;
  const customerId = asText(row.customer_id ?? row.customerId);
  const previousEmail = asText(row.previous_email ?? row.previousEmail);
  const newEmail = asText(row.new_email ?? row.newEmail);
  const idempotencyKey = asText(row.idempotency_key ?? row.idempotencyKey);
  if (!customerId || !previousEmail || !newEmail || !idempotencyKey) return null;

  return {
    ok: true,
    result: resultRaw,
    customerId,
    organizationId: asText(row.organization_id ?? row.organizationId) ?? customerId,
    previousEmail,
    newEmail,
    previousEmailDomain:
      asText(row.previous_email_domain ?? row.previousEmailDomain) ??
      extractEmailDomain(previousEmail) ??
      "",
    newEmailDomain:
      asText(row.new_email_domain ?? row.newEmailDomain) ?? extractEmailDomain(newEmail) ?? "",
    idempotencyKey,
    writeId: asText(row.write_id ?? row.writeId),
    authUnchanged: row.auth_unchanged !== false && row.authUnchanged !== false,
    billingUnchanged: row.billing_unchanged !== false && row.billingUnchanged !== false,
    emailSent: row.email_sent === true || row.emailSent === true,
    notificationSent: row.notification_sent === true || row.notificationSent === true,
  };
}

export function mapCustomerIdentityRpcError(message: string | undefined): {
  status: number;
  code: PlatformCustomerIdentityErrorCode;
} {
  const raw = (message ?? "").toLowerCase();
  if (raw.includes("platform high-risk write denied") || raw.includes("forbidden")) {
    return { status: 403, code: "forbidden" };
  }
  if (raw.includes("confirmation_required")) return { status: 400, code: "confirmation_required" };
  if (raw.includes("invalid_internal_reason")) return { status: 400, code: "invalid_internal_reason" };
  if (raw.includes("invalid_idempotency_key")) return { status: 400, code: "invalid_idempotency_key" };
  if (raw.includes("invalid_email")) return { status: 400, code: "invalid_email" };
  if (raw.includes("customer_not_found")) return { status: 404, code: "customer_not_found" };
  if (raw.includes("expected_email_mismatch")) return { status: 409, code: "expected_email_mismatch" };
  if (raw.includes("email_conflict")) return { status: 409, code: "email_conflict" };
  if (raw.includes("aipify_com_not_owned")) return { status: 400, code: "aipify_com_not_owned" };
  if (raw.includes("internal_aipify_requires_owned_domain")) {
    return { status: 400, code: "internal_aipify_requires_owned_domain" };
  }
  if (raw.includes("idempotency_conflict")) return { status: 409, code: "idempotency_conflict" };
  if (raw.includes("not authorized") || raw.includes("jwt")) {
    return { status: 401, code: "unauthorized" };
  }
  return { status: 500, code: "unknown" };
}

export function previewContactEmailDecision(
  email: string,
  isInternalAipifyIdentity: boolean,
) {
  return evaluateCustomerContactEmail(email, { isInternalAipifyIdentity });
}
