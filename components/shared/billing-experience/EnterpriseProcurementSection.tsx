"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { BillingExperienceLabels } from "@/lib/billing-experience";
import { ENTERPRISE_PROCUREMENT_METHODS } from "@/lib/billing-experience/constants";

type EnterpriseProcurementSectionProps = {
  labels: BillingExperienceLabels["enterpriseProcurement"];
  manageHref: string;
  compact?: boolean;
  providerInfrastructureLabel?: string;
  providerCard?: ReactNode;
};

export function EnterpriseProcurementSection({
  labels,
  manageHref,
  compact = false,
  providerInfrastructureLabel,
  providerCard,
}: EnterpriseProcurementSectionProps) {
  return (
    <section
      className={`rounded-2xl border border-neutral-200/90 bg-white shadow-sm ${
        compact ? "p-5" : "p-6"
      }`}
    >
      <h2 className="text-lg font-semibold tracking-tight text-neutral-900">{labels.title}</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">{labels.description}</p>
      <p className="mt-4 rounded-xl border border-neutral-100 bg-neutral-50 px-4 py-3.5 text-sm leading-relaxed text-neutral-800">
        {labels.message}
      </p>
      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {labels.supportedMethodsLabel}
        </p>
        <ul className="mt-3 flex flex-wrap gap-2">
          {ENTERPRISE_PROCUREMENT_METHODS.map((method) => (
            <li
              key={method}
              className="rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 ring-1 ring-neutral-200/80"
            >
              {labels.methods[method]}
            </li>
          ))}
        </ul>
      </div>
      {providerCard ? (
        <div className="mt-8 border-t border-neutral-100 pt-8">
          {providerInfrastructureLabel ? (
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
              {providerInfrastructureLabel}
            </p>
          ) : null}
          <div className={`grid gap-6 ${providerInfrastructureLabel ? "mt-4" : ""} lg:grid-cols-2`}>
            {providerCard}
          </div>
        </div>
      ) : null}
      <Link
        href={manageHref}
        className="mt-6 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-800"
      >
        {labels.manageLink} →
      </Link>
    </section>
  );
}
