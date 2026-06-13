"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  DISCOVERY_PHASE_NAMES,
  INSTALL_CORE_PRINCIPLE,
  INSTALL_PHILOSOPHY,
  parseBusinessDiscoveryCenter,
  type BusinessDiscoveryCenter,
} from "@/lib/business-discovery";

type AipifyInstallDiscoveryPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophy: string;
  currentPhase: string;
  runPhase: string;
  running: string;
  introductionTitle: string;
  systemsTitle: string;
  knowledgeTitle: string;
  workflowsTitle: string;
  actionsTitle: string;
  peopleTitle: string;
  readinessTitle: string;
  recommendationsTitle: string;
  auditTitle: string;
  noAudit: string;
  overallReadiness: string;
  confidence: string;
  installEngineLink: string;
  modernInstallLink: string;
  onboardingLink: string;
  privacyNote: string;
  phases: Record<string, string>;
  readinessStates: Record<string, string>;
};

type AipifyInstallDiscoveryPanelProps = {
  labels: AipifyInstallDiscoveryPanelLabels;
};

export function AipifyInstallDiscoveryPanel({ labels }: AipifyInstallDiscoveryPanelProps) {
  const [center, setCenter] = useState<BusinessDiscoveryCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/business-discovery/center");
    if (res.ok) setCenter(parseBusinessDiscoveryCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function runPhase(phase: number) {
    setRunning(phase);
    await fetch("/api/business-discovery/phase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phase }),
    });
    setRunning(null);
    await load();
  }

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/app/customer-onboarding-engine" className="text-indigo-600 hover:underline">
          {labels.onboardingLink}
        </Link>
        <Link href="/app/aipify-install-engine" className="text-indigo-600 hover:underline">
          {labels.installEngineLink}
        </Link>
        <Link href="/app/install" className="text-indigo-600 hover:underline">
          {labels.modernInstallLink}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {labels.corePrinciple}: {INSTALL_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-900">
          {labels.philosophy}: {INSTALL_PHILOSOPHY}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">{labels.privacyNote}</p>
        )}
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-indigo-900">{labels.currentPhase}</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
            Phase {center?.current_phase} —{" "}
            {labels.phases[String(center?.current_phase)] ??
              DISCOVERY_PHASE_NAMES[center?.current_phase ?? 1]}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          {labels.overallReadiness}:{" "}
          {labels.readinessStates[center?.overall_readiness ?? "learning"] ?? center?.overall_readiness}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((phase) => (
            <button
              key={phase}
              type="button"
              disabled={!center?.can_run || running === phase}
              onClick={() => void runPhase(phase)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                center?.current_phase === phase
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              }`}
            >
              {running === phase ? labels.running : labels.runPhase} {phase}
            </button>
          ))}
        </div>
      </section>

      {center?.introduction_message && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm text-emerald-950 whitespace-pre-line">
          <h2 className="font-semibold text-emerald-900">{labels.introductionTitle}</h2>
          <p className="mt-2">{center.introduction_message}</p>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.systemsTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center?.systems.map((system) => (
              <li key={system.system_key} className="rounded-lg border border-gray-100 p-3">
                <div className="font-medium">{system.system_name}</div>
                <p className="text-gray-600">
                  {system.system_type} · {system.integration_status} · {labels.confidence}{" "}
                  {system.confidence_score}%
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.knowledgeTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center?.knowledge.map((source) => (
              <li key={source.source_key} className="rounded-lg border border-gray-100 p-3">
                <div className="font-medium">{source.source_label}</div>
                <p className="text-gray-600">
                  {source.item_count} items · coverage {source.coverage_score}%
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.workflowsTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center?.workflows.map((workflow) => (
              <li key={workflow.workflow_key} className="rounded-lg border border-gray-100 p-3">
                <div className="font-medium">{workflow.workflow_name}</div>
                <p className="text-gray-600">
                  {workflow.workflow_type}
                  {workflow.automation_opportunity ? " · automation opportunity" : ""}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.actionsTitle}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {center?.actions.map((action) => (
              <li key={action.action_key} className="rounded-lg border border-gray-100 p-3">
                <div className="font-medium">{action.action_label}</div>
                <p className="text-gray-600">
                  Level {action.approval_level} · {action.available ? "available" : "pending permission"}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.readinessTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {center?.readiness.map((item) => (
            <div key={item.companion_key} className="rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-medium">{item.companion_key.replace(/_/g, " ")}</p>
              <p className="mt-2 text-xl font-semibold">{item.confidence_score}%</p>
              <p className="text-xs text-gray-500">
                {labels.readinessStates[item.readiness_state] ?? item.readiness_state}
              </p>
            </div>
          ))}
        </div>
      </section>

      {center?.recommendations.length ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
          <h2 className="font-semibold text-amber-900">{labels.recommendationsTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-amber-950">
            {center.recommendations.map((rec) => (
              <li key={rec.key}>· {rec.message}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.auditTitle}</h2>
        {center?.recent_audit.length ? (
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            {center.recent_audit.map((entry) => (
              <li key={entry.id} className="rounded-lg bg-gray-50 px-3 py-2">
                <span className="font-medium text-gray-800">{entry.event_type}</span>
                {entry.summary ? ` — ${entry.summary}` : ""}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-gray-500">{labels.noAudit}</p>
        )}
      </section>
    </div>
  );
}
