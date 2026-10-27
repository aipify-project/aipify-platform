import type { Metadata } from "next";
import { cookies } from "next/headers";
import KompisWebSalesPage from "@/components/marketing/kompis-web-sales/KompisWebSalesPage";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { resolveKompisWebSalesLocale } from "@/lib/marketing/kompis-web-sales/locale";
import { parseKompisWebSalesLabels } from "@/lib/marketing/kompis-web-sales/labels";

async function loadSalesContext() {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value ?? null;
  const locale = resolveKompisWebSalesLocale({ cookieLocale });
  const dict = await getDictionary(locale, ["common", "marketing"]);
  const marketing = { ...(dict.marketing as Record<string, unknown>) };
  const common = dict.common as Record<string, string>;
  const labels = parseKompisWebSalesLabels(marketing);
  return { locale, labels, common };
}

export async function generateMetadata(): Promise<Metadata> {
  const { labels } = await loadSalesContext();
  return {
    title: labels.meta.title,
    description: labels.meta.description,
    alternates: { canonical: "/kompis-web" },
    openGraph: {
      title: labels.meta.title,
      description: labels.meta.description,
      url: "https://aipify.ai/kompis-web",
      siteName: "Aipify",
      type: "website",
    },
  };
}

export default async function KompisWebSalesRoutePage() {
  const { locale, labels, common } = await loadSalesContext();

  return (
    <KompisWebSalesPage
      labels={labels}
      locale={locale}
      appName={typeof common.appName === "string" ? common.appName : "Aipify"}
    />
  );
}
