"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type UpdateRow = {
  id: string;
  version: string;
  title: string;
  status: string;
  update_type: string;
  update_channel: string;
  scheduled_at: string | null;
  expected_duration_minutes: number;
  affected_installations: number;
  rollback_available: boolean;
  created_at: string;
};

type PlatformUpdatesPanelProps = {
  locale: string;
  /** When true, omit outer title/max-width (parent page owns chrome). */
  embedded?: boolean;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    version: string;
    status: string;
    type: string;
    channel: string;
    scheduled: string;
    affected: string;
    view: string;
    areas: {
      scheduled: string;
      history: string;
      rollout: string;
      failed: string;
      rollback: string;
    };
    pulseLabel: string;
    sourceUnavailableTitle?: string;
    sourceUnavailableBody?: string;
    loadError?: string;
  };
};

type LoadState = "loading" | "ready" | "empty" | "rpc_missing" | "error";

function isMissingRpcError(message: string | undefined): boolean {
  if (!message) return false;
  const m = message.toLowerCase();
  return (
    m.includes("could not find the function") ||
    m.includes("does not exist") ||
    m.includes("list_platform_updates") ||
    m.includes("42883") ||
    m.includes("pgrst202")
  );
}

export default function PlatformUpdatesPanel({
  locale,
  embedded = false,
  labels,
}: PlatformUpdatesPanelProps) {
  const [rows, setRows] = useState<UpdateRow[]>([]);
  const [state, setState] = useState<LoadState>("loading");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_updates");
      if (cancelled) return;

      if (error) {
        setRows([]);
        setState(isMissingRpcError(error.message) ? "rpc_missing" : "error");
        return;
      }

      const next = Array.isArray(data) ? (data as UpdateRow[]) : [];
      setRows(next);
      setState(next.length === 0 ? "empty" : "ready");
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "loading") {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  const shellClass = embedded ? "space-y-6" : "mx-auto max-w-5xl space-y-6 p-6";

  if (state === "rpc_missing") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-5 dark:border-amber-800 dark:bg-amber-950/30"
      >
        <h2 className="text-base font-semibold text-amber-950 dark:text-amber-50">
          {labels.sourceUnavailableTitle ?? labels.empty}
        </h2>
        <p className="mt-2 text-sm text-amber-900/90 dark:text-amber-100/90">
          {labels.sourceUnavailableBody ?? labels.loadError ?? labels.empty}
        </p>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div
        role="alert"
        className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:border-rose-800 dark:bg-rose-950/40"
      >
        <p className="text-sm font-medium text-rose-950 dark:text-rose-50">
          {labels.loadError ?? labels.empty}
        </p>
      </div>
    );
  }

  return (
    <div className={shellClass}>
      {!embedded ? (
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
      ) : null}

      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Object.values(labels.areas).map((area) => (
          <li
            key={area}
            className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
          >
            {area}
          </li>
        ))}
      </ul>

      {state === "empty" ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-x-auto overflow-hidden rounded-xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">{labels.version}</th>
                <th className="px-4 py-3">{labels.status}</th>
                <th className="px-4 py-3">{labels.type}</th>
                <th className="px-4 py-3">{labels.channel}</th>
                <th className="px-4 py-3">{labels.scheduled}</th>
                <th className="px-4 py-3">{labels.affected}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.version}
                    <div className="text-xs font-normal text-gray-500">{row.title}</div>
                  </td>
                  <td className="px-4 py-3 capitalize">{row.status.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3">{row.update_type}</td>
                  <td className="px-4 py-3">{row.update_channel}</td>
                  <td className="px-4 py-3">
                    {row.scheduled_at ? formatDate(row.scheduled_at, locale) : "—"}
                  </td>
                  <td className="px-4 py-3">{row.affected_installations}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/platform/updates/${row.id}`}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {labels.view}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
