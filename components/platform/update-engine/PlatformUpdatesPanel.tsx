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
  };
};

export default function PlatformUpdatesPanel({
  locale,
  labels,
}: PlatformUpdatesPanelProps) {
  const [rows, setRows] = useState<UpdateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_updates");
      if (!error && Array.isArray(data)) {
        setRows(data as UpdateRow[]);
      }
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

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

      {rows.length === 0 ? (
        <AipifyEmptyState
          message={labels.empty}
          pulseLabel={labels.pulseLabel}
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
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
                    {row.scheduled_at
                      ? formatDate(row.scheduled_at, locale)
                      : "—"}
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
