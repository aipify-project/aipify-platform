"use client";

import { useState } from "react";
import { PublicMarketingClasses } from "@/lib/design/public-marketing-tokens";
import type { GrowthPartnersPageRedesignLabels } from "./types";

type Props = {
  portal: GrowthPartnersPageRedesignLabels["portalPreview"];
};

type TabKey = "leads" | "commissions" | "certification" | "resources";

const TAB_ORDER: TabKey[] = ["leads", "commissions", "certification", "resources"];

export default function GrowthPartnerPortalPreview({ portal }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("leads");

  return (
    <section aria-labelledby="gp-portal-title" className={`${PublicMarketingClasses.sectionAlt} py-16 sm:py-20`}>
      <div className={PublicMarketingClasses.containerWide}>
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="gp-portal-title" className={PublicMarketingClasses.sectionHeading}>{portal.title}</h2>
          <p className="mt-4 text-lg leading-relaxed text-aipify-text-secondary">{portal.subtitle}</p>
        </div>

        <div className="mt-10 mx-auto max-w-4xl">
          <div className="flex flex-wrap justify-center gap-2">
            {TAB_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                aria-pressed={activeTab === key}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-aipify-focus ${
                  activeTab === key
                    ? "bg-aipify-companion text-white shadow-sm"
                    : "border border-aipify-border bg-aipify-surface text-aipify-text-secondary hover:border-aipify-companion/40"
                }`}
              >
                {portal.tabs[key]}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-aipify-border bg-aipify-surface shadow-lg">
            <div className="flex items-center gap-2 border-b border-aipify-border bg-aipify-surface-muted/60 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-red-300" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-300" aria-hidden="true" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" aria-hidden="true" />
              <span className="ml-2 text-xs font-medium text-aipify-text-muted">Growth Partner Portal</span>
            </div>

            <div className="p-6 sm:p-8">
              {activeTab === "leads" ? (
                <div>
                  <h3 className="text-base font-semibold text-aipify-text">{portal.leads.heading}</h3>
                  <dl className="mt-4 divide-y divide-aipify-border rounded-xl border border-aipify-border">
                    {portal.leads.rows.map((row) => (
                      <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <dt className="text-aipify-text-secondary">{row.label}</dt>
                        <dd className="font-medium text-aipify-text">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {activeTab === "commissions" ? (
                <div>
                  <h3 className="text-base font-semibold text-aipify-text">{portal.commissions.heading}</h3>
                  <dl className="mt-4 divide-y divide-aipify-border rounded-xl border border-aipify-border">
                    {portal.commissions.rows.map((row) => (
                      <div key={row.label} className="flex justify-between gap-4 px-4 py-3 text-sm">
                        <dt className="text-aipify-text-secondary">{row.label}</dt>
                        <dd className="font-medium text-aipify-text">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ) : null}

              {activeTab === "certification" ? (
                <div>
                  <h3 className="text-base font-semibold text-aipify-text">{portal.certification.heading}</h3>
                  <ul className="mt-4 space-y-2">
                    {portal.certification.modules.map((mod) => (
                      <li
                        key={mod.name}
                        className="flex items-center justify-between rounded-xl border border-aipify-border px-4 py-3 text-sm"
                      >
                        <span className="text-aipify-text-secondary">{mod.name}</span>
                        <span className="rounded-full bg-aipify-accent-soft px-2.5 py-0.5 text-xs font-medium text-aipify-companion">
                          {mod.status}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {activeTab === "resources" ? (
                <div>
                  <h3 className="text-base font-semibold text-aipify-text">{portal.resources.heading}</h3>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {portal.resources.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-xl border border-aipify-border bg-aipify-surface-muted/40 px-4 py-3 text-sm text-aipify-text-secondary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-aipify-text-muted">{portal.previewNote}</p>
        </div>
      </div>
    </section>
  );
}
