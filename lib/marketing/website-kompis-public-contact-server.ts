import "server-only";

import {
  pickWebsiteKompisPublicContactHref,
  pickWebsiteKompisPublicContactHrefFromIndex,
} from "@/lib/marketing/website-kompis-public-contact";
import { normalizeWebsiteKompisEmbedDomain } from "@/lib/marketing/website-kompis-embed";
import { searchPublicCompanionTenantFaq } from "@/lib/marketing/public-companion-tenant-faq";
import { searchTenantPublicSiteIndex } from "@/lib/marketing/website-kompis-public-site-index/search";

const CONTACT_QUERY_BY_LOCALE: Record<string, string> = {
  en: "contact support",
  no: "kontakt support",
  sv: "kontakta support",
  da: "kontakt support",
  pl: "kontakt wsparcie",
  uk: "контакт підтримка",
};

/**
 * Resolve a tenant-bound public contact URL from published FAQ and/or site-index.
 * Returns null when no safe contact source exists — callers must not invent /contact.
 */
export async function resolveWebsiteKompisPublicContactUrl(input: {
  installId?: string | null;
  domain?: string | null;
  locale: string;
}): Promise<string | null> {
  const domain = normalizeWebsiteKompisEmbedDomain(input.domain ?? "");
  if (!domain || !input.installId) return null;

  const locale = input.locale.trim().toLowerCase() || "en";
  const query = CONTACT_QUERY_BY_LOCALE[locale] ?? CONTACT_QUERY_BY_LOCALE.en;

  const faqRows = await searchPublicCompanionTenantFaq({
    installId: input.installId,
    domain,
    locale,
    query,
    limit: 8,
  });

  const fromFaq = pickWebsiteKompisPublicContactHref(faqRows, domain);
  if (fromFaq) return fromFaq;

  const indexHits = await searchTenantPublicSiteIndex({
    installId: input.installId,
    domain,
    locale,
    query,
    limit: 8,
  });

  return pickWebsiteKompisPublicContactHrefFromIndex(
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
}
