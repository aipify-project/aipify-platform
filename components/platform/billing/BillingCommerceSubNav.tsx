"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getBillingCommerceActiveNavId,
  getBillingCommerceNavItem,
  type BillingCommerceNavGroupId,
  type BillingCommerceNavId,
} from "@/lib/platform/billing-commerce-center/config";

type BillingCommerceSubNavItem = {
  id: string;
  href: string;
  label: string;
};

type BillingCommerceSubNavProps = {
  items: BillingCommerceSubNavItem[];
  groups: Array<{
    id: string;
    label: string;
    itemIds: BillingCommerceNavId[];
  }>;
  overviewHref?: string;
  overviewLabel?: string;
  ariaLabel: string;
};

const GROUP_CHIP_STYLES: Record<
  BillingCommerceNavGroupId,
  { active: string; idle: string }
> = {
  core: {
    active: "bg-sky-100 text-sky-950 ring-1 ring-sky-300/80",
    idle: "bg-sky-50/70 text-sky-900 ring-1 ring-sky-200/80 hover:bg-sky-100/80",
  },
  tax: {
    active: "bg-orange-100 text-orange-950 ring-1 ring-orange-300/80",
    idle: "bg-orange-50/80 text-orange-900 ring-1 ring-orange-200/80 hover:bg-orange-100/70",
  },
  reporting: {
    active: "bg-violet-100 text-violet-950 ring-1 ring-violet-300/80",
    idle: "bg-violet-50/70 text-violet-900 ring-1 ring-violet-200/80 hover:bg-violet-100/80",
  },
};

function groupChipClass(groupId: string, active: boolean): string {
  const palette =
    GROUP_CHIP_STYLES[groupId as BillingCommerceNavGroupId] ?? GROUP_CHIP_STYLES.core;
  const tone = active ? palette.active : palette.idle;
  return `rounded-lg px-3 py-1.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${tone}`;
}

function overviewChipClass(active: boolean): string {
  return active
    ? "rounded-lg px-3 py-1.5 text-sm font-semibold transition bg-slate-200/90 text-slate-950 ring-1 ring-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
    : "rounded-lg px-3 py-1.5 text-sm font-semibold transition bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500";
}

export function BillingCommerceSubNav({
  items,
  groups,
  overviewHref = "/platform/billing",
  overviewLabel,
  ariaLabel,
}: BillingCommerceSubNavProps) {
  const pathname = usePathname();
  const activeId = getBillingCommerceActiveNavId(pathname);
  const labelById = new Map(items.map((item) => [item.id, item]));

  return (
    <nav
      className="rounded-2xl border border-slate-200/90 bg-white/80 px-3 py-3 shadow-[0_1px_2px_rgba(32,35,54,0.04)] sm:px-4"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col gap-3">
        {overviewLabel ? (
          <div className="flex flex-wrap gap-2">
            <Link href={overviewHref} className={overviewChipClass(activeId === "overview")}>
              {overviewLabel}
            </Link>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 lg:gap-4">
          {groups.map((group) => {
            const groupItems = group.itemIds
              .map((id) => {
                const fromProps = labelById.get(id);
                const fromConfig = getBillingCommerceNavItem(id);
                if (!fromConfig) return null;
                return {
                  id,
                  href: fromProps?.href ?? fromConfig.href,
                  label: fromProps?.label ?? id,
                };
              })
              .filter((item): item is BillingCommerceSubNavItem & { id: BillingCommerceNavId } =>
                Boolean(item),
              );

            if (groupItems.length === 0) return null;

            return (
              <div key={group.id} className="min-w-0 space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {groupItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={groupChipClass(group.id, activeId === item.id)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
