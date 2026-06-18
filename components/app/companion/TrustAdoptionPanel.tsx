"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ADOPTION_PHILOSOPHY,
  TRUST_ADOPTION_CORE_PRINCIPLE,
  parseTrustAdoptionCenter,
  type TrustAdoptionCenter,
} from "@/lib/trust-adoption";

type TrustAdoptionPanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  philosophyTitle: string;
  adoptionStage: string;
  adoptionState: string;
  reliabilityScore: string;
  reliabilityLevel: string;
  trustTrend: string;
  valueMomentsTitle: string;
  signalsTitle: string;
  recommendationsTitle: string;
  widgetsTitle: string;
  auditTitle: string;
  noAudit: string;
  companionLink: string;
  firstDayLink: string;
  privacyNote: string;
  stages: Record<string, string>;
  states: Record<string, string>;
  reliabilityLevels: Record<string, string>;
};

type TrustAdoptionPanelProps = {
  labels: TrustAdoptionPanelLabels;
};

export function TrustAdoptionPanel({ labels }: TrustAdoptionPanelProps) {
  const [center, setCenter] = useState<TrustAdoptionCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/trust-adoption/center");
    if (res.ok) setCenter(parseTrustAdoptionCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/app/proactive-companion-engine" className="text-indigo-600 hover:underline">
          {labels.companionLink}
        </Link>
        <Link href="/app/onboarding/first-day-experience" className="text-indigo-600 hover:underline">
          {labels.firstDayLink}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {labels.corePrinciple}: {TRUST_ADOPTION_CORE_PRINCIPLE}
        </p>
        {center?.privacy_note && (
          <p className="mt-2 text-sm text-gray-500">{labels.privacyNote}</p>
        )}
      </div>

      <section className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5 text-sm">
        <h2 className="font-semibold text-violet-900">{labels.philosophyTitle}</h2>
        <ul className="mt-3 space-y-1 text-violet-950">
          <li>Day 1: {ADOPTION_PHILOSOPHY.day1}</li>
          <li>Week 1: {ADOPTION_PHILOSOPHY.week1}</li>
          <li>Week 2: {ADOPTION_PHILOSOPHY.week2}</li>
          <li>Month 1: {ADOPTION_PHILOSOPHY.month1}</li>
        </ul>
      </section>

      <section className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <p className="text-gray-600">{labels.adoptionStage}</p>
            <p className="mt-1 font-semibold">
              {labels.stages[center?.adoption_stage ?? "curiosity"] ?? center?.adoption_stage}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{labels.adoptionState}</p>
            <p className="mt-1 font-semibold">
              {labels.states[center?.adoption_state ?? "exploring"] ?? center?.adoption_state}
            </p>
          </div>
          <div>
            <p className="text-gray-600">{labels.reliabilityScore}</p>
            <p className="mt-1 text-2xl font-bold">{center?.companion_reliability_score ?? 0}%</p>
          </div>
          <div>
            <p className="text-gray-600">{labels.reliabilityLevel}</p>
            <p className="mt-1 font-semibold">
              {labels.reliabilityLevels[center?.reliability_level ?? "building_trust"] ??
                center?.reliability_level}
            </p>
          </div>
        </div>
        {center?.trust_trend && (
          <p className="mt-3 text-sm text-gray-700">
            {labels.trustTrend}: {center.trust_trend}
          </p>
        )}
      </section>

      {center?.widgets && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-gray-900">{labels.widgetsTitle}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {Object.entries(center.widgets).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 p-3">
                <p className="text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="mt-1 font-medium text-gray-900">{String(value)}</p>
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
              <div className="font-medium">{moment.title}</div>
              <p className="mt-1 text-gray-600">{moment.summary}</p>
              <p className="mt-1 text-xs text-gray-500">
                {moment.outcome_type} · {moment.time_saved_minutes} min saved · {moment.trust_impact} trust impact
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-gray-900">{labels.signalsTitle}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          {center?.signals.map((signal) => (
            <div key={signal.signal_key} className="rounded-lg bg-gray-50 px-3 py-2">
              {signal.signal_key.replace(/_/g, " ")}: {signal.signal_value}
            </div>
          ))}
        </div>
      </section>

      {center?.recommendations.length ? (
        <section className="rounded-2xl border border-amber-100 bg-amber-50/60 p-5">
          <h2 className="font-semibold text-amber-900">{labels.recommendationsTitle}</h2>
          <ul className="mt-3 space-y-2 text-sm text-amber-950">
            {center.recommendations.map((rec) => (
              <li key={rec.recommendation_key}>· {rec.message}</li>
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
