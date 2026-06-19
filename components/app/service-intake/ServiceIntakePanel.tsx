"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseServiceIntakeCenter,
  serviceIntakeSectionToRpc,
  type ServiceIntakeCenter,
  type ServiceIntakeSection,
} from "@/lib/service-intake-engine";
import type { ServiceIntakeLabels } from "@/lib/service-intake-engine/labels";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">{label}</dt>
      <dd className="mt-2 text-2xl font-semibold text-zinc-900">{value}</dd>
    </div>
  );
}

function ItemCard({
  title,
  summary,
  statusLabel,
  meta,
}: {
  title: string;
  summary?: string;
  statusLabel?: string;
  meta?: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <p className="font-semibold text-zinc-900">{title}</p>
      {statusLabel ? <p className="mt-1 text-xs text-zinc-600">{statusLabel}</p> : null}
      {meta ? <p className="mt-1 text-xs text-zinc-500">{meta}</p> : null}
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
    </div>
  );
}

function rowTitle(item: Record<string, unknown>) {
  return String(item.record_title ?? item.form_title ?? item.customer_label ?? item.record_key ?? "Record");
}

function rowMeta(item: Record<string, unknown>) {
  const parts: string[] = [];
  if (item.service_label) parts.push(String(item.service_label));
  if (item.customer_label) parts.push(String(item.customer_label));
  if (item.record_status) parts.push(String(item.record_status));
  return parts.join(" · ");
}

function pickRows(center: ServiceIntakeCenter, section: ServiceIntakeSection) {
  if (center.records?.length) return center.records;
  if (section === "forms") return center.forms ?? [];
  if (section === "submissions") return center.submissions ?? [];
  if (section === "consents") return center.consents ?? [];
  if (section === "serviceDelivery") return center.service_delivery ?? [];
  return [];
}

export function ServiceIntakePanel({
  labels,
  activeSection,
}: {
  labels: ServiceIntakeLabels;
  activeSection: ServiceIntakeSection;
}) {
  const [center, setCenter] = useState<ServiceIntakeCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = serviceIntakeSectionToRpc(activeSection);
    const params = new URLSearchParams({ section: rpcSection });
    const res = await fetch(`/api/services/intake?${params.toString()}`);
    if (res.ok) setCenter(parseServiceIntakeCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  const rows = useMemo(() => {
    const base = pickRows(center ?? { found: false }, activeSection);
    if (!search.trim()) return base;
    const q = search.toLowerCase();
    return base.filter((item) => rowTitle(item).toLowerCase().includes(q));
  }, [center, activeSection, search]);

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <p className="font-medium">{labels.empty}</p>
        {center?.error ? <p className="mt-2 text-sm">{center.error}</p> : null}
      </div>
    );
  }

  const stats = center.stats ?? {};
  const sectionTitle = labels.sections[activeSection] ?? labels.title;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">{sectionTitle}</h2>
          {center.privacy_note ? (
            <p className="mt-1 text-xs text-zinc-500">{center.privacy_note}</p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {center.principle ? (
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">
          {center.principle}
        </p>
      ) : null}

      {activeSection === "forms" ? (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.activeForms} value={stats.active_forms ?? 0} />
            <StatCard label={labels.stats.pendingSubmissions} value={stats.pending_submissions ?? 0} />
            <StatCard label={labels.stats.consentsRequired} value={stats.consents_required ?? 0} />
            <StatCard label={labels.stats.deliveryTasksOpen} value={stats.delivery_tasks_open ?? 0} />
            <StatCard label={labels.stats.readinessBlocked} value={stats.readiness_blocked ?? 0} />
          </div>
        </section>
      ) : null}

      

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="font-medium text-zinc-800">{labels.noRecords}</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((item) => {
            const key = String(item.record_key ?? rowTitle(item));
            return (
              <ItemCard
                key={key}
                title={rowTitle(item)}
                summary={typeof item.summary === "string" ? item.summary : undefined}
                statusLabel={
                  typeof item.status_label === "string"
                    ? item.status_label
                    : typeof item.status_label === "string" ? item.status_label : undefined
                }
                meta={rowMeta(item)}
              />
            );
          })}
        </div>
      )}

      <p className="text-xs text-zinc-500">{labels.readiness.principle}</p>
    </div>
  );
}
