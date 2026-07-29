import { isValidIsoAlpha2Country } from "./countries";
import type {
  PlatformPortalCustomerCreationInput,
  PlatformPortalCustomerCreationResult,
} from "./types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const RESERVED_SLUGS = new Set([
  "platform",
  "app",
  "admin",
  "super",
  "api",
  "login",
  "auth",
  "my-company-1",
  "aipify",
  "aipify-group",
  "aipify-internal",
]);

export const REGISTRATION_NUMBER_MIN_LENGTH = 2;
export const REGISTRATION_NUMBER_MAX_LENGTH = 64;

export type PlatformPortalCustomerCreationErrorCode =
  | "invalid_organization_number"
  | "invalid_legal_name"
  | "invalid_display_name"
  | "invalid_slug"
  | "reserved_slug"
  | "invalid_country"
  | "invalid_verification_source"
  | "duplicate_organization_number"
  | "duplicate_slug"
  | "unauthorized"
  | "forbidden"
  | "unknown";

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

/** Norway-only: nine digits after stripping non-digits. */
export function normalizeNorwegianOrganizationNumber(value: unknown): string | null {
  const digits = String(value ?? "").replace(/\D/g, "");
  return digits.length === 9 ? digits : null;
}

/** @deprecated Prefer normalizeRegistrationNumber(country, value). Kept for Norway-only callers. */
export function normalizeOrganizationNumber(value: unknown): string | null {
  return normalizeNorwegianOrganizationNumber(value);
}

/**
 * Country-aware registration number normalization.
 * NO → exact nine digits. Other countries → trim only; preserve letters/hyphens.
 */
export function normalizeRegistrationNumber(
  countryCode: string,
  value: unknown,
): string | null {
  const country = String(countryCode ?? "")
    .trim()
    .toUpperCase();
  if (!country) return null;

  if (country === "NO") {
    return normalizeNorwegianOrganizationNumber(value);
  }

  const trimmed = String(value ?? "").trim();
  if (
    trimmed.length < REGISTRATION_NUMBER_MIN_LENGTH ||
    trimmed.length > REGISTRATION_NUMBER_MAX_LENGTH
  ) {
    return null;
  }
  return trimmed;
}

export function normalizeCustomerSlug(value: unknown): string | null {
  let slug = String(value ?? "")
    .trim()
    .toLowerCase();
  slug = slug.replace(/[^a-z0-9]+/g, "-").replace(/-+/g, "-");
  slug = slug.replace(/^-+|-+$/g, "");
  if (slug.length < 2 || slug.length > 64) return null;
  return slug;
}

export function suggestCustomerSlug(displayName: string): string {
  return normalizeCustomerSlug(displayName) ?? "customer";
}

export function isReservedCustomerSlug(slug: string): boolean {
  return RESERVED_SLUGS.has(slug.toLowerCase());
}

export function parseCustomerCreationInput(
  value: unknown,
):
  | { ok: true; value: PlatformPortalCustomerCreationInput }
  | { ok: false; code: PlatformPortalCustomerCreationErrorCode } {
  const row = asRecord(value);
  if (!row) {
    return { ok: false, code: "unknown" };
  }

  const allowed = new Set([
    "organizationNumber",
    "legalName",
    "displayName",
    "slug",
    "country",
    "verificationSource",
  ]);
  for (const key of Object.keys(row)) {
    if (!allowed.has(key)) {
      return { ok: false, code: "unknown" };
    }
  }

  const countryRaw = asNullableTrimmedString(row.country);
  if (!countryRaw) {
    return { ok: false, code: "invalid_country" };
  }
  const country = countryRaw.toUpperCase();
  if (!isValidIsoAlpha2Country(country)) {
    return { ok: false, code: "invalid_country" };
  }

  const organizationNumber = normalizeRegistrationNumber(country, row.organizationNumber);
  if (!organizationNumber) {
    return { ok: false, code: "invalid_organization_number" };
  }

  const legalName = asNullableTrimmedString(row.legalName);
  if (!legalName) {
    return { ok: false, code: "invalid_legal_name" };
  }

  const displayName = asNullableTrimmedString(row.displayName) ?? legalName;
  if (!displayName) {
    return { ok: false, code: "invalid_display_name" };
  }

  const slug = normalizeCustomerSlug(row.slug);
  if (!slug) {
    return { ok: false, code: "invalid_slug" };
  }
  if (isReservedCustomerSlug(slug)) {
    return { ok: false, code: "reserved_slug" };
  }

  const verificationRaw = asNullableTrimmedString(row.verificationSource);
  const verificationSource =
    verificationRaw === "brreg" || verificationRaw === "operator"
      ? verificationRaw
      : country === "NO"
        ? "operator"
        : "operator";

  if (verificationSource === "brreg" && country !== "NO") {
    return { ok: false, code: "invalid_verification_source" };
  }

  return {
    ok: true,
    value: {
      organizationNumber,
      legalName,
      displayName,
      slug,
      country,
      verificationSource,
    },
  };
}

export function parsePlatformPortalCustomerCreationResult(
  value: unknown,
): PlatformPortalCustomerCreationResult | null {
  const row = asRecord(value);
  if (!row) return null;

  const customer = asRecord(row.customer);
  const created = asRecord(row.created);
  if (!customer || !created) return null;

  const id = asRequiredId(customer.id);
  const companyId = asRequiredId(customer.company_id ?? customer.companyId);
  const name = asNullableTrimmedString(customer.name);
  const status = asNullableTrimmedString(customer.status);
  if (!id || !companyId || !name || !status) return null;

  return {
    customer: {
      id,
      companyId,
      name,
      legalName: asNullableTrimmedString(customer.legal_name ?? customer.legalName),
      slug: asNullableTrimmedString(customer.slug),
      organizationNumber: asNullableTrimmedString(
        customer.organization_number ?? customer.organizationNumber,
      ),
      status,
      createdAt: asNullableTrimmedString(customer.created_at ?? customer.createdAt),
    },
    created: {
      company: asStrictBoolean(created.company),
      organization: asStrictBoolean(created.organization),
      customer: asStrictBoolean(created.customer),
      registrationProfile: asStrictBoolean(
        created.registration_profile ?? created.registrationProfile,
      ),
      paymentProfile: asStrictBoolean(created.payment_profile ?? created.paymentProfile),
    },
  };
}

export function mapCreateCustomerRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalCustomerCreationErrorCode } {
  const text = (message ?? "").toUpperCase();
  if (text.includes("PLATFORM PORTAL ACCESS DENIED") || text.includes("ACCESS DENIED")) {
    return { status: 403, code: "forbidden" };
  }
  if (text.includes("DUPLICATE_ORGANIZATION_NUMBER")) {
    return { status: 409, code: "duplicate_organization_number" };
  }
  if (text.includes("DUPLICATE_SLUG")) {
    return { status: 409, code: "duplicate_slug" };
  }
  if (text.includes("RESERVED_SLUG")) {
    return { status: 400, code: "reserved_slug" };
  }
  if (text.includes("INVALID_ORGANIZATION_NUMBER")) {
    return { status: 400, code: "invalid_organization_number" };
  }
  if (text.includes("INVALID_LEGAL_NAME")) {
    return { status: 400, code: "invalid_legal_name" };
  }
  if (text.includes("INVALID_SLUG")) {
    return { status: 400, code: "invalid_slug" };
  }
  if (text.includes("INVALID_COUNTRY")) {
    return { status: 400, code: "invalid_country" };
  }
  return { status: 500, code: "unknown" };
}
