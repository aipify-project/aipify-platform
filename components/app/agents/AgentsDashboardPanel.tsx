"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseAgentsDashboard,
  parseCollaborationResult,
  type AgentsDashboard,
  type CollaborationResult,
} from "@/lib/aipify/agents";

type AgentsDashboardPanelProps = {
  labels: Record<string, string>;
};

function riskBadgeClass(risk: string) {
  switch (risk) {
    case "restricted":
      return "bg-rose-100 text-rose-800";
    case "high":
      return "bg-orange-100 text-orange-800";
    case "medium":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-sky-100 text-sky-800";
  }
}

export function AgentsDashboardPanel({ labels }: AgentsDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<AgentsDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [coordinating, setCoordinating] = useState(false);
  const [lastFlow, setLastFlow] = useState<CollaborationResult | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/agents/dashboard");
    if (res.ok) setDashboard(parseAgentsDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const runSampleFlow = async () => {
    setCoordinating(true);
    const res = await fetch("/api/aipify/agents/coordinate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scenario: "support_low_confidence" }),
    });
    if (res.ok) {
      setLastFlow(parseCollaborationResult(await res.json()));
      await load();
    }
    setCoordinating(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-5">
        <h2 className="text-sm font-semibold text-sky-900">{labels.overview}</h2>
        <p className="mt-2 text-sm text-gray-700">
          {dashboard.active_count ?? 0} {labels.activeAgents}
          {(dashboard.blocked_count ?? 0) > 0 ? ` · ${dashboard.blocked_count} ${labels.blockedEvents}` : ""}
        </p>
        <p className="mt-2 text-xs text-gray-600">{labels.principle}</p>
        <button
          type="button"
          onClick={() => void runSampleFlow()}
          disabled={coordinating}
          className="mt-4 rounded-lg border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-800 hover:bg-sky-50 disabled:opacity-50"
        >
          {coordinating ? labels.runningFlow : labels.runSampleFlow}
        </button>
      </section>

      {lastFlow?.steps && lastFlow.steps.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.lastCollaboration}</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {(lastFlow.steps as Array<Record<string, unknown>>).map((step, i) => (
              <li key={i} className="rounded border border-gray-100 px-3 py-2">
                <span className="font-medium capitalize">{String(step.agent ?? step.source_agent ?? "")}</span>
                {": "}
                {String(step.message ?? step.summary ?? step.message_type ?? "")}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.agentRegistry}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dashboard.agents.map((agent) => (
            <Link
              key={agent.agent_key}
              href={`/app/agents/${agent.agent_key}`}
              className="rounded-lg border border-gray-200 bg-white p-4 text-sm hover:border-sky-300"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-gray-900">{agent.name}</p>
                <span className={`rounded px-2 py-0.5 text-xs capitalize ${riskBadgeClass(agent.risk_level)}`}>
                  {agent.risk_level}
                </span>
              </div>
              <p className="mt-1 line-clamp-2 text-gray-600">{agent.description}</p>
              <p className="mt-2 text-xs capitalize text-gray-500">
                {agent.enabled ? labels.enabled : labels.disabled} · {agent.status}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {dashboard.health.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.agentHealth}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {dashboard.health.map((h) => (
              <div key={h.agent_key} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <p className="font-medium text-gray-900">{h.name}</p>
                <p className="mt-1 text-gray-600">
                  {h.event_count} {labels.events} · {Math.round(h.success_rate * 100)}% {labels.successRate}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.recent_events.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.recentEvents}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.recent_events.map((event) => (
              <li key={event.id} className="flex flex-wrap justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
                <span>
                  <span className="font-medium capitalize">{event.source_agent}</span>
                  {event.target_agent ? ` → ${event.target_agent}` : ""}
                  {" · "}
                  <span className="text-gray-600">{event.message_type.replace(/_/g, " ")}</span>
                </span>
                <span className="capitalize text-gray-500">{event.status}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
