"use client";

import Link from "next/link";
import { AipifyNavClasses, AipifySidebarTypography } from "@/lib/design";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  APP_NAV_COMPACT_STORAGE_KEY,
  APP_NAV_INITIALIZED_STORAGE_KEY,
  APP_NAV_LAST_ITEM_STORAGE_KEY,
  APP_NAV_OPEN_GROUP_STORAGE_KEY,
  APP_COLLAPSIBLE_GROUPS,
} from "@/lib/app/nav-groups";
import { getGroupIdForNavItem, filterAppNavSearchEntries } from "@/lib/app/nav-search";
import type { AppNavGroupConfig } from "@/lib/app/build-nav";
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
  const legacyCompactKey =
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
    legacyCompactKey,
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
      className={AipifySidebarTypography.chevron}
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
  onNavigate,
  prefetch,
}: {
  item: NavItem;
  isActive: boolean;
  activeAccent: "default" | "soft";
  onNavigate?: () => void;
  prefetch?: boolean;
}) {
  return (
    <Link
      href={item.href}
      prefetch={prefetch}
      onClick={onNavigate}
      title={item.accessHint ? `${item.label} — ${item.accessHint}` : item.label}
      className={`${AipifySidebarTypography.navItemRow} ${
        isActive
          ? `${ACTIVE_ACCENT_CLASSES[activeAccent]} ${AipifySidebarTypography.navigationItemActive}`
          : `${AipifyNavClasses.item} ${AipifySidebarTypography.navigationItem}`
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={`mt-0.5 ${AipifySidebarTypography.navIcon} ${
          isActive ? AipifyNavClasses.itemActiveIcon : AipifyNavClasses.itemIcon
        }`}
      >
        {item.icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className={AipifySidebarTypography.navLabelWrap} title={item.label}>
          {item.locked ? <span aria-hidden="true">🔒 </span> : null}
          {item.label}
        </span>
        {item.accessHint ? (
          <span className={`mt-0.5 block truncate ${AipifySidebarTypography.accessHint}`}>
            {item.accessHint}
          </span>
        ) : null}
      </span>
    </Link>
  );
}

function SearchResultRow({
  item,
  isActive,
  onNavigate,
}: {
  item: NavSearchEntry;
  isActive: boolean;
  onNavigate?: () => void;
}) {
  const icon = getNavIcon(item.id);

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.label}
      className={`${AipifySidebarTypography.navItemRow} items-start ${
        isActive
          ? `${AipifyNavClasses.itemActive} ${AipifySidebarTypography.navigationItemActive}`
          : `${AipifyNavClasses.item} ${AipifySidebarTypography.navigationItem}`
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      <span
        className={`mt-0.5 ${AipifySidebarTypography.navIcon} ${
          isActive ? AipifyNavClasses.itemActiveIcon : AipifyNavClasses.itemIcon
        }`}
      >
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`${AipifySidebarTypography.navLabelWrap} ${
            isActive ? AipifySidebarTypography.navigationItemActive : AipifySidebarTypography.searchMenuRow
          }`}
          title={item.label}
        >
          {item.label}
        </span>
        <span
          className={`mt-0.5 ${AipifySidebarTypography.navLabelWrap} ${
            isActive ? "text-base font-medium leading-[1.45] text-white/90" : AipifySidebarTypography.searchMenuGroup
          }`}
          title={item.groupLabel}
        >
          {item.groupLabel}
        </span>
        <span
          className={`mt-1 block ${
            isActive ? "text-base leading-[1.4] text-white/90" : AipifySidebarTypography.searchMenuDescription
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
  searchResultsLabel = "Search results",
  keyboardHint,
  noSearchResultsLabel = "No matching modules",
  sidebarMode = "customer",
}: GroupedSidebarProps) {
  const storage = useMemo(() => createStorageHelpers(sidebarMode), [sidebarMode]);
  const [openGroupId, setOpenGroupId] = useState<string | null>(null);
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
    [storage.openGroupKey],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(storage.legacyCompactKey);
    setHydrated(true);
  }, [storage.legacyCompactKey]);

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
    [openGroupId, applyOpenGroup, storage.fixedGroupIds],
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
    [applyOpenGroup, onNavigate, storage],
  );

  const searchResults = useMemo(
    () => storage.filterSearch(searchIndex, searchQuery),
    [searchIndex, searchQuery, storage],
  );

  const isSearching = searchQuery.trim().length > 0;

  if (!hydrated) {
    return <nav className={`flex flex-col gap-2 ${className}`} aria-label="Dashboard" />;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {keyboardHint ? (
        <p className={`truncate px-1 ${AipifySidebarTypography.keyboardHint}`} title={keyboardHint}>
          {keyboardHint}
        </p>
      ) : null}

      <nav className="flex flex-col gap-1" aria-label="Dashboard">
        {isSearching ? (
          <div className="space-y-1">
            <p className={`px-3 py-1 ${AipifySidebarTypography.sectionLabel}`}>{searchResultsLabel}</p>
            {searchResults.length === 0 ? (
              <p className={`px-3 py-2 ${AipifySidebarTypography.subNavigationItem}`}>
                {noSearchResultsLabel}
              </p>
            ) : (
              searchResults.map((item) => (
                <SearchResultRow
                  key={item.id}
                  item={item}
                  isActive={item.id === activeId}
                  onNavigate={() => handleNavigate(item.id)}
                />
              ))
            )}
          </div>
        ) : (
          groups.map((group) => {
            const isFixed = storage.fixedGroupIds.includes(group.id);
            const isExpanded = isFixed || openGroupId === group.id;

            return (
              <div key={group.id} className="space-y-1">
                {isFixed ? (
                  <p className={`px-3 py-2 ${AipifySidebarTypography.sectionLabel}`} title={group.label}>
                    {group.label}
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className={`flex min-h-12 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left ${AipifySidebarTypography.sectionLabelButton} focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus focus-visible:ring-offset-2`}
                    aria-expanded={isExpanded}
                  >
                    <span className={`min-w-0 flex-1 ${AipifySidebarTypography.navLabelWrap}`} title={group.label}>
                      {group.label}
                    </span>
                    <ChevronIcon open={isExpanded} />
                  </button>
                )}
                {isExpanded &&
                  group.items.map((item) => (
                    <NavLinkRow
                      key={item.id}
                      item={{ ...item, icon: getNavIcon(item.id) }}
                      isActive={item.id === activeId}
                      activeAccent={activeAccent}
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
