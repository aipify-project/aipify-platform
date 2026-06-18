"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import { parseOrchestrationFlows, type OrchestrationFlow } from "@/lib/aipify/orchestration";

type OrchestrationFlowsPanelProps = {
  labels: Record<string, string>;
};

export function OrchestrationFlowsPanel({ labels }: OrchestrationFlowsPanelProps) {
  const [flows, setFlows] = useState<OrchestrationFlow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    const res = await fetch(`/api/aipify/orchestration/flows?${params}`);
    if (res.ok) {
      const data = await res.json();
      setFlows(parseOrchestrationFlows({ flows: data.flows }));
    }
    setLoading(false);
  }, [statusFilter]);

  const retry = async (id: string) => {
    await fetch(`/api/aipify/orchestration/flows/${id}/retry`, { method: "POST" });
    void load();
  };

  const cancel = async (id: string) => {
    await fetch(`/api/aipify/orchestration/flows/${id}/cancel`, { method: "POST" });
    void load();
  };

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <select
          className="rounded border border-gray-200 px-3 py-1.5 text-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">{labels.allStatuses}</option>
          <option value="running">running</option>
          <option value="waiting_approval">waiting_approval</option>
          <option value="completed">completed</option>
          <option value="blocked">blocked</option>
          <option value="failed">failed</option>
        </select>
        <button type="button" onClick={() => void load()} className="rounded bg-indigo-600 px-3 py-1.5 text-sm text-white">
          {labels.refresh}
        </button>
      </div>

      {flows.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noFlows}</p>
      ) : (
        <ul className="space-y-2">
          {flows.map((f) => (
            <li key={f.id} className="rounded-lg border border-gray-200 bg-white p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium">{f.name}</span>
                <span className="capitalize text-gray-500">{f.status}</span>
              </div>
              {f.current_step ? <p className="mt-1 text-gray-600">{labels.currentStep}: {f.current_step}</p> : null}
              {f.result_summary ? <p className="mt-1 text-xs text-gray-500">{f.result_summary}</p> : null}
              {(f.status === "failed" || f.status === "blocked") && (
                <div className="mt-2 flex gap-2">
                  <button type="button" onClick={() => void retry(f.id)} className="text-xs text-indigo-600 hover:underline">
                    {labels.retry}
                  </button>
                  <button type="button" onClick={() => void cancel(f.id)} className="text-xs text-gray-500 hover:underline">
                    {labels.cancel}
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
