"use client";

import { useState } from "react";

export type CompanionCapability = {
  id: string;
  title: string;
  example: string;
};

type WhatCompanionDoesSectionProps = {
  title: string;
  capabilities: CompanionCapability[];
};

export default function WhatCompanionDoesSection({ title, capabilities }: WhatCompanionDoesSectionProps) {
  const [activeId, setActiveId] = useState(capabilities[0]?.id ?? "");
  const active = capabilities.find((item) => item.id === activeId) ?? capabilities[0];

  if (!active) return null;

  return (
    <section aria-labelledby="what-companion-does-title" className="bg-aipify-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="what-companion-does-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {capabilities.map((capability) => (
            <button
              key={capability.id}
              type="button"
              onClick={() => setActiveId(capability.id)}
              aria-pressed={capability.id === active.id}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                capability.id === active.id
                  ? "border-aipify-companion/40 bg-aipify-companion text-white"
                  : "border-aipify-border bg-aipify-surface-muted/60 text-aipify-text-secondary hover:border-aipify-companion/20"
              }`}
            >
              {capability.title}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 p-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-aipify-companion">{active.title}</p>
          <p className="mt-3 text-base leading-relaxed text-aipify-text-secondary">{active.example}</p>
        </div>
      </div>
    </section>
  );
}
