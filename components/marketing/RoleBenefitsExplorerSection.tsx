"use client";

import { useState } from "react";

export type RoleBenefitProfile = {
  id: string;
  title: string;
  benefits: string[];
};

type RoleBenefitsExplorerSectionProps = {
  title: string;
  roles: RoleBenefitProfile[];
};

export default function RoleBenefitsExplorerSection({ title, roles }: RoleBenefitsExplorerSectionProps) {
  const [activeId, setActiveId] = useState(roles[0]?.id ?? "");
  const active = roles.find((role) => role.id === activeId) ?? roles[0];

  if (!active) return null;

  return (
    <section aria-labelledby="role-benefits-title" className="border-y border-aipify-border bg-aipify-surface-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <h2 id="role-benefits-title" className="text-center text-3xl font-bold tracking-tight text-aipify-text sm:text-4xl">
          {title}
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {roles.map((role) => (
            <button
              key={role.id}
              type="button"
              onClick={() => setActiveId(role.id)}
              aria-pressed={role.id === active.id}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                role.id === active.id
                  ? "border-aipify-companion/40 bg-aipify-companion text-white"
                  : "border-aipify-border bg-aipify-surface text-aipify-text-secondary hover:border-aipify-companion/20"
              }`}
            >
              {role.title}
            </button>
          ))}
        </div>

        <ul className="mx-auto mt-10 grid max-w-3xl gap-3 sm:grid-cols-2">
          {active.benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex gap-3 rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 text-sm text-aipify-text-secondary"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-aipify-companion" aria-hidden="true" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
