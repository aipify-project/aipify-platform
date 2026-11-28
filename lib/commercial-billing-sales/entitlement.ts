/**
 * B. Product-agnostic entitlement / license model — pure, server-side authorization helpers.
 *
 * Contract for Agent 2 (APP purchase surfaces):
 *   - Catalog browse NEVER requires a license or entitlement.
 *   - Operating a product requires an ACTIVE entitlement for the caller's tenant (and its dependencies).
 *   - Absence of an entitlement record is NOT free access. Free access is an explicit record.
 *   - Paused / grace / expired tenants may always reach billing + recovery.
 */

import { COMMERCIAL_PAYMENT_GRACE_DAYS } from "./contract";

export type EntitlementState =
  | "pending_payment"
  | "active"
  | "grace_period"
  | "cancel_scheduled"
  | "canceled"
  | "expired"
  | "suspended"
  | "revoked";

export type EntitlementSource = "paid" | "free_access" | "internal_system";

export type EntitlementInterval = "month" | "year" | "one_time" | "free";

export type EntitlementRecord = {
  entitlementId: string;
  tenantId: string;
  productKey: string;
  variantKey: string | null;
  interval: EntitlementInterval;
  state: EntitlementState;
  source: EntitlementSource;
  /** ISO. Required for paid recurring entitlements. */
  validFrom: string | null;
  /** ISO. null only for one_time / free_access / internal_system (non-expiring by policy). */
  validUntil: string | null;
  /** ISO. End of payment grace — only meaningful when state === grace_period. */
  graceUntil: string | null;
};

export type EffectiveEntitlementState =
  | EntitlementState
  | "invalid_validity";

export type EffectiveEntitlement = {
  state: EffectiveEntitlementState;
  /** May use existing capability (read + operate). */
  mayOperate: boolean;
  /** May add new capacity (seats, new activations, upgrades that consume). */
  mayExpand: boolean;
  reason: string | null;
};

export function entitlementKey(tenantId: string, productKey: string): string {
  return `${tenantId}::${productKey}`;
}

function ms(iso: string | null): number | null {
  if (iso == null) return null;
  const t = new Date(iso).getTime();
  return Number.isNaN(t) ? null : t;
}

export function computeGraceUntil(validUntilIso: string, graceDays: number = COMMERCIAL_PAYMENT_GRACE_DAYS): string {
  return new Date(new Date(validUntilIso).getTime() + graceDays * 24 * 60 * 60 * 1000).toISOString();
}

/** Non-expiring by policy: lifetime one-time, explicit free access, internal system. */
function mayLackValidUntil(r: EntitlementRecord): boolean {
  return r.source !== "paid" || r.interval === "one_time";
}

/**
 * Resolve the effective state at `now`. Time always wins over stored state:
 * a stored `active` past its validity becomes grace_period (if grace set) or expired.
 */
export function resolveEffectiveEntitlement(
  record: EntitlementRecord | null | undefined,
  now: Date,
): EffectiveEntitlement {
  if (!record) {
    return { state: "expired", mayOperate: false, mayExpand: false, reason: "entitlement_missing" };
  }
  const nowMs = now.getTime();
  const until = ms(record.validUntil);
  const from = ms(record.validFrom);

  if (record.validUntil != null && until == null) {
    return { state: "invalid_validity", mayOperate: false, mayExpand: false, reason: "valid_until_invalid" };
  }
  if (record.validFrom != null && from == null) {
    return { state: "invalid_validity", mayOperate: false, mayExpand: false, reason: "valid_from_invalid" };
  }

  switch (record.state) {
    case "pending_payment":
      return { state: "pending_payment", mayOperate: false, mayExpand: false, reason: "payment_not_confirmed" };
    case "suspended":
      return { state: "suspended", mayOperate: false, mayExpand: false, reason: "entitlement_suspended" };
    case "revoked":
      return { state: "revoked", mayOperate: false, mayExpand: false, reason: "entitlement_revoked" };
    case "canceled":
      return { state: "canceled", mayOperate: false, mayExpand: false, reason: "subscription_canceled" };
    case "expired":
      return { state: "expired", mayOperate: false, mayExpand: false, reason: "entitlement_expired" };
    default:
      break;
  }

  if (until == null && !mayLackValidUntil(record)) {
    return { state: "invalid_validity", mayOperate: false, mayExpand: false, reason: "valid_until_required" };
  }
  if (from != null && nowMs < from) {
    return { state: "pending_payment", mayOperate: false, mayExpand: false, reason: "not_yet_valid" };
  }

  const inPeriod = until == null || nowMs < until;

  if (record.state === "grace_period") {
    const grace = ms(record.graceUntil);
    if (grace != null && nowMs < grace) {
      return { state: "grace_period", mayOperate: true, mayExpand: false, reason: "payment_recovery_window" };
    }
    return { state: "expired", mayOperate: false, mayExpand: false, reason: "grace_elapsed" };
  }

  if (record.state === "cancel_scheduled") {
    return inPeriod
      ? { state: "cancel_scheduled", mayOperate: true, mayExpand: false, reason: "ends_at_period_end" }
      : { state: "expired", mayOperate: false, mayExpand: false, reason: "entitlement_expired" };
  }

  // active
  if (inPeriod) return { state: "active", mayOperate: true, mayExpand: true, reason: null };
  const grace = ms(record.graceUntil);
  if (grace != null && nowMs < grace) {
    return { state: "grace_period", mayOperate: true, mayExpand: false, reason: "payment_recovery_window" };
  }
  return { state: "expired", mayOperate: false, mayExpand: false, reason: "entitlement_expired" };
}

export type ProductOperation =
  | "browse_catalog"
  | "operate"
  | "expand_capacity"
  | "manage_billing";

export type EntitlementAuthorization =
  | { allowed: true; reason: "catalog_browse_open" | "billing_recovery_open" | "entitled" }
  | {
      allowed: false;
      reason:
        | "tenant_required"
        | "cross_tenant_forbidden"
        | "entitlement_missing"
        | "entitlement_not_operational"
        | "expansion_blocked"
        | "dependency_missing"
        | "dependency_not_operational";
      detail: string | null;
    };

/** Dependencies are product keys that must also be operational for the same tenant. */
export function authorizeProductOperation(input: {
  callerTenantId: string | null | undefined;
  operation: ProductOperation;
  productKey: string;
  entitlements: readonly EntitlementRecord[];
  /** productKey -> required product keys (resolved server-side from catalog/module binding). */
  dependencies?: Readonly<Record<string, readonly string[]>>;
  now: Date;
}): EntitlementAuthorization {
  if (input.operation === "browse_catalog") {
    return { allowed: true, reason: "catalog_browse_open" };
  }
  const tenant = typeof input.callerTenantId === "string" ? input.callerTenantId.trim() : "";
  if (!tenant) return { allowed: false, reason: "tenant_required", detail: null };

  // Billing / recovery remains reachable for any identified tenant (License Center philosophy).
  if (input.operation === "manage_billing") {
    return { allowed: true, reason: "billing_recovery_open" };
  }

  // Tenant isolation: only consider the caller's records; foreign records are a hard error if targeted.
  const foreign = input.entitlements.find(
    (e) => e.productKey === input.productKey && e.tenantId !== tenant,
  );
  const own = input.entitlements.filter((e) => e.tenantId === tenant && e.productKey === input.productKey);
  if (own.length === 0) {
    return foreign
      ? { allowed: false, reason: "cross_tenant_forbidden", detail: input.productKey }
      : { allowed: false, reason: "entitlement_missing", detail: input.productKey };
  }

  const effective = pickBestEffective(own, input.now);
  if (!effective.mayOperate) {
    return { allowed: false, reason: "entitlement_not_operational", detail: effective.reason };
  }
  if (input.operation === "expand_capacity" && !effective.mayExpand) {
    return { allowed: false, reason: "expansion_blocked", detail: effective.state };
  }

  for (const dep of input.dependencies?.[input.productKey] ?? []) {
    const depOwn = input.entitlements.filter((e) => e.tenantId === tenant && e.productKey === dep);
    if (depOwn.length === 0) return { allowed: false, reason: "dependency_missing", detail: dep };
    if (!pickBestEffective(depOwn, input.now).mayOperate) {
      return { allowed: false, reason: "dependency_not_operational", detail: dep };
    }
  }
  return { allowed: true, reason: "entitled" };
}

function pickBestEffective(records: readonly EntitlementRecord[], now: Date): EffectiveEntitlement {
  let best: EffectiveEntitlement | null = null;
  for (const r of records) {
    const eff = resolveEffectiveEntitlement(r, now);
    if (!best) best = eff;
    else if (eff.mayExpand && !best.mayExpand) best = eff;
    else if (eff.mayOperate && !best.mayOperate) best = eff;
  }
  return best ?? { state: "expired", mayOperate: false, mayExpand: false, reason: "entitlement_missing" };
}

/** Explicit free access record — only way a tenant may operate a free product without payment. */
export function buildFreeAccessEntitlement(input: {
  tenantId: string;
  productKey: string;
  variantKey?: string | null;
  grantedAt: string;
}): EntitlementRecord {
  return {
    entitlementId: entitlementKey(input.tenantId, input.productKey),
    tenantId: input.tenantId,
    productKey: input.productKey,
    variantKey: input.variantKey ?? null,
    interval: "free",
    state: "active",
    source: "free_access",
    validFrom: input.grantedAt,
    validUntil: null,
    graceUntil: null,
  };
}

/**
 * Dependency graph sanity — rejects cycles so authorization can never loop or silently allow.
 */
export function detectDependencyCycle(deps: Readonly<Record<string, readonly string[]>>): string[] | null {
  const visiting = new Set<string>();
  const done = new Set<string>();
  const path: string[] = [];
  const visit = (k: string): string[] | null => {
    if (done.has(k)) return null;
    if (visiting.has(k)) return [...path.slice(path.indexOf(k)), k];
    visiting.add(k);
    path.push(k);
    for (const d of deps[k] ?? []) {
      const c = visit(d);
      if (c) return c;
    }
    path.pop();
    visiting.delete(k);
    done.add(k);
    return null;
  };
  for (const k of Object.keys(deps)) {
    const c = visit(k);
    if (c) return c;
  }
  return null;
}
