/**
 * Tenant / program isolation — no automatic cross-tenant access.
 * Aipify CSP ledger stays separate from tenant commercial programs.
 */

import { AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY } from "./contract";
import type { SalesPartnerProgramKind, SalesPartnerProgramRef } from "./types";

export type IsolationCheckResult =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "cross_tenant_forbidden"
        | "cross_program_forbidden"
        | "aipify_program_mixed_with_tenant"
        | "missing_owner_tenant";
    };

export function assertSameTenantPrograms(
  a: SalesPartnerProgramRef,
  b: SalesPartnerProgramRef,
): IsolationCheckResult {
  if (!a.ownerTenantId || !b.ownerTenantId) {
    return { ok: false, reason: "missing_owner_tenant" };
  }
  if (a.ownerTenantId !== b.ownerTenantId) {
    return { ok: false, reason: "cross_tenant_forbidden" };
  }
  return { ok: true };
}

export function assertSameProgram(
  a: SalesPartnerProgramRef,
  b: SalesPartnerProgramRef,
): IsolationCheckResult {
  const tenant = assertSameTenantPrograms(a, b);
  if (!tenant.ok) return tenant;
  if (a.programId !== b.programId) {
    return { ok: false, reason: "cross_program_forbidden" };
  }
  return { ok: true };
}

/**
 * Seller may hold multiple program memberships — each membership is program-scoped.
 * Never merge Aipify free program ledger into a tenant commercial program.
 */
export function assertLedgerPlanesIsolated(input: {
  programKind: SalesPartnerProgramKind;
  ledgerPlane: "csp_aipify" | "tenant_commercial";
}): IsolationCheckResult {
  if (input.programKind === "aipify_certified_free" && input.ledgerPlane === "tenant_commercial") {
    return { ok: false, reason: "aipify_program_mixed_with_tenant" };
  }
  if (input.programKind === "tenant_commercial" && input.ledgerPlane === "csp_aipify") {
    return { ok: false, reason: "aipify_program_mixed_with_tenant" };
  }
  return { ok: true };
}

export function isAipifyInternalProgramOwner(ownerTenantId: string): boolean {
  return ownerTenantId === AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY;
}

/**
 * Multiple memberships: same sellerUserId may appear in many programs as long as
 * each row is (programId, sellerUserId) unique and tenants never share rows.
 */
export function membershipKey(programId: string, sellerUserId: string): string {
  return `${programId}::${sellerUserId}`;
}

export function detectMembershipCollision(
  keys: readonly string[],
): { collision: boolean; duplicateKey: string | null } {
  const seen = new Set<string>();
  for (const key of keys) {
    if (seen.has(key)) return { collision: true, duplicateKey: key };
    seen.add(key);
  }
  return { collision: false, duplicateKey: null };
}
