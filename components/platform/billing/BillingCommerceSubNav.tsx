"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getBillingCommerceActiveNavId } from "@/lib/platform/billing-commerce-center/config";

type BillingCommerceSubNavItem = {
  id: string;
  href: string;
  label: string;
};

type BillingCommerceSubNavProps = {
  items: BillingCommerceSubNavItem[];
  overviewHref?: string;
  overviewLabel?: string;
};

export function BillingCommerceSubNav({
  items,
  overviewHref = "/platform/billing",
  overviewLabel,
}: BillingCommerceSubNavProps) {
  const pathname = usePathname();
  const activeId = getBillingCommerceActiveNavId(pathname);

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-gray-200 pb-4"
      aria-label="Billing & Commerce navigation"
    >
      {overviewLabel ? (
        <Link
          href={overviewHref}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeId === "overview"
              ? "border border-sky-200 bg-sky-50 text-sky-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-sky-50 hover:text-sky-800"
          }`}
        >
          {overviewLabel}
        </Link>
      ) : null}
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeId === item.id
              ? "border border-sky-200 bg-sky-50 text-sky-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-sky-50 hover:text-sky-800"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
