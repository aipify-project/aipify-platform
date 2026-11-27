"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AipifyShellClasses, AipifySidebarTypography, AipifySidebarLayout } from "@/lib/design";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import { AppCanvasBackground } from "@/components/app/design/AppCanvasBackground";
import { useEffect, useMemo, useState } from "react";
import { usePlatformProfile } from "@/components/platform/PlatformProfileProvider";
import { useOptionalDashboardProfile } from "./DashboardProfileProvider";
import { AipifyPlatformBrandMark } from "@/components/branding";
import { PoweredByAipifyFooter } from "@/components/branding/PoweredByAipifyFooter";
import { LicenseSidebarPanel } from "@/components/app/license";
import Sidebar, { type NavItem } from "./Sidebar";
import FlatSidebar from "./FlatSidebar";
import GroupedSidebar from "./GroupedSidebar";
import SidebarBrand, { SidebarBrandLegacy } from "./SidebarBrand";
import { TopbarShareFeedbackButton } from "@/components/app/voice-of-the-customer";
import type { VocWidgetLabels } from "@/lib/voice-of-the-customer";
import type { CompanionPresenceLabels } from "@/components/app/companion-presence";
import { PresenceProvider, type PresenceLabels } from "@/components/presence/PresenceProvider";
import {
  UnifiedNotificationFeedProvider,
} from "@/components/presence/UnifiedNotificationFeedProvider";
import { NotificationCenterDrawer } from "@/components/presence/NotificationCenterDrawer";
import type { UnifiedNotificationCenterLabels } from "@/lib/presence/unified-notification-feed";
import Topbar from "./Topbar";
import { OrganizationSwitcher } from "@/components/app/organization";
import {
  ProductContextSwitcher,
  type ProductContextSwitcherLabels,
} from "@/components/app/product-context/ProductContextSwitcher";
import {
  AppLanguageSelector,
  coerceClientAppLocale,
} from "@/components/app/AppLanguageSelector";
import { CommandBarProvider, useOptionalCommandBar } from "@/components/command-bar";
import type {
  CommandBarLabels,
  CommandBarNavSource,
  CommandBarPortal,
} from "@/lib/command-bar";
import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import {
  getAppPortalActiveNavId,
  getAppPortalSettingsActiveNavId,
} from "@/lib/app-portal/nav-config";
import type { AppProductContextId } from "@/lib/app-portal/product-context/constants";
import { getCustomerActiveNavId } from "@/lib/dashboard/nav-config";
import { getPlatformActiveNavId } from "@/lib/platform/nav-config";
import { getNavIcon } from "./nav-icons";
import { AipifyWebAppInstallAction } from "@/components/pwa/AipifyWebAppInstallAction";
import { coerceToAppLocale } from "@/lib/i18n/app-locales";
import type { PwaInstallLabels } from "@/lib/pwa/types";

const SETTINGS_SURFACE_NAV_IDS = new Set([
  "accountIntegrations",
  "accountNotifications",
  "kompisWebAppearance",
]);

type DashboardShellProps = {
  appName: string;
  planName: string;
  shellLabel: string;
  searchPlaceholder: string;
  companySelectorLabel: string;
  notificationsLabel: string;
  roleLabels: Record<string, string>;
  profileFallbackName: string;
  companyFallbackName: string;
  signOutLabel: string;
  navConfig: AppNavLink[];
  navGroups?: AppNavGroupConfig[];
  navSearchIndex?: import("@/lib/nav/search-entry").NavSearchEntry[];
  navSearchNoResultsLabel?: string;
  shellVariant: "platform" | "customer";
  mobileNavIds: string[];
  navSearchHint?: string;
  navSearchResultsLabel?: string;
  navigationAriaLabel?: string;
  companyNameOverride?: string;
  platformBrandMark?: {
    poweredBy: string;
    tooltipTitle: string;
    tooltipTagline: string;
    versionLabel: string;
    pulseLabel: string;
  };
  licensePanelLabels?: {
    workspace: string;
    licensedTo: string;
    plan: string;
    status: string;
    version: string;
    poweredBy: string;
    copyright: string;
    statusActive: string;
    statusGrace: string;
    statusPaused: string;
    statusUnknown: string;
    notConfigured: string;
    notAssigned: string;
    organizationMissing: string;
    contextLoading: string;
    contextUnavailable: string;
    pulseLabel: string;
    privacySettingsOpen: string;
  };
  presenceLabels?: PresenceLabels;
  companionPresenceLabels?: CompanionPresenceLabels;
  locale?: string;
  languageSelectorLabels?: {
    label: string;
    activeLanguage: string;
    changeLanguage: string;
    switchFailed: string;
    retry: string;
    openMenu: string;
  };
  shellUiLabels?: {
    openMenu: string;
    closeMenu: string;
    mobileNavigation: string;
  };
  organizationSwitcherLabels?: {
    label: string;
    switching: string;
  };
  /** Job 60 — flat product menu + context switcher (customer APP only). */
  productContext?: {
    activeProduct: AppProductContextId | null;
    availableProducts: AppProductContextId[];
    labels: ProductContextSwitcherLabels;
  };
  twoFactorBadgeLabels?: {
    enabled: string;
    required: string;
  };
  commandBar?: {
    portal: CommandBarPortal;
    labels: CommandBarLabels;
    navSources: CommandBarNavSource[];
  };
  voiceOfCustomerLabels?: VocWidgetLabels;
  notificationCenterLabels?: UnifiedNotificationCenterLabels;
  pwaLabels?: PwaInstallLabels;
  /** Last customer-menu item, under the product list. Not part of a product menu. */
  customerProfileLink?: {
    href: string;
    label: string;
  };
  /** Customer service — directly under Kundeforhold in the sidebar footer. */
  customerSupportLink?: {
    href: string;
    label: string;
  };
  /** Header Contact Support shortcut (all customer pages). */
  supportContactLink?: {
    href: string;
    label: string;
  };
  onMenuClick?: () => void;
  children: React.ReactNode;
};

export default function DashboardShell({
  appName,
  planName,
  shellLabel,
  searchPlaceholder,
  companySelectorLabel,
  notificationsLabel,
  roleLabels,
  profileFallbackName,
  companyFallbackName,
  signOutLabel,
  navConfig,
  navGroups,
  navSearchIndex,
  navSearchNoResultsLabel,
  shellVariant,
  mobileNavIds,
  navSearchHint,
  navSearchResultsLabel,
  navigationAriaLabel,
  companyNameOverride,
  platformBrandMark,
  licensePanelLabels,
  presenceLabels,
  companionPresenceLabels,
  locale = "en",
  languageSelectorLabels,
  shellUiLabels,
  organizationSwitcherLabels,
  productContext,
  twoFactorBadgeLabels,
  commandBar,
  voiceOfCustomerLabels,
  notificationCenterLabels,
  pwaLabels,
  customerProfileLink,
  customerSupportLink,
  supportContactLink,
  children,
}: DashboardShellProps) {
  if (commandBar) {
    return (
      <CommandBarProvider
        portal={commandBar.portal}
        labels={commandBar.labels}
        navSources={commandBar.navSources}
      >
        <DashboardShellFrame
          appName={appName}
          planName={planName}
          shellLabel={shellLabel}
          searchPlaceholder={searchPlaceholder}
          companySelectorLabel={companySelectorLabel}
          notificationsLabel={notificationsLabel}
          roleLabels={roleLabels}
          profileFallbackName={profileFallbackName}
          companyFallbackName={companyFallbackName}
          signOutLabel={signOutLabel}
          navConfig={navConfig}
          navGroups={navGroups}
          navSearchIndex={navSearchIndex}
          navSearchNoResultsLabel={navSearchNoResultsLabel}
          shellVariant={shellVariant}
          mobileNavIds={mobileNavIds}
          navSearchHint={navSearchHint}
          navSearchResultsLabel={navSearchResultsLabel}
          navigationAriaLabel={navigationAriaLabel}
          companyNameOverride={companyNameOverride}
          platformBrandMark={platformBrandMark}
          licensePanelLabels={licensePanelLabels}
          presenceLabels={presenceLabels}
          companionPresenceLabels={companionPresenceLabels}
          voiceOfCustomerLabels={voiceOfCustomerLabels}
          notificationCenterLabels={notificationCenterLabels}
          locale={locale}
          languageSelectorLabels={
            shellVariant === "customer" ? languageSelectorLabels : undefined
          }
          pwaLabels={pwaLabels}
          customerProfileLink={customerProfileLink}
          customerSupportLink={customerSupportLink}
          supportContactLink={supportContactLink}
          shellUiLabels={shellUiLabels}
          organizationSwitcherLabels={organizationSwitcherLabels}
          productContext={productContext}
          twoFactorBadgeLabels={twoFactorBadgeLabels}
          commandBarLabels={commandBar.labels}
        >
          {children}
        </DashboardShellFrame>
      </CommandBarProvider>
    );
  }

  return (
    <DashboardShellFrame
      appName={appName}
      planName={planName}
      shellLabel={shellLabel}
      searchPlaceholder={searchPlaceholder}
      companySelectorLabel={companySelectorLabel}
      notificationsLabel={notificationsLabel}
      roleLabels={roleLabels}
      profileFallbackName={profileFallbackName}
      companyFallbackName={companyFallbackName}
      signOutLabel={signOutLabel}
      navConfig={navConfig}
      navGroups={navGroups}
      navSearchIndex={navSearchIndex}
      navSearchNoResultsLabel={navSearchNoResultsLabel}
      shellVariant={shellVariant}
      mobileNavIds={mobileNavIds}
      navSearchHint={navSearchHint}
      navSearchResultsLabel={navSearchResultsLabel}
      navigationAriaLabel={navigationAriaLabel}
      companyNameOverride={companyNameOverride}
      platformBrandMark={platformBrandMark}
      licensePanelLabels={licensePanelLabels}
      presenceLabels={presenceLabels}
      companionPresenceLabels={companionPresenceLabels}
      voiceOfCustomerLabels={voiceOfCustomerLabels}
      notificationCenterLabels={notificationCenterLabels}
      locale={locale}
      languageSelectorLabels={languageSelectorLabels}
      pwaLabels={pwaLabels}
      customerProfileLink={customerProfileLink}
      customerSupportLink={customerSupportLink}
      supportContactLink={supportContactLink}
      shellUiLabels={shellUiLabels}
      organizationSwitcherLabels={organizationSwitcherLabels}
      productContext={productContext}
      twoFactorBadgeLabels={twoFactorBadgeLabels}
    >
      {children}
    </DashboardShellFrame>
  );
}

type DashboardShellFrameProps = Omit<DashboardShellProps, "commandBar"> & {
  commandBarLabels?: CommandBarLabels;
};

function DashboardShellFrame({
  appName,
  planName,
  shellLabel,
  searchPlaceholder,
  companySelectorLabel,
  notificationsLabel,
  roleLabels,
  profileFallbackName,
  companyFallbackName,
  signOutLabel,
  navConfig,
  navGroups,
  navSearchIndex,
  navSearchNoResultsLabel,
  shellVariant,
  mobileNavIds,
  navSearchHint,
  navSearchResultsLabel,
  navigationAriaLabel,
  companyNameOverride,
  platformBrandMark,
  licensePanelLabels,
  presenceLabels,
  locale = "en",
  languageSelectorLabels,
  shellUiLabels,
  organizationSwitcherLabels,
  productContext,
  twoFactorBadgeLabels,
  voiceOfCustomerLabels,
  notificationCenterLabels,
  pwaLabels,
  customerProfileLink,
  customerSupportLink,
  supportContactLink,
  commandBarLabels,
  children,
}: DashboardShellFrameProps) {
  const pathname = usePathname();
  const customerProfileHref = customerProfileLink?.href ?? "";
  const customerProfileActive =
    customerProfileHref.length > 0 &&
    (pathname === customerProfileHref ||
      pathname.startsWith(`${customerProfileHref}/`) ||
      pathname.startsWith("/app/account/profile"));
  const customerSupportHref = customerSupportLink?.href ?? "";
  const customerSupportActive =
    customerSupportHref.length > 0 &&
    (pathname === customerSupportHref ||
      pathname.startsWith(`${customerSupportHref}/`) ||
      pathname.startsWith("/app/support/requests") ||
      pathname.startsWith("/app/support/contact"));
  const activeNav = useMemo(() => {
    if (shellVariant === "platform") {
      return getPlatformActiveNavId(pathname);
    }
    if (pathname.startsWith("/app")) {
      const raw = getAppPortalActiveNavId(pathname);
      if (
        productContext?.activeProduct &&
        SETTINGS_SURFACE_NAV_IDS.has(raw)
      ) {
        return getAppPortalSettingsActiveNavId(productContext.activeProduct);
      }
      return raw;
    }
    return getCustomerActiveNavId(pathname);
  }, [shellVariant, pathname, productContext?.activeProduct]);
  const customerContext = useOptionalDashboardProfile();
  const platformContext = usePlatformProfile();
  const commandBarContext = useOptionalCommandBar();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navSearchQuery, setNavSearchQuery] = useState("");

  const navItems = useMemo<NavItem[]>(
    () =>
      navConfig.map((item) => ({
        ...item,
        icon: getNavIcon(item.id),
      })),
    [navConfig]
  );

  /**
   * Unified APP shell uses GroupedSidebar (shared + Mine Produkter + administration).
   * Flat product sidebar is retained only when a single synthetic product group is presented.
   */
  const useFlatProductSidebar =
    shellVariant === "customer" &&
    pathname.startsWith("/app") &&
    Boolean(productContext) &&
    (navGroups?.length ?? 0) <= 1;

  const profileName =
    customerContext?.profile?.user.full_name ??
    platformContext?.displayName ??
    profileFallbackName;

  const companyName =
    companyNameOverride ??
    customerContext?.profile?.company.name ??
    companyFallbackName;

  const profileRoleKey = customerContext?.profile?.user.role
    ?? platformContext?.platformAdmin?.role
    ?? "owner";

  const profileRole = customerContext?.profile
    ? roleLabels[customerContext.profile.user.role] ?? customerContext.profile.user.role
    : platformContext?.platformAdmin
      ? roleLabels[platformContext.platformAdmin.role] ?? platformContext.platformAdmin.role
      : roleLabels.owner;

  const profileLoading =
    customerContext?.loading ?? platformContext?.loading ?? false;

  useEffect(() => {
    if (commandBarContext) return;

    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("app-nav-search")?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [commandBarContext]);

  const useGroupedSidebar = Boolean(navGroups && navSearchIndex) && !useFlatProductSidebar;

  const renderProductSwitcher = () =>
    useFlatProductSidebar && productContext ? (
      <ProductContextSwitcher
        activeProduct={productContext.activeProduct}
        availableProducts={productContext.availableProducts}
        organizationName={companyName}
        labels={productContext.labels}
        pathname={pathname}
      />
    ) : null;

  const sidebarNav = useFlatProductSidebar ? (
    <FlatSidebar
      items={navConfig}
      activeId={activeNav}
      navigationAriaLabel={navigationAriaLabel}
    />
  ) : useGroupedSidebar ? (
    <GroupedSidebar
      groups={navGroups!}
      searchIndex={navSearchIndex!}
      activeId={activeNav}
      searchQuery={navSearchQuery}
      searchResultsLabel={navSearchResultsLabel}
      keyboardHint={navSearchHint}
      noSearchResultsLabel={navSearchNoResultsLabel}
      navigationAriaLabel={navigationAriaLabel}
      activeAccent={shellVariant === "customer" ? "soft" : "light"}
      sidebarMode={shellVariant === "platform" ? "platform" : "customer"}
    />
  ) : (
    <Sidebar
      items={navItems}
      activeId={activeNav}
      activeAccent={shellVariant === "customer" ? "soft" : "light"}
    />
  );

  const brandBlock =
    shellVariant === "customer" ? (
      <SidebarBrand companyName={companyName} shellLabel={shellLabel} />
    ) : (
      <SidebarBrandLegacy
        appName={appName}
        companyName={companyName}
        plan={planName}
        subtitle={shellLabel}
      />
    );

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const mobileNavItems = navItems.filter((item) =>
    mobileNavIds.includes(item.id)
  );

  const isCustomerApp = shellVariant === "customer";

  const shell = (
    <div
      className={
        isCustomerApp
          ? AppVisualClasses.shellRoot
          : `aipify-platform-shell flex min-h-screen ${AipifyShellClasses.canvas}`
      }
      data-aipify-app-shell={isCustomerApp ? "true" : undefined}
      data-aipify-platform-shell={isCustomerApp ? undefined : "true"}
    >
      {isCustomerApp ? <AppCanvasBackground /> : null}
      <div className={isCustomerApp ? AppVisualClasses.appFrame : "flex min-h-screen w-full"}>
      <aside
        className={`${AipifySidebarLayout.asideDesktop} ${AipifyShellClasses.sidebarDesktopWidth} ${
          isCustomerApp ? AppVisualClasses.sidebar : AipifyShellClasses.sidebar
        }`}
      >
        <div className={AipifySidebarLayout.brandRegion}>{brandBlock}</div>
        <div className={`${AipifySidebarLayout.navScrollRegion} p-4`}>
          {renderProductSwitcher()}
          {sidebarNav}
        </div>
        {shellVariant === "customer" && licensePanelLabels ? (
          <div className={AipifySidebarLayout.footerRegion}>
            {customerProfileLink ? (
              <CustomerProfileMenuLink
                href={customerProfileLink.href}
                label={customerProfileLink.label}
                active={customerProfileActive}
              />
            ) : null}
            {customerSupportLink ? (
              <CustomerSupportMenuLink
                href={customerSupportLink.href}
                label={customerSupportLink.label}
                active={customerSupportActive}
              />
            ) : null}
            <LicenseSidebarPanel labels={licensePanelLabels} />
            <PoweredByAipifyFooter
              label={
                /aipify/i.test(licensePanelLabels.poweredBy)
                  ? licensePanelLabels.poweredBy
                  : `${licensePanelLabels.poweredBy} Aipify`.replace(/\s+/g, " ").trim()
              }
            />
          </div>
        ) : platformBrandMark ? (
          <div className={AipifySidebarLayout.footerRegion}>
            <AipifyPlatformBrandMark
              appName={appName}
              poweredBy={platformBrandMark.poweredBy}
              tooltipTitle={platformBrandMark.tooltipTitle}
              tooltipTagline={platformBrandMark.tooltipTagline}
              versionLabel={platformBrandMark.versionLabel}
              pulseLabel={platformBrandMark.pulseLabel}
            />
            <PoweredByAipifyFooter
              label={
                /aipify/i.test(platformBrandMark.poweredBy)
                  ? platformBrandMark.poweredBy
                  : `${platformBrandMark.poweredBy} Aipify`.replace(/\s+/g, " ").trim()
              }
            />
          </div>
        ) : null}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
            aria-label={shellUiLabels?.closeMenu ?? "Close menu"}
            onClick={() => setSidebarOpen(false)}
          />
          <aside
            className={`absolute left-0 top-0 flex h-full ${AipifyShellClasses.sidebarDesktopWidth} flex-col overflow-hidden shadow-xl ${
              isCustomerApp ? AppVisualClasses.sidebar : AipifyShellClasses.sidebar
            }`}
          >
            <div className={`relative border-b border-aipify-border ${AipifySidebarLayout.brandRegion}`}>
              {brandBlock}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                aria-label={shellUiLabels?.closeMenu ?? "Close menu"}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className={`${AipifySidebarLayout.navScrollRegion} p-4`}>
              {shellVariant === "customer" && languageSelectorLabels ? (
                <div className="mb-4 lg:hidden">
                  <AppLanguageSelector
                    currentLocale={coerceClientAppLocale(locale)}
                    labels={languageSelectorLabels}
                    variant="settings"
                  />
                </div>
              ) : null}
              {shellVariant === "customer" && pwaLabels ? (
                <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3 lg:hidden">
                  <AipifyWebAppInstallAction labels={pwaLabels} variant="button" showGuideLink={false} />
                </div>
              ) : null}
              {renderProductSwitcher()}
              {useFlatProductSidebar ? (
                <FlatSidebar
                  items={navConfig}
                  activeId={activeNav}
                  onNavigate={() => setSidebarOpen(false)}
                  navigationAriaLabel={navigationAriaLabel}
                />
              ) : useGroupedSidebar ? (
                <GroupedSidebar
                  groups={navGroups!}
                  searchIndex={navSearchIndex!}
                  activeId={activeNav}
                  searchQuery={navSearchQuery}
                  onNavigate={() => setSidebarOpen(false)}
                  searchResultsLabel={navSearchResultsLabel}
                  keyboardHint={navSearchHint}
                  noSearchResultsLabel={navSearchNoResultsLabel}
                  navigationAriaLabel={navigationAriaLabel}
                  activeAccent={shellVariant === "customer" ? "soft" : "light"}
                  sidebarMode={shellVariant === "platform" ? "platform" : "customer"}
                />
              ) : (
                <Sidebar
                  items={navItems}
                  activeId={activeNav}
                  onNavigate={() => setSidebarOpen(false)}
                  activeAccent={shellVariant === "customer" ? "soft" : "light"}
                />
              )}
            </div>
            {shellVariant === "customer" && licensePanelLabels ? (
              <div className={AipifySidebarLayout.footerRegion}>
                {customerProfileLink ? (
                  <CustomerProfileMenuLink
                    href={customerProfileLink.href}
                    label={customerProfileLink.label}
                    active={customerProfileActive}
                    onNavigate={() => setSidebarOpen(false)}
                  />
                ) : null}
                {customerSupportLink ? (
                  <CustomerSupportMenuLink
                    href={customerSupportLink.href}
                    label={customerSupportLink.label}
                    active={customerSupportActive}
                    onNavigate={() => setSidebarOpen(false)}
                  />
                ) : null}
                <LicenseSidebarPanel labels={licensePanelLabels} />
                <PoweredByAipifyFooter
                  label={
                    /aipify/i.test(licensePanelLabels.poweredBy)
                      ? licensePanelLabels.poweredBy
                      : `${licensePanelLabels.poweredBy} Aipify`.replace(/\s+/g, " ").trim()
                  }
                />
              </div>
            ) : platformBrandMark ? (
              <div className={AipifySidebarLayout.footerRegion}>
                <AipifyPlatformBrandMark
                  appName={appName}
                  poweredBy={platformBrandMark.poweredBy}
                  tooltipTitle={platformBrandMark.tooltipTitle}
                  tooltipTagline={platformBrandMark.tooltipTagline}
                  versionLabel={platformBrandMark.versionLabel}
                  pulseLabel={platformBrandMark.pulseLabel}
                />
                <PoweredByAipifyFooter
                  label={
                    /aipify/i.test(platformBrandMark.poweredBy)
                      ? platformBrandMark.poweredBy
                      : `${platformBrandMark.poweredBy} Aipify`.replace(/\s+/g, " ").trim()
                  }
                />
              </div>
            ) : null}
          </aside>
        </div>
      )}

      <div className={isCustomerApp ? AppVisualClasses.mainColumn : "flex min-w-0 flex-1 flex-col"}>
        <Topbar
          searchPlaceholder={searchPlaceholder}
          searchQuery={navSearchQuery}
          onSearchChange={setNavSearchQuery}
          companyName={companyName}
          companySelectorLabel={companySelectorLabel}
          organizationSwitcher={
            shellVariant === "customer" && organizationSwitcherLabels ? (
              <OrganizationSwitcher
                label={organizationSwitcherLabels.label}
                fallbackName={companyName}
                switchingLabel={organizationSwitcherLabels.switching}
              />
            ) : undefined
          }
          notificationsLabel={notificationsLabel}
          profileName={profileName}
          profileRole={profileRole}
          profileRoleKey={profileRoleKey}
          profileLoading={profileLoading}
          signOutLabel={signOutLabel}
          twoFactorBadgeLabels={twoFactorBadgeLabels}
          onMenuClick={() => setSidebarOpen(true)}
          onCommandBarClick={commandBarContext ? commandBarContext.open : undefined}
          commandBarPlaceholder={commandBarLabels?.placeholder}
          commandBarOpenLabel={commandBarLabels?.openCommandBar}
          openMenuLabel={shellUiLabels?.openMenu}
          locale={coerceToAppLocale(locale)}
          languageSelectorLabels={
            shellVariant === "customer" ? languageSelectorLabels : undefined
          }
          pwaLabels={shellVariant === "customer" ? pwaLabels : undefined}
          supportContactButton={
            shellVariant === "customer" && supportContactLink ? (
              <TopbarContactSupportLink
                href={supportContactLink.href}
                label={supportContactLink.label}
              />
            ) : undefined
          }
          feedbackButton={
            shellVariant === "customer" && voiceOfCustomerLabels ? (
              <TopbarShareFeedbackButton labels={voiceOfCustomerLabels} />
            ) : undefined
          }
        />

        <main
          className={
            isCustomerApp
              ? AppVisualClasses.mainScroll
              : "flex-1 overflow-y-auto scroll-pb-[calc(6rem+env(safe-area-inset-bottom))] px-4 py-6 pb-[calc(6rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 lg:scroll-pb-8 lg:px-8 lg:pb-8"
          }
        >
          <div className="animate-fade-in-up">{children}</div>
        </main>

        <nav
          className={`fixed bottom-0 left-0 right-0 z-30 px-2 py-2 backdrop-blur-sm lg:hidden ${AipifyShellClasses.topbar}`}
          aria-label={shellUiLabels?.mobileNavigation ?? "Mobile navigation"}
        >
          <div className="flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = item.id === activeNav;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex min-h-12 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus ${
                    isActive
                      ? `text-aipify-companion ${AipifySidebarTypography.mobileNavItem}`
                      : `text-aipify-text-secondary ${AipifySidebarTypography.mobileNavItem}`
                  }`}
                  aria-current={isActive ? "page" : undefined}
                  title={item.label}
                >
                  <span
                    className={`${AipifySidebarTypography.navIcon} ${
                      isActive ? "text-aipify-companion" : "text-aipify-text-secondary"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className={AipifySidebarTypography.mobileNavLabel}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      </div>
    </div>
  );

  const withUnifiedNotifications =
    shellVariant === "customer" &&
    pathname.startsWith("/app") &&
    notificationCenterLabels ? (
      <UnifiedNotificationFeedProvider labels={notificationCenterLabels}>
        {shell}
        <NotificationCenterDrawer />
      </UnifiedNotificationFeedProvider>
    ) : (
      shell
    );

  if (!presenceLabels) {
    return withUnifiedNotifications;
  }

  return (
    <PresenceProvider surface={shellVariant} labels={presenceLabels} locale={locale}>
      {withUnifiedNotifications}
    </PresenceProvider>
  );
}

function CustomerProfileMenuLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`${AipifySidebarTypography.navItemRow} mb-3 ${
        active
          ? `${AppVisualClasses.navItemActive} text-[15px] font-semibold leading-snug`
          : `${AppVisualClasses.navItem} ${AipifySidebarTypography.navigationItem}`
      } ${AppVisualClasses.focusRing}`}
    >
      <span className={AipifySidebarTypography.navIcon} aria-hidden>
        <svg className="h-[21px] w-[21px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </Link>
  );
}

function CustomerSupportMenuLink({
  href,
  label,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={`${AipifySidebarTypography.navItemRow} mb-3 ${
        active
          ? `${AppVisualClasses.navItemActive} text-[15px] font-semibold leading-snug`
          : `${AppVisualClasses.navItem} ${AipifySidebarTypography.navigationItem}`
      } ${AppVisualClasses.focusRing}`}
    >
      <span className={AipifySidebarTypography.navIcon} aria-hidden>
        <svg className="h-[21px] w-[21px]" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </Link>
  );
}

function TopbarContactSupportLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-aipify-border bg-aipify-surface px-2.5 py-2 text-sm font-medium text-aipify-text transition hover:border-aipify-accent-muted hover:bg-aipify-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus sm:px-3"
      aria-label={label}
    >
      <svg
        className="h-4 w-4 shrink-0 text-aipify-text-secondary"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.183-.36c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
        />
      </svg>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
