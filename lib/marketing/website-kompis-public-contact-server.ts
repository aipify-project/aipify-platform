import "server-only";

import {
  pickWebsiteKompisPublicContactHref,
  pickWebsiteKompisPublicContactHrefFromIndex,
} from "@/lib/marketing/website-kompis-public-contact";
import { normalizeWebsiteKompisEmbedDomain } from "@/lib/marketing/website-kompis-embed";
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

/**
 * Resolve a tenant-bound public contact URL from published FAQ and/or site-index.
 * Priority: FAQ contact-typed/relevant rows, then site-index path/title/form evidence.
 * Returns null when no safe contact source exists — callers must not invent /contact.
 * Install-config override is not available without schema allowlist (separate BLOCKED gate).
 */
export async function resolveWebsiteKompisPublicContactUrl(input: {
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
