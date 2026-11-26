"use client";

import type { ReactNode } from "react";
import { SELLER_PORTAL_LAYOUT } from "@/lib/partners-portal/design-tokens";

export type AipifyTabItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
};

type AipifyTabsProps = {
  items: AipifyTabItem[];
  activeId: string;
  onChange: (id: string) => void;
  ariaLabel: string;
};

export function AipifyTabs({ items, activeId, onChange, ariaLabel }: AipifyTabsProps) {
  return (
    <div className="-mx-1 overflow-x-auto px-1" role="tablist" aria-label={ariaLabel}>
      <div className="flex min-w-max gap-1 border-b border-[#E8E4F2]">
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={active}
              disabled={item.disabled}
              onClick={() => onChange(item.id)}
              className={`inline-flex min-h-11 items-center gap-2 border-b-2 px-3 text-sm font-medium transition ${SELLER_PORTAL_LAYOUT.focusRing} ${
                active
                  ? "border-[#7C3AED] text-[#7C3AED]"
                  : "border-transparent text-[#64748B] hover:text-[#1E293B]"
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
