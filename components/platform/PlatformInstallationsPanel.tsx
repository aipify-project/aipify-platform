"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { PlatformInstallationRow } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

type PlatformInstallationsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    customer: string;
    domain: string;
    status: string;
    modules: string;
    lastSynced: string;
    actions: string;
    viewCustomer: string;
    detailTitle: string;
    integrations: string;
    webhooks: string;
    errorLogs: string;
    syncHistory: string;
    noModules: string;
    noIntegrations: string;
    webhookOperational: string;
    noErrors: string;
    lastSyncEntry: string;
    never: string;
    pulseLabel: string;
    statusLabels: Record<string, string>;
    integrationStatusLabels: Record<string, string>;
  };
};

export default function PlatformInstallationsPanel({
  locale,
  labels,
}: PlatformInstallationsPanelProps) {
  const [installations, setInstallations] = useState<PlatformInstallationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_installations");

      if (!cancelled) {
        setInstallations(error || !data ? [] : (data as PlatformInstallationRow[]));
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  const selected = useMemo(
    () => installations.find((row) => row.id === selectedId) ?? null,
    [installations, selectedId]
  );

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {labels.title}
        </h1>
        <p className="mt-2 text-base text-gray-500">{labels.subtitle}</p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">{labels.loading}</p>
      ) : installations.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    {[labels.customer, labels.domain, labels.status, labels.modules, labels.lastSynced, labels.actions].map(
                      (heading) => (
                        <th
                          key={heading}
                          className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          {heading}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {installations.map((row) => (
                    <tr
                      key={row.id}
                      className={`cursor-pointer hover:bg-gray-50/60 ${selectedId === row.id ? "bg-violet-50/50" : ""}`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">{row.customer_name}</p>
                        <p className="font-mono text-xs text-gray-500">{row.customer_number}</p>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {row.site_url ?? "—"}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          status={row.status}
                          label={labels.statusLabels[row.status] ?? row.status}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {row.modules.length > 0 ? row.modules.join(", ") : labels.noModules}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {row.last_synced_at
                          ? formatDate(row.last_synced_at, locale)
                          : labels.never}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/platform/customers/${row.customer_id}`}
                          onClick={(event) => event.stopPropagation()}
                          className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                        >
                          {labels.viewCustomer}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {selected && (
            <article className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">{labels.detailTitle}</h2>
              <p className="mt-1 text-sm text-gray-500">
                {selected.customer_name} · {selected.site_url ?? "—"}
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <section className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{labels.modules}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {selected.modules.length > 0
                      ? selected.modules.join(", ")
                      : labels.noModules}
                  </p>
                </section>

                <section className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{labels.integrations}</h3>
                  {selected.integrations.length === 0 ? (
                    <p className="mt-2 text-sm text-gray-600">{labels.noIntegrations}</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {selected.integrations.map((integration) => (
                        <li
                          key={integration.integration_key}
                          className="flex items-center justify-between gap-3 text-sm"
                        >
                          <span className="font-medium text-gray-700">
                            {integration.integration_key}
                          </span>
                          <StatusBadge
                            status={integration.status}
                            label={
                              labels.integrationStatusLabels[integration.status] ??
                              integration.status
                            }
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{labels.webhooks}</h3>
                  <p className="mt-2 text-sm text-gray-600">{labels.webhookOperational}</p>
                </section>

                <section className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
                  <h3 className="text-sm font-semibold text-gray-900">{labels.errorLogs}</h3>
                  <p className="mt-2 text-sm text-gray-600">{labels.noErrors}</p>
                </section>

                <section className="rounded-xl border border-gray-100 bg-gray-50/60 p-4 md:col-span-2">
                  <h3 className="text-sm font-semibold text-gray-900">{labels.syncHistory}</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {selected.last_synced_at
                      ? labels.lastSyncEntry.replace(
                          "{date}",
                          formatDate(selected.last_synced_at, locale)
                        )
                      : labels.never}
                  </p>
                </section>
              </div>
            </article>
          )}
        </div>
      )}
    </div>
  );
}
