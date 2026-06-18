"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CUSTOMER_SUCCESS_SECTIONS,
  type CustomerSuccessSection,
} from "@/lib/customer-success-adoption-center";
import type { CustomerSuccessAdoptionCenterLabels } from "@/lib/customer-success-adoption-center/labels";

type Props = {
  labels: CustomerSuccessAdoptionCenterLabels["sections"];
};

function sectionFromPath(pathname: string): CustomerSuccessSection {
  if (pathname === "/app/customer-success" || pathname === "/app/customer-success/") return "overview";
  const match = CUSTOMER_SUCCESS_SECTIONS.find(
    (s) => s.key !== "overview" && pathname.startsWith(s.href)
  );
  return match?.key ?? "overview";
}

export function CustomerSuccessNav({ labels }: Props) {
  const pathname = usePathname();
  const active = sectionFromPath(pathname);

  return (
    <nav
      aria-label="Customer Success & Adoption"
      className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4"
    >
      {CUSTOMER_SUCCESS_SECTIONS.map((item) => {
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
