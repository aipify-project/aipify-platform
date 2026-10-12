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
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            title={item.accessHint ?? item.label}
            aria-disabled={item.locked || undefined}
            className={`${AipifySidebarTypography.navItemRow} min-h-11 ${
              isActive
                ? `${AppVisualClasses.navItemActive} text-[13px] font-semibold leading-snug`
                : `${AppVisualClasses.navItem} ${AipifySidebarTypography.navigationItem}`
            } ${AppVisualClasses.focusRing} ${item.locked ? "opacity-60" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`mt-0.5 ${AipifySidebarTypography.navIcon} ${
                isActive ? AppVisualClasses.navItemActiveIcon : "text-[var(--app-text-muted)]"
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
        );
      })}
    </nav>
  );
}
