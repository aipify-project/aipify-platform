"use client";

import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDateTime } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { PlatformAutomation, WeeklyExecutiveDigest } from "@/lib/platform/types";
import WeeklyExecutiveDigestCard from "./WeeklyExecutiveDigestCard";

type PlatformAutomationsPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    name: string;
    status: string;
    trigger: string;
    lastRun: string;
    nextRun: string;
    actions: string;
    healthTitle: string;
    lastSuccess: string;
    totalExecutions: string;
    failureCount: string;
    avgExecution: string;
    view: string;
    pulseLabel: string;
    statusLabels: Record<string, string>;
    digest: {
      title: string;
      newCustomers: string;
      supportRequests: string;
      aiResolved: string;
      revenueGrowth: string;
      trialsExpiring: string;
      recommendations: string;
    };
  };
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-50 text-emerald-700",
  paused: "bg-gray-50 text-gray-600",
  warning: "bg-amber-50 text-amber-700",
  failed: "bg-rose-50 text-rose-700",
};

export default function PlatformAutomationsPanel({
  locale,
  labels,
}: PlatformAutomationsPanelProps) {
  const [automations, setAutomations] = useState<PlatformAutomation[]>([]);
  const [digest, setDigest] = useState<WeeklyExecutiveDigest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [autoResult, digestResult] = await Promise.all([
        supabase.rpc("list_platform_automations"),
        supabase.rpc("get_weekly_executive_digest"),
      ]);

      if (!cancelled) {
        setAutomations(
          autoResult.error || !autoResult.data
            ? []
            : (autoResult.data as PlatformAutomation[])
        );
        setDigest(
          digestResult.error || !digestResult.data
            ? null
            : (digestResult.data as WeeklyExecutiveDigest)
        );
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <p className="text-sm text-gray-500">{labels.loading}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {digest && <WeeklyExecutiveDigestCard digest={digest} labels={labels.digest} />}

      {automations.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  {[labels.name, labels.status, labels.trigger, labels.lastRun, labels.nextRun, labels.healthTitle].map(
                    (header) => (
                      <th
                        key={header}
                        className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {automations.map((automation) => (
                  <tr key={automation.id}>
                    <td className="px-4 py-4">
                      <p className="font-semibold text-gray-900">{automation.name}</p>
                      {automation.description && (
                        <p className="mt-1 text-xs text-gray-500">{automation.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[automation.status] ?? STATUS_STYLES.paused}`}
                      >
                        {labels.statusLabels[automation.status] ?? automation.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {automation.trigger_type}
                      {automation.schedule_cron && (
                        <span className="mt-1 block font-mono text-xs text-gray-400">
                          {automation.schedule_cron}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDateTime(automation.last_run_at, locale)}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      {formatDateTime(automation.next_run_at, locale)}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-600">
                      <p>{labels.lastSuccess}: {formatDateTime(automation.last_success_at, locale)}</p>
                      <p className="mt-1">
                        {labels.totalExecutions}: {automation.total_executions}
                      </p>
                      <p>
                        {labels.failureCount}: {automation.failure_count}
                      </p>
                      <p>
                        {labels.avgExecution}: {automation.avg_execution_ms} ms
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
