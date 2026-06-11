"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseQualityIncidents, type QualityIncident } from "@/lib/aipify/quality";

type QualityIncidentsPanelProps = {
  labels: Record<string, string>;
  severityLabels: Record<string, string>;
};

export function QualityIncidentsPanel({ labels, severityLabels }: QualityIncidentsPanelProps) {
  const [incidents, setIncidents] = useState<QualityIncident[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/quality/incidents");
    if (res.ok) setIncidents(parseQualityIncidents(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function resolve(id: string, status: "resolved" | "false_positive") {
    setActingId(id);
    await fetch(`/api/aipify/quality/incidents/${id}/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await refresh();
    setActingId(null);
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-5xl space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/quality" className="text-sm text-violet-700">{labels.back}</Link>
      </div>
      <div className="space-y-3">
        {incidents.map((inc) => (
          <div key={inc.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="font-medium">{inc.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{inc.observed_behavior}</p>
              </div>
              <span className="text-xs text-gray-500">
                {severityLabels[inc.severity] ?? inc.severity} · {inc.status}
              </span>
            </div>
            {inc.status === "open" ? (
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={actingId === inc.id}
                  onClick={() => void resolve(inc.id, "resolved")}
                  className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-50"
                >
                  {labels.resolve}
                </button>
                <button
                  type="button"
                  disabled={actingId === inc.id}
                  onClick={() => void resolve(inc.id, "false_positive")}
                  className="rounded border border-gray-300 px-3 py-1 text-xs disabled:opacity-50"
                >
                  {labels.falsePositive}
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {incidents.length === 0 ? <p className="text-sm text-gray-500">{labels.empty}</p> : null}
      </div>
    </div>
  );
}
