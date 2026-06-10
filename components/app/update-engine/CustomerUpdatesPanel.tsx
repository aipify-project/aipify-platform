"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type CustomerUpdatesPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    currentVersion: string;
    nextUpdate: string;
    noNextUpdate: string;
    maintenanceWindow: string;
    history: string;
    noHistory: string;
    status: string;
    reassurance: string;
    readOnly: string;
    pulseLabel: string;
  };
};

export default function CustomerUpdatesPanel({
  locale,
  labels,
}: CustomerUpdatesPanelProps) {
  const [overview, setOverview] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("get_customer_update_overview");
      if (!error && data) {
        setOverview(data as Record<string, unknown>);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const installations =
    (overview?.installations as Record<string, unknown>[]) ?? [];
  const nextUpdate = overview?.next_scheduled_update as
    | Record<string, unknown>
    | null
    | undefined;
  const history = (overview?.update_history as Record<string, unknown>[]) ?? [];
  const reassurance =
    (overview?.customer_reassurance as string) ?? labels.reassurance;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{labels.title}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-gray-500">{labels.readOnly}</p>
      </div>

      <p className="rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2 text-sm text-emerald-900">
        {reassurance}
      </p>

      {installations.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <ul className="space-y-3">
          {installations.map((inst) => (
            <li
              key={String(inst.installation_id)}
              className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm"
            >
              <div className="font-medium text-gray-900">
                {labels.currentVersion}: {String(inst.current_version ?? "1.0.0")}
              </div>
              <div className="mt-1 text-gray-500">
                {labels.status}: {String(inst.update_status ?? "idle")}
              </div>
            </li>
          ))}
        </ul>
      )}

      <section>
        <h3 className="text-sm font-semibold text-gray-900">{labels.nextUpdate}</h3>
        {nextUpdate ? (
          <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-sm text-amber-900">
            <div className="font-medium">{String(nextUpdate.title)}</div>
            <div>
              {labels.maintenanceWindow}:{" "}
              {nextUpdate.scheduled_at
                ? formatDate(String(nextUpdate.scheduled_at), locale)
                : "—"}
            </div>
          </div>
        ) : (
          <p className="mt-2 text-sm text-gray-500">{labels.noNextUpdate}</p>
        )}
      </section>

      <section>
        <h3 className="text-sm font-semibold text-gray-900">{labels.history}</h3>
        {history.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noHistory}</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {history.map((item) => (
              <li key={String(item.id)}>
                {String(item.version)} — {String(item.title)} (
                {String(item.status)})
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
