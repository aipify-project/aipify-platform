"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseServiceExperienceCenter,
  serviceCommunicationsSectionToRpc,
  type ServiceCommunicationsSection,
  type ServiceExperienceCenter,
} from "@/lib/service-experience-engine";
import type { ServiceCommunicationsLabels } from "@/lib/service-experience-engine/labels";

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
  return String(item.record_title ?? item.customer_label ?? item.booking_key ?? "Record");
}

function rowMeta(item: Record<string, unknown>) {
  const parts: string[] = [];
  if (item.channel_key) parts.push(String(item.channel_key));
  if (item.category_key) parts.push(String(item.category_key));
  if (item.location_label) parts.push(String(item.location_label));
  if (item.status_label) parts.push(String(item.status_label));
  return parts.join(" · ");
}

function pickRows(center: ServiceExperienceCenter, section: ServiceCommunicationsSection) {
  if (center.records?.length) return center.records;
  if (section === "overview") return center.messages ?? [];
  if (section === "templates") return center.templates ?? [];
  return center.records ?? center.messages ?? [];
}

export function ServiceCommunicationsPanel({
  labels,
  activeSection,
}: {
  labels: ServiceCommunicationsLabels;
  activeSection: ServiceCommunicationsSection;
}) {
  const [center, setCenter] = useState<ServiceExperienceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = serviceCommunicationsSectionToRpc(activeSection);
    const params = new URLSearchParams({ section: rpcSection });
    const res = await fetch(`/api/services/communications?${params.toString()}`);
    if (res.ok) setCenter(parseServiceExperienceCenter(await res.json()));
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
          {center.principle ? <p className="mt-1 text-sm text-zinc-600">{center.principle}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => void load()}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          {labels.refresh}
        </button>
      </div>

      {activeSection === "overview" ? (
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard label={labels.stats.scheduled} value={stats.scheduled ?? 0} />
          <StatCard label={labels.stats.delivered} value={stats.delivered ?? 0} />
          <StatCard label={labels.stats.failed} value={stats.failed ?? 0} />
          <StatCard label={labels.stats.repliesPending} value={stats.repliesPending ?? 0} />
          <StatCard label={labels.stats.suppressed} value={stats.suppressed ?? 0} />
        </dl>
      ) : null}

      <div>
        <label className="sr-only" htmlFor="comm-search">
          Search
        </label>
        <input
          id="comm-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={labels.noRecords}
          className="w-full max-w-md rounded-lg border border-zinc-200 px-3 py-2 text-sm"
        />
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-zinc-600">{labels.noRecords}</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((item) => (
            <ItemCard
              key={String(item.record_key ?? rowTitle(item))}
              title={rowTitle(item)}
              statusLabel={String(item.status_label ?? "")}
              meta={rowMeta(item)}
              summary={String(item.summary ?? "")}
            />
          ))}
        </div>
      )}

      {center.privacy_note ? <p className="text-xs text-zinc-500">{center.privacy_note}</p> : null}
    </div>
  );
}
