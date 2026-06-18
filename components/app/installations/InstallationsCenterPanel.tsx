"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type InstallRow = {
  id: string;
  platform_type?: string;
  domain?: string;
  health_score?: number;
  status?: string;
  last_heartbeat_at?: string;
  version?: string;
};

type InstallationsCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    addInstall: string;
    viewDetails: string;
    healthCheck: string;
    columns: {
      platform: string;
      health: string;
      heartbeat: string;
      version: string;
    };
  };
};

export function InstallationsCenterPanel({ locale, labels }: InstallationsCenterPanelProps) {
  const [installations, setInstallations] = useState<InstallRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_modern_install_state");
    if (!error && data) {
      setInstallations((data.installations as InstallRow[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
          <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        </div>
        <Link
          href="/app/install"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.addInstall}
        </Link>
      </div>

      {installations.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-gray-600">
              <tr>
                <th className="px-4 py-3">{labels.columns.platform}</th>
                <th className="px-4 py-3">{labels.columns.health}</th>
                <th className="px-4 py-3">{labels.columns.heartbeat}</th>
                <th className="px-4 py-3">{labels.columns.version}</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {installations.map((row) => (
                <tr key={row.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {row.platform_type ?? row.domain ?? row.id}
                  </td>
                  <td className="px-4 py-3">{row.health_score ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {row.last_heartbeat_at
                      ? formatDate(row.last_heartbeat_at, locale)
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{row.version ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Link href="/app/install" className="text-indigo-600 hover:underline">
                      {labels.viewDetails}
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
