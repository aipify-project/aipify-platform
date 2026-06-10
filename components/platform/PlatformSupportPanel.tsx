"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import { parseSupportAiPerformance } from "@/lib/platform/executive-intelligence";
import type { SupportAiPerformance } from "@/lib/platform/executive-intelligence";
import type { PlatformSupportQueueRow } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";
import SupportAiPerformancePanel from "./SupportAiPerformancePanel";

type PlatformSupportPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    customer: string;
    category: string;
    priority: string;
    assignee: string;
    lastUpdated: string;
    subject: string;
    aiEscalation: string;
    aiCouldNotResolve: string;
    requiresHumanReview: string;
    unassigned: string;
    viewCustomer: string;
    pulseLabel: string;
    statusLabels: Record<string, string>;
    categoryLabels: Record<string, string>;
    priorityLabels: Record<string, string>;
    counters: {
      resolvedByAi: string;
      escalatedByAi: string;
      waitingHuman: string;
      openCases: string;
    };
    performance: {
      title: string;
      subtitle: string;
      requestsToday: string;
      resolvedByAi: string;
      escalatedCases: string;
      avgResponseTime: string;
      satisfactionScore: string;
      escalationReasons: string;
      seconds: string;
      percent: string;
      noReasons: string;
    };
  };
};

export default function PlatformSupportPanel({
  locale,
  labels,
}: PlatformSupportPanelProps) {
  const [cases, setCases] = useState<PlatformSupportQueueRow[]>([]);
  const [counters, setCounters] = useState({
    resolvedByAi: 0,
    escalatedByAi: 0,
    waitingHuman: 0,
    openCases: 0,
  });
  const [performance, setPerformance] = useState<SupportAiPerformance | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const [queueResult, snapshotResult, performanceResult] = await Promise.all([
        supabase.rpc("list_platform_support_queue"),
        supabase.rpc("get_platform_dashboard_snapshot"),
        supabase.rpc("get_support_ai_performance"),
      ]);

      if (!cancelled) {
        setCases(
          queueResult.error || !queueResult.data
            ? []
            : (queueResult.data as PlatformSupportQueueRow[])
        );
        if (snapshotResult.data && typeof snapshotResult.data === "object") {
          const snapshot = snapshotResult.data as {
            support_resolved: number;
            escalated_cases: number;
            waiting_human: number;
            open_cases: number;
          };
          setCounters({
            resolvedByAi: snapshot.support_resolved,
            escalatedByAi: snapshot.escalated_cases,
            waitingHuman: snapshot.waiting_human,
            openCases: snapshot.open_cases,
          });
        }
        if (performanceResult.data && typeof performanceResult.data === "object") {
          setPerformance(
            parseSupportAiPerformance(performanceResult.data as Record<string, unknown>)
          );
        }
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  function escalationLabel(reason: string | null) {
    if (!reason) return null;
    if (reason.toLowerCase().includes("could not resolve")) {
      return labels.aiCouldNotResolve;
    }
    if (reason.toLowerCase().includes("human review")) {
      return labels.requiresHumanReview;
    }
    return reason;
  }

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
      ) : (
        <div className="space-y-6">
          {performance && (
            <SupportAiPerformancePanel performance={performance} labels={labels.performance} />
          )}
          {cases.length === 0 ? (
            <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
          ) : (
            <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: labels.counters.resolvedByAi, value: counters.resolvedByAi },
              { label: labels.counters.escalatedByAi, value: counters.escalatedByAi },
              { label: labels.counters.waitingHuman, value: counters.waitingHuman },
              { label: labels.counters.openCases, value: counters.openCases },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  {item.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{item.value}</p>
              </article>
            ))}
          </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50/80">
                <tr>
                  {[labels.customer, labels.subject, labels.category, labels.priority, labels.assignee, labels.lastUpdated, ""].map(
                    (heading, index) => (
                      <th
                        key={`${heading}-${index}`}
                        className={`px-4 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500 ${index === 6 ? "text-right" : "text-left"}`}
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {cases.map((row) => {
                  const escalation = escalationLabel(row.ai_escalation_reason);
                  return (
                    <tr key={row.id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-4">
                        <p className="text-sm font-semibold text-gray-900">{row.customer_name}</p>
                        <p className="font-mono text-xs text-gray-500">{row.customer_number}</p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-gray-900">{row.subject}</p>
                        {escalation && (
                          <p className="mt-1 text-xs font-medium text-amber-700">
                            {labels.aiEscalation}: {escalation}
                          </p>
                        )}
                        <StatusBadge
                          status={row.status}
                          label={labels.statusLabels[row.status] ?? row.status}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {labels.categoryLabels[row.category] ?? row.category}
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge
                          status={row.priority}
                          label={labels.priorityLabels[row.priority] ?? row.priority}
                        />
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {row.assigned_agent ?? labels.unassigned}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-600">
                        {formatDate(row.updated_at, locale)}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Link
                          href={`/platform/customers/${row.customer_id}`}
                          className="text-sm font-semibold text-violet-600 hover:text-violet-700"
                        >
                          {labels.viewCustomer}
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
