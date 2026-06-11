"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAgentDetail, type AgentDetail } from "@/lib/aipify/agents";

type AgentsDetailPanelProps = {
  agentKey: string;
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

export function AgentsDetailPanel({ agentKey, labels }: AgentsDetailPanelProps) {
  const [detail, setDetail] = useState<AgentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/agents/${agentKey}`);
    if (res.ok) setDetail(parseAgentDetail(await res.json()));
    else setDetail(null);
    setLoading(false);
  }, [agentKey]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggleEnabled = async () => {
    if (!detail) return;
    setUpdating(true);
    const res = await fetch(`/api/aipify/agents/${agentKey}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: !detail.agent.enabled }),
    });
    if (res.ok) setDetail(parseAgentDetail(await res.json()));
    setUpdating(false);
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const { agent, events, metrics } = detail;

  return (
    <div className="space-y-6">
      <Link href="/app/agents" className="text-sm text-sky-700 hover:underline">
        ← {labels.back}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{agent.name}</h2>
          <p className="mt-1 text-gray-600">{agent.description}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <span className={`rounded px-2 py-1 capitalize ${riskBadgeClass(agent.risk_level)}`}>
              {labels.risk}: {agent.risk_level}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 capitalize text-gray-700">
              {agent.category}
            </span>
            <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">v{agent.version}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => void toggleEnabled()}
          disabled={updating}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:border-sky-300 disabled:opacity-50"
        >
          {agent.enabled ? labels.disableAgent : labels.enableAgent}
        </button>
      </div>

      {agent.responsibilities.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.responsibilities}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {agent.responsibilities.map((r) => (
              <li key={r} className="capitalize">{r.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {agent.capabilities && agent.capabilities.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.capabilities}</h3>
          <ul className="mt-2 space-y-2">
            {agent.capabilities.map((cap) => (
              <li key={cap.capability_key} className="rounded border border-gray-200 bg-white px-3 py-2 text-sm">
                <span className="font-medium capitalize">{cap.capability_key.replace(/_/g, " ")}</span>
                {cap.description ? <span className="text-gray-600"> — {cap.description}</span> : null}
                {cap.requires_approval ? (
                  <span className="ml-2 text-xs text-amber-700">({labels.requiresApproval})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {agent.permissions && agent.permissions.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.permissions}</h3>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {agent.permissions.map((perm) => (
              <li key={perm.permission_key} className="flex justify-between rounded border border-gray-200 bg-white px-3 py-2 text-sm">
                <span className="capitalize">{perm.permission_key.replace(/_/g, " ")}</span>
                <span className={perm.granted ? "text-emerald-700" : "text-gray-400"}>
                  {perm.granted ? labels.granted : labels.denied}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {metrics.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.metrics}</h3>
          <div className="mt-2 grid gap-2 sm:grid-cols-3">
            {metrics.map((m) => (
              <div key={m.metric_key} className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
                <p className="capitalize text-gray-500">{m.metric_key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-semibold text-gray-900">{m.metric_value}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {events.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.eventHistory}</h3>
          <ul className="mt-2 space-y-2">
            {events.map((event) => (
              <li key={event.id} className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="capitalize">{event.message_type.replace(/_/g, " ")}</span>
                  <span className="capitalize text-gray-500">{event.status}</span>
                </div>
                {event.target_agent ? (
                  <p className="mt-1 text-xs text-gray-500">→ {event.target_agent}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.governanceNote}</p>
    </div>
  );
}
