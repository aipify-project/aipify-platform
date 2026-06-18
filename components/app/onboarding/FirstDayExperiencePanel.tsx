"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  FIRST_DAY_CORE_PRINCIPLE,
  parseFirstDayExperienceCenter,
  type FirstDayCenter,
} from "@/lib/first-day-experience";

type FirstDayExperiencePanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  currentStep: string;
  advanceStep: string;
  advancing: string;
  welcomeTitle: string;
  discoveryTitle: string;
  valueMomentsTitle: string;
  capabilityTitle: string;
  permissionTitle: string;
  personalizationTitle: string;
  firstSuccessTitle: string;
  readinessTitle: string;
  recommendationsTitle: string;
  confidenceTitle: string;
  auditTitle: string;
  noAudit: string;
  completeTask: string;
  completing: string;
  savePersonalization: string;
  trustScore: string;
  onboardingLink: string;
  aipifyInstallLink: string;
  privacyNote: string;
  steps: Record<string, string>;
  adoptionStages: Record<string, string>;
};

type FirstDayExperiencePanelProps = {
  labels: FirstDayExperiencePanelLabels;
};

export function FirstDayExperiencePanel({ labels }: FirstDayExperiencePanelProps) {
  const [center, setCenter] = useState<FirstDayCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [advancing, setAdvancing] = useState<number | null>(null);
  const [completing, setCompleting] = useState(false);
  const [form, setForm] = useState({
    communication_style: "professional",
    briefing_frequency: "daily",
    approval_sensitivity: "balanced",
    companion_naming: "Aipify",
  });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/first-day-experience/center");
    if (res.ok) {
      const data = parseFirstDayExperienceCenter(await res.json());
      setCenter(data);
      if (data.personalization) {
        setForm({
          communication_style: String(data.personalization.communication_style ?? "professional"),
          briefing_frequency: String(data.personalization.briefing_frequency ?? "daily"),
          approval_sensitivity: String(data.personalization.approval_sensitivity ?? "balanced"),
          companion_naming: String(data.personalization.companion_naming ?? "Aipify"),
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function advanceStep(step: number) {
    setAdvancing(step);
    await fetch("/api/first-day-experience/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance", step }),
    });
    setAdvancing(null);
    await load();
  }

  async function completeTask() {
    setCompleting(true);
    await fetch("/api/first-day-experience/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "complete_task", task_type: "draft_email" }),
    });
    setCompleting(false);
    await load();
  }

  async function savePersonalization() {
    await fetch("/api/first-day-experience/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "personalize", ...form }),
    });
    await load();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/app/customer-onboarding-engine" className="text-indigo-600 hover:underline">
          {labels.onboardingLink}
        </Link>
        <Link href="/app/onboarding/aipify-install" className="text-indigo-600 hover:underline">
          {labels.aipifyInstallLink}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {labels.corePrinciple}: {FIRST_DAY_CORE_PRINCIPLE}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">{labels.privacyNote}</p>
        )}
      </div>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold text-indigo-900">{labels.currentStep}</h2>
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-800">
            Step {center?.current_step} ·{" "}
            {labels.adoptionStages[center?.adoption_stage ?? "observer"] ?? center?.adoption_stage}
          </span>
        </div>
        <p className="mt-2 text-sm text-gray-700">
          {labels.trustScore}: {center?.trust_score ?? 0}%
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => (
            <button
              key={step}
              type="button"
              disabled={!center?.can_complete || advancing === step}
              onClick={() => void advanceStep(step)}
              className={`rounded-lg px-3 py-1.5 text-sm ${
                center?.current_step === step
                  ? "bg-indigo-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              }`}
            >
              {advancing === step ? labels.advancing : labels.advanceStep} {step}
            </button>
          ))}
        </div>
      </section>

      {center?.welcome_message && center.current_step >= 1 && (
        <section className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm whitespace-pre-line">
          <h2 className="font-semibold text-emerald-900">{labels.welcomeTitle}</h2>
          <p className="mt-2 text-emerald-950">{center.welcome_message}</p>
        </section>
      )}

      {center?.discovery_summary && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm text-sm">
          <h2 className="font-semibold text-gray-900">{labels.discoveryTitle}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.entries(center.discovery_summary).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-gray-50 px-3 py-2">
                {key.replace(/_/g, " ")}: {String(value)}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.valueMomentsTitle}</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {center?.value_moments.map((moment) => (
            <li key={moment.moment_key} className="rounded-xl border border-gray-100 p-4">
              <div className="font-medium text-gray-900">{moment.title}</div>
              <p className="mt-1 text-gray-600">{moment.summary}</p>
              <p className="mt-1 text-xs text-gray-500">
                {moment.insight_type} · {moment.confidence} confidence
                {moment.delivered ? " · delivered" : ""}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {center?.confidence_messages.length ? (
        <section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5 text-sm">
          <h2 className="font-semibold text-violet-900">{labels.confidenceTitle}</h2>
          <ul className="mt-3 space-y-2">
            {center.confidence_messages.map((msg) => (
              <li key={msg.area}>
                <span className="font-medium">{msg.area}</span> — {msg.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.personalizationTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          {(
            [
              ["communication_style", form.communication_style],
              ["briefing_frequency", form.briefing_frequency],
              ["approval_sensitivity", form.approval_sensitivity],
              ["companion_naming", form.companion_naming],
            ] as const
          ).map(([key, value]) => (
            <label key={key} className="block">
              <span className="text-gray-600">{key.replace(/_/g, " ")}</span>
              <input
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2"
                value={value}
                onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))}
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          onClick={() => void savePersonalization()}
          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          {labels.savePersonalization}
        </button>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.firstSuccessTitle}</h2>
        <p className="mt-2 text-sm text-gray-600">
          {center?.first_task_completed
            ? "First approved task completed."
            : "Complete an approved first task to move from explanation to experience."}
        </p>
        {!center?.first_task_completed && (
          <button
            type="button"
            disabled={completing || !center?.can_complete}
            onClick={() => void completeTask()}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {completing ? labels.completing : labels.completeTask}
          </button>
        )}
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
        <h2 className="font-semibold text-gray-900">{labels.auditTitle}</h2>
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
