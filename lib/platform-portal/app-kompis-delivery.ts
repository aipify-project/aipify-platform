// Platform APP + Website Kompis Canonical Delivery V1.
// Application-layer contracts, parsers, and helpers only.
//
// Architecture (locked):
// - Parent APP license: aipify_billing_license_links (app_subscription)
// - Kompis child/underlisens: tenant_modules (module_key = website_kompis)
//   + tenant_public_companion_install_config
// - Parent binding lives in tenant_modules.metadata: parent_license_id,
//   installation_id, domain, app_panel_organization_id, delivery_model
// - Auto-install: runtime-config sync via existing install config model
// - Acknowledgement: get_website_kompis_public_install_config(install_id, domain)
//   must report ok + enabled + module licensed/enabled/status=enabled +
//   installation token_hash present, not revoked, status active
//
// This module never stores secrets, full license keys, or pilot-customer-
// specific values. Everything here is generic across tenants.

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

function parseNested(value: unknown): Record<string, unknown> {
  return record(value) ?? {};
}

/** Delivery status machine — application-layer union, mirrors migration RPCs. */
export const APP_KOMPIS_DELIVERY_STATUSES = [
  "not_started",
  "checking_requirements",
  "ready",
  "provisioning_app",
  "provisioning_companion",
  "installing",
  "awaiting_confirmation",
  "active",
  "attention",
  "failed",
  "suspended",
  "revoked",
] as const;

export type AppKompisDeliveryStatus = (typeof APP_KOMPIS_DELIVERY_STATUSES)[number];

function isKnownDeliveryStatus(value: string): value is AppKompisDeliveryStatus {
  return (APP_KOMPIS_DELIVERY_STATUSES as readonly string[]).includes(value);
}

function parseDeliveryStatus(
  value: unknown,
  fallback: AppKompisDeliveryStatus,
): AppKompisDeliveryStatus {
  const raw = text(value);
  if (!raw) return fallback;
  const normalized = raw.toLowerCase();
  return isKnownDeliveryStatus(normalized) ? normalized : fallback;
}

export type PlatformPortalAppKompisErrorCode =
  | "invalid_customer"
  | "invalid_internal_reason"
  | "confirmation_required"
  | "invalid_idempotency_key"
  | "customer_not_found"
  | "parent_license_required"
  | "parent_license_not_eligible"
  | "app_panel_required"
  | "child_entitlement_required"
  | "domain_required"
  | "installation_required"
  | "install_id_required"
  | "prerequisites_not_met"
  | "idempotency_conflict"
  | "delivery_not_found"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type PlatformPortalAppKompisEligibilityReason = {
  code: string;
  satisfied: boolean;
};

export type PlatformPortalAppKompisParentLicense = {
  id: string | null;
  status: string | null;
  productCode: string | null;
  provisioningStatus: string | null;
  eligible: boolean;
};

export type PlatformPortalAppKompisAppPanel = {
  organizationId: string | null;
  status: string | null;
  eligible: boolean;
};

export type PlatformPortalAppKompisChildEntitlement = {
  id: string | null;
  moduleKey: string | null;
  status: string | null;
  licensed: boolean;
  enabled: boolean;
  deliveryModel: string | null;
  eligible: boolean;
};

export type PlatformPortalAppKompisDomain = {
  id: string | null;
  hostname: string | null;
  status: string | null;
  verified: boolean;
  eligible: boolean;
};

export type PlatformPortalAppKompisInstallation = {
  id: string | null;
  installId: string | null;
  status: string | null;
  tokenPresent: boolean;
  revoked: boolean;
  active: boolean;
  eligible: boolean;
};

export type PlatformPortalAppKompisAutoInstall = {
  configEnabled: boolean;
  synced: boolean;
  lastSyncedAt: string | null;
};

export type PlatformPortalAppKompisAcknowledgement = {
  ok: boolean;
  enabled: boolean;
  licensed: boolean;
  statusEnabled: boolean;
  tokenPresent: boolean;
  notRevoked: boolean;
  statusActive: boolean;
  checkedAt: string | null;
};

export type PlatformPortalAppKompisExistingDelivery = {
  id: string | null;
  status: string | null;
  deliveredAt: string | null;
};

export type PlatformPortalAppKompisDeliveryStatusPayload = {
  customerId: string;
  deliveryStatus: AppKompisDeliveryStatus;
  eligible: boolean;
  active: boolean;
  blocked: boolean;
  reasons: PlatformPortalAppKompisEligibilityReason[];
  agreement: {
    eligible: boolean;
    status: string | null;
    duration: string | null;
  };
  parentLicense: PlatformPortalAppKompisParentLicense;
  appPanel: PlatformPortalAppKompisAppPanel;
  childEntitlement: PlatformPortalAppKompisChildEntitlement;
  domain: PlatformPortalAppKompisDomain;
  installation: PlatformPortalAppKompisInstallation;
  autoInstall: PlatformPortalAppKompisAutoInstall;
  acknowledgement: PlatformPortalAppKompisAcknowledgement;
  existingDelivery: PlatformPortalAppKompisExistingDelivery;
  lastCheckedAt: string | null;
  lastAttemptAt: string | null;
};

export type PlatformPortalAppKompisDeliveryResult = {
  customerId: string;
  created: boolean;
  idempotentReplay: boolean;
  deliveryStatus: AppKompisDeliveryStatus;
  delivery: PlatformPortalAppKompisExistingDelivery;
  parentLicense: {
    id: string | null;
    status: string | null;
    provisioningStatus: string | null;
  };
  appPanel: {
    organizationId: string | null;
    status: string | null;
  };
  childEntitlement: {
    id: string | null;
    status: string | null;
    licensed: boolean;
    enabled: boolean;
  };
  domain: {
    id: string | null;
    hostname: string | null;
  };
  installation: {
    id: string | null;
    installId: string | null;
  };
  autoInstall: {
    configEnabled: boolean;
  };
  acknowledgement: PlatformPortalAppKompisAcknowledgement;
};

export type PlatformPortalAppKompisReconcileResult = PlatformPortalAppKompisDeliveryResult & {
  reconciled: boolean;
  changes: string[];
};

export function createAppKompisDeliveryIdempotencyKey(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `akd-${suffix}`;
}

export function parseDeliverAppKompisInput(
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
  | { ok: false; code: PlatformPortalAppKompisErrorCode } {
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
    !idempotencyKey.startsWith("akd-")
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

function parseReasons(value: unknown): PlatformPortalAppKompisEligibilityReason[] {
  if (!Array.isArray(value)) return [];
  const reasons: PlatformPortalAppKompisEligibilityReason[] = [];
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

function deriveFallbackStatus(eligible: boolean, active: boolean): AppKompisDeliveryStatus {
  if (active) return "active";
  if (eligible) return "ready";
  return "not_started";
}

export function parsePlatformPortalAppKompisDeliveryStatus(
  value: unknown,
): PlatformPortalAppKompisDeliveryStatusPayload | null {
  const row = record(value);
  const customerId = text(row?.customer_id ?? row?.customerId);
  if (!row || !customerId || !UUID.test(customerId)) return null;

  const agreement = parseNested(row.agreement);
  const parentLicense = parseNested(row.parent_license ?? row.parentLicense);
  const appPanel = parseNested(row.app_panel ?? row.appPanel);
  const childEntitlement = parseNested(
    row.child_entitlement ?? row.childEntitlement,
  );
  const domain = parseNested(row.domain);
  const installation = parseNested(row.installation);
  const autoInstall = parseNested(row.auto_install ?? row.autoInstall);
  const acknowledgement = parseNested(row.acknowledgement);
  const existingDelivery = parseNested(
    row.existing_delivery ?? row.existingDelivery,
  );

  const eligible = bool(row.eligible);
  const active = bool(row.active);

  return {
    customerId,
    deliveryStatus: parseDeliveryStatus(
      row.delivery_status ?? row.deliveryStatus,
      deriveFallbackStatus(eligible, active),
    ),
    eligible,
    active,
    blocked: bool(row.blocked),
    reasons: parseReasons(row.reasons),
    agreement: {
      eligible: bool(agreement.eligible),
      status: nullableText(agreement.status),
      duration: nullableText(agreement.duration),
    },
    parentLicense: {
      id: nullableText(parentLicense.id),
      status: nullableText(parentLicense.status),
      productCode: nullableText(
        parentLicense.product_code ?? parentLicense.productCode,
      ),
      provisioningStatus: nullableText(
        parentLicense.provisioning_status ?? parentLicense.provisioningStatus,
      ),
      eligible: bool(parentLicense.eligible),
    },
    appPanel: {
      organizationId: nullableText(
        appPanel.organization_id ?? appPanel.organizationId,
      ),
      status: nullableText(appPanel.status),
      eligible: bool(appPanel.eligible),
    },
    childEntitlement: {
      id: nullableText(childEntitlement.id),
      moduleKey: nullableText(childEntitlement.module_key ?? childEntitlement.moduleKey),
      status: nullableText(childEntitlement.status),
      licensed: bool(childEntitlement.licensed),
      enabled: bool(childEntitlement.enabled),
      deliveryModel: nullableText(
        childEntitlement.delivery_model ?? childEntitlement.deliveryModel,
      ),
      eligible: bool(childEntitlement.eligible),
    },
    domain: {
      id: nullableText(domain.id),
      hostname: nullableText(domain.hostname ?? domain.domain),
      status: nullableText(domain.status),
      verified: bool(domain.verified),
      eligible: bool(domain.eligible),
    },
    installation: {
      id: nullableText(installation.id),
      installId: nullableText(installation.install_id ?? installation.installId),
      status: nullableText(installation.status),
      tokenPresent: bool(
        installation.token_present ?? installation.tokenPresent,
      ),
      revoked: bool(installation.revoked),
      active: bool(installation.active),
      eligible: bool(installation.eligible),
    },
    autoInstall: {
      configEnabled: bool(
        autoInstall.config_enabled ?? autoInstall.configEnabled,
      ),
      synced: bool(autoInstall.synced),
      lastSyncedAt: nullableText(
        autoInstall.last_synced_at ?? autoInstall.lastSyncedAt,
      ),
    },
    acknowledgement: {
      ok: bool(acknowledgement.ok),
      enabled: bool(acknowledgement.enabled),
      licensed: bool(acknowledgement.licensed),
      statusEnabled: bool(
        acknowledgement.status_enabled ?? acknowledgement.statusEnabled,
      ),
      tokenPresent: bool(
        acknowledgement.token_present ?? acknowledgement.tokenPresent,
      ),
      notRevoked: bool(
        acknowledgement.not_revoked ?? acknowledgement.notRevoked,
      ),
      statusActive: bool(
        acknowledgement.status_active ?? acknowledgement.statusActive,
      ),
      checkedAt: nullableText(
        acknowledgement.checked_at ?? acknowledgement.checkedAt,
      ),
    },
    existingDelivery: {
      id: nullableText(existingDelivery.id),
      status: nullableText(existingDelivery.status),
      deliveredAt: nullableText(
        existingDelivery.delivered_at ?? existingDelivery.deliveredAt,
      ),
    },
    lastCheckedAt: nullableText(row.last_checked_at ?? row.lastCheckedAt),
    lastAttemptAt: nullableText(row.last_attempt_at ?? row.lastAttemptAt),
  };
}

function parseDeliveryResultCore(
  row: Record<string, unknown>,
): Omit<PlatformPortalAppKompisDeliveryResult, "customerId"> {
  const delivery = parseNested(row.delivery);
  const parentLicense = parseNested(row.parent_license ?? row.parentLicense);
  const appPanel = parseNested(row.app_panel ?? row.appPanel);
  const childEntitlement = parseNested(
    row.child_entitlement ?? row.childEntitlement,
  );
  const domain = parseNested(row.domain);
  const installation = parseNested(row.installation);
  const autoInstall = parseNested(row.auto_install ?? row.autoInstall);
  const acknowledgement = parseNested(row.acknowledgement);

  return {
    created: bool(row.created),
    idempotentReplay: bool(row.idempotent_replay ?? row.idempotentReplay),
    deliveryStatus: parseDeliveryStatus(
      row.delivery_status ?? row.deliveryStatus,
      "attention",
    ),
    delivery: {
      id: nullableText(delivery.id),
      status: nullableText(delivery.status),
      deliveredAt: nullableText(delivery.delivered_at ?? delivery.deliveredAt),
    },
    parentLicense: {
      id: nullableText(parentLicense.id),
      status: nullableText(parentLicense.status),
      provisioningStatus: nullableText(
        parentLicense.provisioning_status ?? parentLicense.provisioningStatus,
      ),
    },
    appPanel: {
      organizationId: nullableText(
        appPanel.organization_id ?? appPanel.organizationId,
      ),
      status: nullableText(appPanel.status),
    },
    childEntitlement: {
      id: nullableText(childEntitlement.id),
      status: nullableText(childEntitlement.status),
      licensed: bool(childEntitlement.licensed),
      enabled: bool(childEntitlement.enabled),
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
    autoInstall: {
      configEnabled: bool(
        autoInstall.config_enabled ?? autoInstall.configEnabled,
      ),
    },
    acknowledgement: {
      ok: bool(acknowledgement.ok),
      enabled: bool(acknowledgement.enabled),
      licensed: bool(acknowledgement.licensed),
      statusEnabled: bool(
        acknowledgement.status_enabled ?? acknowledgement.statusEnabled,
      ),
      tokenPresent: bool(
        acknowledgement.token_present ?? acknowledgement.tokenPresent,
      ),
      notRevoked: bool(
        acknowledgement.not_revoked ?? acknowledgement.notRevoked,
      ),
      statusActive: bool(
        acknowledgement.status_active ?? acknowledgement.statusActive,
      ),
      checkedAt: nullableText(
        acknowledgement.checked_at ?? acknowledgement.checkedAt,
      ),
    },
  };
}

export function parsePlatformPortalAppKompisDeliveryResult(
  value: unknown,
): PlatformPortalAppKompisDeliveryResult | null {
  const row = record(value);
  const customerId = text(row?.customer_id ?? row?.customerId);
  if (!row || !customerId || !UUID.test(customerId)) return null;

  return {
    customerId,
    ...parseDeliveryResultCore(row),
  };
}

export function parsePlatformPortalAppKompisReconcileResult(
  value: unknown,
): PlatformPortalAppKompisReconcileResult | null {
  const row = record(value);
  const customerId = text(row?.customer_id ?? row?.customerId);
  if (!row || !customerId || !UUID.test(customerId)) return null;

  const changes = Array.isArray(row.changes)
    ? row.changes.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
    : [];

  return {
    customerId,
    ...parseDeliveryResultCore(row),
    reconciled: bool(row.reconciled),
    changes,
  };
}

export function mapAppKompisDeliveryRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalAppKompisErrorCode } {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("ACCESS DENIED") || raw.includes("PLATFORM ADMIN")) {
    return { status: 403, code: "forbidden" };
  }
  const map: Record<string, [number, PlatformPortalAppKompisErrorCode]> = {
    INVALID_CUSTOMER: [400, "invalid_customer"],
    INVALID_INTERNAL_REASON: [400, "invalid_internal_reason"],
    CONFIRMATION_REQUIRED: [400, "confirmation_required"],
    INVALID_IDEMPOTENCY_KEY: [400, "invalid_idempotency_key"],
    CUSTOMER_NOT_FOUND: [404, "customer_not_found"],
    DELIVERY_NOT_FOUND: [404, "delivery_not_found"],
    PARENT_LICENSE_REQUIRED: [422, "parent_license_required"],
    PARENT_LICENSE_NOT_ELIGIBLE: [422, "parent_license_not_eligible"],
    APP_PANEL_REQUIRED: [422, "app_panel_required"],
    CHILD_ENTITLEMENT_REQUIRED: [422, "child_entitlement_required"],
    DOMAIN_REQUIRED: [422, "domain_required"],
    INSTALLATION_REQUIRED: [422, "installation_required"],
    INSTALL_ID_REQUIRED: [422, "install_id_required"],
    PREREQUISITES_NOT_MET: [422, "prerequisites_not_met"],
    COMMERCIAL_PLAN_REQUIRED: [422, "prerequisites_not_met"],
    IDEMPOTENCY_CONFLICT: [409, "idempotency_conflict"],
  };
  for (const [needle, mapped] of Object.entries(map)) {
    if (raw.includes(needle)) return { status: mapped[0], code: mapped[1] };
  }
  return { status: 500, code: "unknown" };
}

export function deliveryStatusVariant(
  status: string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "success";
    case "ready":
    case "awaiting_confirmation":
    case "attention":
      return "warning";
    case "checking_requirements":
    case "provisioning_app":
    case "provisioning_companion":
    case "installing":
      return "info";
    case "failed":
    case "suspended":
    case "revoked":
      return "danger";
    default:
      return "muted";
  }
}

export function appKompisDeliveryReasonLabel(
  code: string,
  labels: Record<string, string>,
  satisfied: boolean,
): string {
  const key = satisfied ? `${code}Ok` : `${code}Missing`;
  return labels[key] ?? labels[code] ?? labels.notEligible ?? code;
}
