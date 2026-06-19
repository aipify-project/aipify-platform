"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseServiceNetworkDetail,
  type ServiceNetworkDetail,
  type ServiceNetworkEntityType,
} from "@/lib/service-network-engine";
import type { ServiceNetworkLabels } from "@/lib/service-network-engine/labels";
import { SERVICE_NETWORK_DETAIL_ROUTES } from "@/lib/service-network-engine/config";

function statusIconChar(icon?: string) {
  switch (icon) {
    case "check-circle":
      return "✓";
    case "alert-triangle":
      return "!";
    case "clock":
      return "⏳";
    case "lock":
      return "🔒";
    default:
      return "●";
  }
}

export function ServiceNetworkDetailPanel({
  labels,
  entityType,
  recordId,
}: {
  labels: ServiceNetworkLabels;
  entityType: ServiceNetworkEntityType;
  recordId: string;
}) {
  const [detail, setDetail] = useState<ServiceNetworkDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const apiPath = {
    location: "locations",
    resource: "resources",
    provider: "providers",
    rental: "rentals",
  }[entityType];

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/services/${apiPath}/${encodeURIComponent(recordId)}`);
    if (res.ok) setDetail(parseServiceNetworkDetail(await res.json()));
    else setDetail(null);
    setLoading(false);
  }, [apiPath, recordId]);

  useEffect(() => {
    void load();
  }, [load]);

  const backHref = SERVICE_NETWORK_DETAIL_ROUTES[entityType];

  if (loading && !detail) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!detail?.found || !detail.record) {
    return (
      <div className="space-y-4">
        <Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">
          ← {labels.detail.back}
        </Link>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <p className="font-medium">{labels.detail.notFound}</p>
          {detail?.error ? <p className="mt-2 text-sm">{detail.error}</p> : null}
        </div>
      </div>
    );
  }

  const record = detail.record;
  const title = String(record.record_title ?? recordId);
  const statusLabel = String(record.status_label ?? record.record_status ?? "");
  const statusIcon = record.status_icon ? String(record.status_icon) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={backHref} className="text-sm font-medium text-violet-700 hover:underline">
            ← {labels.detail.back}
          </Link>
          <h2 className="mt-2 text-lg font-semibold text-zinc-900">{title}</h2>
          <p className="mt-1 text-sm text-zinc-500">{labels.entityTypes[entityType]}</p>
        </div>
        {statusLabel ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700">
            <span aria-hidden="true">{statusIconChar(statusIcon)}</span>
            {statusLabel}
          </span>
        ) : null}
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
          {labels.detail.overview}
        </h3>
        {typeof record.summary === "string" && record.summary ? (
          <p className="mt-3 text-sm text-zinc-700">{record.summary}</p>
        ) : null}
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {record.location_label ? (
            <>
              <dt className="text-xs font-medium uppercase text-zinc-500">{labels.filters.location}</dt>
              <dd className="text-sm text-zinc-900">{String(record.location_label)}</dd>
            </>
          ) : null}
          {record.city ? (
            <>
              <dt className="text-xs font-medium uppercase text-zinc-500">City</dt>
              <dd className="text-sm text-zinc-900">{String(record.city)}</dd>
            </>
          ) : null}
          {record.resource_type ? (
            <>
              <dt className="text-xs font-medium uppercase text-zinc-500">{labels.filters.type}</dt>
              <dd className="text-sm text-zinc-900">{String(record.resource_type).replace(/_/g, " ")}</dd>
            </>
          ) : null}
          {record.provider_type ? (
            <>
              <dt className="text-xs font-medium uppercase text-zinc-500">{labels.filters.type}</dt>
              <dd className="text-sm text-zinc-900">{String(record.provider_type).replace(/_/g, " ")}</dd>
            </>
          ) : null}
          {record.rental_model ? (
            <>
              <dt className="text-xs font-medium uppercase text-zinc-500">Rental model</dt>
              <dd className="text-sm text-zinc-900">{String(record.rental_model).replace(/_/g, " ")}</dd>
            </>
          ) : null}
        </dl>
      </section>

      {(detail.related_assignments?.length ?? 0) > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            {labels.detail.assignments}
          </h3>
          <div className="grid gap-3">
            {detail.related_assignments?.map((item) => (
              <div
                key={String(item.record_key)}
                className="rounded-xl border border-zinc-200 bg-white p-4 text-sm text-zinc-700"
              >
                {String(item.record_title ?? item.record_key)}
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
