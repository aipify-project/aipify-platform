"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SELLERS_ADMIN_NAV, sellersAdminNavActive } from "@/lib/platform/sellers-admin-nav";

export function SellersAdminNav({
  labels,
  label,
}: {
  labels: Record<string, string>;
  label: string;
}) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="overflow-x-auto">
      <ul className="flex min-w-max gap-1 border-b border-[color:var(--aipify-border)]">
        {SELLERS_ADMIN_NAV.map((item) => {
          const active = sellersAdminNavActive(pathname, item.href);
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex whitespace-nowrap rounded-t-lg px-3 py-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)] ${
                  active
                    ? "bg-[color:var(--aipify-companion-purple)] text-white"
                    : "text-[color:var(--aipify-text-secondary)] hover:bg-[color:var(--aipify-surface-muted)]"
                }`}
              >
                {labels[item.id] ?? item.id}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
