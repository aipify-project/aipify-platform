"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseContinuityDashboard, type ContinuityDashboard } from "@/lib/aipify/continuity";

type ContinuityDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "highly_prepared":
      return "text-emerald-700";
    case "prepared":
      return "text-teal-700";
    case "improvement_recommended":
      return "text-amber-700";
    case "resilience_concerns":
      return "text-orange-700";
    case "critical_gap":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

export function ContinuityDashboardPanel({ labels }: ContinuityDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<ContinuityDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/continuity/dashboard");
    if (res.ok) setDashboard(parseContinuityDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const activateIncidentMode = async () => {
    setActivating(true);
    await fetch("/api/aipify/continuity/incident-mode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        incident_level: 2,
        category: "operational_disruption",
        summary: "Incident Mode activated for continuity coordination",
      }),
    });
    setActivating(false);
    await load();
  };

  const deactivateIncidentMode = async () => {
    setActivating(true);
    await fetch("/api/aipify/continuity/incident-mode", { method: "DELETE" });
    setActivating(false);
    await load();
  };

  const generateBriefing = async () => {
    await fetch("/api/aipify/continuity/briefings/generate", { method: "POST" });
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  const modeActive = dashboard.incident_mode?.active;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-rose-200 bg-rose-50/50 p-6">
        <h2 className="text-sm font-semibold text-rose-900">{labels.readinessScore}</h2>
        <p className="mt-2 text-4xl font-bold text-gray-900">
          {dashboard.overall_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className={`mt-1 text-sm font-medium capitalize ${bandClass(dashboard.readiness_band)}`}>
          {dashboard.readiness_band?.replace(/_/g, " ")}
        </p>
        <p className="mt-3 text-xs text-rose-800">{labels.humanLeadership}</p>
        {modeActive ? (
          <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-900">
            {labels.incidentModeActive} — {labels.incidentModeNote}
            <button
              type="button"
              disabled={activating}
              onClick={() => void deactivateIncidentMode()}
              className="ml-3 rounded border border-red-400 px-2 py-0.5 text-xs font-medium hover:bg-red-100 disabled:opacity-50"
            >
              {labels.deactivateIncidentMode}
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={activating}
            onClick={() => void activateIncidentMode()}
            className="mt-4 rounded-lg border border-rose-400 px-3 py-1.5 text-sm font-medium text-rose-900 hover:bg-rose-100 disabled:opacity-50"
          >
            {activating ? labels.activating : labels.activateIncidentMode}
          </button>
        )}
      </section>

      <section>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="rounded-lg border border-rose-300 px-3 py-1.5 text-sm font-medium text-rose-900 hover:bg-rose-50"
        >
          {labels.generateBriefing}
        </button>
        {dashboard.briefings.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                {b.summary}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.criticalProcesses}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.critical_processes.map((proc) => (
            <li key={proc.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium">{proc.process_name}</p>
              <p className="mt-1 text-xs capitalize text-gray-500">{proc.criticality_level}</p>
              {proc.backup ? (
                <p className="mt-1 text-xs text-gray-600">
                  {labels.backupOwners}: {proc.backup.primary}
                  {proc.backup.secondary ? ` → ${proc.backup.secondary}` : ""}
                  {proc.backup.tertiary ? ` → ${proc.backup.tertiary}` : ""}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.incidentsSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.incidents.map((inc) => (
            <li key={inc.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <Link href={`/app/continuity/incidents/${inc.id}`} className="font-medium text-rose-900 hover:underline">
                {inc.summary}
              </Link>
              <p className="mt-1 text-xs text-gray-500">
                Level {inc.incident_level} · {inc.level_label ?? inc.category} · {inc.status}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
