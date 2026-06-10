import DashboardAuthGuard from "@/components/dashboard/DashboardAuthGuard";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import {
  CUSTOMER_CONTROL_CENTER_NAV,
  CUSTOMER_MOBILE_NAV_IDS,
} from "@/lib/dashboard/nav-config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPresenceLabels } from "@/lib/presence/labels";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["common", "auth", "dashboard", "branding", "presence"]);
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
          navConfig={CUSTOMER_CONTROL_CENTER_NAV.map((item) => ({
            id: item.id,
            href: item.href,
            label: t(item.labelKey),
          }))}
          shellVariant="customer"
          mobileNavIds={CUSTOMER_MOBILE_NAV_IDS}
          platformBrandMark={{
            poweredBy: t("branding.poweredBy"),
            tooltipTitle: t("branding.platformTooltipTitle"),
            tooltipTagline: t("branding.platformTooltipTagline"),
            versionLabel: t("branding.platformVersion"),
            pulseLabel: t("branding.pulseLabel"),
          }}
          presenceLabels={buildPresenceLabels(t)}
        >
          {children}
        </DashboardShell>
      </DashboardProfileProvider>
    </DashboardAuthGuard>
  );
}
