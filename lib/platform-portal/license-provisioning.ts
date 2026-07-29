import type {
  PlatformPortalCustomerLicense,
  PlatformPortalCustomerLicenseResult,
  PlatformPortalLicenseProduct,
  PlatformPortalLicenseProductsPayload,
} from "./types";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PRODUCT_CODE_REGEX = /^[a-z][a-z0-9_]{1,63}$/;

export type PlatformPortalLicenseProvisioningErrorCode =
  | "invalid_customer"
  | "invalid_product"
  | "invalid_internal_reason"
  | "invalid_idempotency_key"
  | "customer_not_found"
  | "product_not_found"
  | "product_not_assignable"
  | "commercial_plan_required"
  | "active_license_conflict"
  | "idempotency_conflict"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type CreatePlatformPortalCustomerLicenseInput = {
  customerId: string;
  productId: string;
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

function asProductCode(value: unknown): string | null {
  const code = asNullableTrimmedString(value)?.toLowerCase() ?? null;
  if (!code || !PRODUCT_CODE_REGEX.test(code)) return null;
  return code;
}

function asStrictBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

export function createLicenseIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `lic-${crypto.randomUUID()}`;
  }
  return `lic-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function parsePlatformPortalLicenseProduct(
  value: unknown,
): PlatformPortalLicenseProduct | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asProductCode(row.id ?? row.code);
  const code = asProductCode(row.code ?? row.id);
  const name = asNullableTrimmedString(row.name);
  if (!id || !code || !name) return null;

  return {
    id,
    code,
    name,
    description: asNullableTrimmedString(row.description),
    active: asStrictBoolean(row.active, true),
    assignableByPlatform: asStrictBoolean(
      row.assignable_by_platform ?? row.assignableByPlatform,
      false,
    ),
    requiresCommercialPlan: asStrictBoolean(
      row.requires_commercial_plan ?? row.requiresCommercialPlan,
      true,
    ),
    requiresEntitlement: asStrictBoolean(
      row.requires_entitlement ?? row.requiresEntitlement,
      false,
    ),
    requiresDomain: asStrictBoolean(row.requires_domain ?? row.requiresDomain, false),
    requiresInstallation: asStrictBoolean(
      row.requires_installation ?? row.requiresInstallation,
      false,
    ),
    licenseMode: asNullableTrimmedString(row.license_mode ?? row.licenseMode),
    defaultStatus: asNullableTrimmedString(row.default_status ?? row.defaultStatus),
  };
}

export function parsePlatformPortalLicenseProductsPayload(
  value: unknown,
): PlatformPortalLicenseProductsPayload {
  const row = asRecord(value);
  const products = Array.isArray(row?.products)
    ? row.products
        .map((item) => parsePlatformPortalLicenseProduct(item))
        .filter((item): item is PlatformPortalLicenseProduct => item !== null)
        .filter((item) => item.active && item.assignableByPlatform)
    : [];

  return {
    products,
    generatedAt: asNullableTrimmedString(row?.generated_at ?? row?.generatedAt),
  };
}

export function parsePlatformPortalCustomerLicense(
  value: unknown,
): PlatformPortalCustomerLicense | null {
  const row = asRecord(value);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const status = asNullableTrimmedString(row.status);
  if (!id || !status) return null;

  return {
    id,
    productId: asNullableTrimmedString(row.product_id ?? row.productId),
    productCode: asNullableTrimmedString(row.product_code ?? row.productCode),
    productName: asNullableTrimmedString(row.product_name ?? row.productName),
    status,
    maskedLicenseCode: asNullableTrimmedString(
      row.masked_license_code ?? row.maskedLicenseCode,
    ),
    entitlementId: asNullableTrimmedString(row.entitlement_id ?? row.entitlementId),
    domainId: asNullableTrimmedString(row.domain_id ?? row.domainId),
    domain: asNullableTrimmedString(row.domain),
    installationId: asNullableTrimmedString(row.installation_id ?? row.installationId),
    installId: asNullableTrimmedString(row.install_id ?? row.installId),
    provisioningStatus: asNullableTrimmedString(
      row.provisioning_status ?? row.provisioningStatus,
    ),
    provisioningRequired: asStrictBoolean(
      row.provisioning_required ?? row.provisioningRequired,
      false,
    ),
    createdAt: asNullableTrimmedString(row.created_at ?? row.createdAt),
    activatedAt: asNullableTrimmedString(row.activated_at ?? row.activatedAt),
    expiresAt: asNullableTrimmedString(row.expires_at ?? row.expiresAt),
  };
}

export function parsePlatformPortalCustomerLicensesPayload(value: unknown): {
  customerId: string | null;
  licenses: PlatformPortalCustomerLicense[];
  generatedAt: string | null;
} {
  const row = asRecord(value);
  const licenses = Array.isArray(row?.licenses)
    ? row.licenses
        .map((item) => parsePlatformPortalCustomerLicense(item))
        .filter((item): item is PlatformPortalCustomerLicense => item !== null)
    : [];

  return {
    customerId: asRequiredId(row?.customer_id ?? row?.customerId),
    licenses,
    generatedAt: asNullableTrimmedString(row?.generated_at ?? row?.generatedAt),
  };
}

export function parseCreateLicenseInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: CreatePlatformPortalCustomerLicenseInput }
  | { ok: false; code: PlatformPortalLicenseProvisioningErrorCode } {
  if (!UUID_REGEX.test(customerId)) {
    return { ok: false, code: "invalid_customer" };
  }
  const row = asRecord(body);
  if (!row) return { ok: false, code: "unknown" };

  const productId = asProductCode(row.productId ?? row.product_id ?? row.productCode);
  if (!productId) return { ok: false, code: "invalid_product" };

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
      productId,
      internalReason,
      idempotencyKey,
    },
  };
}

export function parsePlatformPortalCustomerLicenseResult(
  value: unknown,
): PlatformPortalCustomerLicenseResult | null {
  const row = asRecord(value);
  if (!row) return null;
  const customerId = asRequiredId(row.customer_id ?? row.customerId);
  const license = parsePlatformPortalCustomerLicense(row.license);
  if (!customerId || !license) return null;

  return {
    customerId,
    license,
    created: asStrictBoolean(row.created),
    entitlementCreated: asStrictBoolean(
      row.entitlement_created ?? row.entitlementCreated,
    ),
    provisioningRequired: asStrictBoolean(
      row.provisioning_required ?? row.provisioningRequired,
    ),
    idempotentReplay: asStrictBoolean(
      row.idempotent_replay ?? row.idempotentReplay,
    ),
  };
}

export function mapLicenseProvisioningRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalLicenseProvisioningErrorCode } {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("PLATFORM PORTAL ACCESS DENIED") || raw.includes("ACCESS DENIED")) {
    return { status: 403, code: "forbidden" };
  }
  if (raw.includes("INVALID_CUSTOMER")) return { status: 400, code: "invalid_customer" };
  if (raw.includes("INVALID_PRODUCT")) return { status: 400, code: "invalid_product" };
  if (raw.includes("INVALID_INTERNAL_REASON")) {
    return { status: 400, code: "invalid_internal_reason" };
  }
  if (raw.includes("INVALID_IDEMPOTENCY_KEY")) {
    return { status: 400, code: "invalid_idempotency_key" };
  }
  if (raw.includes("CUSTOMER_NOT_FOUND")) return { status: 404, code: "customer_not_found" };
  if (raw.includes("PRODUCT_NOT_FOUND")) return { status: 404, code: "product_not_found" };
  if (raw.includes("PRODUCT_NOT_ASSIGNABLE")) {
    return { status: 422, code: "product_not_assignable" };
  }
  if (raw.includes("COMMERCIAL_PLAN_REQUIRED")) {
    return { status: 422, code: "commercial_plan_required" };
  }
  if (raw.includes("ACTIVE_LICENSE_CONFLICT")) {
    return { status: 409, code: "active_license_conflict" };
  }
  if (raw.includes("IDEMPOTENCY_CONFLICT")) {
    return { status: 409, code: "idempotency_conflict" };
  }
  return { status: 500, code: "unknown" };
}

export function licenseStatusVariant(
  status: string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
    case "expired":
    case "cancelled":
    case "canceled":
    case "revoked":
    case "failed":
      return "danger";
    default:
      return "info";
  }
}

export function provisioningStatusVariant(
  status: string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "domain_linked":
    case "provisioned":
    case "complete":
      return "success";
    case "requires_domain":
    case "requires_installation":
    case "pending":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "info";
  }
}

export function assertNoFullLicenseCodeLeak(payload: unknown): boolean {
  const text = JSON.stringify(payload ?? null);
  return !/AIP-SUB-[0-9A-F]{32}/i.test(text);
}
