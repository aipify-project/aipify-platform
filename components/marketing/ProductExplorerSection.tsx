"use client";

import { useState } from "react";
import Link from "next/link";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";
import { MARKETING_PRIMARY_CTA_HREFS } from "@/lib/marketing/primary-ctas";

export type ProductExplorerItem = {
  id: string;
  title: string;
  explanation: string;
  screenshotLabel: string;
  workflow: string;
  value: string;
};

type ProductExplorerSectionProps = {
  title: string;
  items: ProductExplorerItem[];
  bookDemoLabel: string;
  labels: {
    explanation: string;
    workflow: string;
    value: string;
  };
};

export default function ProductExplorerSection({
  title,
  items,
  bookDemoLabel,
  labels,
}: ProductExplorerSectionProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  const active = items.find((item) => item.id === activeId) ?? items[0];

  if (!active) return null;

  return (
    <section id="explore-aipify" aria-labelledby="product-explorer-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="product-explorer-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(item.id)}
                  aria-pressed={item.id === active.id}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    item.id === active.id
                      ? "border-aipify-companion/40 bg-aipify-accent-soft text-aipify-companion"
                      : "border-aipify-border bg-aipify-surface-muted/60 text-aipify-text-secondary hover:border-aipify-companion/20"
                  }`}
                >
                  {item.title}
                </button>
              </li>
            ))}
          </ul>

          <div className={`${AipifyMarketingClasses.card} space-y-5`}>
            <div
              className="flex aspect-[16/10] items-center justify-center rounded-xl border border-dashed border-aipify-border bg-aipify-surface-muted text-xs font-medium uppercase tracking-wide text-aipify-text-muted"
              aria-hidden="true"
            >
              {active.screenshotLabel}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{labels.explanation}</p>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{active.explanation}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{labels.workflow}</p>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{active.workflow}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{labels.value}</p>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text">{active.value}</p>
            </div>
            <Link
              href={MARKETING_PRIMARY_CTA_HREFS.bookDemo}
              className={`inline-flex ${AipifyMarketingClasses.primaryCta} px-5 py-2.5 text-sm`}
              {...marketingDataAttr("cta_click", `product_explorer_${active.id}`)}
            >
              {bookDemoLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
