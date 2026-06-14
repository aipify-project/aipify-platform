"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePlatformProfile } from "@/components/platform/PlatformProfileProvider";
import { useOptionalDashboardProfile } from "./DashboardProfileProvider";
import { AipifyPlatformBrandMark } from "@/components/branding";
import { LicenseSidebarPanel } from "@/components/app/license";
import Sidebar, { type NavItem } from "./Sidebar";
import GroupedSidebar from "./GroupedSidebar";
import SidebarBrand, { SidebarBrandLegacy } from "./SidebarBrand";
import { CompanionPresenceIndicator } from "@/components/app/companion-presence";
import type { CompanionPresenceLabels } from "@/components/app/companion-presence";
import { PresenceProvider, type PresenceLabels } from "@/components/presence/PresenceProvider";
import Topbar from "./Topbar";
import { OrganizationSwitcher } from "@/components/app/organization";
import { buildAppNavConfig, type AppNavGroupConfig, type AppNavLink } from "@/lib/app/build-nav";
import { getAppActiveNavId } from "@/lib/app/nav-config";
import { getCustomerActiveNavId } from "@/lib/dashboard/nav-config";
import { getPlatformActiveNavId } from "@/lib/platform/nav-config";
import { getNavIcon } from "./nav-icons";

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
  navSearchIndex?: import("@/lib/app/nav-search").AppNavSearchEntry[];
  navSearchNoResultsLabel?: string;
  shellVariant: "platform" | "customer";
  mobileNavIds: string[];
  navSearchHint?: string;
  navCompactToggleLabel?: string;
  navSearchResultsLabel?: string;
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
    pulseLabel: string;
  };
  presenceLabels?: PresenceLabels;
  companionPresenceLabels?: CompanionPresenceLabels;
  locale?: string;
  organizationSwitcherLabels?: {
    label: string;
    switching: string;
  };
  twoFactorBadgeLabels?: {
    enabled: string;
    required: string;
  };
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
  navCompactToggleLabel,
  navSearchResultsLabel,
  companyNameOverride,
  platformBrandMark,
  licensePanelLabels,
  presenceLabels,
  companionPresenceLabels,
  locale = "en",
  organizationSwitcherLabels,
  twoFactorBadgeLabels,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const activeNav = useMemo(() => {
    if (shellVariant === "platform") {
      return getPlatformActiveNavId(pathname);
    }
    if (pathname.startsWith("/app")) {
      return getAppActiveNavId(pathname);
    }
    return getCustomerActiveNavId(pathname);
  }, [shellVariant, pathname]);
  const customerContext = useOptionalDashboardProfile();
  const platformContext = usePlatformProfile();
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
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        document.getElementById("app-nav-search")?.focus();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const sidebarNav =
    shellVariant === "customer" && navGroups && navSearchIndex ? (
      <GroupedSidebar
        groups={navGroups}
        searchIndex={navSearchIndex}
        activeId={activeNav}
        searchQuery={navSearchQuery}
        compactToggleLabel={navCompactToggleLabel}
        searchResultsLabel={navSearchResultsLabel}
        keyboardHint={navSearchHint}
        noSearchResultsLabel={navSearchNoResultsLabel}
      />
    ) : (
      <Sidebar
        items={navItems}
        activeId={activeNav}
        activeAccent={shellVariant === "customer" ? "soft" : "default"}
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

  const shell = (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden h-screen w-64 shrink-0 flex-col overflow-visible border-r border-gray-200 bg-white lg:flex">
        {brandBlock}
        <div className="flex-1 overflow-y-auto p-4">
          {sidebarNav}
        </div>
        {shellVariant === "customer" && licensePanelLabels ? (
          <LicenseSidebarPanel labels={licensePanelLabels} />
        ) : platformBrandMark ? (
          <AipifyPlatformBrandMark
            appName={appName}
            poweredBy={platformBrandMark.poweredBy}
            tooltipTitle={platformBrandMark.tooltipTitle}
            tooltipTagline={platformBrandMark.tooltipTagline}
            versionLabel={platformBrandMark.versionLabel}
            pulseLabel={platformBrandMark.pulseLabel}
          />
        ) : null}
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col overflow-visible bg-white shadow-xl">
            <div className="relative border-b border-gray-200">
              {brandBlock}
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {shellVariant === "customer" && navGroups && navSearchIndex ? (
                <GroupedSidebar
                  groups={navGroups}
                  searchIndex={navSearchIndex}
                  activeId={activeNav}
                  searchQuery={navSearchQuery}
                  onNavigate={() => setSidebarOpen(false)}
                  compactToggleLabel={navCompactToggleLabel}
                  searchResultsLabel={navSearchResultsLabel}
                  keyboardHint={navSearchHint}
                  noSearchResultsLabel={navSearchNoResultsLabel}
                />
              ) : (
                <Sidebar
                  items={navItems}
                  activeId={activeNav}
                  onNavigate={() => setSidebarOpen(false)}
                  activeAccent={shellVariant === "customer" ? "soft" : "default"}
                />
              )}
            </div>
            {shellVariant === "customer" && licensePanelLabels ? (
              <LicenseSidebarPanel labels={licensePanelLabels} />
            ) : platformBrandMark ? (
              <AipifyPlatformBrandMark
                appName={appName}
                poweredBy={platformBrandMark.poweredBy}
                tooltipTitle={platformBrandMark.tooltipTitle}
                tooltipTagline={platformBrandMark.tooltipTagline}
                versionLabel={platformBrandMark.versionLabel}
                pulseLabel={platformBrandMark.pulseLabel}
              />
            ) : null}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
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
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">
          <div className="animate-fade-in-up">{children}</div>
        </main>

        <nav
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 px-2 py-2 backdrop-blur-sm lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = item.id === activeNav;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    isActive ? "text-violet-600" : "text-gray-500"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={isActive ? "text-violet-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span className="max-w-[4.5rem] truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );

  const withCompanion =
    shellVariant === "customer" &&
    pathname.startsWith("/app") &&
    companionPresenceLabels ? (
      <>
        {shell}
        <CompanionPresenceIndicator labels={companionPresenceLabels} />
      </>
    ) : (
      shell
    );

  if (!presenceLabels) {
    return withCompanion;
  }

  return (
    <PresenceProvider surface={shellVariant} labels={presenceLabels} locale={locale}>
      {withCompanion}
    </PresenceProvider>
  );
}
