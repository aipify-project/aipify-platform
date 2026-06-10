"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getIntelligenceActiveNavId } from "@/lib/platform/nav-config";

type IntelligenceSubNavItem = {
  id: string;
  href: string;
  label: string;
};

type IntelligenceSubNavProps = {
  items: IntelligenceSubNavItem[];
};

export default function IntelligenceSubNav({ items }: IntelligenceSubNavProps) {
  const pathname = usePathname();
  const activeId = getIntelligenceActiveNavId(pathname);

  return (
    <nav className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            activeId === item.id
              ? "bg-violet-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
