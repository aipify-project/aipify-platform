"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseIncidentDetail, type IncidentDetail } from "@/lib/aipify/continuity";

type IncidentDetailPanelProps = {
  incidentId: string;
  labels: Record<string, string>;
};

export function IncidentDetailPanel({ incidentId, labels }: IncidentDetailPanelProps) {
  const [detail, setDetail] = useState<IncidentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/continuity/incidents/${incidentId}`);
    if (res.ok) setDetail(parseIncidentDetail(await res.json()));
    setLoading(false);
  }, [incidentId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const { incident } = detail;

  return (
    <div className="space-y-6">
      <Link href="/app/continuity" className="text-sm text-rose-800 hover:underline">
        ← {labels.back}
      </Link>
      <div>
        <p className="text-xs font-medium uppercase text-rose-700">
          Level {incident.incident_level} · {incident.level_label ?? incident.category}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{incident.summary}</h1>
        {incident.description ? <p className="mt-2 text-gray-600">{incident.description}</p> : null}
      </div>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.recoveryActions}</h2>
        <ul className="mt-3 space-y-2">
          {detail.recovery_actions.map((action) => (
            <li key={action.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium">{action.action_title}</p>
              <p className="mt-1 text-xs capitalize text-gray-500">
                {action.assigned_role_key?.replace(/_/g, " ")} · {action.status.replace(/_/g, " ")}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.humanLeadership}</p>
    </div>
  );
}
