"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DESKTOP_COMPANION_NAV } from "@/lib/desktop-companion-foundation/constants";

type Props = {
  labels: Record<string, string>;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
};

export function DesktopCompanionFoundationShell({ labels, children, sidebar }: Props) {
  const pathname = usePathname();

  return (
    <div className="mx-auto flex max-w-7xl gap-6 p-6">
      <aside className="hidden w-52 shrink-0 lg:block">
        <nav className="space-y-1">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            {labels.title}
          </p>
          {DESKTOP_COMPANION_NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  active
                    ? "bg-indigo-50 font-medium text-indigo-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {labels[item.labelKey] ?? item.id}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 space-y-6">
        {sidebar}
        {children}
      </div>
    </div>
  );
}
