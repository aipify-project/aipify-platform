import type { AppKompisLayoutMode } from "@/lib/design/app-layout";

export type KompisRouteLayoutCapability = {
  route: string;
  module: string;
  /** Preferred presentation when Kompis is open. */
  layoutMode: AppKompisLayoutMode;
  /** Customer-safe context key for suggested prompts (not raw path). */
  contextKey: string;
  /** Whether wide tables/forms should force overlay even on desktop. */
  prefersOverlayForWidth: boolean;
};

const DEFAULT_CAPABILITY: Omit<KompisRouteLayoutCapability, "route"> = {
  module: "account",
  layoutMode: "split",
  contextKey: "generic",
  prefersOverlayForWidth: false,
};

/**
 * Resolve APP module + Kompis layout capability from the current pathname.
 * Client may propose the path; Core re-validates tenant/permissions on invoke.
 */
export function resolveKompisRouteLayout(pathname: string): KompisRouteLayoutCapability {
  const route = normalizeAppRoute(pathname);

  if (route === "/app" || route === "/app/" || route.startsWith("/app/home")) {
    return {
      route,
      module: "home",
      layoutMode: "split",
      contextKey: "dashboard",
      prefersOverlayForWidth: false,
    };
  }

  if (route.startsWith("/app/integrations") || route.startsWith("/app/install")) {
    return {
      route,
      module: "integrations",
      layoutMode: "split",
      contextKey: "integrations",
      prefersOverlayForWidth: false,
    };
  }

  if (
    route.startsWith("/app/settings/billing") ||
    route.startsWith("/app/billing") ||
    route.startsWith("/app/approvals") ||
    route.startsWith("/app/team") ||
    route.startsWith("/app/settings/team")
  ) {
    return {
      route,
      module: route.includes("billing") ? "billing" : route.includes("approvals") ? "approvals" : "organization",
      layoutMode: "overlay",
      contextKey: route.includes("billing")
        ? "billing"
        : route.includes("approvals")
          ? "approvals"
          : "organization",
      prefersOverlayForWidth: true,
    };
  }

  if (route.startsWith("/app/support") || route.startsWith("/app/settings/support")) {
    return {
      route,
      module: "support",
      layoutMode: "split",
      contextKey: "support",
      prefersOverlayForWidth: false,
    };
  }

  if (
    route.startsWith("/app/organization") ||
    route.startsWith("/app/settings/organization") ||
    route.startsWith("/app/roles")
  ) {
    return {
      route,
      module: "organization",
      layoutMode: "split",
      contextKey: "organization",
      prefersOverlayForWidth: false,
    };
  }

  if (route.startsWith("/app/kompis-workspace")) {
    return {
      route,
      module: "account",
      layoutMode: "full",
      contextKey: "workspace",
      prefersOverlayForWidth: false,
    };
  }

  return {
    route,
    ...DEFAULT_CAPABILITY,
    contextKey: "generic",
  };
}

/**
 * Effective layout for viewport: force overlay below desktop split breakpoint
 * or when the page prefers overlay for width.
 */
export function resolveEffectiveKompisLayoutMode(
  capability: KompisRouteLayoutCapability,
  opts: { viewportWidth: number; splitMinPx?: number }
): AppKompisLayoutMode {
  if (capability.layoutMode === "full") return "full";
  const splitMin = opts.splitMinPx ?? 1024;
  if (opts.viewportWidth < splitMin || capability.prefersOverlayForWidth) {
    return "overlay";
  }
  return capability.layoutMode;
}

export function normalizeAppRoute(pathname: string): string {
  if (!pathname || typeof pathname !== "string") return "/app";
  const trimmed = pathname.trim();
  if (!trimmed.startsWith("/")) return `/${trimmed}`;
  // Strip query/hash if accidentally present
  const pathOnly = trimmed.split(/[?#]/)[0] ?? trimmed;
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly;
}

/** Customer-safe module label key suffix for i18n (never raw enums in UI). */
export function kompisContextLabelKey(contextKey: string): string {
  const allowed = new Set([
    "dashboard",
    "integrations",
    "billing",
    "support",
    "organization",
    "approvals",
    "workspace",
    "generic",
  ]);
  return allowed.has(contextKey) ? contextKey : "generic";
}
