"use client";

import Link from "next/link";
import type { BusinessPackDetailLabels } from "@/lib/app-portal/business-pack-detail-labels";

type Props = {
  labels: BusinessPackDetailLabels;
  backHref?: string;
  backLabel?: string;
};

export function BusinessPackUnavailablePanel({
  labels,
  backHref = "/app/business-packs/available",
  backLabel,
}: Props) {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
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
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">{labels.unavailableTitle}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{labels.unavailableBody}</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link
            href="/app/business-packs/available"
            className="inline-flex justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.viewAvailable}
          </Link>
          <Link
            href="/app/business-packs/recommendations"
            className="inline-flex justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            {labels.viewRecommendations}
          </Link>
          <Link
            href="/app/support/contact"
            className="inline-flex justify-center rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {labels.contactAipify}
          </Link>
        </div>
      </section>
    </div>
  );
}
