/**
 * Semantic inventory and request-aware classification for Platform-privileged API routes.
 * Pathname-only matching is insufficient — portal/scope query params and alternate families
 * must be evaluated per request.
 */

export type PlatformPrivilegedKind =
  | "none"
  | "platform_session"
  | "platform_admin_if";

export type PlatformPrivilegedClassification = {
  privileged: boolean;
  kind: PlatformPrivilegedKind;
  trigger: string;
};

export type ClassifyPrivilegedPlatformRequestInput = {
  pathname: string;
  method?: string;
  searchParams?: URLSearchParams | Record<string, string | string[] | undefined>;
};

/** Always require Platform role + verified AAL2 (pathname prefix families). */
export const PLATFORM_SESSION_PREFIXES = [
  "/api/platform/",
  "/api/platform-admin/",
  "/api/aipify/platform-install/",
  "/api/aipify/platform-integrity/",
  "/api/customer-success-operations",
  "/api/compliance-governance-center",
  "/api/customer-journey-analytics",
  "/api/customer-lifecycle-center",
  "/api/executive-operations-center",
  "/api/global-announcements",
  "/api/payment-operations",
  "/api/payment-provider-health",
  "/api/payment-analytics",
  "/api/product-roadmap",
  "/api/release-center",
  "/api/revenue-operations",
  "/api/subscription-operations",
  "/api/voice-of-the-customer",
  "/api/aipify/install/unonight",
] as const;

/** Matches /api/platform-* slugs (not /api/platform/ nested routes). */
export const PLATFORM_DASHED_SLUG_PREFIX = "/api/platform-";

/** Require AAL2 only when caller is a Platform admin (hybrid tenant routes). */
export const PLATFORM_ADMIN_IF_PREFIXES = ["/api/aipify/tenants/"] as const;

export const CONDITIONAL_COMMAND_BAR_PATHS = [
  "/api/command-bar/search",
  "/api/command-bar/context",
] as const;

export const CONDITIONAL_SKILLS_MARKETPLACE_PATH = "/api/skills-marketplace";

export const CONDITIONAL_PAYMENT_PROVIDERS_PATH = "/api/payment-providers";

export const EXCLUDED_PLATFORM_GUARD_PATHS = [
  "/api/aipify/v1/platform-snapshot",
  "/api/super-portal/",
] as const;

/** Customer tenant observability — org-scoped RPCs, not cross-tenant Platform admin. */
export const CUSTOMER_TENANT_OBSERVABILITY_PATHS = [
  "/api/incidents",
  "/api/observability/status",
] as const;

export const PLATFORM_PRIVILEGED_PORTAL_VALUES = new Set(["platform", "super_admin"]);

export function normalizeApiPathname(pathname: string): string {
  if (!pathname) return "/";
  let normalized = pathname;
  while (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

function readSearchParam(
  searchParams: ClassifyPrivilegedPlatformRequestInput["searchParams"],
  key: string,
): string | null {
  if (!searchParams) return null;
  if (searchParams instanceof URLSearchParams) {
    return searchParams.get(key);
  }
  const value = searchParams[key];
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

function matchesPrefix(pathname: string, prefix: string): boolean {
  const normalizedPrefix = prefix.endsWith("/") ? prefix.slice(0, -1) : prefix;
  return pathname === normalizedPrefix || pathname.startsWith(`${normalizedPrefix}/`);
}

function isExcludedPath(pathname: string): boolean {
  for (const excluded of EXCLUDED_PLATFORM_GUARD_PATHS) {
    if (matchesPrefix(pathname, excluded.replace(/\/$/, ""))) return true;
  }
  return false;
}

function isPlatformDashedSlugRoute(pathname: string): boolean {
  if (!pathname.startsWith(PLATFORM_DASHED_SLUG_PREFIX)) return false;
  if (pathname.startsWith("/api/platform/")) return false;
  return true;
}

function classifyConditionalCommandBar(
  pathname: string,
  searchParams: ClassifyPrivilegedPlatformRequestInput["searchParams"],
): PlatformPrivilegedClassification | null {
  if (!CONDITIONAL_COMMAND_BAR_PATHS.includes(pathname as (typeof CONDITIONAL_COMMAND_BAR_PATHS)[number])) {
    return null;
  }

  const portal = readSearchParam(searchParams, "portal") ?? "customer";
  if (!["customer", "platform", "super_admin"].includes(portal)) {
    return { privileged: false, kind: "none", trigger: "invalid_portal" };
  }

  if (PLATFORM_PRIVILEGED_PORTAL_VALUES.has(portal)) {
    return { privileged: true, kind: "platform_session", trigger: `portal=${portal}` };
  }

  return { privileged: false, kind: "none", trigger: "customer_portal" };
}

function classifyConditionalSkillsMarketplace(
  pathname: string,
  searchParams: ClassifyPrivilegedPlatformRequestInput["searchParams"],
): PlatformPrivilegedClassification | null {
  if (pathname !== CONDITIONAL_SKILLS_MARKETPLACE_PATH) return null;

  const scope = readSearchParam(searchParams, "scope") ?? "customer";
  if (scope === "platform") {
    return { privileged: true, kind: "platform_session", trigger: "scope=platform" };
  }
  if (scope !== "customer") {
    return { privileged: false, kind: "none", trigger: "invalid_scope" };
  }
  return { privileged: false, kind: "none", trigger: "customer_scope" };
}

function classifyConditionalPaymentProvidersGet(
  pathname: string,
  method: string | undefined,
  searchParams: ClassifyPrivilegedPlatformRequestInput["searchParams"],
): PlatformPrivilegedClassification | null {
  if (pathname !== CONDITIONAL_PAYMENT_PROVIDERS_PATH) return null;
  if (method && method.toUpperCase() !== "GET") return null;

  const scope = readSearchParam(searchParams, "scope") ?? "tenant";
  if (scope === "platform") {
    return { privileged: true, kind: "platform_session", trigger: "scope=platform" };
  }
  return { privileged: false, kind: "none", trigger: "tenant_scope" };
}

export function isPlatformPrivilegedPortalValue(portal: string | null | undefined): boolean {
  if (!portal) return false;
  return PLATFORM_PRIVILEGED_PORTAL_VALUES.has(portal);
}

export function isPlatformPrivilegedScopeValue(scope: string | null | undefined): boolean {
  return scope === "platform";
}

export function classifyPrivilegedPlatformRequest(
  input: ClassifyPrivilegedPlatformRequestInput,
): PlatformPrivilegedClassification {
  const pathname = normalizeApiPathname(input.pathname);
  const method = input.method?.toUpperCase();

  if (isExcludedPath(pathname)) {
    return { privileged: false, kind: "none", trigger: "excluded" };
  }

  const commandBar = classifyConditionalCommandBar(pathname, input.searchParams);
  if (commandBar) return commandBar;

  const skills = classifyConditionalSkillsMarketplace(pathname, input.searchParams);
  if (skills) return skills;

  const paymentProviders = classifyConditionalPaymentProvidersGet(
    pathname,
    method,
    input.searchParams,
  );
  if (paymentProviders) return paymentProviders;

  for (const prefix of PLATFORM_ADMIN_IF_PREFIXES) {
    if (matchesPrefix(pathname, prefix)) {
      return { privileged: true, kind: "platform_admin_if", trigger: prefix };
    }
  }

  if (isPlatformDashedSlugRoute(pathname)) {
    return { privileged: true, kind: "platform_session", trigger: PLATFORM_DASHED_SLUG_PREFIX };
  }

  for (const prefix of PLATFORM_SESSION_PREFIXES) {
    if (matchesPrefix(pathname, prefix)) {
      return { privileged: true, kind: "platform_session", trigger: prefix };
    }
  }

  return { privileged: false, kind: "none", trigger: "none" };
}

/** @deprecated Use classifyPrivilegedPlatformRequest — retained for legacy call sites. */
export function isPrivilegedPlatformApiPath(pathname: string): boolean {
  return classifyPrivilegedPlatformRequest({ pathname }).privileged;
}

/** Inventory export for drift-detection tests. */
export function listPlatformPrivilegedInventory() {
  return {
    alwaysPrivilegedPrefixes: [...PLATFORM_SESSION_PREFIXES],
    platformDashedSlugPrefix: PLATFORM_DASHED_SLUG_PREFIX,
    platformAdminIfPrefixes: [...PLATFORM_ADMIN_IF_PREFIXES],
    conditionalCommandBarPaths: [...CONDITIONAL_COMMAND_BAR_PATHS],
    conditionalSkillsMarketplacePath: CONDITIONAL_SKILLS_MARKETPLACE_PATH,
    conditionalPaymentProvidersPath: CONDITIONAL_PAYMENT_PROVIDERS_PATH,
    excludedPaths: [...EXCLUDED_PLATFORM_GUARD_PATHS],
    customerTenantObservabilityPaths: [...CUSTOMER_TENANT_OBSERVABILITY_PATHS],
  };
}
