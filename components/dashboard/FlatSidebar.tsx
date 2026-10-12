"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { AipifyNavClasses, AipifySidebarTypography } from "@/lib/design";
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
 * Job 60 — one vertical menu list. No accordion, nesting, or group headers.
 */
export default function FlatSidebar({
  items,
  activeId,
  onNavigate,
  className = "",
  navigationAriaLabel = "Navigation",
}: FlatSidebarProps) {
  return (
    <nav className={`flex flex-col gap-1 ${className}`} aria-label={navigationAriaLabel}>
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
            className={`${AipifySidebarTypography.navItemRow} ${
              isActive
                ? `${AipifyNavClasses.itemActive} ${AipifySidebarTypography.navigationItemActive}`
                : `${AipifyNavClasses.item} ${AipifySidebarTypography.navigationItem}`
            } ${item.locked ? "opacity-60" : ""}`}
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
