import type {
  PlatformPortalCustomerDomain,
  PlatformPortalCustomerDomainInstallationResult,
  PlatformPortalCustomerDomainsPayload,
  PlatformPortalCustomerInstallation,
  PlatformPortalCustomerInstallationsPayload,
  PlatformPortalEligibleLicense,
} from "./types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PlatformPortalDomainInstallationErrorCode =
  | "invalid_customer"
  | "invalid_license"
  | "invalid_hostname"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "customer_not_found"
  | "license_not_found"
  | "license_customer_mismatch"
  | "license_not_eligible"
  | "commercial_plan_required"
  | "domain_already_exists"
  | "license_domain_conflict"
  | "idempotency_conflict"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type CreatePlatformPortalCustomerDomainInstallationInput = {
  customerId: string;
  licenseId: string;
  hostname: string;
  internalReason: string;
  idempotencyKey: string;
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

export function createDomainInstallationIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `dom-${crypto.randomUUID()}`;
  }
  return `dom-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Client-side preview mirror of server normalize (not authoritative). */
export function normalizeHostnamePreview(input: string): string | null {
  let value = input.trim();
  if (!value) return null;
  if (value.includes("@") || value.includes("?") || value.includes("#")) return null;
  value = value.replace(/^https?:\/\//i, "");
  // Reject path (allow only a single trailing slash).
  if (value.includes("/")) {
    if (!/^[^/]+\/$/.test(value)) return null;
    value = value.slice(0, -1);
  }
  value = value.replace(/\.+$/, "").toLowerCase();
  if (!value || value.includes(":") || value === "localhost") return null;
  if (/^\d+(\.\d+){3}$/.test(value)) return null;
  if (!value.includes(".")) return null;
  return value;
}

export function parsePlatformPortalCustomerDomain(
  value: unknown,
): PlatformPortalCustomerDomain | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const hostname = asNullableTrimmedString(row.hostname ?? row.domain);
  const status = asNullableTrimmedString(row.status);
  if (!id || !hostname || !status) return null;
  return {
    id,
    hostname,
    status,
    verificationStatus: asNullableTrimmedString(
      row.verification_status ?? row.verificationStatus,
    ),
    installId: asNullableTrimmedString(row.install_id ?? row.installId),
    createdAt: asNullableTrimmedString(row.created_at ?? row.createdAt),
    verifiedAt: asNullableTrimmedString(row.verified_at ?? row.verifiedAt),
  };
}

export function parsePlatformPortalEligibleLicense(
  value: unknown,
): PlatformPortalEligibleLicense | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const status = asNullableTrimmedString(row.status);
  if (!id || !status) return null;
  return {
    id,
    productCode: asNullableTrimmedString(row.product_code ?? row.productCode),
    productName: asNullableTrimmedString(row.product_name ?? row.productName),
    status,
    domain: asNullableTrimmedString(row.domain),
    installId: asNullableTrimmedString(row.install_id ?? row.installId),
    provisioningStatus: asNullableTrimmedString(
      row.provisioning_status ?? row.provisioningStatus,
    ),
    eligible: asStrictBoolean(row.eligible, false),
  };
}

export function parsePlatformPortalCustomerDomainsPayload(
  value: unknown,
): PlatformPortalCustomerDomainsPayload {
  const row = asRecord(value);
  const domains = Array.isArray(row?.domains)
    ? row.domains
        .map((item) => parsePlatformPortalCustomerDomain(item))
        .filter((item): item is PlatformPortalCustomerDomain => item !== null)
    : [];
  const eligibleLicenses = Array.isArray(row?.eligible_licenses ?? row?.eligibleLicenses)
    ? ((row?.eligible_licenses ?? row?.eligibleLicenses) as unknown[])
        .map((item) => parsePlatformPortalEligibleLicense(item))
        .filter((item): item is PlatformPortalEligibleLicense => item !== null)
    : [];

  return {
    customerId: asRequiredId(row?.customer_id ?? row?.customerId),
    domains,
    eligibleLicenses,
    generatedAt: asNullableTrimmedString(row?.generated_at ?? row?.generatedAt),
  };
}

export function parsePlatformPortalCustomerInstallation(
  value: unknown,
): PlatformPortalCustomerInstallation | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const installId = asRequiredId(row.install_id ?? row.installId ?? row.id);
  const status = asNullableTrimmedString(row.status);
  if (!id || !installId || !status) return null;
  return {
    id,
    installId,
    status,
    systemType: asNullableTrimmedString(row.system_type ?? row.systemType),
    name: asNullableTrimmedString(row.name),
    siteUrl: asNullableTrimmedString(row.site_url ?? row.siteUrl),
    domainId: asNullableTrimmedString(row.domain_id ?? row.domainId),
    createdAt: asNullableTrimmedString(row.created_at ?? row.createdAt),
    activatedAt: asNullableTrimmedString(row.activated_at ?? row.activatedAt),
  };
}

export function parsePlatformPortalCustomerInstallationsPayload(
  value: unknown,
): PlatformPortalCustomerInstallationsPayload {
  const row = asRecord(value);
  const installations = Array.isArray(row?.installations)
    ? row.installations
        .map((item) => parsePlatformPortalCustomerInstallation(item))
        .filter((item): item is PlatformPortalCustomerInstallation => item !== null)
    : [];

  return {
    customerId: asRequiredId(row?.customer_id ?? row?.customerId),
    installations,
    generatedAt: asNullableTrimmedString(row?.generated_at ?? row?.generatedAt),
  };
}

export function parseCreateDomainInstallationInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: CreatePlatformPortalCustomerDomainInstallationInput }
  | { ok: false; code: PlatformPortalDomainInstallationErrorCode } {
  if (!UUID_REGEX.test(customerId)) {
    return { ok: false, code: "invalid_customer" };
  }
  const row = asRecord(body);
  if (!row) return { ok: false, code: "unknown" };

  const licenseId = asRequiredId(row.licenseId ?? row.license_id);
  if (!licenseId) return { ok: false, code: "invalid_license" };

  const hostnameRaw = asNullableTrimmedString(row.hostname);
  const hostname = hostnameRaw ? normalizeHostnamePreview(hostnameRaw) : null;
  if (!hostname) return { ok: false, code: "invalid_hostname" };

  const internalReason = asNullableTrimmedString(row.internalReason ?? row.internal_reason);
  if (!internalReason || internalReason.length < 3 || internalReason.length > 500) {
    return { ok: false, code: "invalid_internal_reason" };
  }

  const idempotencyKey = asNullableTrimmedString(
    row.idempotencyKey ?? row.idempotency_key,
  );
  if (!idempotencyKey || idempotencyKey.length < 8 || idempotencyKey.length > 128) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  return {
    ok: true,
    value: {
      customerId,
      licenseId,
      hostname,
      internalReason,
      idempotencyKey,
    },
  };
}

export function parsePlatformPortalCustomerDomainInstallationResult(
  value: unknown,
): PlatformPortalCustomerDomainInstallationResult | null {
  const row = asRecord(value);
  if (!row) return null;
  const customerId = asRequiredId(row.customer_id ?? row.customerId);
  const licenseId = asRequiredId(row.license_id ?? row.licenseId);
  const domain = asRecord(row.domain);
  const installation = asRecord(row.installation);
  const license = asRecord(row.license);
  const created = asRecord(row.created);
  if (!customerId || !licenseId || !domain || !installation || !license || !created) {
    return null;
  }

  const domainId = asRequiredId(domain.id);
  const hostname = asNullableTrimmedString(domain.hostname);
  const domainStatus = asNullableTrimmedString(domain.status);
  const installationId = asRequiredId(installation.id);
  const installId = asRequiredId(installation.install_id ?? installation.installId ?? installation.id);
  const installationStatus = asNullableTrimmedString(installation.status);
  const licenseRowId = asRequiredId(license.id);
  const licenseStatus = asNullableTrimmedString(license.status);
  const provisioningStatus = asNullableTrimmedString(
    license.provisioning_status ?? license.provisioningStatus,
  );

  if (
    !domainId ||
    !hostname ||
    !domainStatus ||
    !installationId ||
    !installId ||
    !installationStatus ||
    !licenseRowId ||
    !licenseStatus ||
    !provisioningStatus
  ) {
    return null;
  }

  return {
    customerId,
    licenseId,
    domain: {
      id: domainId,
      hostname,
      status: domainStatus,
      verifiedAt: asNullableTrimmedString(domain.verified_at ?? domain.verifiedAt),
      createdAt: asNullableTrimmedString(domain.created_at ?? domain.createdAt),
    },
    installation: {
      id: installationId,
      installId,
      status: installationStatus,
      createdAt: asNullableTrimmedString(installation.created_at ?? installation.createdAt),
      activatedAt: asNullableTrimmedString(
        installation.activated_at ?? installation.activatedAt,
      ),
    },
    license: {
      id: licenseRowId,
      status: licenseStatus,
      provisioningStatus,
      domainId: asNullableTrimmedString(license.domain_id ?? license.domainId),
      installationId: asNullableTrimmedString(
        license.installation_id ?? license.installationId,
      ),
      installId: asNullableTrimmedString(license.install_id ?? license.installId),
    },
    created: {
      domain: asStrictBoolean(created.domain),
      installation: asStrictBoolean(created.installation),
    },
    idempotentReplay: asStrictBoolean(
      row.idempotent_replay ?? row.idempotentReplay,
    ),
  };
}

export function mapDomainInstallationRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalDomainInstallationErrorCode } {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("PLATFORM PORTAL ACCESS DENIED") || raw.includes("ACCESS DENIED")) {
    return { status: 403, code: "forbidden" };
  }
  if (raw.includes("INVALID_CUSTOMER")) return { status: 400, code: "invalid_customer" };
  if (raw.includes("INVALID_LICENSE")) return { status: 400, code: "invalid_license" };
  if (raw.includes("INVALID_HOSTNAME")) return { status: 422, code: "invalid_hostname" };
  if (raw.includes("INVALID_INTERNAL_REASON")) {
    return { status: 400, code: "invalid_internal_reason" };
  }
  if (raw.includes("INVALID_IDEMPOTENCY_KEY")) {
    return { status: 400, code: "invalid_idempotency_key" };
  }
  if (raw.includes("CUSTOMER_NOT_FOUND")) return { status: 404, code: "customer_not_found" };
  if (raw.includes("LICENSE_NOT_FOUND")) return { status: 404, code: "license_not_found" };
  if (raw.includes("LICENSE_CUSTOMER_MISMATCH")) {
    return { status: 404, code: "license_customer_mismatch" };
  }
  if (raw.includes("LICENSE_NOT_ELIGIBLE")) {
    return { status: 422, code: "license_not_eligible" };
  }
  if (raw.includes("COMMERCIAL_PLAN_REQUIRED")) {
    return { status: 422, code: "commercial_plan_required" };
  }
  if (raw.includes("DOMAIN_ALREADY_EXISTS")) {
    return { status: 409, code: "domain_already_exists" };
  }
  if (raw.includes("LICENSE_DOMAIN_CONFLICT")) {
    return { status: 409, code: "license_domain_conflict" };
  }
  if (raw.includes("IDEMPOTENCY_CONFLICT")) {
    return { status: 409, code: "idempotency_conflict" };
  }
  return { status: 500, code: "unknown" };
}

export function domainStatusVariant(
  status: string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "active":
    case "verified":
      return "success";
    case "pending":
    case "unverified":
      return "warning";
    case "failed":
    case "suspended":
    case "expired":
    case "removed":
    case "disabled":
      return "danger";
    default:
      return "info";
  }
}

export function installationStatusVariant(
  status: string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "active":
    case "ready":
      return "success";
    case "draft":
    case "pending_verification":
    case "installing":
    case "warning":
      return "warning";
    case "failed":
    case "suspended":
    case "archived":
      return "danger";
    default:
      return "info";
  }
}
