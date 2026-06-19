"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { parseCommercialIntelligenceCenter, type CommercialIntelligenceCenter } from "@/lib/commercial-intelligence-engine/parse";
import type { Roci588PlatformSection } from "@/lib/commercial-intelligence-engine/config";
import type { buildPlatformCommercialIntelligenceLabels } from "@/lib/commercial-intelligence-engine/labels";

type Labels = ReturnType<typeof buildPlatformCommercialIntelligenceLabels>;

type Props = {
  labels: Labels;
  section: Roci588PlatformSection;
  backHref?: string;
};

export function PlatformCommercialIntelligencePanel({ labels, section, backHref = "/platform" }: Props) {
  const [center, setCenter] = useState<CommercialIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/platform/commercial-intelligence/center?section=${section}`);
    if (res.ok) setCenter(parseCommercialIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [section]);

  useEffect(() => { void load(); }, [load]);

  const sectionLabel = labels.sections[section] ?? labels.title;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered /><span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return <p className="text-sm text-red-600">{center?.error ?? labels.empty}</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-sky-700 hover:text-sky-800">← {labels.back}</Link>
        <h1 className="mt-3 text-2xl font-semibold text-gray-900">{sectionLabel}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {center.principle ? <p className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm text-gray-800">{center.principle}</p> : null}
      </div>
      {center.stats && Object.keys(center.stats).length > 0 && (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(center.stats).map(([key, value]) => (
            <div key={key} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <dt className="text-xs font-semibold uppercase text-gray-500">{key.replace(/_/g, " ")}</dt>
              <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      {(center.rows ?? []).length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr><th className="px-4 py-3">{labels.records}</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody>
              {(center.rows ?? []).slice(0, 25).map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{String(row.customer_name ?? row.title ?? row.source_title ?? "—")}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{String(row.status ?? row.health_status ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-500">{center.privacy_note}</p>
    </div>
  );
}
