"use client";

import Link from "next/link";
import type { CspHelpLabels } from "@/lib/partners-portal/csp-section-labels";

export type { CspHelpLabels };

export function CertifiedSalesPartnerHelpPanel({ labels }: { labels: CspHelpLabels }) {
  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-aipify-text">{labels.title}</h2>
        <p className="max-w-3xl text-sm text-aipify-text-secondary">{labels.intro}</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {labels.sections.map((section) => (
          <article
            key={section.id}
            className="rounded-2xl border border-aipify-border bg-aipify-surface p-5 shadow-sm"
          >
            <h3 className="font-semibold text-aipify-text">{section.title}</h3>
            <p className="mt-2 text-sm text-aipify-text-secondary">{section.body}</p>
            {section.href && section.cta ? (
              <Link
                href={section.href}
                className="mt-4 inline-flex text-sm font-semibold text-aipify-companion hover:underline"
              >
                {section.cta}
              </Link>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}
