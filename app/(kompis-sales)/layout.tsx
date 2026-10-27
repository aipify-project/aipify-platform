import type { Metadata } from "next";
import AnalyticsConsentProvider from "@/components/analytics/AnalyticsConsentProvider";
import MarketingAnalyticsShell from "@/components/marketing/MarketingAnalyticsShell";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { createTranslator } from "@/lib/i18n/translate";
import { buildAnalyticsConsentLabels } from "@/lib/product-analytics/consent";
import { getMarketingContext } from "@/lib/marketing/get-marketing-context";

/**
 * Isolated sales shell for `/` and `/kompis-web` — page owns its own header/footer.
 * Other marketing routes keep `app/(marketing)/layout.tsx`.
 */
export default async function KompisSalesLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { locale } = await getMarketingContext();
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
