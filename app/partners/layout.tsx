import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  PartnersPortalAuthGuard,
  PartnersPortalShell,
} from "@/components/partners-portal";
import { CspPortalSessionProvider } from "@/components/partners-portal/CspPortalSessionProvider";
import { PartnersPortalTopbarActions } from "@/components/partners-portal/PartnersPortalTopbarActions";
import AnalyticsConsentProvider from "@/components/analytics/AnalyticsConsentProvider";
import { AipifySystemNotice } from "@/components/ui/aipify-system-notice";
import {
  buildPartnersPortalLabels,
  buildPartnersPortalNavLabels,
} from "@/lib/partners-portal/labels";
import { resolvePartnersPortalServerAccess } from "@/lib/partners-portal/server-access";
import { buildAnalyticsConsentLabels } from "@/lib/product-analytics/consent";
import { buildPartnersPortalTopbarLabels } from "@/lib/partners-portal/shell-labels";
import { coerceToAppLocale } from "@/lib/i18n/app-locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function isPublicCertificateVerifyPath(pathname: string): boolean {
  return pathname === "/partners/academy/verify" || pathname.startsWith("/partners/academy/verify/");
}

export default async function PartnersPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "";

  // Public certificate verification must not require partner session or portal shell.
  if (isPublicCertificateVerifyPath(pathname)) {
    return <>{children}</>;
  }

  // Server-side gate — direct URLs cannot rely on the client AuthGuard alone.
  const access = await resolvePartnersPortalServerAccess();
  if (access.kind === "unauthorized") {
    redirect("/login?portal=partner&next=/partners");
  }
  if (access.kind === "denied") {
    return <AipifySystemNotice status="csp_partner_required" />;
  }

  const locale = await getLocale();
  const dict = await getDictionary(locale, [
    "common",
    "auth",
    "partnersPortal",
    "analyticsConsent",
  ]);
  const t = createTranslator(dict);
  const labels = buildPartnersPortalLabels(t);
  const legacyNavLabels = buildPartnersPortalNavLabels(t);
  const analyticsConsentLabels = buildAnalyticsConsentLabels(t);
  const appLocale = coerceToAppLocale(locale);
  const topbarLabels = buildPartnersPortalTopbarLabels(t);
  const avatarUrl = access.avatarUrl;
  const cspNavLabels: Record<string, string> = {
    ...legacyNavLabels,
    home: t("partnersPortal.certifiedSalesPartner.navGroups.home"),
    sales: t("partnersPortal.certifiedSalesPartner.navGroups.sales"),
    commission: t("partnersPortal.certifiedSalesPartner.navGroups.commission"),
    academy: t("partnersPortal.certifiedSalesPartner.navGroups.academy"),
    marketing: t("partnersPortal.certifiedSalesPartner.navGroups.marketing"),
    communication: t("partnersPortal.certifiedSalesPartner.navGroups.communication"),
    account: t("partnersPortal.certifiedSalesPartner.navGroups.account"),
    menu: t("partnersPortal.certifiedSalesPartner.nav.menu"),
    menuClose: t("partnersPortal.certifiedSalesPartner.nav.menuClose"),
    overview: t("partnersPortal.certifiedSalesPartner.nav.home"),
    productCatalog: t("partnersPortal.certifiedSalesPartner.nav.products"),
    referralLinks: t("partnersPortal.certifiedSalesPartner.nav.salesLinks"),
    salesPage: t("partnersPortal.certifiedSalesPartner.nav.salesPage"),
    leads: t("partnersPortal.certifiedSalesPartner.nav.leads"),
    prospects: t("partnersPortal.certifiedSalesPartner.nav.customers"),
    pipeline: t("partnersPortal.certifiedSalesPartner.nav.sales"),
    settlementPortal: t("partnersPortal.certifiedSalesPartner.nav.commissionPayouts"),
    trainingPrograms: t("partnersPortal.certifiedSalesPartner.nav.growthAcademy"),
    certifications: t("partnersPortal.certifiedSalesPartner.nav.certifications"),
    marketingAssets: t("partnersPortal.certifiedSalesPartner.nav.salesTools"),
    salesMaterials: t("partnersPortal.certifiedSalesPartner.nav.salesMaterials"),
    emailTemplates: t("partnersPortal.certifiedSalesPartner.nav.emailTemplates"),
    messages: t("partnersPortal.certifiedSalesPartner.nav.messages"),
    notifications: t("partnersPortal.certifiedSalesPartner.nav.notifications"),
    settings: t("partnersPortal.certifiedSalesPartner.nav.help"),
    profile: t("partnersPortal.certifiedSalesPartner.nav.profile"),
    mainNavigation: topbarLabels.mainNavigation,
  };

  return (
    <AnalyticsConsentProvider labels={analyticsConsentLabels} privacyHref="/privacy">
      <PartnersPortalAuthGuard loadingLabel={labels.shell.loading} serverAuthorized>
        <CspPortalSessionProvider>
          <PartnersPortalShell
            portalBadge={t("partnersPortal.certifiedSalesPartner.portal.badge")}
            portalTitle={t("partnersPortal.certifiedSalesPartner.portal.title")}
            portalSubtitle={t("partnersPortal.certifiedSalesPartner.portal.subtitle")}
            signOutLabel={t("auth.logout.signOut")}
            governanceNote={labels.shell.governanceNote}
            poweredByLabel={t("partnersPortal.shell.poweredBy")}
            navLabels={cspNavLabels}
            certifiedSalesPartnerMode
            topbarActions={
              <PartnersPortalTopbarActions
                locale={appLocale}
                labels={topbarLabels}
                avatarUrl={avatarUrl}
              />
            }
          >
            {children}
          </PartnersPortalShell>
        </CspPortalSessionProvider>
      </PartnersPortalAuthGuard>
    </AnalyticsConsentProvider>
  );
}
