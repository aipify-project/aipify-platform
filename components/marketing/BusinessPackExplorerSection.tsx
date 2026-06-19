"use client";

import { useState } from "react";

export type BusinessPackExplorerItem = {
  id: string;
  name: string;
  purpose: string;
  capabilities: string;
  audience: string;
  benefits: string;
};

type BusinessPackExplorerSectionProps = {
  title: string;
  subtitle: string;
  packs: BusinessPackExplorerItem[];
  labels: {
    purpose: string;
    capabilities: string;
    audience: string;
    benefits: string;
  };
};

export default function BusinessPackExplorerSection({
  title,
  subtitle,
  packs,
  labels,
}: BusinessPackExplorerSectionProps) {
  const [activeId, setActiveId] = useState(packs[0]?.id ?? "");
  const active = packs.find((pack) => pack.id === activeId) ?? packs[0];

  if (!active) return null;

  return (
    <section aria-labelledby="business-pack-explorer-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="business-pack-explorer-title" className="text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-aipify-text-secondary">{subtitle}</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {packs.map((pack) => (
              <li key={pack.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(pack.id)}
                  aria-pressed={pack.id === active.id}
                  className={`w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition ${
                    pack.id === active.id
                      ? "border-aipify-companion/40 bg-aipify-accent-soft text-aipify-companion"
                      : "border-aipify-border bg-aipify-surface-muted/60 text-aipify-text-secondary hover:border-aipify-companion/20"
                  }`}
                >
                  {pack.name}
                </button>
              </li>
            ))}
          </ul>

          <div className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-aipify-text">{active.name}</h3>
            <dl className="mt-6 space-y-4">
              {[
                { label: labels.purpose, value: active.purpose },
                { label: labels.capabilities, value: active.capabilities },
                { label: labels.audience, value: active.audience },
                { label: labels.benefits, value: active.benefits },
              ].map((row) => (
                <div key={row.label}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{row.label}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-aipify-text-secondary">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
