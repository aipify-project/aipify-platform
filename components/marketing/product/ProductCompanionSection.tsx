"use client";

import { useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses } from "@/lib/design/light-enterprise-theme";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { ProductPageContent } from "@/lib/marketing/parse-product-page";

type ProductCompanionSectionProps = ProductPageContent["companion"] & {
  appName: string;
};

export default function ProductCompanionSection({
  title,
  subtitle,
  distinction,
  panel,
  capabilities,
  appName,
}: ProductCompanionSectionProps) {
  const [activeId, setActiveId] = useState(capabilities[0]?.id ?? "");
  const active = capabilities.find((c) => c.id === activeId) ?? capabilities[0];

  return (
    <section id="companion" className={`scroll-mt-20 ${AipifyMarketingClasses.sectionAlt}`} aria-labelledby="product-companion-title">
      <div className={`${PublicMarketingClasses.container} py-14 sm:py-16`}>
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
          <div>
            <div className="flex items-center gap-3">
              <AipifyPulse size={40} variant="gradient" title={appName} aria-label={appName} />
              <span className="text-sm font-semibold text-aipify-companion">Aipify Companion</span>
            </div>
            <h2 id="product-companion-title" className={`mt-5 ${PublicMarketingClasses.sectionHeading}`}>
              {title}
            </h2>
            {subtitle ? <p className={PublicMarketingClasses.sectionSubtitle}>{subtitle}</p> : null}
            {distinction ? (
              <p className="mt-4 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm leading-relaxed text-aipify-text-secondary">
                {distinction}
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap gap-2">
              {capabilities.map((cap) => (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => setActiveId(cap.id)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-aipify-focus ${
                    cap.id === activeId
                      ? "bg-aipify-companion text-white"
                      : "border border-aipify-border bg-aipify-surface text-aipify-text-secondary hover:text-aipify-text"
                  }`}
                >
                  {cap.title}
                </button>
              ))}
            </div>

            {active ? (
              <dl className="mt-6 space-y-4">
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>What it means</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-aipify-text">{active.meaning}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>Example</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{active.example}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>Boundary</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{active.boundary}</dd>
                </div>
                <div>
                  <dt className={PublicMarketingClasses.cardLabel}>Human control</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{active.humanControl}</dd>
                </div>
              </dl>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg">
            <div className="border-b border-aipify-border bg-aipify-surface-muted/80 px-5 py-4">
              <p className="text-sm font-semibold text-aipify-text">{panel.title}</p>
              <p className="mt-1 text-xs text-aipify-text-muted">{panel.status}</p>
            </div>
            <div className="space-y-5 p-5">
              <div>
                <p className={PublicMarketingClasses.cardLabel}>{panel.contextLabel}</p>
                <ul className="mt-2 space-y-1.5">
                  {panel.contextItems.map((item) => (
                    <li key={item} className="text-sm text-aipify-text">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-aipify-accent-muted bg-aipify-accent-soft/50 p-4">
                <p className={PublicMarketingClasses.cardLabel}>{panel.recommendationLabel}</p>
                <p className="mt-2 text-sm leading-relaxed text-aipify-text">{panel.recommendation}</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {panel.actions.map((action) => (
                  <li
                    key={action}
                    className="rounded-lg border border-aipify-border bg-aipify-surface-muted px-3 py-1.5 text-sm font-medium text-aipify-text"
                  >
                    {action}
                  </li>
                ))}
              </ul>
              <p className="text-sm font-medium text-aipify-accent">{panel.explainLabel}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
