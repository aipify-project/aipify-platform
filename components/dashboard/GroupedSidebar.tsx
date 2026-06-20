"use client";

import Link from "next/link";
import { AipifyNavClasses } from "@/lib/design";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  APP_NAV_COMPACT_STORAGE_KEY,
  APP_NAV_INITIALIZED_STORAGE_KEY,
  APP_NAV_LAST_ITEM_STORAGE_KEY,
  APP_NAV_OPEN_GROUP_STORAGE_KEY,
  APP_COLLAPSIBLE_GROUPS,
} from "@/lib/app/nav-groups";
import { getGroupIdForNavItem, filterAppNavSearchEntries } from "@/lib/app/nav-search";
import type { AppNavGroupConfig, AppNavLink } from "@/lib/app/build-nav";
import type { NavSearchEntry } from "@/lib/nav/search-entry";
import {
  PLATFORM_NAV_COMPACT_STORAGE_KEY,
  PLATFORM_NAV_INITIALIZED_STORAGE_KEY,
  PLATFORM_NAV_LAST_ITEM_STORAGE_KEY,
  PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY,
  PLATFORM_COLLAPSIBLE_GROUPS,
} from "@/lib/platform/nav-groups";
import {
  getPlatformGroupIdForNavItem,
  filterPlatformNavSearchEntries,
} from "@/lib/platform/nav-search";
import { getNavIcon } from "./nav-icons";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  locked?: boolean;
  accessHint?: string;
};

type GroupedSidebarProps = {
  groups: AppNavGroupConfig[];
  searchIndex: NavSearchEntry[];
  activeId: string;
  searchQuery?: string;
  onNavigate?: () => void;
  className?: string;
  activeAccent?: "default" | "soft";
  compactToggleLabel?: string;
  searchResultsLabel?: string;
  keyboardHint?: string;
  noSearchResultsLabel?: string;
  sidebarMode?: "customer" | "platform";
};

const ACTIVE_ACCENT_CLASSES = {
  default: AipifyNavClasses.itemActive,
  soft: AipifyNavClasses.itemActive,
} as const;

function createStorageHelpers(mode: "customer" | "platform") {
  const openGroupKey =
    mode === "platform" ? PLATFORM_NAV_OPEN_GROUP_STORAGE_KEY : APP_NAV_OPEN_GROUP_STORAGE_KEY;
  const compactKey =
    mode === "platform" ? PLATFORM_NAV_COMPACT_STORAGE_KEY : APP_NAV_COMPACT_STORAGE_KEY;
  const initializedKey =
    mode === "platform" ? PLATFORM_NAV_INITIALIZED_STORAGE_KEY : APP_NAV_INITIALIZED_STORAGE_KEY;
  const lastItemKey =
    mode === "platform" ? PLATFORM_NAV_LAST_ITEM_STORAGE_KEY : APP_NAV_LAST_ITEM_STORAGE_KEY;
  const collapsibleGroups: readonly string[] =
    mode === "platform" ? PLATFORM_COLLAPSIBLE_GROUPS : APP_COLLAPSIBLE_GROUPS;
  const resolveGroupId =
    mode === "platform" ? getPlatformGroupIdForNavItem : getGroupIdForNavItem;
  const filterSearch =
    mode === "platform" ? filterPlatformNavSearchEntries : filterAppNavSearchEntries;
  const defaultOpenGroup = mode === "platform" ? "platformAdmin" : "organization";

  return {
    openGroupKey,
    compactKey,
    initializedKey,
    lastItemKey,
    collapsibleGroups,
    resolveGroupId,
    filterSearch,
    defaultOpenGroup,
    fixedGroupIds: mode === "customer" ? (["home"] as string[]) : ([] as string[]),
  };
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
  prefetch,
}: {
  item: NavItem;
  isActive: boolean;
  activeAccent: "default" | "soft";
  compact: boolean;
  onNavigate?: () => void;
  prefetch?: boolean;
}) {
  return (
    <Link
      href={item.href}
      prefetch={prefetch}
      onClick={onNavigate}
      title={item.accessHint ? `${item.label} — ${item.accessHint}` : item.label}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
        isActive
          ? ACTIVE_ACCENT_CLASSES[activeAccent]
          : AipifyNavClasses.item
      } ${compact ? "justify-center px-2" : ""}`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={isActive ? AipifyNavClasses.itemActiveIcon : AipifyNavClasses.itemIcon}>
        {item.icon}
      </span>
      {!compact ? (
        <span className="min-w-0 flex-1">
          <span className="block truncate">
            {item.locked ? <span aria-hidden="true">🔒 </span> : null}
            {item.label}
          </span>
          {item.accessHint ? (
            <span className="mt-0.5 block truncate text-[11px] font-normal text-amber-700">
              {item.accessHint}
            </span>
          ) : null}
        </span>
      ) : null}
    </Link>
  );
}

function SearchResultRow({
  item,
  isActive,
  compact,
  onNavigate,
}: {
  item: NavSearchEntry;
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
          ? AipifyNavClasses.itemActive
          : `${AipifyNavClasses.item} text-aipify-text`
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <span className={`mt-0.5 shrink-0 ${isActive ? AipifyNavClasses.itemActiveIcon : AipifyNavClasses.itemIcon}`}>
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
  sidebarMode = "customer",
}: GroupedSidebarProps) {
  const storage = useMemo(() => createStorageHelpers(sidebarMode), [sidebarMode]);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
  const [compact, setCompact] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const activeGroupId = useMemo(() => storage.resolveGroupId(activeId), [activeId, storage]);

  const applyOpenGroup = useCallback(
    (groupId: string | null) => {
      setOpenGroupId(groupId);
      if (typeof window === "undefined") return;
      if (groupId) {
        window.localStorage.setItem(storage.openGroupKey, groupId);
      } else {
        window.localStorage.removeItem(storage.openGroupKey);
      }
    },
    [storage.openGroupKey]
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCompact(window.localStorage.getItem(storage.compactKey) === "1");
    setHydrated(true);
  }, [storage.compactKey]);

  useEffect(() => {
    if (!hydrated) return;

    if (activeGroupId && !storage.fixedGroupIds.includes(activeGroupId)) {
      applyOpenGroup(activeGroupId);
      return;
    }

    if (typeof window !== "undefined" && window.localStorage.getItem(storage.initializedKey) === "1") {
      const raw = window.localStorage.getItem(storage.openGroupKey);
      if (raw && storage.collapsibleGroups.includes(raw)) {
        setOpenGroupId(raw);
      }
      return;
    }

    if (sidebarMode === "platform") {
      applyOpenGroup(storage.defaultOpenGroup);
      window.localStorage.setItem(storage.initializedKey, "1");
      return;
    }

    void fetch("/api/auth/2fa/status")
      .then(async (res) => {
        if (!res.ok) {
          applyOpenGroup(storage.defaultOpenGroup);
          window.localStorage.setItem(storage.initializedKey, "1");
          return;
        }
        const status = (await res.json()) as { required?: boolean; enabled?: boolean };
        const defaultGroup =
          status.required && !status.enabled ? "governance" : storage.defaultOpenGroup;
        applyOpenGroup(defaultGroup);
        window.localStorage.setItem(storage.initializedKey, "1");
      })
      .catch(() => {
        applyOpenGroup(storage.defaultOpenGroup);
        window.localStorage.setItem(storage.initializedKey, "1");
      });
  }, [hydrated, activeGroupId, applyOpenGroup, sidebarMode, storage]);

  useEffect(() => {
    if (!hydrated || !activeId || typeof window === "undefined") return;
    window.localStorage.setItem(storage.lastItemKey, activeId);
  }, [hydrated, activeId, storage.lastItemKey]);

  const toggleGroup = useCallback(
    (groupId: string) => {
      if (storage.fixedGroupIds.includes(groupId)) return;
      const next = openGroupId === groupId ? null : groupId;
      applyOpenGroup(next);
    },
    [openGroupId, applyOpenGroup, storage.fixedGroupIds]
  );

  const handleNavigate = useCallback(
    (itemId: string) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storage.lastItemKey, itemId);
      }
      const groupId = storage.resolveGroupId(itemId);
      if (groupId && !storage.fixedGroupIds.includes(groupId)) {
        applyOpenGroup(groupId);
      }
      onNavigate?.();
    },
    [applyOpenGroup, onNavigate, storage]
  );

  const toggleCompact = useCallback(() => {
    const next = !compact;
    setCompact(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storage.compactKey, next ? "1" : "0");
    }
  }, [compact, storage.compactKey]);

  const searchResults = useMemo(
    () => storage.filterSearch(searchIndex, searchQuery),
    [searchIndex, searchQuery, storage]
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
            const isFixed = storage.fixedGroupIds.includes(group.id);
            const isExpanded = isFixed || compact || openGroupId === group.id;

            return (
              <div key={group.id} className="space-y-1">
                {!compact ? (
                  isFixed ? (
                    <p
                      className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-gray-400"
                      title={group.label}
                    >
                      {group.label}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.id)}
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
                      prefetch={group.id !== "support"}
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
