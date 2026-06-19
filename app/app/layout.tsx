import CustomerPortalGuard from "@/components/app/CustomerPortalGuard";
import TwoFactorSessionGate from "@/components/auth/TwoFactorSessionGate";
import { DynamicNavigationSuspendedBanner, NavigationUseTracker } from "@/components/app/dynamic-navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import { buildAppNavConfig, buildAppNavGroupConfig } from "@/lib/app/build-nav";
import {
  buildLayoutCommandBarLabels,
  buildLayoutCompanionPresenceLabels,
  buildLayoutLicensePanelLabels,
  buildLayoutVocWidgetLabels,
} from "@/lib/app/layout-shell-labels";
import { buildAppNavSearchIndex, type AppNavSearchEntry } from "@/lib/app/nav-search";
import { APP_MOBILE_NAV_IDS } from "@/lib/app/nav-config";
import { customerNavSourcesFromSearchIndex } from "@/lib/command-bar";
import {
  buildAppNavFromDynamicNavigation,
  buildNavSearchFromDynamicNavigation,
  getDynamicAppNavigation,
  mergeDynamicWithFallbackNav,
  parseDynamicAppNavigation,
} from "@/lib/dynamic-navigation";
import { getAppLayoutDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";

/** Authenticated app shell — skip build-time static prerender (700+ routes). */
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const dict = await getAppLayoutDictionary(locale);
  const t = createTranslator(dict);
  const fallbackGroups = buildAppNavGroupConfig(t);
  const fallbackConfig = buildAppNavConfig(t);

  let navGroups = fallbackGroups;
  let navConfig = fallbackConfig;
  let navSearchIndex: AppNavSearchEntry[] = buildAppNavSearchIndex(fallbackGroups, fallbackConfig, t);
  let mobileNavIds: string[] = [...APP_MOBILE_NAV_IDS];
  let suspendedNotice: string | null = null;

  try {
    const supabase = await createClient();
    const dynamicRaw = await getDynamicAppNavigation(supabase);
    const dynamicNav = parseDynamicAppNavigation(dynamicRaw);
    if (dynamicNav?.found) {
      const built = buildAppNavFromDynamicNavigation(dynamicNav, t);
      const merged = mergeDynamicWithFallbackNav(built, fallbackGroups, fallbackConfig);
      navGroups = merged.navGroups;
      navConfig = merged.navConfig;
      navSearchIndex = buildNavSearchFromDynamicNavigation(dynamicNav).map((entry) => ({
        ...entry,
        groupId: "modules" as const,
        groupLabel: entry.groupLabel,
      }));
      if (navSearchIndex.length === 0) {
        navSearchIndex = buildAppNavSearchIndex(navGroups, navConfig, t);
      }
      mobileNavIds = built.mobileNavIds;
      if (dynamicNav.suspended && dynamicNav.suspended_notice) {
        suspendedNotice = dynamicNav.suspended_notice;
      }
    }
  } catch {
    // Fallback to static navigation when dynamic engine unavailable
  }

  return (
    <CustomerPortalGuard loadingLabel={t("common.loading")}>
      <TwoFactorSessionGate loadingLabel={t("common.loading")}>
      <DashboardProfileProvider>
        <DashboardShell
          appName={t("common.appName")}
          planName={t("shell.sidebar.plan")}
          shellLabel={t("shell.sidebar.workspaceControlCenter")}
          searchPlaceholder={t("shell.search")}
          companySelectorLabel={t("shell.topbar.companySelector")}
          notificationsLabel={t("shell.topbar.notifications")}
          profileFallbackName={t("shell.topbar.profileFallback")}
          companyFallbackName={t("shell.topbar.companyFallback")}
          signOutLabel={t("shell.signOut")}
          roleLabels={{
            owner: t("shell.roles.owner"),
            admin: t("shell.roles.admin"),
            support: t("shell.roles.support"),
            staff: t("shell.roles.staff"),
            read_only: t("shell.roles.read_only"),
            super_admin: t("shell.roles.super_admin"),
            platform_support: t("shell.roles.platform_support"),
            manager: t("shell.roles.manager"),
            growth_partner: t("shell.roles.growth_partner"),
            moderator: t("shell.roles.moderator"),
            member: t("shell.roles.member"),
          }}
          navConfig={navConfig}
          navGroups={navGroups}
          navSearchIndex={navSearchIndex}
          navSearchNoResultsLabel={t("shell.navSearch.noResults")}
          navSearchHint={t("shell.navSearch.hint")}
          navCompactToggleLabel={t("shell.navSearch.compactToggle")}
          navSearchResultsLabel={t("shell.navSearch.results")}
          shellVariant="customer"
          mobileNavIds={mobileNavIds}
          licensePanelLabels={buildLayoutLicensePanelLabels(t)}
          companionPresenceLabels={buildLayoutCompanionPresenceLabels(t)}
          voiceOfCustomerLabels={buildLayoutVocWidgetLabels(t)}
          locale={locale}
          organizationSwitcherLabels={{
            label: t("shell.multiTenantArchitecture.organizationSwitcher"),
            switching: t("shell.multiTenantArchitecture.switchingOrganization"),
          }}
          twoFactorBadgeLabels={{
            enabled: t("shell.twoFactor.badge.enabled"),
            required: t("shell.twoFactor.badge.required"),
          }}
          commandBar={{
            portal: "customer",
            labels: buildLayoutCommandBarLabels(t),
            navSources: customerNavSourcesFromSearchIndex(navSearchIndex),
          }}
        >
          <NavigationUseTracker />
          {suspendedNotice ? (
            <DynamicNavigationSuspendedBanner
              notice={suspendedNotice}
              renewLabel={t("customerApp.dynamicNavigation.renewSubscription")}
              billingLabel={t("customerApp.dynamicNavigation.billing")}
              supportLabel={t("customerApp.dynamicNavigation.support")}
            />
          ) : null}
          {children}
        </DashboardShell>
      </DashboardProfileProvider>
      </TwoFactorSessionGate>
    </CustomerPortalGuard>
  );
}
