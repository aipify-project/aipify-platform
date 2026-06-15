"use client";

import Link from "next/link";
import type { BillingExperienceLabels } from "@/lib/billing-experience";
import { ENTERPRISE_PROCUREMENT_METHODS } from "@/lib/billing-experience/constants";

type EnterpriseProcurementSectionProps = {
  labels: BillingExperienceLabels["enterpriseProcurement"];
  manageHref: string;
  compact?: boolean;
};

export function EnterpriseProcurementSection({
  labels,
  manageHref,
  compact = false,
}: EnterpriseProcurementSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-slate-300 bg-white shadow-sm ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <h2 className="font-semibold text-slate-900">{labels.title}</h2>
      <p className="mt-2 max-w-3xl text-sm text-slate-600">{labels.description}</p>
      <p className="mt-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        {labels.message}
      </p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {ENTERPRISE_PROCUREMENT_METHODS.map((method) => (
          <li
            key={method}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200"
          >
            {labels.methods[method]}
          </li>
        ))}
      </ul>
      <Link
        href={manageHref}
        className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-800"
      >
        {labels.manageLink} →
      </Link>
    </section>
  );
}
