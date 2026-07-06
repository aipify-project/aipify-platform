export const WEBSITE_KOMPIS_EMBED_DEFAULT_LOCALE = "no" as const;

export const WEBSITE_KOMPIS_EMBED_LOCALES = [
  "en",
  "no",
  "sv",
  "da",
  "pl",
  "uk",
] as const;

export type WebsiteKompisEmbedLocale = (typeof WEBSITE_KOMPIS_EMBED_LOCALES)[number];

export const WEBSITE_KOMPIS_EMBED_DOMAIN_MAX_LENGTH = 253;
export const WEBSITE_KOMPIS_EMBED_INSTALL_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const WEBSITE_KOMPIS_EMBED_DEFAULT_CORE_ORIGIN = "https://aipify.ai";

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

export type WebsiteKompisEmbedAskPayload = {
  question: string;
  locale: WebsiteKompisEmbedLocale;
  domain: string;
  installId: string;
  recentContext?: WebsiteKompisEmbedRecentContextMessage[];
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

export function sanitizeWebsiteKompisEmbedLocale(value: unknown): WebsiteKompisEmbedLocale {
  if (typeof value !== "string") {
    return WEBSITE_KOMPIS_EMBED_DEFAULT_LOCALE;
  }
  const normalized = value.trim().toLowerCase();
  if ((WEBSITE_KOMPIS_EMBED_LOCALES as readonly string[]).includes(normalized)) {
    return normalized as WebsiteKompisEmbedLocale;
  }
  return WEBSITE_KOMPIS_EMBED_DEFAULT_LOCALE;
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
}): string {
  const params = new URLSearchParams({
    installId: input.installId,
    domain: input.domain,
  });
  return `/api/embed/companion/launcher-icon?${params.toString()}`;
}

export function buildWebsiteKompisAskPayload(input: {
  question: string;
  locale: WebsiteKompisEmbedLocale;
  domain: string;
  installId: string;
  recentContext?: WebsiteKompisEmbedRecentContextMessage[];
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
      .map((entry) => ({
        role: entry.role,
        text: entry.text.trim(),
      }));
  }

  return payload;
}
