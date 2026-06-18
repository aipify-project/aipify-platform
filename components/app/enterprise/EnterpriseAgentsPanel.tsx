"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseAipifyAgents, parseAgentRegisterResult, type AipifyAgent } from "@/lib/aipify/enterprise";
import { formatDate } from "@/lib/i18n/format-date";

type EnterpriseAgentsPanelProps = {
  locale: string;
  labels: Record<string, string>;
};

export function EnterpriseAgentsPanel({ locale, labels }: EnterpriseAgentsPanelProps) {
  const [agents, setAgents] = useState<AipifyAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [agentName, setAgentName] = useState("Aipify Agent");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/enterprise/agents");
    if (res.ok) {
      const data = await res.json();
      setAgents(parseAipifyAgents(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function register() {
    const res = await fetch("/api/aipify/enterprise/agents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_name: agentName, deployment_mode: "hybrid" }),
    });
    if (res.ok) {
      const result = parseAgentRegisterResult(await res.json());
      setNewKey(result.agent_key);
      await load();
    }
  }

  async function disable(id: string) {
    await fetch(`/api/aipify/enterprise/agents/${id}/disable`, { method: "POST" });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/enterprise" className="text-sm text-indigo-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      <section className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
        <h2 className="text-sm font-semibold">{labels.registerAgent}</h2>
        <input
          type="text"
          value={agentName}
          onChange={(e) => setAgentName(e.target.value)}
          className="w-full rounded border border-gray-200 px-3 py-2 text-sm"
        />
        <button type="button" onClick={() => void register()} className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white">
          {labels.register}
        </button>
        {newKey ? (
          <p className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
            {labels.agentKeyOnce}: <code className="break-all">{newKey}</code>
          </p>
        ) : null}
      </section>

      {agents.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noAgents}</p>
      ) : (
        <ul className="space-y-3">
          {agents.map((a) => (
            <li key={a.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{a.agent_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{a.status} · {a.deployment_mode}</p>
                  <p className="text-xs text-gray-500">
                    {labels.lastSeen}: {a.last_seen_at ? formatDate(a.last_seen_at, locale) : labels.never}
                  </p>
                </div>
                {a.status !== "disabled" ? (
                  <button type="button" onClick={() => void disable(a.id)} className="text-sm text-red-700">{labels.disable}</button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
