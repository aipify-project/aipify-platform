"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
};

type SidebarProps = {
  items: NavItem[];
  activeId: string;
  onNavigate?: () => void;
  className?: string;
  activeAccent?: "default" | "soft" | "light";
};

import { AipifyNavClasses, AipifySidebarTypography } from "@/lib/design";

const ACTIVE_ACCENT_CLASSES = {
  default: AipifyNavClasses.itemActive,
  soft: AipifyNavClasses.itemActive,
  light: AipifyNavClasses.itemActiveLight,
} as const;

const ACTIVE_ICON_CLASSES = {
  default: AipifyNavClasses.itemActiveIcon,
  soft: AipifyNavClasses.itemActiveIcon,
  light: AipifyNavClasses.itemActiveLightIcon,
} as const;

const ACTIVE_TEXT_CLASSES = {
  default: AipifySidebarTypography.navigationItemActive,
  soft: AipifySidebarTypography.navigationItemActive,
  light: "text-[15px] font-semibold leading-snug text-sky-950",
} as const;

export default function Sidebar({
  items,
  activeId,
  onNavigate,
  className = "",
  activeAccent = "default",
}: SidebarProps) {
  return (
    <nav className={`flex flex-col gap-1 ${className}`} aria-label="Dashboard">
      {items.map((item) => {
        const isActive = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            className={`${AipifySidebarTypography.navItemRow} ${
              isActive
                ? `${ACTIVE_ACCENT_CLASSES[activeAccent]} ${ACTIVE_TEXT_CLASSES[activeAccent]}`
                : `${AipifyNavClasses.item} ${AipifySidebarTypography.navigationItem}`
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`mt-0.5 ${AipifySidebarTypography.navIcon} ${
                isActive ? ACTIVE_ICON_CLASSES[activeAccent] : AipifyNavClasses.itemIcon
              }`}
            >
              {item.icon}
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
