"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  APP_NAV_COMPACT_STORAGE_KEY,
  APP_NAV_INITIALIZED_STORAGE_KEY,
  APP_NAV_LAST_ITEM_STORAGE_KEY,
  APP_NAV_OPEN_GROUP_STORAGE_KEY,
  type AppNavGroupId,
} from "@/lib/app/nav-groups";
import { getGroupIdForNavItem } from "@/lib/app/nav-search";
import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import type { AppNavSearchEntry } from "@/lib/app/nav-search";
import { filterAppNavSearchEntries } from "@/lib/app/nav-search";
import { getNavIcon } from "./nav-icons";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

type GroupedSidebarProps = {
  groups: AppNavGroupConfig[];
  searchIndex: AppNavSearchEntry[];
  activeId: string;
  searchQuery?: string;
  onNavigate?: () => void;
  className?: string;
  activeAccent?: "default" | "soft";
  compactToggleLabel?: string;
  searchResultsLabel?: string;
  keyboardHint?: string;
  noSearchResultsLabel?: string;
};

const ACTIVE_ACCENT_CLASSES = {
  default: "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm",
  soft: "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm",
} as const;

const COLLAPSIBLE_GROUPS: AppNavGroupId[] = [
  "organization",
  "intelligence",
  "operations",
  "platform",
  "governance",
];

function loadOpenGroupId(): AppNavGroupId | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(APP_NAV_OPEN_GROUP_STORAGE_KEY);
  if (!raw) return null;
  return COLLAPSIBLE_GROUPS.includes(raw as AppNavGroupId) ? (raw as AppNavGroupId) : null;
}

function loadCompactMode(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(APP_NAV_COMPACT_STORAGE_KEY) === "1";
}

function isInitialized(): boolean {
  if (typeof window === "undefined") return true;
  return window.localStorage.getItem(APP_NAV_INITIALIZED_STORAGE_KEY) === "1";
}

function persistOpenGroup(groupId: AppNavGroupId | null) {
  if (typeof window === "undefined") return;
  if (groupId) {
    window.localStorage.setItem(APP_NAV_OPEN_GROUP_STORAGE_KEY, groupId);
  } else {
    window.localStorage.removeItem(APP_NAV_OPEN_GROUP_STORAGE_KEY);
  }
}

function persistLastItem(itemId: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(APP_NAV_LAST_ITEM_STORAGE_KEY, itemId);
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="h-3 w-3 shrink-0 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      aria-hidden="true"
    >
      {open ? (
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      )}
    </svg>
  );
}

function NavLinkRow({
  item,
  isActive,
  activeAccent,
  compact,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  activeAccent: "default" | "soft";
  compact: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.label}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        isActive
          ? ACTIVE_ACCENT_CLASSES[activeAccent]
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      } ${compact ? "justify-center px-2" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={isActive ? "text-white" : "text-gray-400"}>{item.icon}</span>
      {!compact ? <span className="truncate">{item.label}</span> : null}
    </Link>
  );
}

function SearchResultRow({
  item,
  isActive,
  compact,
  onNavigate,
}: {
  item: AppNavSearchEntry;
  isActive: boolean;
  compact: boolean;
  onNavigate?: () => void;
}) {
  const icon = getNavIcon(item.id);

  if (compact) {
    return (
      <NavLinkRow
        item={{ ...item, icon }}
        isActive={isActive}
        activeAccent="soft"
        compact
        onNavigate={onNavigate}
      />
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.label}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        isActive
          ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={`mt-0.5 shrink-0 ${isActive ? "text-white" : "text-gray-400"}`}>
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{item.label}</span>
        <span
          className={`mt-0.5 block truncate text-[11px] ${
            isActive ? "text-white/80" : "text-gray-400"
          }`}
        >
          {item.groupLabel}
        </span>
        <span
          className={`mt-1 block text-xs leading-snug ${
            isActive ? "text-white/90" : "text-gray-500"
          }`}
        >
          {item.description}
        </span>
      </span>
    </Link>
  );
}

export default function GroupedSidebar({
  groups,
  searchIndex,
  activeId,
  searchQuery = "",
  onNavigate,
  className = "",
  activeAccent = "soft",
  compactToggleLabel = "Compact navigation",
  searchResultsLabel = "Search results",
  keyboardHint,
  noSearchResultsLabel = "No matching modules",
}: GroupedSidebarProps) {
  const [openGroupId, setOpenGroupId] = useState<AppNavGroupId | null>(null);
  const [compact, setCompact] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const activeGroupId = useMemo(() => getGroupIdForNavItem(activeId), [activeId]);

  const applyOpenGroup = useCallback((groupId: AppNavGroupId | null) => {
    setOpenGroupId(groupId);
    persistOpenGroup(groupId);
  }, []);

  useEffect(() => {
    setCompact(loadCompactMode());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (activeGroupId && activeGroupId !== "home") {
      applyOpenGroup(activeGroupId);
      return;
    }

    if (isInitialized()) {
      setOpenGroupId(loadOpenGroupId());
      return;
    }

    void fetch("/api/auth/2fa/status")
      .then(async (res) => {
        if (!res.ok) {
          applyOpenGroup("organization");
          window.localStorage.setItem(APP_NAV_INITIALIZED_STORAGE_KEY, "1");
          return;
        }
        const status = (await res.json()) as { required?: boolean; enabled?: boolean };
        const defaultGroup: AppNavGroupId =
          status.required && !status.enabled ? "governance" : "organization";
        applyOpenGroup(defaultGroup);
        window.localStorage.setItem(APP_NAV_INITIALIZED_STORAGE_KEY, "1");
      })
      .catch(() => {
        applyOpenGroup("organization");
        window.localStorage.setItem(APP_NAV_INITIALIZED_STORAGE_KEY, "1");
      });
  }, [hydrated, activeGroupId, applyOpenGroup]);

  useEffect(() => {
    if (!hydrated || !activeId) return;
    persistLastItem(activeId);
  }, [hydrated, activeId]);

  const toggleGroup = useCallback(
    (groupId: AppNavGroupId) => {
      if (groupId === "home") return;
      const next = openGroupId === groupId ? null : groupId;
      applyOpenGroup(next);
    },
    [openGroupId, applyOpenGroup]
  );

  const handleNavigate = useCallback(
    (itemId: string) => {
      persistLastItem(itemId);
      const groupId = getGroupIdForNavItem(itemId);
      if (groupId && groupId !== "home") {
        applyOpenGroup(groupId);
      }
      onNavigate?.();
    },
    [applyOpenGroup, onNavigate]
  );

  const toggleCompact = useCallback(() => {
    const next = !compact;
    setCompact(next);
    window.localStorage.setItem(APP_NAV_COMPACT_STORAGE_KEY, next ? "1" : "0");
  }, [compact]);

  const searchResults = useMemo(
    () => filterAppNavSearchEntries(searchIndex, searchQuery),
    [searchIndex, searchQuery]
  );

  const isSearching = searchQuery.trim().length > 0;

  if (!hydrated) {
    return <nav className={`flex flex-col gap-2 ${className}`} aria-label="Dashboard" />;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className={`flex items-center ${compact ? "justify-center" : "justify-between"} gap-2 px-1`}>
        {!compact && keyboardHint ? (
          <p className="truncate text-[10px] font-medium uppercase tracking-wide text-gray-400" title={keyboardHint}>
            {keyboardHint}
          </p>
        ) : null}
        <button
          type="button"
          onClick={toggleCompact}
          className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          aria-label={compactToggleLabel}
          title={compactToggleLabel}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
            {compact ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H16.5" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.0075M3.75 12h.0075M3.75 17.25h.0075" />
            )}
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-1" aria-label="Dashboard">
        {isSearching ? (
          <div className="space-y-1">
            {!compact ? (
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                {searchResultsLabel}
              </p>
            ) : null}
            {searchResults.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">{noSearchResultsLabel}</p>
            ) : (
              searchResults.map((item) => (
                <SearchResultRow
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  compact={compact}
                  onNavigate={() => handleNavigate(item.id)}
                />
              ))
            )}
          </div>
        ) : (
          groups.map((group) => {
            const isHome = group.id === "home";
            const isExpanded = isHome || compact || openGroupId === group.id;

            return (
              <div key={group.id} className="space-y-1">
                {!compact ? (
                  isHome ? (
                    <p
                      className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                      title={group.label}
                    >
                      {group.label}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id as AppNavGroupId)}
                      className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-gray-400 transition hover:bg-gray-50 hover:text-gray-600"
                      aria-expanded={isExpanded}
                    >
                      <span className="truncate" title={group.label}>
                        {group.label}
                      </span>
                      <ChevronIcon open={isExpanded} />
                    </button>
                  )
                ) : null}
                {isExpanded &&
                  group.items.map((item) => (
                    <NavLinkRow
                      key={item.id}
                      item={{ ...item, icon: getNavIcon(item.id) }}
                      isActive={item.id === activeId}
                      activeAccent={activeAccent}
                      compact={compact}
                      onNavigate={() => handleNavigate(item.id)}
                    />
                  ))}
              </div>
            );
          })
        )}
      </nav>
    </div>
  );
}
