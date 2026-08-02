import CustomerPortalGuard from "@/components/app/CustomerPortalGuard";
import { AppTenantBootstrapSurface } from "@/components/app/bootstrap/AppTenantBootstrapSurface";
import TwoFactorSessionGate from "@/components/auth/TwoFactorSessionGate";
import { DynamicNavigationSuspendedBanner, BusinessPackActivationInProgressBanner, NavigationUseTracker } from "@/components/app/dynamic-navigation";
import {
  buildBusinessPackActivationGateLabels,
  getOrganizationBusinessPackActivationGates,
} from "@/lib/business-pack-activation-gate";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal/parse";
import { presentAppNavFromCapabilities } from "@/lib/app-portal/canonical-nav";
import type { AppNavGroupConfig } from "@/lib/app/build-nav";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { DashboardProfileProvider } from "@/components/dashboard/DashboardProfileProvider";
import {
  buildLayoutCommandBarLabels,
  buildLayoutCompanionExperienceLabels,
  buildLayoutCompanionPresenceLabels,
  buildLayoutLicensePanelLabels,
  buildLayoutNotificationCenterLabels,
  buildLayoutVocWidgetLabels,
} from "@/lib/app/layout-shell-labels";
import { buildAppNavSearchIndex, type AppNavSearchEntry } from "@/lib/app/nav-search";
import { customerNavSourcesFromSearchIndex } from "@/lib/command-bar";
import {
  buildFailClosedAppMenuCapabilityBundle,
  loadAppMenuCapabilityBundle,
} from "@/lib/core/app-menu-capability";
import { getDynamicAppNavigation, parseDynamicAppNavigation } from "@/lib/dynamic-navigation";
import { getAppLayoutDictionary, getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { getPlatformAccessProfile } from "@/lib/portals/separation";
import { buildPwaInstallLabels } from "@/lib/pwa/labels";
import { createClient } from "@/lib/supabase/server";
import { resolveAppLayoutBranch } from "@/lib/tenant/resolve-app-layout-branch";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import AnalyticsConsentProvider from "@/components/analytics/AnalyticsConsentProvider";
import { buildAnalyticsConsentLabels } from "@/lib/product-analytics/consent";
import { redirect } from "next/navigation";

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
  const consentDict = await getDictionary(locale, ["analyticsConsent"]);
  const analyticsConsentLabels = buildAnalyticsConsentLabels(createTranslator(consentDict));
  const failClosedPresented = presentAppNavFromCapabilities(
    buildFailClosedAppMenuCapabilityBundle({
      organizationId: null,
      userId: null,
      role: null,
    }),
    t
  );

  let navGroups = failClosedPresented.navGroups;
  let navConfig = failClosedPresented.navConfig;
  let navSearchIndex: AppNavSearchEntry[] = buildAppNavSearchIndex(
    failClosedPresented.navGroups,
    failClosedPresented.navConfig,
    t
  );
  let mobileNavIds: string[] = [...failClosedPresented.mobileNavIds];
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

  const supabase = await createClient();
  const [{ data: orgContextRaw }, platformAccess] = await Promise.all([
    supabase.rpc("get_app_organization_context"),
    getPlatformAccessProfile(supabase),
  ]);
  const orgContext = parseAppOrganizationContext(orgContextRaw);
  const layoutBranch = resolveAppLayoutBranch({
    state: orgContext.state,
    hasPlatformAccess: platformAccess.isPlatformAdmin,
  });

  if (layoutBranch === "platform") {
    redirect("/platform");
  }

  const bootstrapState =
    orgContext.state === "selection_required" ? "selection_required" : "membership_missing";
  const bootstrapLabels = {
    titleSelectionRequired: t("shell.multiTenantArchitecture.organizationSwitcher"),
    messageSelectionRequired: t("shell.licenseSidebar.organizationMissing"),
    titleMembershipMissing: t("shell.licenseSidebar.organizationMissing"),
    messageMembershipMissing: t("shell.licenseSidebar.contextUnavailable"),
    selectOrganization: t("shell.multiTenantArchitecture.yourOrganizations"),
    switching: t("shell.multiTenantArchitecture.switchingOrganization"),
    switchFailed: t("shell.languageSelector.switchFailed"),
    retry: t("shell.languageSelector.retry"),
  };

  if (layoutBranch === "shell") {
    try {
      // Core is the sole authority for which capability ids may appear in Customer APP nav.
      // Dynamic navigation may only contribute suspension notices — never menu items.
      const [capabilityBundle, activationGates, featureAccessRaw, dynamicRaw] = await Promise.all([
        loadAppMenuCapabilityBundle(supabase),
        getOrganizationBusinessPackActivationGates(supabase).catch(() => ({ found: false as const })),
        supabase.rpc("get_app_portal_feature_access", { p_feature: "business_packs" }),
        getDynamicAppNavigation(supabase).catch(() => null),
      ]);

      const presented = presentAppNavFromCapabilities(capabilityBundle, t);
      navGroups = presented.navGroups;
      navConfig = presented.navConfig;
      mobileNavIds = presented.mobileNavIds;
      navSearchIndex = buildAppNavSearchIndex(navGroups, navConfig, t);

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

      if (dynamicRaw) {
        const dynamicNav = parseDynamicAppNavigation(dynamicRaw);
        if (dynamicNav?.suspended && dynamicNav.suspended_notice) {
          suspendedNotice = dynamicNav.suspended_notice;
        }
      }
    } catch {
      // Fail closed — never restore mega-nav or unfiltered dynamic payloads.
      const closed = presentAppNavFromCapabilities(
        buildFailClosedAppMenuCapabilityBundle({
          organizationId: null,
          userId: null,
          role: null,
        }),
        t
      );
      navGroups = closed.navGroups;
      navConfig = closed.navConfig;
      mobileNavIds = closed.mobileNavIds;
      navSearchIndex = buildAppNavSearchIndex(navGroups, navConfig, t);
    }
  }

  return (
    <AnalyticsConsentProvider labels={analyticsConsentLabels} privacyHref="/privacy">
    <CustomerPortalGuard loadingLabel={t("common.loadingState.preparingContent")}>
      <TwoFactorSessionGate loadingLabel={t("common.loadingState.preparingContent")}>
      {layoutBranch === "bootstrap" ? (
        <AppTenantBootstrapSurface state={bootstrapState} labels={bootstrapLabels} />
      ) : (
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
          notificationCenterLabels={buildLayoutNotificationCenterLabels(t)}
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
      )}
      </TwoFactorSessionGate>
    </CustomerPortalGuard>
    </AnalyticsConsentProvider>
  );
}
