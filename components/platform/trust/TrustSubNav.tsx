"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getTrustActiveNavId } from "@/lib/platform/trust-center/config";

type TrustSubNavItem = {
  id: string;
  href: string;
  label: string;
};

type TrustSubNavProps = {
  items: TrustSubNavItem[];
};

export default function TrustSubNav({ items }: TrustSubNavProps) {
  const pathname = usePathname();
  const activeId = getTrustActiveNavId(pathname);

  return (
    <nav
      className="flex flex-wrap gap-2 border-b border-gray-200 pb-4"
      aria-label="Trust Center navigation"
    >
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
