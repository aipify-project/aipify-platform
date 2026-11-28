/**
 * License status resolution — fail-closed for commercial programs.
 * Free Aipify Partner continues via partner_identity (CSP), not this commercial SKU.
 */

import {
  AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY,
  COMMERCIAL_LICENSE_STATUSES_ALLOWING_SELLER_OPS,
  SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION,
} from "./contract";
import type {
  SalesPartnerLicenseSnapshot,
  SalesPartnerLicenseStatus,
  SalesPartnerProgramKind,
} from "./types";

export function isLicenseStatusAllowingSellerOps(
  status: SalesPartnerLicenseStatus,
): boolean {
  return (COMMERCIAL_LICENSE_STATUSES_ALLOWING_SELLER_OPS as readonly string[]).includes(
    status,
  );
}

/**
 * Grace allows existing ops visibility but blocks new seat activation
 * (mirrors APP license pause philosophy — recovery without expansion).
 */
export function isLicenseStatusAllowingNewSeatActivation(
  status: SalesPartnerLicenseStatus,
): boolean {
  return status === "active" || status === "internal_system";
}

export function resolveCommercialLicenseOperationalAccess(
  snapshot: SalesPartnerLicenseSnapshot,
): {
  mayOperateProgram: boolean;
  mayActivateSellerSeat: boolean;
  failClosedReason: string | null;
} {
  if (snapshot.program.kind !== "tenant_commercial") {
    return {
      mayOperateProgram: false,
      mayActivateSellerSeat: false,
      failClosedReason: "program_kind_mismatch",
    };
  }

  if (snapshot.status === "missing") {
    return {
      mayOperateProgram: false,
      mayActivateSellerSeat: false,
      failClosedReason: "license_missing",
    };
  }
  if (snapshot.status === "expired") {
    return {
      mayOperateProgram: false,
      mayActivateSellerSeat: false,
      failClosedReason: "license_expired",
    };
  }
  if (snapshot.status === "suspended") {
    return {
      mayOperateProgram: false,
      mayActivateSellerSeat: false,
      failClosedReason: "license_suspended",
    };
  }

  const mayOperate = isLicenseStatusAllowingSellerOps(snapshot.status);
  const mayActivate = isLicenseStatusAllowingNewSeatActivation(snapshot.status);
  return {
    mayOperateProgram: mayOperate,
    mayActivateSellerSeat: mayActivate,
    failClosedReason: mayOperate ? null : "license_not_operational",
  };
}

/**
 * Aipify’s own certified program uses an internal system license —
 * no purchase required for approved Aipify Partners.
 */
export function buildAipifyInternalSystemLicenseSnapshot(input: {
  programId?: string;
  activeSellerCount?: number;
}): SalesPartnerLicenseSnapshot {
  return {
    program: {
      programId: input.programId ?? SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION.aipifyCertifiedFreeProgram.id,
      ownerTenantId: AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY,
      kind: "aipify_certified_free",
    },
    status: "internal_system",
    source: "internal_system",
    licenseLevelKey: "aipify_internal_system",
    // Free CSP seat capacity is not gated by this commercial module.
    maxActiveSellers: null,
    activeSellerCount: input.activeSellerCount ?? 0,
    expiresAt: null,
  };
}

export function isAipifyInternalSystemLicense(
  snapshot: SalesPartnerLicenseSnapshot,
): boolean {
  return (
    snapshot.program.kind === "aipify_certified_free" &&
    snapshot.source === "internal_system" &&
    snapshot.status === "internal_system" &&
    snapshot.program.ownerTenantId === AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY
  );
}

/**
 * Free Aipify Partner access is partner_identity — never rewritten as a paid commercial SKU.
 * This foundation only documents the regression surface; runtime stays userHasCspPartnerAccess.
 */
export function freeAipifyPartnerAccessContract(): {
  purchaseRequired: false;
  accessPolicy: "partner_identity";
  commercialSkuRequired: false;
  preservedStatuses: readonly string[];
} {
  return {
    purchaseRequired: false,
    accessPolicy: "partner_identity",
    commercialSkuRequired: false,
    preservedStatuses: ["approved", "active", "certified", "in_academy"],
  };
}

export function assertProgramKindMatchesLicense(
  kind: SalesPartnerProgramKind,
  snapshot: SalesPartnerLicenseSnapshot,
): boolean {
  return snapshot.program.kind === kind;
}
