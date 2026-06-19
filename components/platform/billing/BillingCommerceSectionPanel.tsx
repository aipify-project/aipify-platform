"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import type { BillingCommerceCenterPayload } from "@/lib/platform/billing-commerce-center/types";

type BillingCommerceSectionPanelProps = {
  section: string;
  title: string;
  subtitle: string;
  labels: {
    loading: string;
    empty: string;
    back: string;
    stats: string;
    records: string;
    legalReviewBanner?: string;
  };
  backHref?: string;
  children?: ReactNode;
};

function StatCard({ label, value }: { label: string; value: number | string | boolean }) {
  const display = typeof value === "boolean" ? (value ? "Yes" : "No") : value;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-2 text-xl font-semibold text-gray-900">{display}</dd>
    </div>
  );
}

export function BillingCommerceSectionPanel({
  section,
  title,
  subtitle,
  labels,
  backHref = "/platform/billing",
  children,
}: BillingCommerceSectionPanelProps) {
  const [center, setCenter] = useState<BillingCommerceCenterPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/platform/billing/commerce-center?section=${encodeURIComponent(section)}`);
    if (res.ok) setCenter((await res.json()) as BillingCommerceCenterPayload);
    else setCenter(null);
    setLoading(false);
  }, [section]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="text-sm text-red-600">{labels.empty}</p>;
  }

  const rows = center.rows ?? [];
  const stats = center.stats ?? {};
  const statEntries = Object.entries(stats).filter(([key]) => key !== "phase_note" && key !== "legal_review_required");

  return (
    <div className="space-y-8">
      <div>
        <Link href={backHref} className="text-sm font-medium text-sky-700 hover:text-sky-800">
          ← {labels.back}
        </Link>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-2 max-w-3xl text-gray-600">{subtitle}</p>
        {labels.legalReviewBanner && stats.legal_review_required ? (
          <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
            {labels.legalReviewBanner}
          </p>
        ) : null}
      </div>

      {children}

      {statEntries.length > 0 ? (
        <section>
          <h2 className="mb-4 font-semibold text-gray-900">{labels.stats}</h2>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statEntries.map(([key, value]) => (
              <StatCard
                key={key}
                label={key.replace(/_/g, " ")}
                value={value as number | string | boolean}
              />
            ))}
          </dl>
        </section>
      ) : null}

      {rows.length > 0 ? (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <h2 className="font-semibold text-gray-900">{labels.records}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  {Object.keys(rows[0] ?? {}).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                    >
                      {key.replace(/_/g, " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3 text-gray-700">
                        {value === null || value === undefined ? "—" : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {typeof stats.phase_note === "string" ? (
        <p className="text-xs text-gray-500">{stats.phase_note}</p>
      ) : null}
    </div>
  );
}
