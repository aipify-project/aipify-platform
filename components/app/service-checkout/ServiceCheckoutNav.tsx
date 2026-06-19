"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { POS612_SECTIONS, getPos612ActiveSection } from "@/lib/service-checkout-engine/config";
import type { buildServiceCheckoutLabels } from "@/lib/service-checkout-engine/labels";

type Labels = ReturnType<typeof buildServiceCheckoutLabels>;

export function ServiceCheckoutNav({ labels }: { labels: Labels["sections"] }) {
  const pathname = usePathname();
  const active = getPos612ActiveSection(pathname);

  return (
    <nav aria-label="Service Checkout" className="flex flex-wrap gap-2 border-b border-zinc-200 pb-4">
      {POS612_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            active === item.key ? "bg-violet-700 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
          }`}
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
