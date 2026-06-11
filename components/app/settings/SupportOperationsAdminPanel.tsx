"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  AUTONOMY_LEVELS,
  parseSupportOperationsCenter,
  type AsoSettings,
  type SupportOperationsCenter,
} from "@/lib/autonomous-support-operations";

type SupportOperationsAdminPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    save: string;
    saved: string;
    privacy: string;
    viewBusinessDna: string;
    runProactive: string;
    sections: {
      health: string;
      autonomy: string;
      performance: string;
      cases: string;
      approval: string;
      gaps: string;
      alerts: string;
      highRisk: string;
      triage: string;
      audit: string;
      ethics: string;
      settings: string;
    };
    settings: {
      proactive: string;
      gapDetection: string;
      selfHealing: string;
      collaboration: string;
      autoThreshold: string;
      draftThreshold: string;
    };
    triage: {
      subject: string;
      body: string;
      run: string;
      result: string;
    };
    autonomyLevels: Record<string, string>;
    empty: string;
    youControl: string;
  };
};

const READINESS_STYLES: Record<string, string> = {
  human_only: "bg-rose-100 text-rose-800",
  assisted: "bg-amber-100 text-amber-800",
  partial_automation: "bg-sky-100 text-sky-800",
  trusted_operations: "bg-emerald-100 text-emerald-800",
};

export function SupportOperationsAdminPanel({ labels }: SupportOperationsAdminPanelProps) {
  const [center, setCenter] = useState<SupportOperationsCenter | null>(null);
  const [settings, setSettings] = useState<AsoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [triageSubject, setTriageSubject] = useState("Where is my order?");
  const [triageBody, setTriageBody] = useState("");
  const [triageResult, setTriageResult] = useState<Record<string, unknown> | null>(null);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/support-operations");
    if (res.ok) {
      const data = parseSupportOperationsCenter(await res.json());
      setCenter(data);
      if (data.settings) setSettings(data.settings);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveSettings() {
    if (!settings) return;
    await fetch("/api/support-operations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function runProactive() {
    await fetch("/api/support-operations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "proactive_check" }),
    });
    await refresh();
  }

  async function runTriage() {
    const res = await fetch("/api/support-operations/triage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: triageSubject,
        body: triageBody,
        channel: "email",
        customer_name: "Customer",
      }),
    });
    setTriageResult(await res.json());
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  const readiness = center?.readiness;
  const performance = center?.performance as Record<string, unknown> | undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <Link href="/app/settings" className="text-sm text-indigo-600 hover:underline">
          ← {labels.back}
        </Link>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-1 text-sm font-medium text-indigo-800">{labels.youControl}</p>
        {center?.privacy_note && (
          <p className="mt-2 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-800">
            {center.privacy_note}
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <Link href="/app/settings/business-dna" className="text-sm text-indigo-600 hover:underline">
            {labels.viewBusinessDna}
          </Link>
          <button
            type="button"
            onClick={() => void runProactive()}
            className="text-sm text-gray-600 hover:underline"
          >
            {labels.runProactive}
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.health}</h2>
        {readiness && (
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <span className="text-3xl font-bold">{readiness.readiness_score}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${READINESS_STYLES[readiness.level] ?? READINESS_STYLES.assisted}`}
            >
              {readiness.readiness_label}
            </span>
            <span className="text-sm text-gray-500">
              Recommended level: {readiness.recommended_autonomy_level}
            </span>
          </div>
        )}
      </section>

      {settings && (
        <section className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="font-semibold text-indigo-900">{labels.sections.autonomy}</h2>
          <div className="mt-3 space-y-3">
            <label className="block text-sm">
              <span className="text-gray-700">{labels.sections.settings}</span>
              <select
                value={settings.autonomy_level}
                onChange={(e) =>
                  setSettings({ ...settings, autonomy_level: Number(e.target.value) })
                }
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
              >
                {AUTONOMY_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    Level {level}: {labels.autonomyLevels[String(level)] ?? level}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.proactive_support_enabled}
                onChange={(e) =>
                  setSettings({ ...settings, proactive_support_enabled: e.target.checked })
                }
              />
              {labels.settings.proactive}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.knowledge_gap_detection_enabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    knowledge_gap_detection_enabled: e.target.checked,
                  })
                }
              />
              {labels.settings.gapDetection}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={settings.human_collaboration_mode}
                onChange={(e) =>
                  setSettings({ ...settings, human_collaboration_mode: e.target.checked })
                }
              />
              {labels.settings.collaboration}
            </label>
            <button
              type="button"
              onClick={() => void saveSettings()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
            >
              {saved ? labels.saved : labels.save}
            </button>
          </div>
        </section>
      )}

      {performance && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-5">
          <h2 className="font-semibold text-emerald-900">{labels.sections.performance}</h2>
          <ul className="mt-3 space-y-1 text-sm text-emerald-900">
            <li>
              Open cases: {String(performance.open_cases ?? 0)} · Automation rate:{" "}
              {String(performance.automation_rate ?? 0)}%
            </li>
            {Array.isArray(performance.insights) &&
              performance.insights.map((insight, i) => (
                <li key={i}>· {String(insight)}</li>
              ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.approval}</h2>
        {(center?.approval_queue?.length ?? 0) === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.empty}</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {center?.approval_queue?.map((c) => (
              <li key={String(c.id)} className="rounded-lg bg-amber-50 px-3 py-2">
                {String(c.subject)} — {String(c.confidence_score)}% confidence
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-rose-100 bg-rose-50/40 p-5">
        <h2 className="font-semibold text-rose-900">{labels.sections.highRisk}</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {center?.high_risk_cases?.map((c) => (
            <li key={String(c.id)}>
              {String(c.subject)} — {String(c.risk_level)}
            </li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-5">
        <h2 className="font-semibold text-amber-900">{labels.sections.gaps}</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {center?.knowledge_gaps?.map((g) => (
            <li key={String(g.id)}>
              <span className="font-medium">{String(g.category)}</span> ({String(g.occurrence_count)}×) —{" "}
              {String(g.suggestion)}
            </li>
          )) ?? <li className="text-gray-500">{labels.empty}</li>}
        </ul>
      </section>

      <section className="rounded-2xl border border-sky-100 bg-sky-50/40 p-5">
        <h2 className="font-semibold text-sky-900">{labels.sections.triage}</h2>
        <label className="mt-3 block text-sm">
          {labels.triage.subject}
          <input
            value={triageSubject}
            onChange={(e) => setTriageSubject(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <label className="mt-3 block text-sm">
          {labels.triage.body}
          <textarea
            value={triageBody}
            onChange={(e) => setTriageBody(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
          />
        </label>
        <button
          type="button"
          onClick={() => void runTriage()}
          className="mt-3 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.triage.run}
        </button>
        {triageResult && (
          <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-white p-3 text-xs">
            {labels.triage.result}: {JSON.stringify(triageResult, null, 2)}
          </pre>
        )}
      </section>

      {Array.isArray(center?.ethical_principles) && (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/40 p-5">
          <h2 className="font-semibold text-violet-900">{labels.sections.ethics}</h2>
          <ul className="mt-2 space-y-1 text-sm text-violet-800">
            {center.ethical_principles.map((p, i) => (
              <li key={i}>· {p}</li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.sections.audit}</h2>
        <ul className="mt-3 space-y-1 text-sm text-gray-600">
          {center?.audit_log?.map((a) => (
            <li key={String(a.id)}>
              {String(a.event_type)} — {String(a.performed_by)}
            </li>
          )) ?? <li>{labels.empty}</li>}
        </ul>
      </section>
    </div>
  );
}
