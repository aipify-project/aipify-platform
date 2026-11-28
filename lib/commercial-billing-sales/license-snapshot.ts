/**
 * A. Sales Partner license snapshot / read contract.
 * Builds SalesPartnerLicenseSnapshot from Core-shaped rows, fail-closed.
 * Reuses the #532 foundation (capacity, access, isolation, notification) — never duplicates it.
 * APP thin read helper: no purchase UI, no CTA, RPC missing => closed.
 */

import {
  buildCapacityLimitReachedNotification,
  decideSellerSeatActivation,
  freeAipifyPartnerAccessContract,
  isSeatCapacityConfigured,
  resolveCommercialLicenseOperationalAccess,
  type SalesPartnerLicenseSnapshot,
  type SalesPartnerLicenseSource,
  type SalesPartnerLicenseStatus,
  type SalesPartnerMembershipRef,
  type SalesPartnerProgramKind,
  type SeatActivationDecision,
} from "@/lib/sales-partner-commercial-license";
import { callCspRpc, type CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";
import { SALES_PARTNER_LICENSE_SNAPSHOT_RPC } from "./contract";

type CapacityLimitNotificationPayload = NonNullable<
  ReturnType<typeof buildCapacityLimitReachedNotification>
>;

const STATUSES: readonly SalesPartnerLicenseStatus[] = [
  "active",
  "grace_period",
  "expired",
  "missing",
  "suspended",
  "internal_system",
];
const SOURCES: readonly SalesPartnerLicenseSource[] = ["paid_subscription", "internal_system", "none"];
const KINDS: readonly SalesPartnerProgramKind[] = ["aipify_certified_free", "tenant_commercial"];

/** Core row shape (snake_case) as returned by get_sales_partner_program_license_snapshot. */
export type CoreSalesPartnerLicenseRow = {
  program_id?: unknown;
  owner_tenant_id?: unknown;
  kind?: unknown;
  status?: unknown;
  source?: unknown;
  license_level_key?: unknown;
  max_active_sellers?: unknown;
  active_seller_count?: unknown;
  expires_at?: unknown;
};

export type LicenseSnapshotBuildResult =
  | { ok: true; snapshot: SalesPartnerLicenseSnapshot }
  | {
      ok: false;
      reason:
        | "row_invalid"
        | "program_id_required"
        | "owner_tenant_required"
        | "kind_invalid"
        | "status_invalid"
        | "source_invalid"
        | "max_active_sellers_invalid"
        | "active_seller_count_invalid"
        | "expires_at_invalid";
    };

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

/**
 * A paid license whose expiry passed is `expired` regardless of the stored status
 * (guards against a stale row). Internal-system licenses never expire.
 */
export function resolveEffectiveLicenseStatus(
  status: SalesPartnerLicenseStatus,
  expiresAt: string | null,
  now: Date,
): SalesPartnerLicenseStatus {
  if (status === "internal_system" || status === "missing" || status === "suspended") return status;
  if (status === "expired") return status;
  if (expiresAt == null) return status;
  const exp = new Date(expiresAt).getTime();
  if (Number.isNaN(exp)) return "expired";
  return exp <= now.getTime() ? "expired" : status;
}

export function buildSalesPartnerLicenseSnapshotFromCoreRow(
  row: CoreSalesPartnerLicenseRow | null | undefined,
  now: Date = new Date(),
): LicenseSnapshotBuildResult {
  if (!row || typeof row !== "object" || Array.isArray(row)) return { ok: false, reason: "row_invalid" };
  const programId = str(row.program_id);
  if (!programId) return { ok: false, reason: "program_id_required" };
  const ownerTenantId = str(row.owner_tenant_id);
  if (!ownerTenantId) return { ok: false, reason: "owner_tenant_required" };
  const kind = str(row.kind) as SalesPartnerProgramKind | null;
  if (!kind || !KINDS.includes(kind)) return { ok: false, reason: "kind_invalid" };
  const status = str(row.status) as SalesPartnerLicenseStatus | null;
  if (!status || !STATUSES.includes(status)) return { ok: false, reason: "status_invalid" };
  const source = str(row.source) as SalesPartnerLicenseSource | null;
  if (!source || !SOURCES.includes(source)) return { ok: false, reason: "source_invalid" };

  // null = not configured; explicit 0 = zero seats. Strings / negatives / floats are invalid.
  let max: number | null = null;
  if (row.max_active_sellers != null) {
    if (
      typeof row.max_active_sellers !== "number" ||
      !Number.isInteger(row.max_active_sellers) ||
      row.max_active_sellers < 0
    ) {
      return { ok: false, reason: "max_active_sellers_invalid" };
    }
    max = row.max_active_sellers;
  }

  const count = row.active_seller_count ?? 0;
  if (typeof count !== "number" || !Number.isInteger(count) || count < 0) {
    return { ok: false, reason: "active_seller_count_invalid" };
  }

  let expiresAt: string | null = null;
  if (row.expires_at != null) {
    const iso = str(row.expires_at);
    if (!iso || Number.isNaN(new Date(iso).getTime())) return { ok: false, reason: "expires_at_invalid" };
    expiresAt = new Date(iso).toISOString();
  }

  return {
    ok: true,
    snapshot: {
      program: { programId, ownerTenantId, kind },
      status: resolveEffectiveLicenseStatus(status, expiresAt, now),
      source,
      licenseLevelKey: str(row.license_level_key),
      maxActiveSellers: max,
      activeSellerCount: count,
      expiresAt,
    },
  };
}

export type LicenseSnapshotListResult = {
  snapshots: SalesPartnerLicenseSnapshot[];
  rejected: Array<{ index: number; reason: string }>;
};

/**
 * Build snapshots for ONE owner tenant. Rows from other tenants are dropped (tenant isolation) —
 * never returned and never counted.
 */
export function buildSnapshotsForOwnerTenant(
  rows: readonly CoreSalesPartnerLicenseRow[],
  ownerTenantId: string,
  now: Date = new Date(),
): LicenseSnapshotListResult {
  const snapshots: SalesPartnerLicenseSnapshot[] = [];
  const rejected: Array<{ index: number; reason: string }> = [];
  rows.forEach((row, index) => {
    const built = buildSalesPartnerLicenseSnapshotFromCoreRow(row, now);
    if (!built.ok) {
      rejected.push({ index, reason: built.reason });
      return;
    }
    if (built.snapshot.program.ownerTenantId !== ownerTenantId) {
      rejected.push({ index, reason: "cross_tenant_forbidden" });
      return;
    }
    snapshots.push(built.snapshot);
  });
  return { snapshots, rejected };
}

/** A seller may belong to many programs (multi-program membership); each stays program-scoped. */
export function listSellerProgramAccess(input: {
  snapshots: readonly SalesPartnerLicenseSnapshot[];
  memberships: readonly SalesPartnerMembershipRef[];
  sellerUserId: string;
}): Array<{
  programId: string;
  ownerTenantId: string;
  role: SalesPartnerMembershipRef["role"];
  mayOperate: boolean;
  failClosedReason: string | null;
}> {
  const out: ReturnType<typeof listSellerProgramAccess> = [];
  for (const m of input.memberships) {
    if (m.sellerUserId !== input.sellerUserId || m.status !== "active") continue;
    const snap = input.snapshots.find((s) => s.program.programId === m.programId);
    if (!snap) continue; // membership without a readable license is never operational
    const access = resolveCommercialLicenseOperationalAccess(snap);
    out.push({
      programId: m.programId,
      ownerTenantId: snap.program.ownerTenantId,
      role: m.role,
      mayOperate: access.mayOperateProgram,
      failClosedReason: access.failClosedReason,
    });
  }
  return out;
}

/**
 * Unified authorization.
 *  - Free Aipify Partner: partner_identity only; NEVER requires a paid license.
 *  - Tenant commercial: license snapshot must permit operation + caller is the owner tenant.
 */
export type SalesPartnerAccessInput =
  | {
      kind: "aipify_certified_free";
      /** csp_partner_profiles.status — same input as userHasCspPartnerAccess. */
      cspPartnerStatus: string | null | undefined;
    }
  | {
      kind: "tenant_commercial";
      callerTenantId: string;
      license: SalesPartnerLicenseSnapshot | null;
    };

export type SalesPartnerAccessDecision =
  | { allowed: true; basis: "partner_identity" | "commercial_license" }
  | {
      allowed: false;
      reason:
        | "partner_status_not_allowed"
        | "license_snapshot_missing"
        | "cross_tenant_forbidden"
        | "program_kind_mismatch"
        | string;
    };

export function authorizeSalesPartnerOperation(input: SalesPartnerAccessInput): SalesPartnerAccessDecision {
  if (input.kind === "aipify_certified_free") {
    const allowed = freeAipifyPartnerAccessContract().preservedStatuses;
    const status = typeof input.cspPartnerStatus === "string" ? input.cspPartnerStatus : null;
    return status && allowed.includes(status)
      ? { allowed: true, basis: "partner_identity" }
      : { allowed: false, reason: "partner_status_not_allowed" };
  }
  if (!input.license) return { allowed: false, reason: "license_snapshot_missing" };
  if (!input.callerTenantId || input.license.program.ownerTenantId !== input.callerTenantId) {
    return { allowed: false, reason: "cross_tenant_forbidden" };
  }
  const access = resolveCommercialLicenseOperationalAccess(input.license);
  return access.mayOperateProgram
    ? { allowed: true, basis: "commercial_license" }
    : { allowed: false, reason: access.failClosedReason ?? "license_not_operational" };
}

export type LicenseCapacityView = {
  programId: string;
  maxActiveSellers: number | null;
  activeSellerCount: number;
  seatsRemaining: number | null;
  capacityConfigured: boolean;
  capacityReached: boolean;
  notification: CapacityLimitNotificationPayload | null;
};

export function buildLicenseCapacityView(snapshot: SalesPartnerLicenseSnapshot): LicenseCapacityView {
  const configured = isSeatCapacityConfigured(snapshot.maxActiveSellers);
  const remaining = configured
    ? Math.max(0, (snapshot.maxActiveSellers as number) - snapshot.activeSellerCount)
    : null;
  const notification = buildCapacityLimitReachedNotification(snapshot);
  return {
    programId: snapshot.program.programId,
    maxActiveSellers: snapshot.maxActiveSellers,
    activeSellerCount: snapshot.activeSellerCount,
    seatsRemaining: remaining,
    capacityConfigured: configured,
    capacityReached: notification != null,
    notification,
  };
}

/** Re-export of the foundation seat decision so callers use ONE capacity implementation. */
export function decideSeatActivationForOwner(input: {
  license: SalesPartnerLicenseSnapshot;
  membership: SalesPartnerMembershipRef | null;
  callerOwnerTenantId: string;
}): SeatActivationDecision {
  return decideSellerSeatActivation(input);
}

// ---------------------------------------------------------------------------
// APP thin read helper — fail-closed when RPC missing. No purchase UI, no CTA.
// ---------------------------------------------------------------------------

export type SalesPartnerLicenseReadResult =
  | {
      ready: true;
      ownerTenantId: string;
      snapshots: SalesPartnerLicenseSnapshot[];
      rejected: Array<{ index: number; reason: string }>;
      purchaseCtaAllowed: false;
    }
  | {
      ready: false;
      failClosed: true;
      reason:
        | "tenant_required"
        | "rpc_missing"
        | "csp_backend_not_applied"
        | "rpc_error"
        | "forbidden"
        | "unauthorized"
        | "payload_invalid"
        | "cross_tenant_forbidden"
        | string;
      purchaseCtaAllowed: false;
    };

function closed(reason: string): SalesPartnerLicenseReadResult {
  return { ready: false, failClosed: true, reason, purchaseCtaAllowed: false };
}

export async function readSalesPartnerLicenseSnapshots(
  client: CspRpcClient,
  input: { organizationId: string | null | undefined; now?: Date },
): Promise<SalesPartnerLicenseReadResult> {
  const orgId = str(input.organizationId);
  if (!orgId) return closed("tenant_required");

  // RPC (PREPARED_ONLY candidate): get_sales_partner_program_license_snapshot(p_owner_tenant_id uuid)
  // returns ONE flat tenant_commercial program row. Missing RPC => fail-closed.
  const result = await callCspRpc<unknown>(client, SALES_PARTNER_LICENSE_SNAPSHOT_RPC, {
    p_owner_tenant_id: orgId,
  });
  if (!result.ready) return closed(result.error);

  const data = result.data;
  if (!data || typeof data !== "object" || Array.isArray(data)) return closed("payload_invalid");
  const payload = data as Record<string, unknown>;
  if (payload.ok !== true) return closed(typeof payload.error === "string" ? payload.error : "payload_invalid");
  // The server answers for exactly the requested tenant; anything else is a cross-tenant leak.
  if (str(payload.owner_tenant_id) !== orgId) return closed("cross_tenant_forbidden");

  const row: CoreSalesPartnerLicenseRow = {
    ...payload,
    kind: payload.kind ?? payload.program_kind,
  };
  const built = buildSnapshotsForOwnerTenant([row], orgId, input.now ?? new Date());
  if (built.snapshots.length === 0) return closed(built.rejected[0]?.reason ?? "payload_invalid");
  return {
    ready: true,
    ownerTenantId: orgId,
    snapshots: built.snapshots,
    rejected: built.rejected,
    purchaseCtaAllowed: false,
  };
}
