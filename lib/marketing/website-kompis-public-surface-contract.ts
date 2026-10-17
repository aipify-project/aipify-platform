/**
 * Universal public Website Kompis surface contract (Core-owned).
 *
 * Hosts mount the Core loader once and publish an access class via the adapter.
 * Core decides activation, context capture, and private deactivation.
 * A shared path failsafe complements the host adapter — it does not replace it
 * and does not claim complete private-route detection for every customer.
 * No customer route whitelist, domain, or product names belong here.
 */

import { isPrivateWebsiteKompisSurfacePathname } from "@/lib/marketing/website-kompis-public-site-index/private-paths";

export const WEBSITE_KOMPIS_PUBLIC_ACCESS_CLASSES = ["public", "private", "unknown"] as const;
export type WebsiteKompisPublicAccessClass = (typeof WEBSITE_KOMPIS_PUBLIC_ACCESS_CLASSES)[number];

/** Host publishes this dataset key on <html> (preferred) or the loader script. */
export const WEBSITE_KOMPIS_ACCESS_DATASET_KEY = "aipifyKompisAccess" as const;
/** Attribute form: data-aipify-kompis-access */
export const WEBSITE_KOMPIS_ACCESS_DATA_ATTRIBUTE = "data-aipify-kompis-access" as const;
/** Optional window flag for non-DOM hosts. */
export const WEBSITE_KOMPIS_ACCESS_WINDOW_FLAG = "__AIPIFY_WEBSITE_KOMPIS_ACCESS__" as const;

export const WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE =
  "aipify.websiteKompis.surface" as const;

export type WebsiteKompisEmbedSurfaceMessage = {
  type: typeof WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE;
  accessClass: WebsiteKompisPublicAccessClass;
  active: boolean;
  clearPageContext: boolean;
};

export type WebsiteKompisPublicSurfaceState = {
  accessClass: WebsiteKompisPublicAccessClass;
  /** Public Kompis UI may be shown. */
  active: boolean;
  /** Safe public pageContext capture may run. */
  allowPageContext: boolean;
  /** Drop any held public pageContext (private/unknown transition). */
  clearPageContext: boolean;
  reason:
    | "public_active"
    | "private_inactive"
    | "unknown_inactive"
    | "install_disabled"
    | "invalid_install";
};

export function parseWebsiteKompisPublicAccessClass(
  value: unknown,
): WebsiteKompisPublicAccessClass {
  if (typeof value !== "string") return "unknown";
  const normalized = value.trim().toLowerCase();
  if (normalized === "public" || normalized === "private" || normalized === "unknown") {
    return normalized;
  }
  return "unknown";
}

/**
 * Combine host access adapter + Core surface path failsafe.
 * Explicit host `public` must not override a known private surface path.
 * Public auth entries (`/login`, `/register`, …) are not path-failsafe hides.
 */
export function resolveWebsiteKompisEffectiveAccessClass(input: {
  hostAccessClass: unknown;
  pathname?: string | null;
}): WebsiteKompisPublicAccessClass {
  if (isPrivateWebsiteKompisSurfacePathname(input.pathname ?? undefined)) {
    return "private";
  }
  return parseWebsiteKompisPublicAccessClass(input.hostAccessClass);
}

/**
 * Resolve Core surface state from host adapter access class + install gates.
 * Pass `pathname` so the shared path failsafe can deactivate on known private routes.
 * Unknown/private never activate the public surface or allow context capture.
 */
export function resolveWebsiteKompisPublicSurfaceState(input: {
  accessClass: unknown;
  pathname?: string | null;
  installEnabled?: boolean;
  installIdPresent?: boolean;
  domainPresent?: boolean;
}): WebsiteKompisPublicSurfaceState {
  if (input.installEnabled === false) {
    return {
      accessClass: "unknown",
      active: false,
      allowPageContext: false,
      clearPageContext: true,
      reason: "install_disabled",
    };
  }
  if (input.installIdPresent === false || input.domainPresent === false) {
    return {
      accessClass: "unknown",
      active: false,
      allowPageContext: false,
      clearPageContext: true,
      reason: "invalid_install",
    };
  }

  const accessClass = resolveWebsiteKompisEffectiveAccessClass({
    hostAccessClass: input.accessClass,
    pathname: input.pathname,
  });
  if (accessClass === "public") {
    return {
      accessClass,
      active: true,
      allowPageContext: true,
      clearPageContext: false,
      reason: "public_active",
    };
  }
  if (accessClass === "private") {
    return {
      accessClass,
      active: false,
      allowPageContext: false,
      clearPageContext: true,
      reason: "private_inactive",
    };
  }
  return {
    accessClass: "unknown",
    active: false,
    allowPageContext: false,
    clearPageContext: true,
    reason: "unknown_inactive",
  };
}

/**
 * Read access class from host adapter sources (DOM dataset / script / window).
 * Never invent public from pathname. Missing adapter on a page where the host
 * chose to load the public loader may default to public via legacyMountedWithoutAdapter.
 */
export function readWebsiteKompisAccessClassFromAdapter(input: {
  documentElementAccess?: unknown;
  scriptAccess?: unknown;
  windowAccess?: unknown;
  /** True when host loaded the public loader script but published no access attribute yet. */
  legacyMountedWithoutAdapter?: boolean;
}): WebsiteKompisPublicAccessClass {
  if (input.documentElementAccess != null && String(input.documentElementAccess).trim() !== "") {
    return parseWebsiteKompisPublicAccessClass(input.documentElementAccess);
  }
  if (input.scriptAccess != null && String(input.scriptAccess).trim() !== "") {
    return parseWebsiteKompisPublicAccessClass(input.scriptAccess);
  }
  if (input.windowAccess != null && String(input.windowAccess).trim() !== "") {
    return parseWebsiteKompisPublicAccessClass(input.windowAccess);
  }
  return input.legacyMountedWithoutAdapter ? "public" : "unknown";
}

/**
 * Transition helper: public→private/unknown clears context; private→public reactivates.
 */
export function transitionWebsiteKompisPublicSurface(input: {
  previous: WebsiteKompisPublicSurfaceState | null;
  nextAccessClass: unknown;
  pathname?: string | null;
  installEnabled?: boolean;
  installIdPresent?: boolean;
  domainPresent?: boolean;
}): {
  state: WebsiteKompisPublicSurfaceState;
  shouldClearPageContext: boolean;
  becameActive: boolean;
  becameInactive: boolean;
} {
  const state = resolveWebsiteKompisPublicSurfaceState({
    accessClass: input.nextAccessClass,
    pathname: input.pathname,
    installEnabled: input.installEnabled,
    installIdPresent: input.installIdPresent,
    domainPresent: input.domainPresent,
  });
  const wasActive = input.previous?.active === true;
  const becameActive = !wasActive && state.active;
  const becameInactive = wasActive && !state.active;
  const shouldClearPageContext =
    state.clearPageContext || becameInactive || (wasActive && !state.allowPageContext);

  return { state, shouldClearPageContext, becameActive, becameInactive };
}

export function buildWebsiteKompisEmbedSurfaceMessage(
  state: WebsiteKompisPublicSurfaceState,
  options?: { clearPageContext?: boolean },
): WebsiteKompisEmbedSurfaceMessage {
  return {
    type: WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE,
    accessClass: state.accessClass,
    active: state.active,
    clearPageContext: options?.clearPageContext ?? state.clearPageContext,
  };
}

export function parseWebsiteKompisEmbedSurfaceMessage(
  value: unknown,
): WebsiteKompisEmbedSurfaceMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (record.type !== WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE) return null;
  if (typeof record.active !== "boolean") return null;
  if (typeof record.clearPageContext !== "boolean") return null;
  const accessClass = parseWebsiteKompisPublicAccessClass(record.accessClass);
  if (record.accessClass != null && accessClass === "unknown") {
    const raw = String(record.accessClass).trim().toLowerCase();
    if (raw !== "unknown") return null;
  }
  return {
    type: WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE,
    accessClass,
    active: record.active,
    clearPageContext: record.clearPageContext,
  };
}

/**
 * Generic host helper: map an existing layout/access boundary to the Core access class.
 * Hosts pass their own isPrivateSurface boolean — Core never inspects customer routes.
 */
export function accessClassFromHostPrivateBoundary(isPrivateSurface: boolean): WebsiteKompisPublicAccessClass {
  return isPrivateSurface ? "private" : "public";
}

/**
 * Whether the public loader may mount the iframe.
 * A missing host attribute stays public only on pages that are not already a private surface.
 * Known member and app paths stay unmounted. Explicit private or unknown never mounts.
 * Open restore may expand the host frame only after the child reports a painted open shell.
 */
export function resolveWebsiteKompisPublicLoaderMount(input: {
  pathname?: string | null;
  hostAccessClass?: unknown;
  attributeMissing?: boolean;
}): { accessClass: WebsiteKompisPublicAccessClass; mount: boolean } {
  if (isPrivateWebsiteKompisSurfacePathname(input.pathname ?? undefined)) {
    return { accessClass: "private", mount: false };
  }
  if (input.attributeMissing) {
    return { accessClass: "public", mount: true };
  }
  const accessClass = parseWebsiteKompisPublicAccessClass(input.hostAccessClass);
  if (accessClass !== "public") {
    return { accessClass, mount: false };
  }
  return { accessClass: "public", mount: true };
}

/** Host iframe may leave 72×72 only when the surface is mounted and the open shell has painted. */
export function shouldExpandWebsiteKompisHostFrame(input: {
  mount: boolean;
  open: boolean;
  painted: boolean;
}): boolean {
  return input.mount === true && input.open === true && input.painted === true;
}

/** Pure loader/iframe lifecycle step for local harnesses (no DOM / network). */
export type WebsiteKompisProtectedRouteLifecycleSnapshot = {
  pathname: string;
  hostAccessClass: WebsiteKompisPublicAccessClass;
  surfaceActive: boolean;
  accessClass: WebsiteKompisPublicAccessClass;
  heldPageContext: { pathname: string } | null;
  askGeneration: number;
  askAborted: boolean;
  captureAllowed: boolean;
  pendingDisclosureRefresh: boolean;
};

/**
 * Simulate one navigation/access evaluation the way the public loader must behave.
 * Capture miss / inactive always clears held pageContext (null ≠ keep stale).
 */
export function stepWebsiteKompisProtectedRouteLifecycle(
  previous: WebsiteKompisProtectedRouteLifecycleSnapshot,
  input: {
    pathname: string;
    hostAccessClass: unknown;
    /** Simulated capture result when surface would allow capture. */
    capturePathname?: string | null;
    /** In-flight ask present before this step. */
    askInFlight?: boolean;
    scheduleDisclosureRefresh?: boolean;
  },
): WebsiteKompisProtectedRouteLifecycleSnapshot {
  const transition = transitionWebsiteKompisPublicSurface({
    previous: {
      accessClass: previous.accessClass,
      active: previous.surfaceActive,
      allowPageContext: previous.surfaceActive,
      clearPageContext: !previous.surfaceActive,
      reason: previous.surfaceActive ? "public_active" : "private_inactive",
    },
    nextAccessClass: input.hostAccessClass,
    pathname: input.pathname,
    installEnabled: true,
    installIdPresent: true,
    domainPresent: true,
  });

  const becameInactive = transition.becameInactive;
  let askGeneration = previous.askGeneration;
  let askAborted = false;
  if (becameInactive || !transition.state.active) {
    if (input.askInFlight || previous.askAborted === false) {
      askAborted = Boolean(input.askInFlight) || becameInactive;
    }
    if (input.askInFlight || becameInactive) {
      askGeneration += 1;
      askAborted = true;
    }
  }

  let heldPageContext = previous.heldPageContext;
  let captureAllowed = false;
  let pendingDisclosureRefresh = false;

  if (!transition.state.active || transition.shouldClearPageContext) {
    heldPageContext = null;
    pendingDisclosureRefresh = false;
  } else if (transition.state.allowPageContext) {
    const captured =
      input.capturePathname === undefined
        ? { pathname: input.pathname }
        : input.capturePathname
          ? { pathname: input.capturePathname }
          : null;
    if (!captured) {
      heldPageContext = null;
    } else {
      heldPageContext = captured;
      captureAllowed = true;
    }
    pendingDisclosureRefresh = Boolean(input.scheduleDisclosureRefresh) && captureAllowed;
  }

  return {
    pathname: input.pathname,
    hostAccessClass: parseWebsiteKompisPublicAccessClass(input.hostAccessClass),
    surfaceActive: transition.state.active,
    accessClass: transition.state.accessClass,
    heldPageContext,
    askGeneration,
    askAborted,
    captureAllowed,
    pendingDisclosureRefresh,
  };
}
