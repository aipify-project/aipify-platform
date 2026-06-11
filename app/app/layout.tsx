import DashboardAuthGuard from "@/components/dashboard/DashboardAuthGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import { buildAppNavConfig } from "@/lib/app/build-nav";
import { APP_MOBILE_NAV_IDS } from "@/lib/app/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildLicensePanelLabels } from "@/lib/app/license-labels";
import { buildPresenceLabels } from "@/lib/presence/labels";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, [
    "common",
    "auth",
    "dashboard",
    "branding",
    "presence",
    "license",
    "customerApp",
  ]);
  const t = createTranslator(dict);

  return (
    <DashboardAuthGuard loadingLabel={t("common.loading")}>
      <DashboardProfileProvider>
        <DashboardShell
          appName={t("common.appName")}
          planName={t("dashboard.sidebar.plan")}
          shellLabel={t("dashboard.sidebar.customerControlCenter")}
          searchPlaceholder={t("dashboard.search")}
          companySelectorLabel={t("dashboard.topbar.companySelector")}
          notificationsLabel={t("dashboard.topbar.notifications")}
          profileFallbackName={t("dashboard.topbar.profileFallback")}
          companyFallbackName={t("dashboard.topbar.companyFallback")}
          signOutLabel={t("auth.logout.signOut")}
          roleLabels={{
            owner: t("dashboard.roles.owner"),
            admin: t("dashboard.roles.admin"),
            support: t("dashboard.roles.support"),
            staff: t("dashboard.roles.staff"),
            read_only: t("dashboard.roles.read_only"),
          }}
          navConfig={buildAppNavConfig({
            overview: t("customerApp.nav.overview"),
            executive: t("customerApp.nav.executive"),
            presence: t("customerApp.nav.presence"),
            recommendations: t("customerApp.nav.recommendations"),
            skills: t("customerApp.nav.skills"),
            approvals: t("customerApp.nav.approvals"),
            actionCenter: t("customerApp.nav.actionCenter"),
            businessPulse: t("customerApp.nav.businessPulse"),
            strategicGoals: t("customerApp.nav.strategicGoals"),
            frictionIntelligence: t("customerApp.nav.frictionIntelligence"),
            organizationalMemory: t("customerApp.nav.organizationalMemory"),
            installations: t("customerApp.nav.installations"),
            domains: t("customerApp.nav.domains"),
            team: t("customerApp.nav.team"),
            license: t("customerApp.nav.license"),
            security: t("customerApp.nav.security"),
            settings: t("customerApp.nav.settings"),
          })}
          shellVariant="customer"
          mobileNavIds={APP_MOBILE_NAV_IDS}
          licensePanelLabels={buildLicensePanelLabels(t)}
          presenceLabels={buildPresenceLabels(t)}
          locale={locale}
        >
          {children}
        </DashboardShell>
      </DashboardProfileProvider>
    </DashboardAuthGuard>
  );
}
