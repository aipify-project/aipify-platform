import "server-only";

import {
  pickWebsiteKompisPublicContactHref,
  pickWebsiteKompisPublicContactHrefFromIndex,
  validateWebsiteKompisConfiguredSupportContactUrl,
  type WebsiteKompisPublicContactSource,
} from "@/lib/marketing/website-kompis-public-contact";
import { normalizeWebsiteKompisEmbedDomain } from "@/lib/marketing/website-kompis-embed";
import { getWebsiteKompisInstallConfigForPublicRequest } from "@/lib/marketing/website-kompis-install-config";
import { searchPublicCompanionTenantFaq } from "@/lib/marketing/public-companion-tenant-faq";
import { searchTenantPublicSiteIndex } from "@/lib/marketing/website-kompis-public-site-index/search";

const CONTACT_QUERY_BY_LOCALE: Record<string, string[]> = {
  en: ["contact support", "contact us", "customer service", "contact form", "support"],
  no: ["kontakt support", "kontakt oss", "kundeservice", "kontaktskjema", "kontakt"],
  nb: ["kontakt support", "kontakt oss", "kundeservice", "kontaktskjema", "kontakt"],
  nn: ["kontakt support", "kontakt oss", "kundeservice", "kontaktskjema", "kontakt"],
  sv: ["kontakta support", "kontakta oss", "kundservice", "kontaktformulär", "kontakt"],
  da: ["kontakt support", "kontakt os", "kundeservice", "kontaktformular", "kontakt"],
  pl: ["kontakt wsparcie", "kontakt", "obsługa klienta", "formularz kontaktowy"],
  uk: ["контакт підтримка", "контакт", "служба підтримки", "форма зворотного зв'язку"],
};

export type { WebsiteKompisPublicContactSource };

/**
 * Auto-discover a tenant-bound public contact URL from published FAQ and/or site-index.
 * Does not read install-config override.
 */
export async function discoverWebsiteKompisPublicContactUrl(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
}): Promise<string | null> {
  const domain = normalizeWebsiteKompisEmbedDomain(input.domain ?? "");
  if (!domain || !input.installId) return null;

  const locale = input.locale.trim().toLowerCase() || "en";
  const queries = CONTACT_QUERY_BY_LOCALE[locale] ?? CONTACT_QUERY_BY_LOCALE.en;

  for (const contactQuery of queries) {
    const faqRows = await searchPublicCompanionTenantFaq({
      installId: input.installId,
      domain,
      locale,
      query: contactQuery,
      limit: 12,
    });

    const fromFaq = pickWebsiteKompisPublicContactHref(faqRows, domain);
    if (fromFaq) return fromFaq;

    const indexHits = await searchTenantPublicSiteIndex({
      installId: input.installId,
      domain,
      locale,
      query: contactQuery,
      limit: 20,
    });

    const fromIndex = pickWebsiteKompisPublicContactHrefFromIndex(
      indexHits.map((hit) => ({
        title: hit.title,
        pathname: hit.pathname,
        canonicalUrl: hit.canonicalUrl,
        excerpt: hit.excerpt,
        score: hit.score,
        locale: hit.locale,
      })),
      domain,
    );
    if (fromIndex) return fromIndex;
  }

  return null;
}

/**
 * Resolve public contact URL for Kompis CTA.
 * Priority:
 * 1. Valid APP-configured supportContactUrl (owner authoritative override)
 * 2. Strong auto-discovered public contact/support page from FAQ/site-index
 * 3. null — no CTA
 */
export async function resolveWebsiteKompisPublicContactUrl(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
  /** Skip install-config load when caller already has the configured value. */
  configuredSupportContactUrl?: string | null;
}): Promise<string | null> {
  const domain = normalizeWebsiteKompisEmbedDomain(input.domain ?? "");
  if (!domain || !input.installId) return null;

  let configuredRaw = input.configuredSupportContactUrl;
  if (configuredRaw === undefined) {
    const installConfig = await getWebsiteKompisInstallConfigForPublicRequest({
      installId: input.installId,
      domain,
      locale: input.locale,
    });
    configuredRaw = installConfig.supportContactUrl;
  }

  const configured = validateWebsiteKompisConfiguredSupportContactUrl(configuredRaw, domain);
  if (configured.ok && configured.url) {
    return configured.url;
  }

  return discoverWebsiteKompisPublicContactUrl({
    installId: input.installId,
    domain,
    locale: input.locale,
  });
}

export async function resolveWebsiteKompisPublicContactResolution(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
  configuredSupportContactUrl?: string | null;
}): Promise<{
  url: string | null;
  source: WebsiteKompisPublicContactSource;
  discoveredContactUrl: string | null;
}> {
  const domain = normalizeWebsiteKompisEmbedDomain(input.domain ?? "");
  if (!domain || !input.installId) {
    return { url: null, source: "none", discoveredContactUrl: null };
  }

  let configuredRaw = input.configuredSupportContactUrl;
  if (configuredRaw === undefined) {
    const installConfig = await getWebsiteKompisInstallConfigForPublicRequest({
      installId: input.installId,
      domain,
      locale: input.locale,
    });
    configuredRaw = installConfig.supportContactUrl;
  }

  const configured = validateWebsiteKompisConfiguredSupportContactUrl(configuredRaw, domain);
  const discoveredContactUrl = await discoverWebsiteKompisPublicContactUrl({
    installId: input.installId,
    domain,
    locale: input.locale,
  });

  if (configured.ok && configured.url) {
    return {
      url: configured.url,
      source: "configured",
      discoveredContactUrl,
    };
  }

  if (discoveredContactUrl) {
    return {
      url: discoveredContactUrl,
      source: "discovered",
      discoveredContactUrl,
    };
  }

  return { url: null, source: "none", discoveredContactUrl: null };
}
