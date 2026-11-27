import type { Metadata } from "next";
import { cookies, headers } from "next/headers";
import { notFound } from "next/navigation";
import { PersonalSalesPageView } from "@/components/marketing/personal-sales-page/PersonalSalesPageView";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { PUBLIC_FOOTER_ENABLED_LOCALES, isPublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import { parseKompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import {
  buildKompisWebSalesMetadata,
  KOMPIS_WEB_SALES_CANONICAL_URL,
} from "@/lib/marketing/kompis-web-sales/sales-metadata";
import {
  classifyPersonalSalesCode,
  personalSalesProductPath,
  publicationFromPublicResolve,
} from "@/lib/personal-sales-page/contract";
import { parsePersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import { personalSalesLocalePath, resolvePersonalSalesLocale } from "@/lib/personal-sales-page/locale";
import { createClient } from "@/lib/supabase/server";

const SHARE_IMAGE = "/website-kompis/dashboard/kompis_mascot_premium_v2.png";

/**
 * Index decision: every /s/{code} URL repeats the public Kompis Web sales page.
 * Verified and unverified variants stay noindex so they do not compete with aipify.ai.
 * Canonical stays the main sales page. Language alternates exist for sharing only
 * and are not added to the sitemap. Invalid codes 404 and publish no partner data.
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { code } = await params;
  const query = await searchParams;
  if (classifyPersonalSalesCode(code) === "invalid") {
    return { robots: { index: false, follow: false } };
  }
  const headerStore = await headers();
  const cookieStore = await cookies();
  const locale = resolvePersonalSalesLocale({
    queryLang: query.lang,
    cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
  const dict = await getDictionary(locale, ["marketing"]);
  const chrome = parseKompisWebSalesLabels(dict.marketing as Record<string, unknown>);
  const shared = buildKompisWebSalesMetadata(chrome, "/");
  const languages = Object.fromEntries(
    PUBLIC_FOOTER_ENABLED_LOCALES.map((item) => [item, personalSalesLocalePath(code, item)]),
  );
  return {
    title: shared.title,
    description: shared.description,
    robots: { index: false, follow: false },
    alternates: {
      canonical: KOMPIS_WEB_SALES_CANONICAL_URL,
      languages,
    },
    openGraph: {
      title: shared.title ?? undefined,
      description: shared.description ?? undefined,
      url: `https://aipify.ai${personalSalesLocalePath(code, locale)}`,
      siteName: "Aipify",
      type: "website",
      images: [{ url: SHARE_IMAGE, alt: "Aipify" }],
    },
    twitter: {
      card: "summary_large_image",
      title: typeof shared.title === "string" ? shared.title : undefined,
      description: shared.description ?? undefined,
      images: [SHARE_IMAGE],
    },
  };
}

export default async function PersonalSalesPage({
  params,
  searchParams,
}: {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ lang?: string; product?: string }>;
}) {
  const { code } = await params;
  const query = await searchParams;
  if (classifyPersonalSalesCode(code) === "invalid") notFound();

  const headerStore = await headers();
  const cookieStore = await cookies();
  const locale = resolvePersonalSalesLocale({
    queryLang: query.lang,
    cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });
  if (!isPublicFooterEnabledLocale(locale)) notFound();

  const dict = await getDictionary(locale, ["common", "marketing"]);
  const marketing = dict.marketing as Record<string, unknown>;
  const chrome = parseKompisWebSalesLabels(marketing);
  const labels = parsePersonalSalesLabels(marketing.personalSalesPage);
  const common = dict.common as Record<string, string>;
  const appName = typeof common.appName === "string" ? common.appName : "Aipify";

  let resolved: unknown = { found: false };
  if (classifyPersonalSalesCode(code) === "growth_partner") {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc("resolve_growth_partner_public_link", { p_slug: code.toLowerCase() });
      resolved = error ? { found: false } : data;
    } catch {
      resolved = { found: false };
    }
  }

  const publication = publicationFromPublicResolve({ code, resolved });
  const productBlocked = Boolean(query.product) && query.product !== "kompis_web";
  const attributed = publication.state === "published" && !productBlocked ? personalSalesProductPath(code, locale) : null;

  return (
    <PersonalSalesPageView
      chrome={chrome}
      appName={appName}
      locale={locale}
      code={code}
      labels={labels}
      publication={publication}
      startHref={attributed ?? "/start"}
      productBlocked={productBlocked}
    />
  );
}
