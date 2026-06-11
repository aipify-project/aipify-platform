"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseSecurityIncidents, type SecurityIncident } from "@/lib/aipify/security-compliance";

type SecurityIncidentsPanelProps = {
  labels: Record<string, string>;
};

export function SecurityIncidentsPanel({ labels }: SecurityIncidentsPanelProps) {
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/security/incidents");
    if (res.ok) {
      const data = await res.json();
      setIncidents(parseSecurityIncidents(data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function resolve(id: string) {
    await fetch(`/api/aipify/security/incidents/${id}/resolve`, { method: "POST" });
    await load();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{labels.title}</h1>
        <Link href="/app/security" className="text-sm text-rose-700">{labels.back}</Link>
      </div>
      <p className="text-sm text-gray-600">{labels.subtitle}</p>

      {incidents.length === 0 ? (
        <p className="text-sm text-gray-500">{labels.noIncidents}</p>
      ) : (
        <ul className="space-y-3">
          {incidents.map((i) => (
            <li key={i.id} className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{i.title}</p>
                  <p className="text-xs capitalize text-gray-500">{i.severity} · {i.status} · {i.incident_type}</p>
                  {i.summary ? <p className="mt-1 text-sm text-gray-600">{i.summary}</p> : null}
                </div>
                {i.status === "open" || i.status === "investigating" ? (
                  <button type="button" onClick={() => i.id && void resolve(i.id)} className="text-sm text-rose-700">{labels.resolve}</button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
