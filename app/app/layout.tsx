import CustomerPortalGuard from "@/components/app/CustomerPortalGuard";
import TwoFactorSessionGate from "@/components/auth/TwoFactorSessionGate";
import { DynamicNavigationSuspendedBanner, BusinessPackActivationInProgressBanner, NavigationUseTracker } from "@/components/app/dynamic-navigation";
import {
  buildBusinessPackActivationGateLabels,
  getOrganizationBusinessPackActivationGates,
} from "@/lib/business-pack-activation-gate";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import {
  filterFlatNavByAccess,
  filterNavGroupsByAccess,
} from "@/lib/app-portal/filter-nav-by-access";
import type { AppNavGroupConfig } from "@/lib/app/build-nav";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import { buildAppNavConfig, buildAppNavGroupConfig } from "@/lib/app/build-nav";
import {
  buildLayoutCommandBarLabels,
  buildLayoutCompanionExperienceLabels,
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
import { getAppLayoutDictionary, getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPwaInstallLabels } from "@/lib/pwa/labels";
import { createClient } from "@/lib/supabase/server";

/** Authenticated app shell — skip build-time static prerender (700+ routes). */
export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const layoutDict = await getAppLayoutDictionary(locale);
  const customerAppDict = await getCustomerAppDictionaryForSplits(locale, [
    "portalStructure",
    "companion",
  ]);
  const dict = { ...layoutDict, customerApp: customerAppDict.customerApp };
  const t = createTranslator(dict);
  const pwaDict = await getDictionary(locale, ["pwa"]);
  const pwaT = createTranslator(pwaDict);
  const pwaLabels = buildPwaInstallLabels(pwaT);
  const fallbackGroups = buildAppNavGroupConfig(t);
  const fallbackConfig = buildAppNavConfig(t);

  let navGroups = fallbackGroups;
  let navConfig = fallbackConfig;
  let navSearchIndex: AppNavSearchEntry[] = buildAppNavSearchIndex(fallbackGroups, fallbackConfig, t);
  let mobileNavIds: string[] = [...APP_MOBILE_NAV_IDS];
  let suspendedNotice: string | null = null;
  let showActivationBanner = false;
  const activationLabels = buildBusinessPackActivationGateLabels(t);

  function applyBusinessPackSettingsNavLock(groups: AppNavGroupConfig[]): AppNavGroupConfig[] {
    const lockHint = t("customerApp.portalStructure.businessPackSettings.navRequiresUpgrade");
    return groups.map((group) => ({
      ...group,
      items: group.items.map((item) =>
        item.id === "businessPackSettings"
          ? { ...item, locked: true, accessHint: lockHint }
          : item
      ),
    }));
  }

  try {
    const supabase = await createClient();
    const [dynamicRaw, activationGates, featureAccessRaw] = await Promise.all([
      getDynamicAppNavigation(supabase),
      getOrganizationBusinessPackActivationGates(supabase).catch(() => ({ found: false as const })),
      supabase.rpc("get_app_portal_feature_access", { p_feature: "business_packs" }),
    ]);
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
    showActivationBanner =
      activationGates.found === true &&
      (activationGates.items?.some((item) =>
        ["pending_activation", "validating"].includes(item.activation_status)
      ) ?? false);

    const featureAccess = featureAccessRaw.error
      ? null
      : parseAppPortalFeatureAccess(featureAccessRaw.data);
    if (featureAccess?.upgrade_required) {
      navGroups = applyBusinessPackSettingsNavLock(navGroups);
      navConfig = navConfig.map((item) =>
        item.id === "businessPackSettings"
          ? {
              ...item,
              locked: true,
              accessHint: t("customerApp.portalStructure.businessPackSettings.navRequiresUpgrade"),
            }
          : item
      );
    }

    navGroups = await filterNavGroupsByAccess(supabase, navGroups);
    navConfig = filterFlatNavByAccess(navConfig, navGroups);
    navSearchIndex = buildAppNavSearchIndex(navGroups, navConfig, t);
    mobileNavIds = mobileNavIds.filter((id) => navConfig.some((item) => item.id === id));
  } catch {
    // Fallback to static navigation when dynamic engine unavailable
  }

  return (
    <CustomerPortalGuard loadingLabel={t("common.loadingState.preparingContent")}>
      <TwoFactorSessionGate loadingLabel={t("common.loadingState.preparingContent")}>
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
          navSearchResultsLabel={t("shell.navSearch.results")}
          shellVariant="customer"
          mobileNavIds={mobileNavIds}
          licensePanelLabels={buildLayoutLicensePanelLabels(t)}
          companionExperienceLabels={buildLayoutCompanionExperienceLabels(t)}
          companionPresenceLabels={buildLayoutCompanionPresenceLabels(t)}
          voiceOfCustomerLabels={buildLayoutVocWidgetLabels(t)}
          locale={locale}
          organizationSwitcherLabels={{
            label: t("shell.multiTenantArchitecture.organizationSwitcher"),
            switching: t("shell.multiTenantArchitecture.switchingOrganization"),
          }}
          languageSelectorLabels={{
            label: t("shell.languageSelector.label"),
            activeLanguage: t("shell.languageSelector.activeLanguage"),
            changeLanguage: t("shell.languageSelector.changeLanguage"),
            switchFailed: t("shell.languageSelector.switchFailed"),
            retry: t("shell.languageSelector.retry"),
            openMenu: t("shell.languageSelector.openMenu"),
          }}
          shellUiLabels={{
            openMenu: t("shell.mobile.openMenu"),
            closeMenu: t("shell.mobile.closeMenu"),
            mobileNavigation: t("shell.mobile.navigation"),
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
          pwaLabels={pwaLabels}
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
          {showActivationBanner ? (
            <BusinessPackActivationInProgressBanner
              title={activationLabels.title}
              message={activationLabels.message}
              supportLabel={activationLabels.support}
            />
          ) : null}
          {children}
        </DashboardShell>
      </DashboardProfileProvider>
      </TwoFactorSessionGate>
    </CustomerPortalGuard>
  );
}
