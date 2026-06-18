"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseWorkflowDefinitions,
  type WorkflowDefinition,
} from "@/lib/aipify/organizational-intelligence";

type WorkflowsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    empty: string;
    addWorkflow: string;
    name: string;
    key: string;
    category: string;
    responseTime: string;
    openItems: string;
    insightsLink: string;
  };
};

export function WorkflowsPanel({ labels }: WorkflowsPanelProps) {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [key, setKey] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/aipify/workflows/definitions");
    if (res.ok) setWorkflows(parseWorkflowDefinitions(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function addWorkflow() {
    if (!name.trim() || !key.trim()) return;
    await fetch("/api/aipify/workflows/definitions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        workflow_key: key.trim(),
        category: "support",
        expected_response_time_minutes: 60,
      }),
    });
    setName("");
    setKey("");
    void load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link href="/app/insights" className="text-sm text-indigo-600 hover:underline">
        {labels.back}
      </Link>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
      </div>

      {workflows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
          {labels.empty}
        </p>
      ) : (
        <div className="space-y-3">
          {workflows.map((w) => (
            <article
              key={w.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-semibold text-gray-900">{w.name}</h2>
                <span className="text-xs text-gray-500">{w.category}</span>
              </div>
              <p className="mt-1 font-mono text-xs text-gray-500">{w.workflow_key}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600">
                {w.expected_response_time_minutes != null ? (
                  <span>
                    {labels.responseTime}: {w.expected_response_time_minutes} min
                  </span>
                ) : null}
                <span>
                  {labels.openItems}: {w.open_events ?? 0}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-base font-semibold text-gray-900">{labels.addWorkflow}</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.name}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder={labels.key}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono"
        />
        <button
          type="button"
          onClick={() => void addWorkflow()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.addWorkflow}
        </button>
      </section>

      <Link href="/app/insights" className="text-sm text-indigo-600 hover:underline">
        {labels.insightsLink}
      </Link>
    </div>
  );
}
