/**
 * Software module manifest — distinct from product catalog SKUs and org entitlements.
 *
 * A) Product catalog = marketing / purchasability (Platform)
 * B) Module manifest = routes, nav children, dashboard adapters (this module)
 * C) Entitlements = server-verified access (Core / tenant_modules / partner identity)
 */

import type { AppPortalNavId } from "@/lib/app-portal/nav-config";
import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";

export const APP_SOFTWARE_MODULE_KEYS = [
  "website_kompis",
  "kompis_bedrift",
  "sales_partner",
] as const;

export type AppSoftwareModuleKey = (typeof APP_SOFTWARE_MODULE_KEYS)[number];

export type ModuleReadiness =
  | "implemented"
  | "test_ready"
  | "activated"
  | "inactive"
  | "hidden";

export type ModuleAccessPolicy =
  | "tenant_module"
  | "partner_identity"
  | "always_shared";

export type ModuleDashboardCapability =
  | "status_card"
  | "kpi_summary"
  | "attention"
  | "deep_link";

export type ModuleManifestNavChild = {
  navId: AppPortalNavId;
  /** When false, child is settings-only / deep-link — not primary Mine Produkter row. */
  primaryNav?: boolean;
};

export type ModuleManifest = {
  /** Stable software module key (entitlement / tenant_modules). */
  moduleKey: AppSoftwareModuleKey;
  /** Bound catalog product keys (SKU ≠ module). */
  productBindings: readonly string[];
  /** Product-context id when the module owns a product workspace. */
  productContextId: AppProductContextId | null;
  /** i18n key under customerApp.portalStructure.navGroups.* or modules.* */
  labelKey: string;
  iconToken: string;
  canonicalRoute: string;
  sortOrder: number;
  readiness: ModuleReadiness;
  accessPolicy: ModuleAccessPolicy;
  /** Nav children declared for Mine Produkter (never injected from DB). */
  menuChildren: readonly ModuleManifestNavChild[];
  dashboardCapabilities: readonly ModuleDashboardCapability[];
  /** Feature flag / pilot — hidden modules never appear as activated. */
  featureFlag?: string;
};

export type ModuleEntitlementState =
  | "active"
  | "setup_required"
  | "pending_approval"
  | "temporarily_unavailable"
  | "expired"
  | "not_entitled"
  | "not_ready"
  | "unknown";

export type ResolvedModuleAccess = {
  moduleKey: AppSoftwareModuleKey;
  entitled: boolean;
  state: ModuleEntitlementState;
  openHref: string | null;
};
