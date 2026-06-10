"use client";

import { useEffect, useState } from "react";
import Sidebar, { type NavItem } from "./Sidebar";
import Topbar from "./Topbar";

const MOBILE_NAV_IDS = ["overview", "assistant", "support", "settings"];

type DashboardShellProps = {
  appName: string;
  searchPlaceholder: string;
  navItems: NavItem[];
  children: React.ReactNode;
};

export default function DashboardShell({
  appName,
  searchPlaceholder,
  navItems,
  children,
}: DashboardShellProps) {
  const [activeNav, setActiveNav] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const mobileNavItems = navItems.filter((item) =>
    MOBILE_NAV_IDS.includes(item.id)
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
            A
          </span>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            {appName}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <Sidebar
            items={navItems}
            activeId={activeNav}
            onNavigate={setActiveNav}
          />
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-gray-900/40"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
                  A
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {appName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
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
                onNavigate={(id) => {
                  setActiveNav(id);
                  setSidebarOpen(false);
                }}
              />
            </div>
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          searchPlaceholder={searchPlaceholder}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:px-8 lg:pb-8">
          {children}
        </main>

        <nav
          className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white px-2 py-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex items-center justify-around">
            {mobileNavItems.map((item) => {
              const isActive = item.id === activeNav;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNav(item.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs font-medium transition ${
                    isActive ? "text-violet-600" : "text-gray-500"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className={isActive ? "text-violet-600" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span className="max-w-[4.5rem] truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}
