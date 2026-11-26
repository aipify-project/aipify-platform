"use client";

import type { SubscriptionTabId } from "@/lib/commercial-packages/subscription-tabs";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  Boxes,
  FileText,
  Gauge,
  LayoutDashboard,
  Package,
  Puzzle,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type SubscriptionTabLabels = Record<SubscriptionTabId, string>;

const TAB_ICONS: Record<SubscriptionTabId, LucideIcon> = {
  overview: LayoutDashboard,
  products: Package,
  store: Boxes,
  addons: Puzzle,
  capacity: Gauge,
  license: ShieldCheck,
  invoices: FileText,
};

const TAB_ORDER: SubscriptionTabId[] = [
  "overview",
  "products",
  "store",
  "addons",
  "capacity",
  "license",
  "invoices",
];

type SubscriptionTabNavProps = {
  active: SubscriptionTabId;
  labels: SubscriptionTabLabels;
  onSelect: (tab: SubscriptionTabId) => void;
};

export function SubscriptionTabNav({ active, labels, onSelect }: SubscriptionTabNavProps) {
  return (
    <div className="-mx-1 overflow-x-auto overscroll-x-contain pb-1 [scrollbar-width:thin]">
      <div
        role="tablist"
        aria-label={labels.overview}
        className="flex min-w-max gap-1 px-1 sm:flex-wrap sm:min-w-0"
      >
        {TAB_ORDER.map((id) => {
          const Icon = TAB_ICONS[id];
          const selected = active === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`subscription-tab-${id}`}
              aria-selected={selected}
              aria-controls={`subscription-panel-${id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => onSelect(id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition-colors motion-reduce:transition-none ${AppPremiumShell.focusRing} ${
                selected
                  ? "bg-[var(--app-primary)] text-white shadow-sm"
                  : "bg-[var(--app-soft-surface)] text-[var(--app-text-muted)] hover:bg-[var(--app-primary-soft)] hover:text-[var(--app-primary)]"
              }`}
            >
              <Icon aria-hidden className="size-4 shrink-0" strokeWidth={2} />
              <span>{labels[id]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
