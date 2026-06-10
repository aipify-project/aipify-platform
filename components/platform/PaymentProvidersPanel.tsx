"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { createClient } from "@/lib/supabase/client";
import type { PaymentEventRow, PaymentProviderSummary } from "@/lib/platform/types";

type PaymentProvidersPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    provider: string;
    customers: string;
    active: string;
    trialing: string;
    failed: string;
    recentEvents: string;
    noEvents: string;
    eventType: string;
    customer: string;
    providerLabels: Record<string, string>;
    pulseLabel: string;
  };
};

export default function PaymentProvidersPanel({
  labels,
}: PaymentProvidersPanelProps) {
  const [providers, setProviders] = useState<PaymentProviderSummary[]>([]);
  const [events, setEvents] = useState<PaymentEventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [providerRes, eventRes] = await Promise.all([
        supabase.rpc("list_platform_payment_providers"),
        supabase.rpc("list_platform_payment_events"),
      ]);

      if (!cancelled) {
        setProviders(
          providerRes.data ? (providerRes.data as PaymentProviderSummary[]) : []
        );
        setEvents(eventRes.data ? (eventRes.data as PaymentEventRow[]) : []);
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

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
      ) : providers.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {providers.map((row) => (
            <article
              key={row.provider}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-gray-900">
                {labels.providerLabels[row.provider] ?? row.provider}
              </h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.customers}</dt>
                  <dd className="font-medium text-gray-900">{row.customer_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.active}</dt>
                  <dd className="font-medium text-gray-900">{row.active_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.trialing}</dt>
                  <dd className="font-medium text-gray-900">{row.trialing_count}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-500">{labels.failed}</dt>
                  <dd className="font-medium text-gray-900">{row.failed_count}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-gray-900">{labels.recentEvents}</h2>
        {events.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">{labels.noEvents}</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {labels.provider}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {labels.eventType}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {labels.customer}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {events.slice(0, 10).map((event) => (
                    <tr key={event.id}>
                      <td className="px-6 py-4 text-sm">
                        {labels.providerLabels[event.provider] ?? event.provider}
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-gray-700">
                        {event.event_type}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {event.display_name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
