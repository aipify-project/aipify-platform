import {
  sanitizeWebsiteKompisPublicPageContext,
  type WebsiteKompisPublicPageContext,
} from "@/lib/marketing/website-kompis-public-page-context";

/** Used only when host omits locale entirely (loader may still default separately). */
export const WEBSITE_KOMPIS_EMBED_DEFAULT_LOCALE = "no" as const;
/** Explicit unsupported host locales (e.g. de) must not fall through to Norwegian. */
export const WEBSITE_KOMPIS_EMBED_UNSUPPORTED_FALLBACK_LOCALE = "en" as const;

export const WEBSITE_KOMPIS_EMBED_LOCALES = [
  "en",
  "no",
  "sv",
  "da",
  "pl",
  "uk",
] as const;

export type WebsiteKompisEmbedLocale = (typeof WEBSITE_KOMPIS_EMBED_LOCALES)[number];

export const WEBSITE_KOMPIS_EMBED_NAVIGATE_MESSAGE_TYPE =
  "aipify.websiteKompis.navigate" as const;

export type WebsiteKompisEmbedNavigateMessage = {
  type: typeof WEBSITE_KOMPIS_EMBED_NAVIGATE_MESSAGE_TYPE;
  href: string;
};

export const WEBSITE_KOMPIS_EMBED_DOMAIN_MAX_LENGTH = 253;
export const WEBSITE_KOMPIS_EMBED_INSTALL_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const WEBSITE_KOMPIS_EMBED_DEFAULT_CORE_ORIGIN = "https://aipify.ai";

/** Keep in sync with PUBLIC_COMPANION_ASK_MAX_CONTEXT_MESSAGE_LENGTH (ask validation). */
export const WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH = 500;

export type WebsiteKompisEmbedParams = {
  installId: string;
  domain: string;
  locale: WebsiteKompisEmbedLocale;
};

export type WebsiteKompisEmbedParamsParseResult =
  | { ok: true; params: WebsiteKompisEmbedParams }
  | { ok: false; reason: "missing_install_id" | "missing_domain" | "invalid_install_id" | "invalid_domain" };

export type WebsiteKompisEmbedRecentContextMessage = {
  role: "user" | "assistant";
  text: string;
};

export const WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE =
  "aipify.websiteKompis.pageContext" as const;

export const WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE =
  "aipify.websiteKompis.requestPageContext" as const;

export {
  WEBSITE_KOMPIS_ACCESS_DATA_ATTRIBUTE,
  WEBSITE_KOMPIS_ACCESS_DATASET_KEY,
  WEBSITE_KOMPIS_ACCESS_WINDOW_FLAG,
  WEBSITE_KOMPIS_EMBED_SURFACE_MESSAGE_TYPE,
  accessClassFromHostPrivateBoundary,
  buildWebsiteKompisEmbedSurfaceMessage,
  parseWebsiteKompisEmbedSurfaceMessage,
  parseWebsiteKompisPublicAccessClass,
  readWebsiteKompisAccessClassFromAdapter,
  resolveWebsiteKompisPublicSurfaceState,
  transitionWebsiteKompisPublicSurface,
  type WebsiteKompisEmbedSurfaceMessage,
  type WebsiteKompisPublicAccessClass,
  type WebsiteKompisPublicSurfaceState,
} from "@/lib/marketing/website-kompis-public-surface-contract";

export const WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE =
  "aipify.websiteKompis.resize" as const;

export const WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX = 72;
export const WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX = 72;
/** Visible open panel width (CSS px). Outer iframe = panel + OPEN_FRAME_OUTSET×2. */
export const WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX = 450;
/** Preferred open panel height; clamped to viewport by host + resolve helper. */
export const WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX = 800;
export const WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MAX_PX = 900;
export const WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MIN_PX = 560;
export const WEBSITE_KOMPIS_EMBED_VIEWPORT_HEIGHT_GUTTER_PX = 24;
/** Host iframe inset so Design V1 border/shadow is not clipped when open. */
export const WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX = 12;
/** Keep open panel off the viewport edge (matches closed launcher inset). */
export const WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX = 12;

export type WebsiteKompisEmbedResizeMessage = {
  type: typeof WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE;
  open: boolean;
  width: number;
  height: number;
};

export function resolveWebsiteKompisEmbedOpenHeightPx(
  viewportHeightPx?: number | null,
): number {
  const preferred = WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_PX;
  if (
    typeof viewportHeightPx !== "number" ||
    !Number.isFinite(viewportHeightPx) ||
    viewportHeightPx <= 0
  ) {
    return preferred;
  }
  // Leave room for edge inset + frame outset so the panel chrome is not clipped.
  const reserved =
    WEBSITE_KOMPIS_EMBED_VIEWPORT_HEIGHT_GUTTER_PX +
    WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX +
    WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX * 2;
  const capped = Math.floor(viewportHeightPx - reserved);
  return Math.max(
    WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MIN_PX,
    Math.min(preferred, capped, WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MAX_PX),
  );
}

/** Host iframe outer size includes frame outset around the open panel. */
export function resolveWebsiteKompisEmbedHostOpenSize(input: {
  panelWidth: number;
  panelHeight: number;
}): { width: number; height: number } {
  const outset = WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX * 2;
  return {
    width: Math.round(input.panelWidth + outset),
    height: Math.round(input.panelHeight + outset),
  };
}

/**
 * Preferred outer iframe size for a host viewport.
 * Desktop 1440×1000 → panel 450×800 → host 474×824 (frame outset 12).
 * Undersized embed posts must not win over this floor in the loader.
 */
export function resolveWebsiteKompisEmbedPreferredHostOpenSize(
  viewportWidthPx?: number | null,
  viewportHeightPx?: number | null,
): { width: number; height: number; panelWidth: number; panelHeight: number } {
  const panelHeight = resolveWebsiteKompisEmbedOpenHeightPx(viewportHeightPx);
  const panelWidth = WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX;
  const host = resolveWebsiteKompisEmbedHostOpenSize({ panelWidth, panelHeight });
  let width = host.width;
  let height = host.height;
  if (
    typeof viewportWidthPx === "number" &&
    Number.isFinite(viewportWidthPx) &&
    viewportWidthPx > 0
  ) {
    width = Math.min(
      width,
      Math.max(
        WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
        Math.floor(viewportWidthPx - WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX),
      ),
    );
  }
  if (
    typeof viewportHeightPx === "number" &&
    Number.isFinite(viewportHeightPx) &&
    viewportHeightPx > 0
  ) {
    height = Math.min(
      height,
      Math.max(
        WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
        Math.floor(viewportHeightPx - WEBSITE_KOMPIS_EMBED_OPEN_EDGE_INSET_PX),
      ),
    );
  }
  return { width, height, panelWidth, panelHeight };
}

/**
 * Build resize postMessage for the host loader.
 * Embed widget must call with preferred size only (no iframe viewportHeightPx).
 * Host `website-kompis.js` clamps using the parent window visualViewport.
 * Optional viewportHeightPx is for host-side/unit tests — never the iframe height.
 */
export function buildWebsiteKompisEmbedResizeMessage(
  open: boolean,
  viewportHeightPx?: number | null,
): WebsiteKompisEmbedResizeMessage {
  if (!open) {
    return {
      type: WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
      open: false,
      width: WEBSITE_KOMPIS_EMBED_CLOSED_WIDTH_PX,
      height: WEBSITE_KOMPIS_EMBED_CLOSED_HEIGHT_PX,
    };
  }
  const panelHeight = resolveWebsiteKompisEmbedOpenHeightPx(viewportHeightPx);
  const host = resolveWebsiteKompisEmbedHostOpenSize({
    panelWidth: WEBSITE_KOMPIS_EMBED_OPEN_WIDTH_PX,
    panelHeight,
  });
  return {
    type: WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
    open: true,
    width: host.width,
    height: host.height,
  };
}

export function parseWebsiteKompisEmbedResizeMessage(
  value: unknown,
): WebsiteKompisEmbedResizeMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  if (record.type !== WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE) {
    return null;
  }
  if (typeof record.open !== "boolean") {
    return null;
  }
  const width = typeof record.width === "number" ? record.width : NaN;
  const height = typeof record.height === "number" ? record.height : NaN;
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return null;
  }
  const maxHostHeight =
    WEBSITE_KOMPIS_EMBED_OPEN_HEIGHT_MAX_PX + WEBSITE_KOMPIS_EMBED_OPEN_FRAME_OUTSET_PX * 2;
  if (width < 48 || width > 560 || height < 48 || height > maxHostHeight) {
    return null;
  }
  return {
    type: WEBSITE_KOMPIS_EMBED_RESIZE_MESSAGE_TYPE,
    open: record.open,
    width: Math.round(width),
    height: Math.round(height),
  };
}

export type WebsiteKompisEmbedAskPayload = {
  question: string;
  locale: WebsiteKompisEmbedLocale;
  domain: string;
  installId: string;
  recentContext?: WebsiteKompisEmbedRecentContextMessage[];
  pageContext?: WebsiteKompisPublicPageContext;
};

export function normalizeWebsiteKompisEmbedInstallId(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed || !WEBSITE_KOMPIS_EMBED_INSTALL_ID_PATTERN.test(trimmed)) {
    return null;
  }
  return trimmed.toLowerCase();
}

export function normalizeWebsiteKompisEmbedDomain(value: unknown): string | null {
  if (typeof value !== "string") return null;
  let normalized = value.trim().toLowerCase();
  if (!normalized) return null;

  normalized = normalized.replace(/^https?:\/\//i, "");
  normalized = normalized.replace(/\/.*$/, "");
  normalized = normalized.replace(/:\d+$/, "");

  if (!normalized || normalized.length > WEBSITE_KOMPIS_EMBED_DOMAIN_MAX_LENGTH) {
    return null;
  }

  if (!/^[a-z0-9.-]+$/.test(normalized) || normalized.includes("..")) {
    return null;
  }

  return normalized;
}

export function normalizeWebsiteKompisEmbedLocaleTag(value: string): string {
  const normalized = value.trim().toLowerCase().replace(/_/g, "-");
  if (!normalized) return "";
  const base = normalized.split("-")[0] ?? normalized;
  if (base === "nb" || base === "nn") return "no";
  return base;
}

export function sanitizeWebsiteKompisEmbedLocale(value: unknown): WebsiteKompisEmbedLocale {
  if (typeof value !== "string" || !value.trim()) {
    return WEBSITE_KOMPIS_EMBED_DEFAULT_LOCALE;
  }
  const normalized = normalizeWebsiteKompisEmbedLocaleTag(value);
  if ((WEBSITE_KOMPIS_EMBED_LOCALES as readonly string[]).includes(normalized)) {
    return normalized as WebsiteKompisEmbedLocale;
  }
  // Explicit but unsupported selection (de, fr, es-only hosts, unknown) → English.
  return WEBSITE_KOMPIS_EMBED_UNSUPPORTED_FALLBACK_LOCALE;
}

export function buildWebsiteKompisEmbedNavigateMessage(href: string): WebsiteKompisEmbedNavigateMessage {
  return {
    type: WEBSITE_KOMPIS_EMBED_NAVIGATE_MESSAGE_TYPE,
    href,
  };
}

export function parseWebsiteKompisEmbedNavigateMessage(
  value: unknown,
): WebsiteKompisEmbedNavigateMessage | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const record = value as Record<string, unknown>;
  if (record.type !== WEBSITE_KOMPIS_EMBED_NAVIGATE_MESSAGE_TYPE) return null;
  if (typeof record.href !== "string" || !record.href.trim()) return null;
  return {
    type: WEBSITE_KOMPIS_EMBED_NAVIGATE_MESSAGE_TYPE,
    href: record.href.trim(),
  };
}

/** Same-origin public navigation only — never javascript:/data: or cross-site. */
export function isAllowedWebsiteKompisHostNavigateHref(
  href: string,
  allowedHosts: readonly string[],
): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;
  // Host-relative public paths are resolved against the parent location by the loader.
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) {
    if (trimmed.includes("\\") || trimmed.includes("<") || /\s/.test(trimmed)) {
      return false;
    }
    return true;
  }
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    const host = parsed.hostname.toLowerCase();
    const allowed = new Set(
      allowedHosts
        .map((entry) => entry.trim().toLowerCase())
        .filter(Boolean)
        .flatMap((entry) => (entry.startsWith("www.") ? [entry, entry.slice(4)] : [entry, `www.${entry}`])),
    );
    return allowed.has(host);
  } catch {
    return false;
  }
}

function readSearchParam(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined | null>,
  key: string,
): string | null {
  if (searchParams instanceof URLSearchParams) {
    const value = searchParams.get(key);
    return value?.trim() ? value.trim() : null;
  }
  const raw = searchParams[key];
  if (typeof raw === "string") return raw.trim() || null;
  if (Array.isArray(raw) && typeof raw[0] === "string") return raw[0].trim() || null;
  return null;
}

export function parseWebsiteKompisEmbedSearchParams(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined | null>,
): WebsiteKompisEmbedParamsParseResult {
  const installIdRaw = readSearchParam(searchParams, "installId");
  const domainRaw = readSearchParam(searchParams, "domain");
  const localeRaw = readSearchParam(searchParams, "locale");

  if (!installIdRaw) {
    return { ok: false, reason: "missing_install_id" };
  }
  if (!domainRaw) {
    return { ok: false, reason: "missing_domain" };
  }

  const installId = normalizeWebsiteKompisEmbedInstallId(installIdRaw);
  if (!installId) {
    return { ok: false, reason: "invalid_install_id" };
  }

  const domain = normalizeWebsiteKompisEmbedDomain(domainRaw);
  if (!domain) {
    return { ok: false, reason: "invalid_domain" };
  }

  return {
    ok: true,
    params: {
      installId,
      domain,
      locale: sanitizeWebsiteKompisEmbedLocale(localeRaw),
    },
  };
}

export function buildWebsiteKompisEmbedIframeSrc(input: {
  coreOrigin: string;
  installId: string;
  domain: string;
  locale?: WebsiteKompisEmbedLocale;
}): string {
  const origin = input.coreOrigin.replace(/\/$/, "");
  const params = new URLSearchParams({
    installId: input.installId,
    domain: input.domain,
    locale: sanitizeWebsiteKompisEmbedLocale(input.locale),
  });
  return `${origin}/embed/website-kompis?${params.toString()}`;
}

export function buildWebsiteKompisMetadataRequestPath(input: {
  installId: string;
  domain: string;
  locale?: string;
}): string {
  const params = new URLSearchParams({
    installId: input.installId,
    domain: input.domain,
  });
  if (input.locale?.trim()) {
    params.set("locale", sanitizeWebsiteKompisEmbedLocale(input.locale));
  }
  return `/api/embed/companion/launcher-icon?${params.toString()}`;
}

export function buildWebsiteKompisAskPayload(input: {
  question: string;
  locale: WebsiteKompisEmbedLocale;
  domain: string;
  installId: string;
  recentContext?: WebsiteKompisEmbedRecentContextMessage[];
  pageContext?: WebsiteKompisPublicPageContext;
}): WebsiteKompisEmbedAskPayload {
  const payload: WebsiteKompisEmbedAskPayload = {
    question: input.question.trim(),
    locale: sanitizeWebsiteKompisEmbedLocale(input.locale),
    domain: normalizeWebsiteKompisEmbedDomain(input.domain) ?? input.domain,
    installId: normalizeWebsiteKompisEmbedInstallId(input.installId) ?? input.installId,
  };

  if (input.recentContext && input.recentContext.length > 0) {
    payload.recentContext = input.recentContext
      .filter((entry) => entry.text.trim().length > 0)
      .map((entry) => {
        const text = entry.text.trim();
        return {
          role: entry.role,
          text:
            text.length > WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH
              ? text.slice(0, WEBSITE_KOMPIS_EMBED_MAX_CONTEXT_MESSAGE_LENGTH)
              : text,
        };
      });
  }

  if (input.pageContext) {
    payload.pageContext = input.pageContext;
  }

  return payload;
}

export function parseWebsiteKompisEmbedPageContextMessage(
  value: unknown,
): WebsiteKompisPublicPageContext | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return undefined;
  }

  const record = value as Record<string, unknown>;
  if (record.type !== WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_MESSAGE_TYPE) {
    return undefined;
  }

  try {
    return sanitizeWebsiteKompisPublicPageContext(record.pageContext);
  } catch {
    return undefined;
  }
}

/** Default wait for parent loader to re-capture and post pageContext before ask. */
export const WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REFRESH_TIMEOUT_MS = 450;

export type WebsiteKompisEmbedPageContextRefreshWindow = {
  parent: {
    postMessage(message: unknown, targetOrigin: string): void;
  };
  addEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  removeEventListener(type: "message", listener: (event: MessageEvent) => void): void;
  setTimeout(handler: () => void, timeout: number): unknown;
  clearTimeout(handle: unknown): void;
};

/**
 * Ask the host loader for a fresh pageContext snapshot (open FAQ panels included).
 * Resolves with the next valid pageContext message, or undefined on timeout.
 */
export function refreshWebsiteKompisEmbedPageContextFromParent(input?: {
  timeoutMs?: number;
  win?: WebsiteKompisEmbedPageContextRefreshWindow;
}): Promise<WebsiteKompisPublicPageContext | undefined> {
  const win =
    input?.win ??
    (typeof window !== "undefined"
      ? (window as unknown as WebsiteKompisEmbedPageContextRefreshWindow)
      : undefined);
  if (!win?.parent?.postMessage) {
    return Promise.resolve(undefined);
  }

  const timeoutMs = Math.max(
    50,
    Math.min(2000, input?.timeoutMs ?? WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REFRESH_TIMEOUT_MS),
  );

  return new Promise((resolve) => {
    let settled = false;
    let timeoutHandle: unknown;
    const parent = win.parent;

    const finish = (value: WebsiteKompisPublicPageContext | undefined) => {
      if (settled) return;
      settled = true;
      win.removeEventListener("message", onMessage);
      if (timeoutHandle != null) {
        win.clearTimeout(timeoutHandle);
      }
      resolve(value);
    };

    const onMessage = (event: MessageEvent) => {
      // Browser: only accept parent. Tests may omit source.
      if (event.source != null && event.source !== (parent as unknown)) {
        return;
      }
      const next = parseWebsiteKompisEmbedPageContextMessage(event.data);
      if (next) {
        finish(next);
      }
    };

    win.addEventListener("message", onMessage);
    try {
      parent.postMessage({ type: WEBSITE_KOMPIS_EMBED_PAGE_CONTEXT_REQUEST_MESSAGE_TYPE }, "*");
    } catch {
      finish(undefined);
      return;
    }
    timeoutHandle = win.setTimeout(() => finish(undefined), timeoutMs);
  });
}

export function escapeWebsiteKompisEmbedAttributeValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function buildWebsiteKompisScriptEmbedSnippet(input: {
  coreOrigin?: string;
  installId: string;
  domain: string;
  locale?: WebsiteKompisEmbedLocale;
}): string | null {
  const installId = normalizeWebsiteKompisEmbedInstallId(input.installId);
  const domain = normalizeWebsiteKompisEmbedDomain(input.domain);
  if (!installId || !domain) {
    return null;
  }

  const origin = (input.coreOrigin ?? WEBSITE_KOMPIS_EMBED_DEFAULT_CORE_ORIGIN).replace(/\/$/, "");
  const locale = sanitizeWebsiteKompisEmbedLocale(input.locale);
  const escapedOrigin = escapeWebsiteKompisEmbedAttributeValue(origin);
  const escapedInstallId = escapeWebsiteKompisEmbedAttributeValue(installId);
  const escapedDomain = escapeWebsiteKompisEmbedAttributeValue(domain);
  const escapedLocale = escapeWebsiteKompisEmbedAttributeValue(locale);

  return `<script
  src="${escapedOrigin}/embed/website-kompis.js"
  data-install-id="${escapedInstallId}"
  data-domain="${escapedDomain}"
  data-locale="${escapedLocale}"
  defer
></script>`;
}
