import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { PersonalSalesPageView } from "@/components/marketing/personal-sales-page/PersonalSalesPageView";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isPublicFooterEnabledLocale } from "@/lib/i18n/public-locales";
import { parseKompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";
import { resolveKompisWebSalesLocale } from "@/lib/marketing/kompis-web-sales/locale";
import { getKompisWebSalesPlanTruth } from "@/lib/marketing/kompis-web-sales/plans-from-catalog";
import { isCspShareLocale } from "@/lib/certified-sales-partner/share-locale";
import {
  classifyPersonalSalesCode,
  personalSalesProductPath,
  publicationFromPublicResolve,
} from "@/lib/personal-sales-page/contract";
import { parsePersonalSalesLabels } from "@/lib/personal-sales-page/labels";
import { createClient } from "@/lib/supabase/server";

/**
 * Seller-specific variants stay out of the index. They repeat the public product story
 * and must not create a second searchable copy of aipify.ai.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const query = await searchParams;
  const cookieStore = await cookies();
  const locale = isCspShareLocale(query.lang)
    ? query.lang
    : resolveKompisWebSalesLocale({ cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value });
  const dict = await getDictionary(locale, ["marketing"]);
  const labels = parsePersonalSalesLabels((dict.marketing as { personalSalesPage?: unknown }).personalSalesPage);
  return {
    title: labels.metaTitle,
    description: labels.metaDescription,
    robots: { index: false, follow: false },
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

  const cookieStore = await cookies();
  const locale = isCspShareLocale(query.lang)
    ? query.lang
    : resolveKompisWebSalesLocale({ cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value });
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
  let monthly: string | null = null;
  let annual: string | null = null;
  try {
    const plans = getKompisWebSalesPlanTruth();
    if (plans.checkoutEnabled === false) {
      monthly = plans.paidMonthlyDisplay;
      annual = plans.paidAnnualDisplay;
    }
  } catch {
    monthly = null;
    annual = null;
  }

  return (
    <PersonalSalesPageView
      chrome={chrome}
      appName={appName}
      locale={locale}
      labels={labels}
      publication={publication}
      startHref={attributed ?? "/start"}
      howHref="/#how"
      monthly={monthly}
      annual={annual}
      productBlocked={productBlocked}
    />
  );
}
