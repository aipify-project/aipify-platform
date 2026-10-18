"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AipifySidebarTypography } from "@/lib/design";
import { AppVisualClasses } from "@/lib/design/app-visual-system";
import { getNavIcon } from "./nav-icons";

export type FlatNavItem = {
  id: string;
  label: string;
  href: string;
  locked?: boolean;
  accessHint?: string;
  sectionLabel?: string;
};

type FlatSidebarProps = {
  items: FlatNavItem[];
  activeId: string;
  onNavigate?: () => void;
  className?: string;
  navigationAriaLabel?: string;
};

/**
 * Job 60 — one vertical menu list. Job 63 — premium soft active state.
 */
export default function FlatSidebar({
  items,
  activeId,
  onNavigate,
  className = "",
  navigationAriaLabel = "Navigation",
}: FlatSidebarProps) {
  return (
    <nav className={`flex flex-col gap-1.5 ${className}`} aria-label={navigationAriaLabel}>
      {items.map((item) => {
        const isActive = item.id === activeId;
        const icon: ReactNode = getNavIcon(item.id);
        return (
          <div key={item.id} className="contents">
          {item.sectionLabel ? (
            <p className="mb-1 mt-3 px-2 text-[10px] font-medium uppercase tracking-[0.14em] text-[var(--app-text-muted)]">
              {item.sectionLabel}
            </p>
          ) : null}
          <Link
            href={item.href}
            onClick={onNavigate}
            title={item.accessHint ?? item.label}
            aria-disabled={item.locked || undefined}
            className={`${AipifySidebarTypography.navItemRow} ${
              isActive
                ? `${AppVisualClasses.navItemActive} text-[15px] font-semibold leading-snug`
                : `${AppVisualClasses.navItem} ${AipifySidebarTypography.navigationItem}`
            } ${AppVisualClasses.focusRing} ${item.locked ? "opacity-60" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`${AipifySidebarTypography.navIcon} ${
                isActive
                  ? AppVisualClasses.navItemActiveIcon
                  : "text-[var(--app-primary-blue)] opacity-85"
              }`}
            >
              {icon}
            </span>
            <span className="min-w-0 flex-1">
              <span className={AipifySidebarTypography.navLabelWrap} title={item.label}>
                {item.label}
              </span>
            </span>
          </Link>
          </div>
        );
      })}
    </nav>
  );
}
