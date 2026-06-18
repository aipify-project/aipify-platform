"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseExecutions, type AutomationExecution } from "@/lib/aipify/adaptive-automation";

type AutomationExecutionsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    empty: string;
    statuses: Record<string, string>;
  };
};

export function AutomationExecutionsPanel({ labels }: AutomationExecutionsPanelProps) {
  const [executions, setExecutions] = useState<AutomationExecution[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/aipify/automation/executions");
    if (res.ok) setExecutions(parseExecutions(await res.json()) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/automations" className="text-sm text-indigo-600 hover:underline">{labels.back}</Link>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      </div>
      {executions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">{labels.empty}</p>
      ) : (
        <div className="space-y-3">
          {executions.map((e) => (
            <article key={e.id} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-900">{e.automation_name ?? e.automation_id}</span>
                <span className="text-xs text-gray-500">{labels.statuses[e.status] ?? e.status}</span>
              </div>
              {e.result_summary ? <p className="mt-2 text-sm text-gray-600">{e.result_summary}</p> : null}
              {e.error_message ? <p className="mt-1 text-sm text-rose-600">{e.error_message}</p> : null}
              <p className="mt-2 text-xs text-gray-400">{e.created_at}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
