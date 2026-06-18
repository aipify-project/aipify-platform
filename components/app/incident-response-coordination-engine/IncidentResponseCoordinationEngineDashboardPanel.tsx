"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseIncidentResponseCoordinationEngineDashboard,
  type IncidentRecord,
  type IncidentResponseCoordinationEngineDashboard,
} from "@/lib/aipify/incident-response-coordination-engine";

type Props = { labels: Record<string, string> };

export function IncidentResponseCoordinationEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<IncidentResponseCoordinationEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [escalating, setEscalating] = useState<string | null>(null);
  const [resolving, setResolving] = useState<string | null>(null);
  const [investigating, setInvestigating] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/incident-response-coordination-engine/dashboard");
    if (res.ok) setDashboard(parseIncidentResponseCoordinationEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const escalateIncident = async (incident: IncidentRecord) => {
    if (!incident.id) return;
    setEscalating(incident.id);
    setActionError(null);
    const res = await fetch("/api/aipify/incident-response-coordination-engine/escalate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_id: incident.id,
        escalation_metadata: { reason: "Escalated from dashboard for coordinated response" },
        communication_content: { summary: "Incident escalated for leadership awareness" },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.escalateFailed);
    } else {
      await load();
    }
    setEscalating(null);
  };

  const startInvestigation = async (incident: IncidentRecord) => {
    if (!incident.id) return;
    setInvestigating(incident.id);
    setActionError(null);
    const res = await fetch("/api/aipify/incident-response-coordination-engine/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_status", incident_id: incident.id, status: "investigating" }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.updateFailed);
    } else {
      await load();
    }
    setInvestigating(null);
  };

  const resolveIncident = async (incident: IncidentRecord) => {
    if (!incident.id) return;
    setResolving(incident.id);
    setActionError(null);
    const res = await fetch("/api/aipify/incident-response-coordination-engine/resolve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_id: incident.id,
        root_cause_metadata: { summary: "Resolved from dashboard review" },
        communication_content: { summary: "Incident resolved — stakeholders notified" },
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.resolveFailed);
    } else {
      await load();
    }
    setResolving(null);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-amber-200 bg-amber-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

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

      {dashboard.incidents && dashboard.incidents.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.incidents}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.incidents.map((incident) => (
              <div key={incident.id} className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <span className="font-medium text-gray-900">{incident.incident_title}</span>
                    <span className="ml-2 text-xs uppercase text-gray-500">{incident.incident_type}</span>
                    <p className="mt-1 text-xs text-gray-600">
                      {labels.severity}: {incident.severity}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{incident.status}</span>
                    {incident.status === "identified" && (
                      <button
                        type="button"
                        className="rounded border border-amber-300 px-2 py-0.5 text-xs text-amber-700 disabled:opacity-50"
                        disabled={investigating === incident.id}
                        onClick={() => void startInvestigation(incident)}
                      >
                        {investigating === incident.id ? labels.investigating : labels.startInvestigation}
                      </button>
                    )}
                    {["identified", "investigating", "mitigated"].includes(incident.status ?? "") && (
                      <>
                        <button
                          type="button"
                          className="rounded border border-amber-300 px-2 py-0.5 text-xs text-amber-700 disabled:opacity-50"
                          disabled={escalating === incident.id}
                          onClick={() => void escalateIncident(incident)}
                        >
                          {escalating === incident.id ? labels.escalating : labels.escalate}
                        </button>
                        <button
                          type="button"
                          className="rounded border border-amber-300 px-2 py-0.5 text-xs text-amber-700 disabled:opacity-50"
                          disabled={resolving === incident.id}
                          onClick={() => void resolveIncident(incident)}
                        >
                          {resolving === incident.id ? labels.resolving : labels.resolve}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.timeline_events && dashboard.timeline_events.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.timeline}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.timeline_events.map((event) => (
              <div key={event.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{event.event_type}</span>
                <span className="ml-2 text-xs text-gray-400">{event.created_at}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {dashboard.communications && dashboard.communications.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-sm font-semibold text-gray-900">{labels.communications}</h3>
          <div className="mt-3 space-y-2 text-sm text-gray-600">
            {dashboard.communications.map((comm) => (
              <div key={comm.id} className="rounded border border-gray-100 p-2">
                <span className="font-medium">{comm.communication_type}</span>
                <span className="ml-2 text-xs">{comm.released_at}</span>
              </div>
            ))}
          </div>
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
