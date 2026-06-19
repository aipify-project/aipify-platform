"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseServiceNetworkCenter,
  serviceNetworkSectionToRpc,
  type ServiceNetworkCenter,
  type ServiceNetworkSection,
} from "@/lib/service-network-engine";
import type { ServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { SERVICE_NETWORK_DETAIL_ROUTES } from "@/lib/service-network-engine/config";

function statusIconChar(icon?: string) {
  switch (icon) {
    case "check-circle":
      return "✓";
    case "alert-triangle":
    case "alert-circle":
      return "!";
    case "clock":
      return "⏳";
    case "lock":
    case "ban":
      return "🔒";
    case "archive":
      return "ℹ";
    case "user-check":
      return "✓";
    case "wrench":
      return "⚙";
    case "pause-circle":
      return "⏸";
    default:
      return "●";
  }
}

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
  statusIcon,
  meta,
  href,
}: {
  title: string;
  summary?: string;
  statusLabel?: string;
  statusIcon?: string;
  meta?: string;
  href?: string;
}) {
  const content = (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-violet-200 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="font-semibold text-zinc-900">{title}</p>
        {statusLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-700">
            <span aria-hidden="true">{statusIconChar(statusIcon)}</span>
            {statusLabel}
          </span>
        ) : null}
      </div>
      {meta ? <p className="mt-2 text-xs text-zinc-500">{meta}</p> : null}
      {summary ? <p className="mt-2 text-sm text-zinc-600">{summary}</p> : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500">
        {content}
      </Link>
    );
  }
  return content;
}

function pickRows(center: ServiceNetworkCenter, section: ServiceNetworkSection) {
  switch (section) {
    case "locations":
      return center.records?.length ? center.records : (center.locations ?? []);
    case "resources":
      return center.records?.length ? center.records : (center.resources ?? []);
    case "providers":
      return center.records?.length ? center.records : (center.providers ?? []);
    case "rentals":
      return center.records?.length ? center.records : (center.rentals ?? []);
    default:
      return [
        ...(center.locations ?? []),
        ...(center.resources ?? []),
        ...(center.providers ?? []),
        ...(center.rentals ?? []),
      ];
  }
}

function detailHref(section: ServiceNetworkSection, recordKey: string): string | undefined {
  const baseBySection: Partial<Record<ServiceNetworkSection, string>> = {
    locations: SERVICE_NETWORK_DETAIL_ROUTES.location,
    resources: SERVICE_NETWORK_DETAIL_ROUTES.resource,
    providers: SERVICE_NETWORK_DETAIL_ROUTES.provider,
    rentals: SERVICE_NETWORK_DETAIL_ROUTES.rental,
  };
  const base = baseBySection[section];
  if (!base || !recordKey) return undefined;
  return `${base}/${encodeURIComponent(recordKey)}`;
}

function rowTitle(item: Record<string, unknown>): string {
  return String(
    item.record_title ??
      item.location_label ??
      item.resource_label ??
      item.provider_label ??
      item.service_label ??
      "Item",
  );
}

function rowMeta(item: Record<string, unknown>, section: ServiceNetworkSection): string {
  const parts: string[] = [];
  if (item.city) parts.push(String(item.city));
  if (item.location_label && section !== "locations") parts.push(String(item.location_label));
  if (item.resource_type) parts.push(String(item.resource_type).replace(/_/g, " "));
  if (item.provider_type) parts.push(String(item.provider_type).replace(/_/g, " "));
  if (item.rental_model) parts.push(String(item.rental_model).replace(/_/g, " "));
  return parts.join(" · ");
}

export function ServiceNetworkPanel({
  labels,
  activeSection,
}: {
  labels: ServiceNetworkLabels;
  activeSection: ServiceNetworkSection;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [center, setCenter] = useState<ServiceNetworkCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const locationFilter = searchParams.get("locationId") ?? "";

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = serviceNetworkSectionToRpc(activeSection);
    const params = new URLSearchParams({ section: rpcSection });
    if (locationFilter) params.set("locationId", locationFilter);
    const res = await fetch(`/api/services/network?${params.toString()}`);
    if (res.ok) setCenter(parseServiceNetworkCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, [activeSection, locationFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const locations = useMemo(() => center?.locations ?? [], [center?.locations]);

  const handleLocationChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set("locationId", value);
    else params.delete("locationId");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  };

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

  const emptyMessage = {
    locations: labels.emptyStates.noLocations,
    resources: labels.emptyStates.noResources,
    providers: labels.emptyStates.noProviders,
    rentals: labels.emptyStates.noRentals,
    network: labels.noRecords,
  }[activeSection];

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

      {locations.length > 0 ? (
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="service-network-location" className="text-sm font-medium text-zinc-700">
            {labels.locationSelector}
          </label>
          <select
            id="service-network-location"
            value={locationFilter}
            onChange={(e) => handleLocationChange(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
          >
            <option value="">{labels.allLocations}</option>
            {locations.map((loc) => {
              const key = String(loc.location_key ?? loc.record_key ?? "");
              const title = String(loc.record_title ?? loc.location_label ?? key);
              return (
                <option key={key} value={key}>
                  {title}
                </option>
              );
            })}
          </select>
        </div>
      ) : null}

      {center.principle ? (
        <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-indigo-950">
          {center.principle}
        </p>
      ) : null}

      {activeSection === "network" && (
        <section className="rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/80 to-white p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label={labels.stats.locations} value={stats.locations ?? 0} />
            <StatCard label={labels.stats.resources} value={stats.resources ?? 0} />
            <StatCard label={labels.stats.providers} value={stats.providers ?? 0} />
            <StatCard label={labels.stats.activeRentals} value={stats.active_rentals ?? 0} />
            <StatCard label={labels.stats.pendingRentals} value={stats.pending_rentals ?? 0} />
            <StatCard label={labels.stats.locationGroups} value={stats.location_groups ?? 0} />
          </div>
        </section>
      )}

      {activeSection !== "network" ? (
        <div>
          <label htmlFor="service-network-search" className="sr-only">
            {labels.filters.search}
          </label>
          <input
            id="service-network-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={labels.filters.search}
            className="w-full max-w-md rounded-lg border border-zinc-300 px-3 py-2 text-sm"
          />
        </div>
      ) : null}

      {activeSection === "network" && (center.companion_recommendations?.length ?? 0) > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {labels.companionRecommendations}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {center.companion_recommendations?.map((rec) => (
              <ItemCard
                key={String(rec.key)}
                title={String(rec.observation ?? rec.key)}
                summary={String(rec.recommendation ?? "")}
                href={typeof rec.href === "string" ? rec.href : undefined}
              />
            ))}
          </div>
        </section>
      ) : null}

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 text-center">
          <p className="font-medium text-zinc-800">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {rows.map((item) => {
            const key = String(item.record_key ?? rowTitle(item));
            const filtered =
              locationFilter &&
              item.location_key &&
              String(item.location_key) !== locationFilter;
            if (filtered) return null;
            return (
              <ItemCard
                key={key}
                title={rowTitle(item)}
                summary={typeof item.summary === "string" ? item.summary : undefined}
                statusLabel={
                  typeof item.status_label === "string"
                    ? item.status_label
                    : typeof item.record_status === "string"
                      ? item.record_status
                      : undefined
                }
                statusIcon={
                  typeof item.status_icon === "string" ? item.status_icon : undefined
                }
                meta={rowMeta(item, activeSection)}
                href={
                  activeSection !== "network"
                    ? detailHref(activeSection, key)
                    : undefined
                }
              />
            );
          })}
        </div>
      )}

      {activeSection === "network" && (center.integrations?.length ?? 0) > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {labels.integrations}
          </h3>
          <div className="grid gap-3 md:grid-cols-3">
            {center.integrations?.map((item) => {
              const meta = item.metadata as Record<string, unknown> | undefined;
              const href = meta?.href ? String(meta.href) : undefined;
              return (
                <ItemCard
                  key={String(item.record_key)}
                  title={String(item.record_title ?? item.integration_ref)}
                  summary={typeof item.summary === "string" ? item.summary : undefined}
                  statusLabel={
                    typeof item.status_label === "string" ? item.status_label : undefined
                  }
                  statusIcon={
                    typeof item.status_icon === "string" ? item.status_icon : undefined
                  }
                  href={href}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
