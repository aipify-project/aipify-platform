"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";
import type { PlatformSupportQueueRow } from "@/lib/platform/types";
import StatusBadge from "./StatusBadge";

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
  };
};

export default function PlatformSupportPanel({
  locale,
  labels,
}: PlatformSupportPanelProps) {
  const [cases, setCases] = useState<PlatformSupportQueueRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("list_platform_support_queue");

      if (!cancelled) {
        setCases(error || !data ? [] : (data as PlatformSupportQueueRow[]));
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
      ) : cases.length === 0 ? (
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      ) : (
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
      )}
    </div>
  );
}
