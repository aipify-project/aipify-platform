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
};

export default function Sidebar({
  items,
  activeId,
  onNavigate,
  className = "",
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
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
              isActive
                ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            <span className={isActive ? "text-white" : "text-gray-400"}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
