import type { Metadata } from "next";
import { cookies } from "next/headers";
import AnalyticsConsentProvider from "@/components/analytics/AnalyticsConsentProvider";
import MarketingAnalyticsShell from "@/components/marketing/MarketingAnalyticsShell";
import { LOCALE_COOKIE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { resolveKompisWebSalesLocale } from "@/lib/marketing/kompis-web-sales/locale";
import { buildAnalyticsConsentLabels } from "@/lib/product-analytics/consent";

/**
 * Isolated sales shell for `/`, `/kompis-web`, `/start`, `/privacy`, `/terms`.
 * Page owns its own header/footer. Consent copy must use the same sales locale
 * as the page (cookie → else EN) — never Accept-Language alone.
 */
export default async function KompisSalesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const locale = resolveKompisWebSalesLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE)?.value ?? null,
  });
  const consentDict = await getDictionary(locale, ["analyticsConsent"]);
  const consentLabels = buildAnalyticsConsentLabels(createTranslator(consentDict));

  return (
    <AnalyticsConsentProvider labels={consentLabels} privacyHref="/privacy">
      <div className="min-h-full">
        <MarketingAnalyticsShell />
        {children}
      </div>
    </AnalyticsConsentProvider>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    robots: { index: true, follow: true },
  };
}
