import {
  DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
  resolveCompanionLauncherIconVariant,
  type CompanionLauncherIconVariantKey,
} from "@/lib/branding/companion-launcher-icons";
import type { PublicCompanionVisitorContext } from "@/lib/marketing/public-companion-tenant-faq";
import {
  hasPublicCompanionVisitorContext,
  resolvePublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";
import { loadWebsiteKompisInstallConfigFromStorage } from "@/lib/marketing/website-kompis-install-config-storage";

export const WEBSITE_KOMPIS_DISABLED_SOURCE = "website-kompis-disabled" as const;

export const WEBSITE_KOMPIS_FALLBACK_TONES = [
  "professional-friendly",
  "short-direct",
] as const;

export type WebsiteKompisFallbackTone = (typeof WEBSITE_KOMPIS_FALLBACK_TONES)[number];

export const WEBSITE_KOMPIS_WELCOME_MESSAGE_VARIANTS = ["standard", "compact"] as const;

export type WebsiteKompisWelcomeMessageVariant =
  (typeof WEBSITE_KOMPIS_WELCOME_MESSAGE_VARIANTS)[number];

export type WebsiteKompisInstallSourceConfig = {
  faq: boolean;
  currentPage: boolean;
  publicSiteIndex: boolean;
  aipifyPublic: boolean;
};

export type WebsiteKompisInstallConfig = {
  enabled: boolean;
  iconVariant: CompanionLauncherIconVariantKey;
  defaultLocale: string;
  fallbackTone: WebsiteKompisFallbackTone;
  sources: WebsiteKompisInstallSourceConfig;
  welcomeMessageVariant: WebsiteKompisWelcomeMessageVariant;
  updatedAt?: string;
};

export const DEFAULT_WEBSITE_KOMPIS_INSTALL_SOURCE_CONFIG: WebsiteKompisInstallSourceConfig =
  {
    faq: true,
    currentPage: true,
    publicSiteIndex: false,
    aipifyPublic: true,
  };

export const DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG: WebsiteKompisInstallConfig = {
  enabled: true,
  iconVariant: DEFAULT_COMPANION_LAUNCHER_ICON_VARIANT,
  defaultLocale: "no",
  fallbackTone: "professional-friendly",
  sources: { ...DEFAULT_WEBSITE_KOMPIS_INSTALL_SOURCE_CONFIG },
  welcomeMessageVariant: "standard",
};

const FORBIDDEN_CONFIG_KEYS = new Set(["iconUrl", "iconPath", "tenantId", "tenant_id", "installId"]);

const ALLOWED_CONFIG_KEYS = new Set([
  "enabled",
  "iconVariant",
  "defaultLocale",
  "fallbackTone",
  "sources",
  "welcomeMessageVariant",
  "updatedAt",
]);

const ALLOWED_SOURCE_KEYS = new Set([
  "faq",
  "currentPage",
  "publicSiteIndex",
  "aipifyPublic",
]);

const CORE_LOCALES = new Set(["en", "no", "sv", "da", "pl", "uk", "es"]);

function parseBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function parseFallbackTone(value: unknown): WebsiteKompisFallbackTone {
  if (
    typeof value === "string" &&
    (WEBSITE_KOMPIS_FALLBACK_TONES as readonly string[]).includes(value)
  ) {
    return value as WebsiteKompisFallbackTone;
  }
  return DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG.fallbackTone;
}

function parseWelcomeMessageVariant(value: unknown): WebsiteKompisWelcomeMessageVariant {
  if (
    typeof value === "string" &&
    (WEBSITE_KOMPIS_WELCOME_MESSAGE_VARIANTS as readonly string[]).includes(value)
  ) {
    return value as WebsiteKompisWelcomeMessageVariant;
  }
  return DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG.welcomeMessageVariant;
}

function parseDefaultLocale(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized.length > 16) return fallback;
  return CORE_LOCALES.has(normalized) ? normalized : fallback;
}

function parseUpdatedAt(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim().slice(0, 40);
  return trimmed || undefined;
}

function parseSources(value: unknown): WebsiteKompisInstallSourceConfig {
  const defaults = DEFAULT_WEBSITE_KOMPIS_INSTALL_SOURCE_CONFIG;
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { ...defaults };
  }

  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (!ALLOWED_SOURCE_KEYS.has(key)) {
      continue;
    }
    if (record[key] !== undefined && typeof record[key] !== "boolean") {
      return { ...defaults };
    }
  }

  return {
    faq: parseBoolean(record.faq, defaults.faq),
    currentPage: parseBoolean(record.currentPage, defaults.currentPage),
    publicSiteIndex: parseBoolean(record.publicSiteIndex, defaults.publicSiteIndex),
    aipifyPublic: parseBoolean(record.aipifyPublic, defaults.aipifyPublic),
  };
}

function extractRawWebsiteKompisBlock(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null;
  if (typeof raw !== "object" || Array.isArray(raw)) return null;

  const record = raw as Record<string, unknown>;
  const nested = record.website_kompis ?? record.websiteKompis;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }

  if (
    "enabled" in record ||
    "iconVariant" in record ||
    "sources" in record ||
    "fallbackTone" in record ||
    "welcomeMessageVariant" in record ||
    "defaultLocale" in record
  ) {
    return record;
  }

  return null;
}

export function normalizeWebsiteKompisInstallConfig(
  input: unknown,
  options: { requestLocale?: string | null } = {},
): WebsiteKompisInstallConfig {
  const localeFallback = parseDefaultLocale(
    options.requestLocale,
    DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG.defaultLocale,
  );

  const block = extractRawWebsiteKompisBlock(input);
  if (!block) {
    return {
      ...DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG,
      defaultLocale: localeFallback,
      sources: { ...DEFAULT_WEBSITE_KOMPIS_INSTALL_SOURCE_CONFIG },
    };
  }

  for (const key of Object.keys(block)) {
    if (FORBIDDEN_CONFIG_KEYS.has(key)) {
      continue;
    }
    if (!ALLOWED_CONFIG_KEYS.has(key)) {
      continue;
    }
  }

  const iconVariant = resolveCompanionLauncherIconVariant(
    typeof block.iconVariant === "string" ? block.iconVariant : undefined,
  );

  return {
    enabled: parseBoolean(block.enabled, DEFAULT_WEBSITE_KOMPIS_INSTALL_CONFIG.enabled),
    iconVariant,
    defaultLocale: parseDefaultLocale(block.defaultLocale, localeFallback),
    fallbackTone: parseFallbackTone(block.fallbackTone),
    sources: parseSources(block.sources),
    welcomeMessageVariant: parseWelcomeMessageVariant(block.welcomeMessageVariant),
    updatedAt: parseUpdatedAt(block.updatedAt),
  };
}

export type WebsiteKompisInstallConfigRequestContext = {
  installId?: string | null;
  domain?: string | null;
  requestHost?: string | null;
  locale?: string | null;
};

export type GetWebsiteKompisInstallConfigOptions = {
  requestLocale?: string | null;
  rawInstallConfig?: unknown;
  skipPersistedLoad?: boolean;
  loadInstallConfig?: (
    visitorContext: PublicCompanionVisitorContext,
  ) => Promise<unknown> | unknown;
};

export async function getWebsiteKompisInstallConfigForPublicRequest(
  context: WebsiteKompisInstallConfigRequestContext,
  options: GetWebsiteKompisInstallConfigOptions = {},
): Promise<WebsiteKompisInstallConfig> {
  const visitorContext = resolvePublicCompanionVisitorContext({
    clientDomain: context.domain,
    requestHost: context.requestHost,
    installId: context.installId,
  });

  let rawConfig = options.rawInstallConfig;
  if (options.loadInstallConfig) {
    rawConfig = await options.loadInstallConfig(visitorContext);
  } else if (
    options.rawInstallConfig === undefined &&
    !options.skipPersistedLoad &&
    hasPublicCompanionVisitorContext(visitorContext)
  ) {
    rawConfig = await loadWebsiteKompisInstallConfigFromStorage(visitorContext);
  }

  return normalizeWebsiteKompisInstallConfig(rawConfig, {
    requestLocale: options.requestLocale ?? context.locale,
  });
}

function siteLabelFromDomain(domain: string | null | undefined): string | null {
  if (!domain) return null;
  const label = domain.split(".")[0]?.trim();
  if (!label) return null;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function disabledCopy(locale: string, siteLabel: string | null): string {
  const named = siteLabel?.trim() || null;

  switch (locale) {
    case "no":
      return named
        ? `Website Kompis er midlertidig utilgjengelig for ${named}. Kontakt ${named} for mer informasjon.`
        : "Website Kompis er midlertidig utilgjengelig. Kontakt virksomheten for mer informasjon.";
    case "sv":
      return named
        ? `Website Kompis är tillfälligt otillgänglig för ${named}. Kontakta ${named} för mer information.`
        : "Website Kompis är tillfälligt otillgänglig. Kontakta verksamheten för mer information.";
    case "da":
      return named
        ? `Website Kompis er midlertidigt utilgængelig for ${named}. Kontakt ${named} for mere information.`
        : "Website Kompis er midlertidigt utilgængelig. Kontakt virksomheden for mere information.";
    case "en":
    default:
      return named
        ? `Website Kompis is temporarily unavailable for ${named}. Contact ${named} for more information.`
        : "Website Kompis is temporarily unavailable. Contact the business for more information.";
  }
}

export function buildWebsiteKompisDisabledResponse(
  locale: string,
  domain: string | null | undefined,
) {
  const siteLabel = siteLabelFromDomain(domain ?? null);

  return {
    answer: {
      directAnswer: disabledCopy(locale, siteLabel),
      explanation: null,
      steps: [],
    },
    actions: [],
    sources: [{ title: siteLabel ?? "Website Kompis", route: WEBSITE_KOMPIS_DISABLED_SOURCE }],
    confidence: { level: "low" as const, score: 0.1 },
    supportEscalation: { offered: false as const, reason: null },
    locale,
  };
}

export type WebsiteKompisPublicInstallMetadata = {
  enabled: boolean;
  iconVariant: CompanionLauncherIconVariantKey;
  welcomeMessageVariant: WebsiteKompisWelcomeMessageVariant;
  fallbackTone: WebsiteKompisFallbackTone;
};

export function toWebsiteKompisPublicInstallMetadata(
  config: WebsiteKompisInstallConfig,
): WebsiteKompisPublicInstallMetadata {
  return {
    enabled: config.enabled,
    iconVariant: config.iconVariant,
    welcomeMessageVariant: config.welcomeMessageVariant,
    fallbackTone: config.fallbackTone,
  };
}
