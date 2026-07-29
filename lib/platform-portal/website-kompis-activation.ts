import type {
  PlatformPortalWebsiteKompisActivationResult,
  PlatformPortalWebsiteKompisEligibilityReason,
  PlatformPortalWebsiteKompisStatus,
} from "./types";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECRET_REASON =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function text(value: unknown): string | null {
  const result = value == null ? "" : String(value).trim();
  return result || null;
}

function bool(value: unknown): boolean {
  return value === true;
}

function nullableText(value: unknown): string | null {
  return text(value);
}

export type PlatformPortalWebsiteKompisErrorCode =
  | "invalid_customer"
  | "invalid_internal_reason"
  | "confirmation_required"
  | "invalid_idempotency_key"
  | "customer_not_found"
  | "commercial_plan_required"
  | "license_required"
  | "license_not_eligible"
  | "domain_required"
  | "installation_required"
  | "install_id_required"
  | "prerequisites_not_met"
  | "idempotency_conflict"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type PlatformPortalWebsiteKompisActivationStatus =
  | "not_ready"
  | "ready_for_activation"
  | "activating"
  | "active"
  | "suspended"
  | "failed"
  | "revoked";

export function createWebsiteKompisActivationIdempotencyKey(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `wpk-${suffix}`;
}

export function parseActivateWebsiteKompisInput(
  customerId: string,
  body: unknown,
):
  | {
      ok: true;
      value: {
        customerId: string;
        internalReason: string;
        confirmation: boolean;
        idempotencyKey: string;
      };
    }
  | { ok: false; code: PlatformPortalWebsiteKompisErrorCode } {
  if (!UUID.test(customerId)) return { ok: false, code: "invalid_customer" };
  const value = record(body);
  const internalReason = text(value?.internalReason ?? value?.internal_reason);
  const idempotencyKey = text(value?.idempotencyKey ?? value?.idempotency_key);
  if (
    !internalReason ||
    internalReason.length < 3 ||
    internalReason.length > 500 ||
    SECRET_REASON.test(internalReason)
  ) {
    return { ok: false, code: "invalid_internal_reason" };
  }
  if (value?.confirmation !== true) {
    return { ok: false, code: "confirmation_required" };
  }
  if (
    !idempotencyKey ||
    idempotencyKey.length < 8 ||
    idempotencyKey.length > 128 ||
    !idempotencyKey.startsWith("wpk-")
  ) {
    return { ok: false, code: "invalid_idempotency_key" };
  }
  return {
    ok: true,
    value: {
      customerId,
      internalReason,
      confirmation: true,
      idempotencyKey,
    },
  };
}

function parseReasons(value: unknown): PlatformPortalWebsiteKompisEligibilityReason[] {
  if (!Array.isArray(value)) return [];
  const reasons: PlatformPortalWebsiteKompisEligibilityReason[] = [];
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      reasons.push({ code: entry.trim(), satisfied: false });
      continue;
    }
    const row = record(entry);
    const code = text(row?.code);
    if (!code) continue;
    reasons.push({ code, satisfied: bool(row?.satisfied) });
  }
  return reasons;
}

function parseNested(
  value: unknown,
): Record<string, unknown> {
  return record(value) ?? {};
}

export function parsePlatformPortalWebsiteKompisStatus(
  value: unknown,
): PlatformPortalWebsiteKompisStatus | null {
  const row = record(value);
  const customerId = text(row?.customer_id ?? row?.customerId);
  if (!row || !customerId || !UUID.test(customerId)) return null;

  const agreement = parseNested(row.agreement);
  const license = parseNested(row.license);
  const domain = parseNested(row.domain);
  const installation = parseNested(row.installation);
  const approval = parseNested(row.approval);
  const existing = parseNested(row.existing_activation ?? row.existingActivation);

  return {
    customerId,
    eligible: bool(row.eligible),
    active: bool(row.active),
    activationStatus: (text(row.activation_status ?? row.activationStatus) ??
      (bool(row.active) ? "active" : bool(row.eligible) ? "ready_for_activation" : "not_ready")) as PlatformPortalWebsiteKompisActivationStatus,
    reasons: parseReasons(row.reasons),
    agreement: {
      eligible: bool(agreement.eligible),
      status: nullableText(agreement.status),
      duration: nullableText(agreement.duration),
    },
    license: {
      eligible: bool(license.eligible),
      id: nullableText(license.id),
      status: nullableText(license.status),
      productCode: nullableText(license.product_code ?? license.productCode),
      provisioningStatus: nullableText(
        license.provisioning_status ?? license.provisioningStatus,
      ),
      domainReference: nullableText(
        license.domain_reference ?? license.domainReference,
      ),
    },
    domain: {
      eligible: bool(domain.eligible),
      id: nullableText(domain.id),
      hostname: nullableText(domain.hostname ?? domain.domain),
      status: nullableText(domain.status),
      verified: bool(domain.verified),
    },
    installation: {
      eligible: bool(installation.eligible),
      id: nullableText(installation.id),
      installId: nullableText(installation.install_id ?? installation.installId),
      status: nullableText(installation.status),
    },
    approval: {
      required: bool(approval.required),
      satisfied:
        approval.satisfied === undefined ? true : bool(approval.satisfied),
    },
    existingActivation: {
      id: nullableText(existing.id),
      status: nullableText(existing.status),
      activatedAt: nullableText(existing.activated_at ?? existing.activatedAt),
      entitlementEnabled: bool(
        existing.entitlement_enabled ?? existing.entitlementEnabled,
      ),
      configEnabled: bool(existing.config_enabled ?? existing.configEnabled),
    },
  };
}

export function parsePlatformPortalWebsiteKompisActivationResult(
  value: unknown,
): PlatformPortalWebsiteKompisActivationResult | null {
  const row = record(value);
  const customerId = text(row?.customer_id ?? row?.customerId);
  if (!row || !customerId || !UUID.test(customerId)) return null;

  const activation = parseNested(row.activation);
  const entitlement = parseNested(row.entitlement);
  const license = parseNested(row.license);
  const domain = parseNested(row.domain);
  const installation = parseNested(row.installation);

  return {
    customerId,
    created: bool(row.created),
    idempotentReplay: bool(row.idempotent_replay ?? row.idempotentReplay),
    activation: {
      id: nullableText(activation.id),
      moduleCode: nullableText(activation.module_code ?? activation.moduleCode),
      status: nullableText(activation.status),
      activatedAt: nullableText(
        activation.activated_at ?? activation.activatedAt,
      ),
    },
    entitlement: {
      id: nullableText(entitlement.id),
      status: nullableText(entitlement.status),
      created: bool(entitlement.created),
    },
    license: {
      id: nullableText(license.id),
      status: nullableText(license.status),
      provisioningStatus: nullableText(
        license.provisioning_status ?? license.provisioningStatus,
      ),
    },
    domain: {
      id: nullableText(domain.id),
      hostname: nullableText(domain.hostname),
    },
    installation: {
      id: nullableText(installation.id),
      installId: nullableText(
        installation.install_id ?? installation.installId,
      ),
    },
  };
}

export function mapWebsiteKompisActivationRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalWebsiteKompisErrorCode } {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("ACCESS DENIED") || raw.includes("PLATFORM ADMIN")) {
    return { status: 403, code: "forbidden" };
  }
  const map: Record<string, [number, PlatformPortalWebsiteKompisErrorCode]> = {
    INVALID_CUSTOMER: [400, "invalid_customer"],
    INVALID_INTERNAL_REASON: [400, "invalid_internal_reason"],
    CONFIRMATION_REQUIRED: [400, "confirmation_required"],
    INVALID_IDEMPOTENCY_KEY: [400, "invalid_idempotency_key"],
    CUSTOMER_NOT_FOUND: [404, "customer_not_found"],
    COMMERCIAL_PLAN_REQUIRED: [422, "commercial_plan_required"],
    LICENSE_REQUIRED: [422, "license_required"],
    LICENSE_NOT_ELIGIBLE: [422, "license_not_eligible"],
    DOMAIN_REQUIRED: [422, "domain_required"],
    INSTALLATION_REQUIRED: [422, "installation_required"],
    INSTALL_ID_REQUIRED: [422, "install_id_required"],
    PREREQUISITES_NOT_MET: [422, "prerequisites_not_met"],
    IDEMPOTENCY_CONFLICT: [409, "idempotency_conflict"],
  };
  for (const [needle, mapped] of Object.entries(map)) {
    if (raw.includes(needle)) return { status: mapped[0], code: mapped[1] };
  }
  return { status: 500, code: "unknown" };
}

export function websiteKompisStatusVariant(
  status: string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "success";
    case "ready_for_activation":
      return "warning";
    case "suspended":
    case "failed":
    case "revoked":
      return "danger";
    case "activating":
      return "info";
    default:
      return "muted";
  }
}

export function reasonLabel(
  code: string,
  labels: Record<string, string>,
  satisfied: boolean,
): string {
  const key = satisfied ? `${code}Ok` : `${code}Missing`;
  return labels[key] ?? labels[code] ?? labels.notEligible ?? code;
}
