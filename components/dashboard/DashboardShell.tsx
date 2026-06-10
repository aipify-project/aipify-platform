"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { usePlatformProfile } from "@/components/platform/PlatformProfileProvider";
import { useOptionalDashboardProfile } from "./DashboardProfileProvider";
import Sidebar, { type NavItem } from "./Sidebar";
import SidebarBrand from "./SidebarBrand";
import Topbar from "./Topbar";
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
  navConfig: Array<{ id: string; href: string; label: string }>;
  shellVariant: "platform" | "customer";
  mobileNavIds: string[];
  companyNameOverride?: string;
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
  navConfig,
  shellVariant,
  mobileNavIds,
  companyNameOverride,
  children,
}: DashboardShellProps) {
  const pathname = usePathname();
  const activeNav = useMemo(() => {
    const resolveActiveNavId =
      shellVariant === "platform"
        ? getPlatformActiveNavId
        : getCustomerActiveNavId;
    return resolveActiveNavId(pathname);
  }, [shellVariant, pathname]);
  const customerContext = useOptionalDashboardProfile();
  const platformContext = usePlatformProfile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  const profileRole = customerContext?.profile
    ? roleLabels[customerContext.profile.user.role]
    : platformContext?.platformAdmin
      ? roleLabels[platformContext.platformAdmin.role]
      : roleLabels.owner;

  const profileLoading =
    customerContext?.loading ?? platformContext?.loading ?? false;

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const mobileNavItems = navItems.filter((item) =>
    mobileNavIds.includes(item.id)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <SidebarBrand
          appName={appName}
          companyName={companyName}
          plan={planName}
          subtitle={shellLabel}
        />
        <div className="flex-1 overflow-y-auto p-4">
          <Sidebar items={navItems} activeId={activeNav} />
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-[1px]"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="relative border-b border-gray-200">
              <SidebarBrand
                appName={appName}
                companyName={companyName}
                plan={planName}
                subtitle={shellLabel}
              />
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
              <Sidebar
                items={navItems}
                activeId={activeNav}
                onNavigate={() => setSidebarOpen(false)}
              />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          searchPlaceholder={searchPlaceholder}
          companyName={companyName}
          companySelectorLabel={companySelectorLabel}
          notificationsLabel={notificationsLabel}
          profileName={profileName}
          profileRole={profileRole}
          profileLoading={profileLoading}
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
}
