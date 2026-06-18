"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";

type DiscoveryRun = {
  id: string;
  run_type: string;
  status: string;
  summary: string | null;
  findings: Record<string, unknown>;
  recommendations: Record<string, unknown>;
  completed_at: string | null;
};

type TenantDiscoveryPanelProps = {
  tenantId: string;
  labels: Record<string, string>;
};

export function TenantDiscoveryPanel({ tenantId, labels }: TenantDiscoveryPanelProps) {
  const [runs, setRuns] = useState<DiscoveryRun[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const reload = useCallback(async () => {
    const res = await fetch(`/api/aipify/tenants/${tenantId}/discovery/runs`);
    const data = await res.json();
    if (res.ok && Array.isArray(data)) setRuns(data as DiscoveryRun[]);
    setLoading(false);
  }, [tenantId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  async function runDiscovery() {
    setRunning(true);
    await fetch(`/api/aipify/tenants/${tenantId}/discovery/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ run_type: "manual_rescan" }),
    });
    await reload();
    setRunning(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <button
          type="button"
          disabled={running}
          onClick={() => void runDiscovery()}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.runDiscovery}
        </button>
      </div>
      <div className="space-y-3">
        {runs.map((run) => (
          <div key={run.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{run.run_type}</span>
              <span className="text-gray-500">{run.status}</span>
            </div>
            {run.summary ? <p className="mt-2 text-sm text-gray-600">{run.summary}</p> : null}
          </div>
        ))}
        {runs.length === 0 ? <p className="text-sm text-gray-600">{labels.empty}</p> : null}
      </div>
    </div>
  );
}
