"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import {
  parseBusinessPackRuntimeCenter,
  type BusinessPackRuntimeCenter,
} from "@/lib/business-pack-runtime-engine/parse";
import type { Bpr603CustomerSection } from "@/lib/business-pack-runtime-engine/config";
import { bpr603CustomerSectionToRpc } from "@/lib/business-pack-runtime-engine/config";
import type { buildBusinessPackRuntimeCustomerLabels } from "@/lib/business-pack-runtime-engine/labels";

type Labels = ReturnType<typeof buildBusinessPackRuntimeCustomerLabels>;

type Props = {
  labels: Labels;
  section: Bpr603CustomerSection;
};

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <dt className="text-xs font-semibold uppercase text-gray-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-gray-900">{title}</p>
        {badge ? (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm text-gray-600">{summary}</p> : null}
      {extra}
    </div>
  );
}

export function BusinessPackRuntimeCustomerPanel({ labels, section }: Props) {
  const [center, setCenter] = useState<BusinessPackRuntimeCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = bpr603CustomerSectionToRpc(section);
    const res = await fetch(`/api/business-pack-runtime/center?section=${rpcSection}`);
    if (res.ok) setCenter(parseBusinessPackRuntimeCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [section]);

  useEffect(() => {
    void load();
  }, [load]);

  const sectionLabel = labels.sections[section] ?? labels.title;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <PlatformEmptyState
        title={labels.empty}
        message={center?.error ?? labels.noRecords}
        primaryAction={{ label: labels.refresh, onClick: () => void load() }}
      />
    );
  }

  const exec = center.executive_dashboard ?? {};
  const rows = center.rows ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{sectionLabel}</h2>
          {center.privacy_note ? <p className="mt-1 text-xs text-gray-500">{center.privacy_note}</p> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {section === "billing" || section === "overview" ? (
            <Link
              href="/app/settings/billing"
              className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-800 hover:bg-violet-100"
            >
              {labels.viewBilling}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => void load()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {labels.refresh}
          </button>
        </div>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-violet-100 bg-violet-50/70 px-5 py-4 text-sm text-violet-950">
          {center.principle}
        </p>
      ) : null}

      {(section === "overview" || section === "billing") && Object.keys(exec).length > 0 && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">
            {labels.executiveDashboard}
          </h3>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.executive.installedPacks} value={exec.installed_packs ?? 0} />
            <StatCard label={labels.executive.healthyPacks} value={exec.healthy_packs ?? 0} />
            <StatCard label={labels.executive.activePipelines} value={exec.active_pipelines ?? 0} />
            <StatCard label={labels.executive.pendingUpdates} value={exec.pending_updates ?? 0} />
            <StatCard label={labels.executive.gracePeriods} value={exec.grace_periods ?? 0} />
          </dl>
        </section>
      )}

      {section === "overview" && (center.companion_recommendations?.length ?? 0) > 0 && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.companionRecommendations}</h3>
          {(center.companion_recommendations ?? []).map((rec, i) => (
            <ItemCard
              key={i}
              title={String(rec.observation ?? "")}
              summary={String(rec.recommendation ?? "")}
              extra={
                rec.href ? (
                  <Link href={String(rec.href)} className="mt-3 inline-block text-sm font-medium text-violet-700 hover:text-violet-900">
                    →
                  </Link>
                ) : undefined
              }
            />
          ))}
        </section>
      )}

      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.records}</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Context</th>
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 25).map((row, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{String(row.title ?? "—")}</td>
                  <td className="px-4 py-3 capitalize text-gray-600">{String(row.status ?? "—")}</td>
                  <td className="px-4 py-3 text-gray-600">{String(row.customer_name ?? "—")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {rows.length === 0 && section !== "overview" && (
        <PlatformEmptyState title={labels.noRecords} message={labels.empty} />
      )}

      {(center.audit_recent?.length ?? 0) > 0 && section === "overview" && (
        <section className="space-y-3">
          <h3 className="font-semibold text-gray-900">{labels.auditRecent}</h3>
          {(center.audit_recent ?? []).slice(0, 8).map((entry, i) => (
            <ItemCard
              key={i}
              title={String(entry.summary ?? "")}
              badge={String(entry.event_type ?? "")}
              summary={String(entry.created_at ?? "")}
            />
          ))}
        </section>
      )}
    </div>
  );
}
