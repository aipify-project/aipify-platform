"use client";

import { useCallback, useEffect, useState } from "react";
import { parseHumanSuccessDashboard, type HumanSuccessDashboard } from "@/lib/aipify/human-success";

type HumanSuccessDashboardPanelProps = {
  labels: Record<string, string>;
};

function bandClass(band?: string) {
  switch (band) {
    case "exceptional_adoption":
      return "text-emerald-700";
    case "strong_adoption":
      return "text-teal-700";
    case "growth_opportunity":
      return "text-amber-700";
    case "adoption_challenges":
      return "text-orange-700";
    case "critical_adoption_risk":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

export function HumanSuccessDashboardPanel({ labels }: HumanSuccessDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<HumanSuccessDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/human-success/dashboard");
    if (res.ok) setDashboard(parseHumanSuccessDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/human-success/briefings/generate", { method: "POST" });
    await load();
  };

  const completeRecommendation = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/human-success/recommendations/${id}/complete`, { method: "POST" });
    setActing(null);
    await load();
  };

  const dismissRecommendation = async (id: string) => {
    setActing(id);
    await fetch(`/api/aipify/human-success/recommendations/${id}/dismiss`, { method: "POST" });
    setActing(null);
    await load();
  };

  const advanceJourney = async (journeyKey: string) => {
    await fetch("/api/aipify/human-success/journeys/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ journey_key: journeyKey }),
    });
    await load();
  };

  const advanceOnboarding = async (path: string) => {
    await fetch("/api/aipify/human-success/onboarding/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path }),
    });
    await load();
  };

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_customer) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-sky-200 bg-sky-50/50 p-6">
        <h2 className="text-sm font-semibold text-sky-900">{labels.adoptionScore}</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-600">{labels.orgAdoption}</p>
            <p className="text-3xl font-bold text-gray-900">
              {dashboard.org_adoption_score ?? 0}
              <span className="text-base font-normal text-gray-500">/100</span>
            </p>
            <p className={`text-sm capitalize ${bandClass(dashboard.org_adoption_band)}`}>
              {dashboard.org_adoption_band?.replace(/_/g, " ")}
            </p>
          </div>
          {dashboard.show_personal_scores !== false ? (
            <div>
              <p className="text-xs text-gray-600">{labels.personalSuccess}</p>
              <p className="text-3xl font-bold text-gray-900">
                {dashboard.personal_success?.success_score ?? 0}
                <span className="text-base font-normal text-gray-500">/100</span>
              </p>
              <p className="text-xs text-sky-800">{labels.personalOnly}</p>
            </div>
          ) : null}
        </div>
        <p className="mt-3 text-xs text-sky-800">{labels.privacyNote}</p>
      </section>

      {dashboard.value_reinforcements.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.valueReinforcement}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.value_reinforcements.map((v) => (
              <li key={v.id} className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                {v.message}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="rounded-lg border border-sky-300 px-3 py-1.5 text-sm font-medium text-sky-900 hover:bg-sky-50"
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
        <h2 className="text-sm font-semibold text-gray-900">{labels.onboardingSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.onboarding.map((o) => (
            <li key={o.path} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium capitalize">{o.path.replace(/_/g, " ")}</p>
              <p className="mt-1 text-xs text-gray-500">
                Step {o.current_step} of {Array.isArray(o.steps) ? o.steps.length : 0}
                {o.completed ? ` · ${labels.completed}` : ""}
              </p>
              {!o.completed ? (
                <button
                  type="button"
                  onClick={() => void advanceOnboarding(o.path)}
                  className="mt-2 rounded border border-sky-300 px-2 py-0.5 text-xs font-medium text-sky-900 hover:bg-sky-50"
                >
                  {labels.nextStep}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.journeysSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.success_journeys.map((j) => (
            <li key={j.journey_key} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium capitalize">{j.journey_key} {labels.journey}</p>
              <p className="mt-1 text-xs text-gray-500">
                {j.current_step}/{j.total_steps ?? 0} {labels.steps}
                {j.completed ? ` · ${labels.completed}` : ""}
              </p>
              {!j.completed ? (
                <button
                  type="button"
                  onClick={() => void advanceJourney(j.journey_key)}
                  className="mt-2 rounded border border-sky-300 px-2 py-0.5 text-xs font-medium text-sky-900 hover:bg-sky-50"
                >
                  {labels.advanceJourney}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.learningSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.learning_recommendations.map((rec) => (
            <li key={rec.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p>{rec.recommendation}</p>
              {rec.context ? <p className="mt-1 text-xs capitalize text-gray-500">{rec.context}</p> : null}
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  disabled={acting === rec.id}
                  onClick={() => void completeRecommendation(rec.id)}
                  className="rounded border border-sky-400 px-2 py-0.5 text-xs font-medium text-sky-900 hover:bg-sky-50 disabled:opacity-50"
                >
                  {labels.complete}
                </button>
                <button
                  type="button"
                  disabled={acting === rec.id}
                  onClick={() => void dismissRecommendation(rec.id)}
                  className="rounded border border-gray-300 px-2 py-0.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  {labels.dismiss}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.frictionSection}</h2>
        <ul className="mt-3 space-y-2">
          {dashboard.friction_insights.map((f) => (
            <li key={f.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
              <p className="font-medium capitalize">{f.category.replace(/_/g, " ")}</p>
              <p className="mt-1 text-gray-700">{f.description}</p>
              {f.recommendation ? (
                <p className="mt-2 text-xs text-sky-800">{f.recommendation}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      {dashboard.champions.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.championsSection}</h2>
          <p className="mt-1 text-xs text-gray-500">{labels.championsNote}</p>
          <ul className="mt-3 space-y-2">
            {dashboard.champions.map((c, i) => (
              <li key={`${c.champion_type}-${i}`} className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <p className="font-medium capitalize">{c.champion_type} Champion</p>
                <p className="mt-1 text-xs text-gray-700">{c.recognition_reason}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.milestones.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.milestonesSection}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.milestones.map((m) => (
              <li key={m.id} className="rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm">
                {m.title}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.safetyNote}</p>
    </div>
  );
}
