"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { INV613_SECTIONS, getInv613ActiveSection } from "@/lib/inventory-operations-engine/config";
import type { InventoryOperationsEngineLabels } from "@/lib/inventory-operations-engine/labels";

export function InventoryOperationsNav({ labels }: { labels: InventoryOperationsEngineLabels["sections"] }) {
  const pathname = usePathname();
  const active = getInv613ActiveSection(pathname);

  return (
    <nav aria-label="Inventory" className="flex flex-wrap gap-2 border-b border-aipify-border pb-4">
      {INV613_SECTIONS.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={
            active === item.key
              ? "rounded-lg bg-[#7C3AED] px-3 py-2 text-sm font-medium text-white"
              : "rounded-lg px-3 py-2 text-sm font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text"
          }
        >
          {labels[item.key]}
        </Link>
      ))}
    </nav>
  );
}
