import type { AppPortalNavGroupId, AppPortalNavId } from "@/lib/app-portal/nav-config";

/** Internal readiness — never show raw enum strings as primary customer copy. */
export type NavReadiness = "operational" | "preview" | "foundation" | "disabled";

export type NavVisibilityPolicy =
  | "entitled_nav"
  | "catalog_only"
  | "always_when_authorized"
  | "hidden";

export type CanonicalNavItemContract = {
  id: AppPortalNavId;
  localeKey: string;
  route: string;
  group: AppPortalNavGroupId;
  requiredRole: "any" | "owner_admin" | "manager_plus";
  /** Portal feature key from get_app_portal_feature_access, when gated. */
  requiredFeatureKey?: string;
  /** Organization permission keys — any match grants role gate. */
  requiredPermissionKeys?: string[];
  /** Business pack / module entitlement key when nav requires installed capability. */
  requiredEntitlement?: string;
  readiness: NavReadiness;
  visibilityPolicy: NavVisibilityPolicy;
};

export type NavVisibilityReasonCode =
  | "visible"
  | "foundation_hidden"
  | "disabled_hidden"
  | "preview_hidden"
  | "unauthorized_role"
  | "feature_not_entitled"
  | "permission_denied"
  | "pack_not_active"
  | "catalog_only";

export type NavVisibilityDecision = {
  id: AppPortalNavId;
  visibleInNav: boolean;
  catalogEligible: boolean;
  reason: NavVisibilityReasonCode;
};

export type CanonicalNavResolution = {
  visibleNavIds: AppPortalNavId[];
  catalogEligibleIds: AppPortalNavId[];
  decisions: NavVisibilityDecision[];
  activeEntitlementIds: string[];
  pendingActivationIds: string[];
  diagnostics: Array<{ id: string; reason: NavVisibilityReasonCode }>;
};
