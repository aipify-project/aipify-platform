"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getBillingCommerceActiveNavId,
  getBillingCommerceNavItem,
  type BillingCommerceNavId,
} from "@/lib/platform/billing-commerce-center/config";
import { PlatformLayoutClasses } from "@/lib/design";

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

function chipClass(active: boolean): string {
  return active
    ? `rounded-lg px-3.5 py-2 text-sm font-semibold transition ${PlatformLayoutClasses.tabActive}`
    : `rounded-lg px-3.5 py-2 text-sm font-semibold transition ${PlatformLayoutClasses.tabIdle}`;
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
    <nav className="space-y-4 border-b border-slate-200/90 pb-5" aria-label={ariaLabel}>
      {overviewLabel ? (
        <div className="flex flex-wrap gap-2">
          <Link href={overviewHref} className={chipClass(activeId === "overview")}>
            {overviewLabel}
          </Link>
        </div>
      ) : null}

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
          <div key={group.id} className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">
              {group.label}
            </p>
            <div className="flex flex-wrap gap-2">
              {groupItems.map((item) => (
                <Link key={item.id} href={item.href} className={chipClass(activeId === item.id)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
