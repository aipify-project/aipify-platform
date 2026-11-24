import {
  PartnersPortalAuthGuard,
  PartnersPortalShell,
} from "@/components/partners-portal";
import AnalyticsConsentProvider from "@/components/analytics/AnalyticsConsentProvider";
import {
  buildPartnersPortalLabels,
  buildPartnersPortalNavLabels,
} from "@/lib/partners-portal/labels";
import { buildAnalyticsConsentLabels } from "@/lib/product-analytics/consent";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnersPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dict = await getDictionary(await getLocale(), ["common", "auth", "partnersPortal", "analyticsConsent"]);
  const t = createTranslator(dict);
  const labels = buildPartnersPortalLabels(t);
  const legacyNavLabels = buildPartnersPortalNavLabels(t);
  const analyticsConsentLabels = buildAnalyticsConsentLabels(t);
  const cspNavLabels: Record<string, string> = {
    ...legacyNavLabels,
    dashboard: t("partnersPortal.certifiedSalesPartner.navGroups.home"),
    customers: t("partnersPortal.certifiedSalesPartner.navGroups.pipeline"),
    settlement: t("partnersPortal.certifiedSalesPartner.navGroups.economy"),
    academy: t("partnersPortal.certifiedSalesPartner.navGroups.academy"),
    account: t("partnersPortal.certifiedSalesPartner.navGroups.account"),
    overview: t("partnersPortal.certifiedSalesPartner.nav.home"),
    productCatalog: t("partnersPortal.certifiedSalesPartner.nav.products"),
    referralLinks: t("partnersPortal.certifiedSalesPartner.nav.salesLinks"),
    leads: t("partnersPortal.certifiedSalesPartner.nav.leads"),
    prospects: t("partnersPortal.certifiedSalesPartner.nav.customers"),
    pipeline: t("partnersPortal.certifiedSalesPartner.nav.sales"),
    settlementPortal: t("partnersPortal.certifiedSalesPartner.nav.commissionPayouts"),
    trainingPrograms: t("partnersPortal.certifiedSalesPartner.nav.growthAcademy"),
    certifications: t("partnersPortal.certifiedSalesPartner.nav.certifications"),
    marketingAssets: t("partnersPortal.certifiedSalesPartner.nav.salesTools"),
    notifications: t("partnersPortal.certifiedSalesPartner.nav.notifications"),
    settings: t("partnersPortal.certifiedSalesPartner.nav.help"),
    profile: t("partnersPortal.certifiedSalesPartner.nav.profile"),
  };

  return (
    <AnalyticsConsentProvider labels={analyticsConsentLabels} privacyHref="/privacy">
    <PartnersPortalAuthGuard loadingLabel={labels.shell.loading}>
      <PartnersPortalShell
        portalBadge={t("partnersPortal.certifiedSalesPartner.portal.badge")}
        portalTitle={t("partnersPortal.certifiedSalesPartner.portal.title")}
        portalSubtitle={t("partnersPortal.certifiedSalesPartner.portal.subtitle")}
        signOutLabel={t("auth.logout.signOut")}
        governanceNote={labels.shell.governanceNote}
        navLabels={cspNavLabels}
        certifiedSalesPartnerMode
      >
        {children}
      </PartnersPortalShell>
    </PartnersPortalAuthGuard>
    </AnalyticsConsentProvider>
  );
}
