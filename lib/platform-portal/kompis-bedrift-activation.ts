/**
 * Platform → Core Kompis Bedrift product entitlement (Step A RPCs).
 * Activate is modeled but Production writes stay fail-closed until an owner-named
 * customer id is added to KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.
 */

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECRET_REASON =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

/** Empty by design — no Production activate until a named owner approval job. */
export const KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST: ReadonlySet<string> =
  new Set();

export function isKompisBedriftActivateOwnerAuthorized(
  customerId: string,
): boolean {
  return KOMPIS_BEDRIFT_ACTIVATE_OWNER_ALLOWLIST.has(customerId);
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

function bool(value: unknown): boolean {
  return value === true;
}

export type PlatformPortalKompisBedriftErrorCode =
  | "invalid_customer"
  | "invalid_internal_reason"
  | "confirmation_required"
  | "invalid_idempotency_key"
  | "customer_not_found"
  | "not_eligible"
  | "already_active"
  | "idempotency_conflict"
  | "owner_activation_authorization_required"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type PlatformPortalKompisBedriftDisplayStatus =
  | "active"
  | "eligible"
  | "inactive"
  | "unknown";

export type PlatformPortalKompisBedriftReason = {
  code: string;
  satisfied: boolean;
};

export type PlatformPortalKompisBedriftStatus = {
  customerId: string;
  moduleKey: "kompis_bedrift";
  active: boolean;
  eligible: boolean;
  displayStatus: PlatformPortalKompisBedriftDisplayStatus;
  reasons: PlatformPortalKompisBedriftReason[];
  subscription: {
    id: string | null;
    status: string | null;
    planKey: string | null;
  } | null;
  existingActivation: {
    id: string | null;
    status: string | null;
    licensed: boolean;
    enabled: boolean;
    activatedAt: string | null;
  } | null;
  notes: {
    noMembershipDefault: boolean;
    noEmployeeKnowledgeAlias: boolean;
    grantsOnlyViaPlatformActivate: boolean;
  };
  /** Server gate — false until owner allowlists this customer. */
  activateAuthorized: boolean;
};

export type PlatformPortalKompisBedriftLabels = {
  title: string;
  serviceName: string;
  sectionTitle: string;
  statusLabel: string;
  sourceCore: string;
  active: string;
  eligible: string;
  inactive: string;
  unknown: string;
  noGrant: string;
  moduleKey: string;
  agreement: string;
  subscriptionStatus: string;
  planKey: string;
  prerequisites: string;
  productDistinctionTitle: string;
  productWebsiteKompis: string;
  productKompisBedrift: string;
  productEmployeeKnowledge: string;
  productEmployeeKnowledgeNote: string;
  activateLockedTitle: string;
  activateLockedBody: string;
  activateUnavailable: string;
  alreadyActive: string;
  loading: string;
  error: string;
  unauthorized: string;
  forbidden: string;
  retry: string;
  notConfigured: string;
  unknownStatus: string;
  presentationStatuses: Record<string, string>;
  reasonLabels: Record<string, string>;
};

export function createKompisBedriftActivationIdempotencyKey(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `bpk-${suffix}`;
}

export function parseActivateKompisBedriftInput(
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
  | { ok: false; code: PlatformPortalKompisBedriftErrorCode } {
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
    !idempotencyKey.startsWith("bpk-")
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

function parseReasons(value: unknown): PlatformPortalKompisBedriftReason[] {
  if (!Array.isArray(value)) return [];
  const reasons: PlatformPortalKompisBedriftReason[] = [];
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

export function parsePlatformPortalKompisBedriftStatus(
  value: unknown,
): PlatformPortalKompisBedriftStatus | null {
  const row = record(value);
  const customerId = text(row?.customer_id ?? row?.customerId);
  if (!row || !customerId || !UUID.test(customerId)) return null;

  const active = bool(row.active);
  const eligible = bool(row.eligible);
  const displayStatus: PlatformPortalKompisBedriftDisplayStatus = active
    ? "active"
    : eligible
      ? "eligible"
      : row.active === false || row.active === true
        ? "inactive"
        : "unknown";

  const existing = record(row.existing_activation ?? row.existingActivation);
  const subscription = record(row.subscription);
  const notes = record(row.notes) ?? {};

  return {
    customerId,
    moduleKey: "kompis_bedrift",
    active,
    eligible,
    displayStatus,
    reasons: parseReasons(row.reasons),
    subscription: subscription
      ? {
          id: text(subscription.id),
          status: text(subscription.status),
          planKey: text(subscription.plan_key ?? subscription.planKey),
        }
      : null,
    existingActivation: existing
      ? {
          id: text(existing.id),
          status: text(existing.status),
          licensed: bool(existing.licensed),
          enabled: bool(existing.enabled),
          activatedAt: text(existing.activated_at ?? existing.activatedAt),
        }
      : null,
    notes: {
      noMembershipDefault: notes.no_membership_default !== false,
      noEmployeeKnowledgeAlias: notes.no_employee_knowledge_alias !== false,
      grantsOnlyViaPlatformActivate:
        notes.grants_only_via_platform_activate !== false,
    },
    activateAuthorized: isKompisBedriftActivateOwnerAuthorized(customerId),
  };
}

export function mapKompisBedriftActivationRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformPortalKompisBedriftErrorCode } {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("ACCESS DENIED") || raw.includes("PLATFORM ADMIN")) {
    return { status: 403, code: "forbidden" };
  }
  const map: Record<string, [number, PlatformPortalKompisBedriftErrorCode]> = {
    INVALID_CUSTOMER: [400, "invalid_customer"],
    INVALID_INTERNAL_REASON: [400, "invalid_internal_reason"],
    CONFIRMATION_REQUIRED: [400, "confirmation_required"],
    INVALID_IDEMPOTENCY_KEY: [400, "invalid_idempotency_key"],
    CUSTOMER_NOT_FOUND: [404, "customer_not_found"],
    NOT_ELIGIBLE: [422, "not_eligible"],
    PREREQUISITES_NOT_MET: [422, "not_eligible"],
    ALREADY_ACTIVE: [409, "already_active"],
    IDEMPOTENCY_CONFLICT: [409, "idempotency_conflict"],
  };
  for (const [needle, mapped] of Object.entries(map)) {
    if (raw.includes(needle)) return { status: mapped[0], code: mapped[1] };
  }
  return { status: 500, code: "unknown" };
}

export function kompisBedriftStatusVariant(
  status: PlatformPortalKompisBedriftDisplayStatus | string | null | undefined,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch ((status ?? "").toLowerCase()) {
    case "active":
      return "success";
    case "eligible":
      return "warning";
    case "inactive":
      return "muted";
    default:
      return "info";
  }
}

export function bedriftReasonLabel(
  code: string,
  labels: Record<string, string>,
  satisfied: boolean,
): string {
  const key = satisfied ? `${code}Ok` : `${code}Missing`;
  return labels[key] ?? labels[code] ?? code;
}
