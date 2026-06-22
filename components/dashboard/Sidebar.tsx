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
  activeAccent?: "default" | "soft";
};

import { AipifyNavClasses, AipifySidebarTypography } from "@/lib/design";

const ACTIVE_ACCENT_CLASSES = {
  default: AipifyNavClasses.itemActive,
  soft: AipifyNavClasses.itemActive,
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
                ? `${ACTIVE_ACCENT_CLASSES[activeAccent]} ${AipifySidebarTypography.navigationItemActive}`
                : `${AipifyNavClasses.item} ${AipifySidebarTypography.navigationItem}`
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span
              className={`${AipifySidebarTypography.navIcon} ${
                isActive ? AipifyNavClasses.itemActiveIcon : AipifyNavClasses.itemIcon
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
