/**
 * Server-oriented seat capacity validation (pure functions).
 * Atomic activation semantics: compare activeCount + 1 against max before allowing activate.
 * null max = not configured (fail-closed for commercial). Explicit 0 = zero seats.
 */

import { resolveCommercialLicenseOperationalAccess } from "./access";
import type {
  SalesPartnerLicenseLevelConfig,
  SalesPartnerLicenseSnapshot,
  SalesPartnerMembershipRef,
  SeatActivationDecision,
} from "./types";

/** True when a level has an explicit configured seat cap (including 0). */
export function isSeatCapacityConfigured(
  maxActiveSellers: number | null | undefined,
): maxActiveSellers is number {
  return maxActiveSellers != null && Number.isFinite(maxActiveSellers) && maxActiveSellers >= 0;
}

export function normalizeLicenseLevelConfig(
  input: Partial<SalesPartnerLicenseLevelConfig> & { licenseLevelKey: string },
): SalesPartnerLicenseLevelConfig | { ok: false; error: string } {
  const key = input.licenseLevelKey.trim();
  if (!key) return { ok: false, error: "license_level_key_required" };
  const max = input.maxActiveSellers;
  if (max != null) {
    if (!Number.isFinite(max) || max < 0 || !Number.isInteger(max)) {
      return { ok: false, error: "invalid_max_active_sellers" };
    }
  }
  // Never invent a default seat cap or price.
  return {
    licenseLevelKey: key,
    label: typeof input.label === "string" && input.label.trim() ? input.label.trim() : key,
    maxActiveSellers: max == null ? null : max,
    currency:
      typeof input.currency === "string" && input.currency.trim()
        ? input.currency.trim().toUpperCase()
        : null,
    priceAmountMajor:
      input.priceAmountMajor != null && Number.isFinite(input.priceAmountMajor)
        ? Number(input.priceAmountMajor)
        : null,
  };
}

/**
 * Decide whether a seller seat may be activated under the current license snapshot.
 * Intended for Core RPC compare-and-set; this pure check is the contract for concurrency.
 */
export function decideSellerSeatActivation(input: {
  license: SalesPartnerLicenseSnapshot;
  membership: SalesPartnerMembershipRef | null;
  /** Expected owner tenant — reject cross-tenant attempts. */
  callerOwnerTenantId: string;
}): SeatActivationDecision {
  const { license, membership, callerOwnerTenantId } = input;

  if (license.program.ownerTenantId !== callerOwnerTenantId) {
    return { ok: false, reason: "cross_tenant_forbidden" };
  }

  if (license.program.kind !== "tenant_commercial") {
    // Free Aipify program is not gated by commercial seat capacity.
    return { ok: false, reason: "program_kind_mismatch" };
  }

  const access = resolveCommercialLicenseOperationalAccess(license);
  if (!access.mayActivateSellerSeat) {
    if (license.status === "missing") return { ok: false, reason: "license_missing" };
    if (license.status === "expired") return { ok: false, reason: "license_expired" };
    if (license.status === "suspended") return { ok: false, reason: "license_suspended" };
    if (license.status === "grace_period") {
      return { ok: false, reason: "license_paused_grace_blocks_activation" };
    }
    return { ok: false, reason: "license_missing" };
  }

  if (membership?.status === "active" && membership.programId === license.program.programId) {
    return { ok: false, reason: "seller_already_active" };
  }

  if (!isSeatCapacityConfigured(license.maxActiveSellers)) {
    return { ok: false, reason: "capacity_not_configured" };
  }

  const next = license.activeSellerCount + 1;
  if (next > license.maxActiveSellers) {
    return { ok: false, reason: "capacity_exhausted" };
  }

  return {
    ok: true,
    action: "activate",
    nextActiveCount: next,
    maxActiveSellers: license.maxActiveSellers,
    capacityReachedAfter: next === license.maxActiveSellers,
  };
}

/**
 * Concurrent race helper: two activations against the same snapshot — only one may win
 * when only one seat remains.
 */
export function simulateConcurrentSeatActivations(input: {
  license: SalesPartnerLicenseSnapshot;
  callerOwnerTenantId: string;
  attempts: number;
}): { accepted: number; rejected: number; finalActiveCount: number } {
  let active = input.license.activeSellerCount;
  let accepted = 0;
  let rejected = 0;
  for (let i = 0; i < input.attempts; i += 1) {
    const decision = decideSellerSeatActivation({
      license: { ...input.license, activeSellerCount: active },
      membership: null,
      callerOwnerTenantId: input.callerOwnerTenantId,
    });
    if (decision.ok) {
      accepted += 1;
      active = decision.nextActiveCount;
    } else {
      rejected += 1;
    }
  }
  return { accepted, rejected, finalActiveCount: active };
}

export function isCapacityLimitReached(snapshot: SalesPartnerLicenseSnapshot): boolean {
  if (!isSeatCapacityConfigured(snapshot.maxActiveSellers)) return false;
  return snapshot.activeSellerCount >= snapshot.maxActiveSellers;
}
