import type { Metadata } from "next";
import AnalyticsConsentProvider from "@/components/analytics/AnalyticsConsentProvider";
import MarketingAnalyticsShell from "@/components/marketing/MarketingAnalyticsShell";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { buildAnalyticsConsentLabels } from "@/lib/product-analytics/consent";
import { loadKompisWebSalesRouteContext } from "@/lib/marketing/kompis-web-sales/sales-route";

/**
 * Isolated sales shell for `/`, `/kompis-web`, `/start`, and public legal pages.
 * Consent labels must follow the same cookie-only sales locale as the page
 * (not Accept-Language), so English anonymous visitors do not see Norwegian consent.
 */
export default async function KompisSalesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale } = await loadKompisWebSalesRouteContext();
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
