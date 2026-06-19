"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CSAR587_CUSTOMER_SECTIONS, type Csar587CustomerSection } from "@/lib/customer-success-operations/config";

type Props = {
  labels: Record<Csar587CustomerSection, string>;
};

function sectionFromPath(pathname: string): Csar587CustomerSection {
  if (pathname === "/app/customer-success" || pathname === "/app/customer-success/") return "overview";
  const match = CSAR587_CUSTOMER_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}

export function CustomerSuccessOperationsNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);

  return (
    <nav
      aria-label="Customer Success Operations"
      className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4"
    >
      {CSAR587_CUSTOMER_SECTIONS.map((item) => {
        const isActive = active === item.key;
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-indigo-700 text-white"
                : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
            }`}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
