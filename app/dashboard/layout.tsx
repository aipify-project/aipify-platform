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
import { buildLicensePanelLabels } from "@/lib/app/license-labels";
import { buildPresenceLabels } from "@/lib/presence/labels";

export default async function DashboardLayout({
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
          navConfig={CUSTOMER_CONTROL_CENTER_NAV.map((item) => ({
            id: item.id,
            href: item.href,
            label: t(item.labelKey),
          }))}
          shellVariant="customer"
          mobileNavIds={CUSTOMER_MOBILE_NAV_IDS}
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
