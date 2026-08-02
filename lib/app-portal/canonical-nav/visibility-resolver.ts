import type { AppPortalNavId } from "@/lib/app-portal/nav-config";
import { organizationRoleAllows } from "@/lib/tenant/organization-role";
import { buildCanonicalNavContracts } from "./contract";
import type {
  CanonicalNavResolution,
  NavVisibilityDecision,
  NavVisibilityReasonCode,
} from "./types";

export type NavResolverContext = {
  /** Organization role from membership — owner/admin/manager/member. */
  organizationRole: string | null;
  /** Feature key → enabled from get_app_portal_feature_access. */
  featureEnabled: Map<string, boolean>;
  /** Permission key → granted from has_organization_permission. */
  permissionGranted: Map<string, boolean>;
  /** Pack keys with activation_status === active. */
  activePackKeys: Set<string>;
  /** Pack keys pending/validating. */
  pendingPackKeys: Set<string>;
  /** Module keys licensed/enabled from tenant_modules. */
  activeModuleKeys: Set<string>;
};

function roleAllows(required: "any" | "owner_admin" | "manager_plus", role: string | null): boolean {
  return organizationRoleAllows(required, role);
}

function decide(
  contract: ReturnType<typeof buildCanonicalNavContracts>[number],
  ctx: NavResolverContext
): NavVisibilityDecision {
  if (contract.readiness === "foundation") {
    return {
      id: contract.id,
      visibleInNav: false,
      catalogEligible: contract.visibilityPolicy === "catalog_only",
      reason: "foundation_hidden",
    };
  }
  if (contract.readiness === "disabled") {
    return {
      id: contract.id,
      visibleInNav: false,
      catalogEligible: false,
      reason: "disabled_hidden",
    };
  }
  if (contract.readiness === "preview") {
    return {
      id: contract.id,
      visibleInNav: false,
      catalogEligible: true,
      reason: "preview_hidden",
    };
  }

  if (!roleAllows(contract.requiredRole, ctx.organizationRole)) {
    return {
      id: contract.id,
      visibleInNav: false,
      catalogEligible: false,
      reason: "unauthorized_role",
    };
  }

  if (contract.requiredFeatureKey) {
    const enabled = ctx.featureEnabled.get(contract.requiredFeatureKey);
    if (enabled === false) {
      return {
        id: contract.id,
        visibleInNav: false,
        catalogEligible: true,
        reason: "feature_not_entitled",
      };
    }
  }

  if (contract.requiredPermissionKeys?.length) {
    const allowed = contract.requiredPermissionKeys.some(
      (key) => ctx.permissionGranted.get(key) === true
    );
    if (!allowed) {
      return {
        id: contract.id,
        visibleInNav: false,
        catalogEligible: false,
        reason: "permission_denied",
      };
    }
  }

  if (contract.requiredEntitlement === "business_packs") {
    const hasActivePack = ctx.activePackKeys.size > 0;
    const featureOn = ctx.featureEnabled.get("business_packs") !== false;
    if (!hasActivePack && !featureOn) {
      return {
        id: contract.id,
        visibleInNav: false,
        catalogEligible: true,
        reason: "pack_not_active",
      };
    }
  }

  if (contract.visibilityPolicy === "catalog_only") {
    return {
      id: contract.id,
      visibleInNav: false,
      catalogEligible: true,
      reason: "catalog_only",
    };
  }

  return {
    id: contract.id,
    visibleInNav: true,
    catalogEligible: true,
    reason: "visible",
  };
}

/**
 * Pure entitlement + role + readiness resolver for canonical portal nav.
 * Server-side only — never trust client-supplied entitlement maps for authority.
 */
export function resolveCanonicalNavVisibility(ctx: NavResolverContext): CanonicalNavResolution {
  const contracts = buildCanonicalNavContracts();
  const decisions: NavVisibilityDecision[] = [];
  const seen = new Set<AppPortalNavId>();

  for (const contract of contracts) {
    if (seen.has(contract.id)) continue;
    seen.add(contract.id);
    decisions.push(decide(contract, ctx));
  }

  const diagnostics = decisions
    .filter((d) => !d.visibleInNav)
    .map((d) => ({ id: d.id, reason: d.reason as NavVisibilityReasonCode }));

  return {
    visibleNavIds: decisions.filter((d) => d.visibleInNav).map((d) => d.id),
    catalogEligibleIds: decisions.filter((d) => d.catalogEligible).map((d) => d.id),
    decisions,
    activeEntitlementIds: [
      ...[...ctx.activePackKeys].map((key) => `pack:${key}`),
      ...[...ctx.activeModuleKeys].map((key) => `module:${key}`),
    ],
    pendingActivationIds: [...ctx.pendingPackKeys].map((key) => `pack:${key}`),
    diagnostics,
  };
}

export function isNavIdVisibleInResolution(
  resolution: CanonicalNavResolution,
  id: string
): boolean {
  return resolution.visibleNavIds.includes(id as AppPortalNavId);
}
