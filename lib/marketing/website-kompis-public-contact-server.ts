import "server-only";

import { pickWebsiteKompisPublicContactHref } from "@/lib/marketing/website-kompis-public-contact";
import { normalizeWebsiteKompisEmbedDomain } from "@/lib/marketing/website-kompis-embed";
import { searchPublicCompanionTenantFaq } from "@/lib/marketing/public-companion-tenant-faq";

const CONTACT_QUERY_BY_LOCALE: Record<string, string> = {
  en: "contact support",
  no: "kontakt support",
  sv: "kontakta support",
  da: "kontakt support",
  pl: "kontakt wsparcie",
  uk: "контакт підтримка",
};

/**
 * Resolve a tenant-bound public contact URL from published FAQ evidence.
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

  const rows = await searchPublicCompanionTenantFaq({
    installId: input.installId,
    domain,
    locale,
    query,
    limit: 8,
  });

  return pickWebsiteKompisPublicContactHref(rows, domain);
}
