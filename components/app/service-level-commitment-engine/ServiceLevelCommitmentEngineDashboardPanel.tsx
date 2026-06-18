"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseServiceLevelCommitmentEngineDashboard,
  type ServiceCommitmentAlertRecord,
  type ServiceCommitmentRecord,
  type ServiceLevelCommitmentEngineDashboard,
} from "@/lib/aipify/service-level-commitment-engine";

type Props = { labels: Record<string, string> };

export function ServiceLevelCommitmentEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ServiceLevelCommitmentEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [acknowledging, setAcknowledging] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/service-level-commitment-engine/dashboard");
    if (res.ok) setDashboard(parseServiceLevelCommitmentEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const pauseCommitment = async (commitment: ServiceCommitmentRecord) => {
    if (!commitment.id) return;
    setPausing(commitment.id);
    setActionError(null);
    const res = await fetch("/api/aipify/service-level-commitment-engine/commitments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "pause", commitment_id: commitment.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.pauseFailed);
    } else {
      await load();
    }
    setPausing(null);
  };

  const acknowledgeAlert = async (alert: ServiceCommitmentAlertRecord) => {
    if (!alert.id) return;
    setAcknowledging(alert.id);
    setActionError(null);
    const res = await fetch("/api/aipify/service-level-commitment-engine/alerts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "acknowledge", alert_id: alert.id }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.acknowledgeFailed);
    } else {
      await load();
    }
    setAcknowledging(null);
  };

  const exportReport = async () => {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/service-level-commitment-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ report_type: "commitment_compliance" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    } else {
      await load();
    }
    setExporting(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="rounded border border-indigo-300 px-3 py-1.5 text-sm text-indigo-700 disabled:opacity-50"
          disabled={exporting}
          onClick={() => void exportReport()}
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <p className="text-xs text-gray-500">{labels.summary}</p>
        <pre className="mt-2 overflow-auto text-xs text-gray-700">{JSON.stringify(summary, null, 2)}</pre>
      </div>

      {dashboard.executive_summary && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.executiveSummary}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.executive_summary, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.principles && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
            {dashboard.principles.map((pr) => <li key={pr}>{pr}</li>)}
          </ul>
        </section>
      )}

      {dashboard.commitments && dashboard.commitments.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.commitments}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.commitments.map((commitment) => (
              <div key={commitment.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{commitment.commitment_name}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{commitment.commitment_type}</span>
                    <p className="mt-1 text-xs text-gray-600">
                      {labels.target}: {commitment.target_value} {commitment.measurement_unit}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{commitment.status}</span>
                    {commitment.status === "active" && (
                      <button
                        type="button"
                        className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                        disabled={pausing === commitment.id}
                        onClick={() => void pauseCommitment(commitment)}
                      >
                        {pausing === commitment.id ? labels.pausing : labels.pause}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.alerts && dashboard.alerts.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.alerts}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.alerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{alert.alert_type}</span>
                    <span className="ml-2 text-xs text-gray-500">{alert.status}</span>
                  </div>
                  {alert.status === "open" && (
                    <button
                      type="button"
                      className="rounded border border-indigo-300 px-2 py-0.5 text-xs text-indigo-700 disabled:opacity-50"
                      disabled={acknowledging === alert.id}
                      onClick={() => void acknowledgeAlert(alert)}
                    >
                      {acknowledging === alert.id ? labels.acknowledging : labels.acknowledge}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.performance && dashboard.performance.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.performance}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.performance, null, 2)}
          </pre>
        </section>
      )}

      {dashboard.integration_summaries && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationSummaries}</h3>
          <pre className="mt-2 overflow-auto text-xs text-gray-700">
            {JSON.stringify(dashboard.integration_summaries, null, 2)}
          </pre>
        </section>
      )}
    </div>
  );
}
