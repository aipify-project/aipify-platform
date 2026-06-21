"use client";

import Link from "next/link";
import type { BusinessPackCapabilityEntry } from "@/lib/app-portal/business-pack-resolver";
import { buildBusinessPackLearnMoreHref } from "@/lib/app-portal/business-pack-resolver";
import type { BusinessPackDetailLabels } from "@/lib/app-portal/business-pack-detail-labels";
import { getResolvedPackDisplayName } from "@/lib/app-portal/business-pack-detail-labels";
import type { Translator } from "@/lib/i18n/translate";

type Props = {
  entry: BusinessPackCapabilityEntry;
  labels: BusinessPackDetailLabels;
  t: Translator;
  backHref?: string;
  backLabel?: string;
};

function capabilityCopy(
  key: string,
  labels: BusinessPackDetailLabels
): BusinessPackDetailLabels["capabilities"]["analytics"] | null {
  if (key === "analytics") return labels.capabilities.analytics;
  if (key === "workflows") return labels.capabilities.workflows;
  return null;
}

export function BusinessPackCapabilityDetailPanel({
  entry,
  labels,
  t,
  backHref = "/app/business-packs/available",
  backLabel,
}: Props) {
  const copy = capabilityCopy(entry.capabilityKey, labels);
  const name = getResolvedPackDisplayName(entry.nameKey, labels, t);

  if (!copy) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <nav className="text-sm text-slate-500" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>{labels.breadcrumbBusinessPacks}</li>
          <li aria-hidden="true">→</li>
          <li className="font-medium text-slate-800">{labels.breadcrumbDetail}</li>
        </ol>
      </nav>
      <Link href={backHref} className="inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-800">
        ← {backLabel ?? labels.backToAvailable}
      </Link>
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">
          {labels.capabilityNote}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{name}</h1>
        <p className="max-w-3xl text-slate-600">{copy.subtitle}</p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.whatItHelpsWith}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{copy.helpsWith}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.coreCapabilities}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{copy.capabilities}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.recommendedFor}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{copy.recommendedFor}</p>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{labels.planAndAccess}</h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{copy.planAccess}</p>
      </section>

      {entry.relatedSlugs.length > 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{labels.relatedPacks}</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {entry.relatedSlugs.map((slug) => {
              const href = buildBusinessPackLearnMoreHref(slug);
              if (!href) return null;
              return (
                <li key={slug}>
                  <Link
                    href={href}
                    className="rounded-lg border border-indigo-200 px-3 py-1.5 text-sm font-medium text-indigo-800 hover:bg-indigo-50"
                  >
                    {slug.replace(/-/g, " ")}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Link
          href="/app/business-packs/available"
          className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          {labels.exploreAvailable}
        </Link>
        <Link
          href="/app/business-packs/recommendations"
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
        >
          {labels.viewRecommendations}
        </Link>
        <Link
          href="/app/support/contact"
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {labels.contactSales}
        </Link>
      </div>
    </div>
  );
}
