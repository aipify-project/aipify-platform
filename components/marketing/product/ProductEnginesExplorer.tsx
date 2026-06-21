"use client";

import { useState } from "react";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductEngine } from "@/lib/marketing/parse-product-page";

type ProductEnginesExplorerProps = {
  title: string;
  subtitle: string;
  secondaryTitle: string;
  items: ProductEngine[];
};

export default function ProductEnginesExplorer({ title, subtitle, secondaryTitle, items }: ProductEnginesExplorerProps) {
  const primary = items.filter((e) => e.primary);
  const secondary = items.filter((e) => !e.primary);
  const [activeId, setActiveId] = useState(primary[0]?.id ?? items[0]?.id ?? "");
  const active = items.find((e) => e.id === activeId) ?? items[0];

  return (
    <section id="engines" className={`scroll-mt-20 ${AipifyMarketingClasses.sectionAlt}`} aria-labelledby="product-engines-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="max-w-2xl">
          <h2 id="product-engines-title" className={PublicMarketingClasses.sectionHeading}>
            {title}
          </h2>
          {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="space-y-6">
            <div>
              <p className={PublicMarketingClasses.cardLabel}>Primary engines</p>
              <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {primary.map((engine) => (
                  <li key={engine.id}>
                    <button
                      type="button"
                      onClick={() => setActiveId(engine.id)}
                      className={`w-full rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-aipify-focus ${
                        engine.id === activeId
                          ? "border-aipify-companion bg-aipify-accent-soft/60 shadow-sm"
                          : "border-aipify-border bg-aipify-surface hover:border-aipify-companion/30"
                      }`}
                    >
                      <p className="font-semibold text-aipify-text">{engine.name}</p>
                      <p className="mt-1 text-sm text-aipify-text-secondary">{engine.purpose}</p>
                      <p className="mt-2 text-xs font-medium text-aipify-companion">{engine.signal}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {secondary.length > 0 ? (
              <div>
                <p className={PublicMarketingClasses.cardLabel}>{secondaryTitle}</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {secondary.map((engine) => (
                    <li key={engine.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(engine.id)}
                        className={`rounded-lg border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-aipify-focus ${
                          engine.id === activeId
                            ? "border-aipify-companion bg-aipify-companion text-white"
                            : "border-aipify-border bg-aipify-surface text-aipify-text-secondary hover:text-aipify-text"
                        }`}
                      >
                        {engine.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          {active ? (
            <div className={PublicMarketingClasses.card}>
              <h3 className="text-xl font-semibold text-aipify-text">{active.name}</h3>
              <p className="mt-2 text-sm text-aipify-text-secondary">{active.purpose}</p>

              <dl className="mt-6 space-y-4">
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>Signal</dt>
                  <dd className="mt-1 text-sm text-aipify-text">{active.signal}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>Recommended action</dt>
                  <dd className="mt-1 text-sm text-aipify-text">{active.action}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>Surface</dt>
                  <dd className="mt-1 text-sm text-aipify-text-secondary">{active.surface}</dd>
                </div>
              </dl>

              {active.detail ? (
                <div className="mt-6 space-y-3 border-t border-aipify-border pt-6">
                  <p className={PublicMarketingClasses.cardLabel}>Detail panel</p>
                  <dl className="space-y-3">
                    {(
                      [
                        ["Context signal", active.detail.signal],
                        ["Full context", active.detail.context],
                        ["Recommendation", active.detail.recommendation],
                        ["Approval rule", active.detail.approvalRule],
                        ["Command Brief item", active.detail.briefItem],
                        ["Audit event", active.detail.auditEvent],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-xs font-medium text-aipify-text-muted">{label}</dt>
                        <dd className="mt-0.5 text-sm text-aipify-text">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
