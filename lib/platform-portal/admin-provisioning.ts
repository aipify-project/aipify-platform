/**
 * Platform → Core administrator provisioning prepare / fail-closed execute.
 *
 * Create-customer does not attach an admin. This module builds a deterministic
 * dry-run plan for inviting/attaching an org owner after customer creation.
 * Production execute stays fail-closed: empty owner allowlist + no invite RPC
 * (Core `invite_organization_user` is a non-operational stub; email delivery
 * is not connected from Platform).
 */

import {
  extractEmailDomain,
  isValidEmailFormat,
  normalizeEmail,
} from "@/lib/aipify-domain-ownership";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECRET_REASON =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

/** Allowed roles for a new-org Platform admin attach (Core organization_users). */
export const PLATFORM_ADMIN_PROVISION_ROLES = [
  "owner",
  "administrator",
] as const;

export type PlatformAdminProvisionRole =
  (typeof PLATFORM_ADMIN_PROVISION_ROLES)[number];

/**
 * Empty by design — no Production invite/attach until a named owner approval
 * job adds a customer id AND a real invite/accept Core contract is wired.
 */
export const ADMIN_PROVISION_OWNER_ALLOWLIST: ReadonlySet<string> = new Set();

export function isAdminProvisionOwnerAuthorized(customerId: string): boolean {
  return ADMIN_PROVISION_OWNER_ALLOWLIST.has(customerId);
}

/** Live invite delivery is not connected — execute must never pretend otherwise. */
export const ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED = false;

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

export type PlatformAdminProvisionErrorCode =
  | "invalid_customer"
  | "invalid_email"
  | "invalid_role"
  | "invalid_internal_reason"
  | "confirmation_required"
  | "invalid_idempotency_key"
  | "customer_not_found"
  | "tenant_inactive"
  | "owner_provision_authorization_required"
  | "invite_delivery_not_connected"
  | "unauthorized"
  | "forbidden"
  | "unknown";

export type PlatformAdminProvisionPrerequisite = {
  code: string;
  satisfied: boolean;
};

export type PlatformAdminProvisionReadiness = {
  customerId: string;
  organizationId: string;
  slug: string | null;
  companyName: string | null;
  contactEmail: string | null;
  memberCount: number;
  customerStatus: string | null;
  hasActiveMembers: boolean;
  readyForAdminPrepare: boolean;
  prerequisites: PlatformAdminProvisionPrerequisite[];
  notes: {
    createCustomerDoesNotAttachAdmin: boolean;
    inviteOrganizationUserIsStub: boolean;
    membershipDoesNotGrantBedrift: boolean;
    existingEmailRequiresExplicitAccept: boolean;
    noAutoLinkAcrossTenants: boolean;
  };
  executeAuthorized: boolean;
  inviteDeliveryConnected: boolean;
};

export type PlatformAdminProvisionPlan = {
  mode: "prepare";
  dryRun: true;
  customerId: string;
  organizationId: string;
  slug: string | null;
  companyName: string | null;
  adminEmail: string;
  emailDomain: string | null;
  role: PlatformAdminProvisionRole;
  membershipStatusIfExecuted: "invited";
  authIdentity: "existing_requires_explicit_accept" | "new_requires_owner_create";
  authProbe: "not_run";
  sideEffects: {
    createsAuthUser: false;
    sendsEmail: false;
    writesMembership: false;
    grantsKompisBedrift: false;
    mutatesUnoNight: false;
  };
  idempotencyKey: string;
  internalReason: string;
  executeBlockedReasons: string[];
  ownerApprovalRequired: true;
  rollbackNotes: string[];
};

export type PlatformAdminProvisionLabels = {
  title: string;
  sectionTitle: string;
  sourceNote: string;
  readinessTitle: string;
  planTitle: string;
  customerId: string;
  organizationId: string;
  slug: string;
  companyName: string;
  contactEmail: string;
  memberCount: string;
  customerStatus: string;
  adminEmail: string;
  role: string;
  roleOwner: string;
  roleAdministrator: string;
  internalReason: string;
  prepareAction: string;
  prepareRunning: string;
  executeLockedTitle: string;
  executeLockedBody: string;
  executeUnavailable: string;
  deliveryNotConnected: string;
  noBedriftFromMembership: string;
  existingEmailAcceptNote: string;
  loading: string;
  error: string;
  unauthorized: string;
  forbidden: string;
  retry: string;
  notConfigured: string;
  ready: string;
  notReady: string;
  prerequisites: string;
  planReady: string;
  sideEffectsNone: string;
  ownerApprovalChecklistTitle: string;
  checklistNamedCustomer: string;
  checklistInviteContract: string;
  checklistExplicitAccept: string;
  checklistNoBedriftGrant: string;
  checklistAuditIdempotency: string;
  prerequisiteLabels: Record<string, string>;
};

export function createAdminProvisionIdempotencyKey(): string {
  const suffix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `apk-${suffix}`;
}

export function parseAdminProvisionPrepareInput(
  customerId: string,
  body: unknown,
):
  | {
      ok: true;
      value: {
        customerId: string;
        adminEmail: string;
        role: PlatformAdminProvisionRole;
        internalReason: string;
        confirmation: boolean;
        idempotencyKey: string;
        mode: "prepare" | "execute";
      };
    }
  | { ok: false; code: PlatformAdminProvisionErrorCode } {
  if (!UUID.test(customerId)) return { ok: false, code: "invalid_customer" };
  const value = record(body);
  const adminEmailRaw = text(value?.adminEmail ?? value?.admin_email);
  const roleRaw = text(value?.role)?.toLowerCase();
  const internalReason = text(value?.internalReason ?? value?.internal_reason);
  const idempotencyKey = text(value?.idempotencyKey ?? value?.idempotency_key);
  const modeRaw = (text(value?.mode) ?? "prepare").toLowerCase();
  const mode = modeRaw === "execute" ? "execute" : "prepare";

  if (!adminEmailRaw || !isValidEmailFormat(adminEmailRaw)) {
    return { ok: false, code: "invalid_email" };
  }
  if (
    !roleRaw ||
    !(PLATFORM_ADMIN_PROVISION_ROLES as readonly string[]).includes(roleRaw)
  ) {
    return { ok: false, code: "invalid_role" };
  }
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
    !idempotencyKey.startsWith("apk-")
  ) {
    return { ok: false, code: "invalid_idempotency_key" };
  }

  return {
    ok: true,
    value: {
      customerId,
      adminEmail: normalizeEmail(adminEmailRaw),
      role: roleRaw as PlatformAdminProvisionRole,
      internalReason,
      confirmation: true,
      idempotencyKey,
      mode,
    },
  };
}

export function buildAdminProvisionReadiness(input: {
  customerId: string;
  organizationId: string;
  slug: string | null;
  companyName: string | null;
  contactEmail: string | null;
  memberCount: number;
  customerStatus: string | null;
}): PlatformAdminProvisionReadiness {
  const status = (input.customerStatus ?? "").toLowerCase();
  const inactive =
    status === "disabled" ||
    status === "suspended" ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "removed";
  const hasActiveMembers = input.memberCount > 0;
  const prerequisites: PlatformAdminProvisionPrerequisite[] = [
    {
      code: "customer_present",
      satisfied: UUID.test(input.customerId),
    },
    {
      code: "organization_synced",
      satisfied: UUID.test(input.organizationId),
    },
    {
      code: "tenant_not_inactive",
      satisfied: !inactive,
    },
    {
      code: "invite_delivery_contract",
      satisfied: ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
    },
    {
      code: "owner_execute_authorization",
      satisfied: isAdminProvisionOwnerAuthorized(input.customerId),
    },
  ];

  return {
    customerId: input.customerId,
    organizationId: input.organizationId,
    slug: input.slug,
    companyName: input.companyName,
    contactEmail: input.contactEmail,
    memberCount: input.memberCount,
    customerStatus: input.customerStatus,
    hasActiveMembers,
    readyForAdminPrepare: !inactive && UUID.test(input.customerId),
    prerequisites,
    notes: {
      createCustomerDoesNotAttachAdmin: true,
      inviteOrganizationUserIsStub: true,
      membershipDoesNotGrantBedrift: true,
      existingEmailRequiresExplicitAccept: true,
      noAutoLinkAcrossTenants: true,
    },
    executeAuthorized: isAdminProvisionOwnerAuthorized(input.customerId),
    inviteDeliveryConnected: ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED,
  };
}

export function buildAdminProvisionPlan(input: {
  readiness: PlatformAdminProvisionReadiness;
  adminEmail: string;
  role: PlatformAdminProvisionRole;
  internalReason: string;
  idempotencyKey: string;
}): PlatformAdminProvisionPlan {
  const executeBlockedReasons: string[] = [];
  if (!isAdminProvisionOwnerAuthorized(input.readiness.customerId)) {
    executeBlockedReasons.push("owner_provision_authorization_required");
  }
  if (!ADMIN_PROVISION_INVITE_DELIVERY_CONNECTED) {
    executeBlockedReasons.push("invite_delivery_not_connected");
  }
  if (!input.readiness.readyForAdminPrepare) {
    executeBlockedReasons.push("tenant_inactive");
  }

  return {
    mode: "prepare",
    dryRun: true,
    customerId: input.readiness.customerId,
    organizationId: input.readiness.organizationId,
    slug: input.readiness.slug,
    companyName: input.readiness.companyName,
    adminEmail: normalizeEmail(input.adminEmail),
    emailDomain: extractEmailDomain(input.adminEmail),
    role: input.role,
    membershipStatusIfExecuted: "invited",
    authIdentity: "existing_requires_explicit_accept",
    authProbe: "not_run",
    sideEffects: {
      createsAuthUser: false,
      sendsEmail: false,
      writesMembership: false,
      grantsKompisBedrift: false,
      mutatesUnoNight: false,
    },
    idempotencyKey: input.idempotencyKey,
    internalReason: input.internalReason,
    executeBlockedReasons,
    ownerApprovalRequired: true,
    rollbackNotes: [
      "prepare_is_read_only_no_rollback_required",
      "execute_must_use_idempotency_and_audit_before_any_write",
      "never_delete_auth_users_on_retry",
      "revoke_pending_invite_only_via_named_compensation_job",
    ],
  };
}

export function mapAdminProvisionError(
  code: PlatformAdminProvisionErrorCode,
): { status: number; code: PlatformAdminProvisionErrorCode } {
  switch (code) {
    case "invalid_customer":
    case "invalid_email":
    case "invalid_role":
    case "invalid_internal_reason":
    case "confirmation_required":
    case "invalid_idempotency_key":
      return { status: 400, code };
    case "unauthorized":
      return { status: 401, code };
    case "forbidden":
    case "owner_provision_authorization_required":
    case "invite_delivery_not_connected":
      return { status: 403, code };
    case "customer_not_found":
      return { status: 404, code };
    case "tenant_inactive":
      return { status: 422, code };
    default:
      return { status: 500, code: "unknown" };
  }
}

export function mapAdminProvisionRpcError(
  message: string | null | undefined,
): { status: number; code: PlatformAdminProvisionErrorCode } {
  const raw = (message ?? "").toUpperCase();
  if (raw.includes("ACCESS DENIED") || raw.includes("PLATFORM ADMIN")) {
    return { status: 403, code: "forbidden" };
  }
  if (raw.includes("CUSTOMER_NOT_FOUND") || raw.includes("NOT FOUND")) {
    return { status: 404, code: "customer_not_found" };
  }
  return { status: 500, code: "unknown" };
}

export function parseMemberCountFromDetail(value: unknown): number {
  const row = record(value);
  const usage = record(row?.usage) ?? row;
  const raw = usage?.member_count ?? usage?.memberCount;
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

export function parseCustomerStatusFromDetail(value: unknown): string | null {
  const row = record(value);
  const customer = record(row?.customer) ?? row;
  return text(customer?.status);
}

export function adminProvisionPrerequisiteLabel(
  code: string,
  labels: Record<string, string>,
  satisfied: boolean,
): string {
  const key = satisfied ? `${code}Ok` : `${code}Missing`;
  return labels[key] ?? labels[code] ?? code;
}

export function assertNoHardcodedProductionAdminEmail(source: string): boolean {
  return !/admin@aipify\.tech/i.test(source);
}

export function boolFlag(value: unknown): boolean {
  return bool(value);
}
