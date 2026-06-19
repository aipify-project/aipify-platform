"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CSAR587_PLATFORM_SECTIONS,
  getCsar587PlatformActiveNavId,
} from "@/lib/customer-success-operations/config";

type Props = {
  labels: Record<string, string>;
};

export function PlatformCustomerSuccessOperationsSubNav({ labels }: Props) {
  const pathname = usePathname();
  const active = getCsar587PlatformActiveNavId(pathname);

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-gray-200 pb-4"
      aria-label="Customer Success Operations navigation"
    >
      {CSAR587_PLATFORM_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            active === item.key
              ? "border border-sky-200 bg-sky-50 text-sky-900 shadow-sm"
              : "bg-gray-50 text-gray-600 hover:bg-sky-50 hover:text-sky-800"
          }`}
        >
          {labels[item.key] ?? item.key}
        </Link>
      ))}
    </nav>
  );
}
