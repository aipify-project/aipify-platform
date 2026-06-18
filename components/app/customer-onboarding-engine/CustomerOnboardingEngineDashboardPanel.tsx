"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCustomerOnboardingEngineDashboard,
  type CustomerOnboardingEngineDashboard,
  type CustomerSuccessObjective,
  type EarlySuccessMoment,
  type IntegrationLink,
  type OnboardingJourneyStage,
} from "@/lib/aipify/customer-onboarding-engine";

type CustomerOnboardingEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

function JourneyStageCard({ stage }: { stage: OnboardingJourneyStage }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{stage.label}</span>
      {stage.description ? <p className="mt-1 text-xs text-gray-600">{stage.description}</p> : null}
      {stage.objectives && stage.objectives.length > 0 ? (
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-gray-600">
          {stage.objectives.map((obj) => (
            <li key={obj}>{obj}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SuccessMomentCard({ moment }: { moment: EarlySuccessMoment }) {
  return (
    <div className="rounded-lg border border-emerald-100 bg-emerald-50/40 px-3 py-2 text-sm">
      {moment.scenario ? <p className="text-xs font-medium text-emerald-900">{moment.scenario}</p> : null}
      {moment.example ? <p className="mt-1 text-xs text-emerald-800">{moment.example}</p> : null}
    </div>
  );
}

function ObjectiveCard({ objective }: { objective: CustomerSuccessObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

export function CustomerOnboardingEngineDashboardPanel({
  labels,
}: CustomerOnboardingEngineDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<CustomerOnboardingEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionKey, setActionKey] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/customer-onboarding-engine/dashboard");
    if (res.ok) setDashboard(parseCustomerOnboardingEngineDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function advanceStep() {
    setActionKey("advance");
    await fetch("/api/aipify/customer-onboarding-engine/advance", { method: "POST" });
    await load();
    setActionKey(null);
  }

  async function completeItem(key: string) {
    setActionKey(key);
    await fetch("/api/aipify/customer-onboarding-engine/checklist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklist_key: key }),
    });
    await load();
    setActionKey(null);
  }

  async function finishOnboarding() {
    setActionKey("complete");
    await fetch("/api/aipify/customer-onboarding-engine/complete", { method: "POST" });
    await load();
    setActionKey(null);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const rec = dashboard.recommendations;
  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link href="/app/operations-dashboard-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.operationsDashboard}
        </Link>
        <Link href="/app/knowledge-center-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.knowledgeCenter}
        </Link>
        <Link href="/app/integration-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.integrationEngine}
        </Link>
        <Link href="/app/onboarding/first-day-experience" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-900">
          {labels.firstDayExperience ?? "First Day Experience"}
        </Link>
        <Link href="/app/onboarding/aipify-install" className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-sm text-indigo-800">
          {labels.aipifyInstall ?? "Aipify Install"}
        </Link>
        <Link href="/app/aipify-install-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.installEngine}
        </Link>
        <Link href="/app/customer-success-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.customerSuccess}
        </Link>
        <Link href="/app/self-love-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.selfLove}
        </Link>
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.customerOnboarding}</h2>
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-emerald-900">{dashboard.blueprint_mission}</p>
        ) : null}
        <p className="mt-2 text-sm text-emerald-900">{dashboard.blueprint_philosophy ?? dashboard.philosophy}</p>
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-2 text-xs text-gray-600">{dashboard.vision}</p> : null}
        {dashboard.onboarding_success_note ? (
          <p className="mt-1 text-xs text-emerald-700">{dashboard.onboarding_success_note}</p>
        ) : null}
        <p className="mt-1 text-xs text-emerald-700">{dashboard.safety_note}</p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.currentStep}</p>
          <p className="mt-1 text-lg font-semibold capitalize text-gray-900">
            {(dashboard.current_step ?? "").replace(/_/g, " ")}
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.completion}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">{dashboard.completion_percentage ?? 0}%</p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.checklistProgress}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {dashboard.checklist_completed ?? 0}/{dashboard.checklist_total ?? 0}
          </p>
        </div>
        <div className="rounded-lg border border-gray-100 bg-white p-3">
          <p className="text-xs font-medium text-gray-700">{labels.stepProgress}</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {(dashboard.step_index ?? 0) + 1}/{dashboard.total_steps ?? 10}
          </p>
        </div>
      </section>

      {engagement ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-600">{labels.daysSinceStart}</p>
              <p className="font-semibold text-gray-900">{engagement.days_since_start ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-600">{labels.checklistRemaining}</p>
              <p className="font-semibold text-gray-900">{engagement.checklist_remaining ?? 0}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <p className="text-xs text-gray-600">{labels.onboardingCompleted}</p>
              <p className="font-semibold text-gray-900">
                {engagement.onboarding_completed ? labels.yes : labels.no}
              </p>
            </div>
          </div>
          {engagement.privacy_note ? (
            <p className="mt-2 text-xs text-gray-500">{engagement.privacy_note}</p>
          ) : null}
        </section>
      ) : null}

      {(dashboard.onboarding_journey?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.onboardingJourney}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {dashboard.onboarding_journey!.map((stage) => (
              <JourneyStageCard key={stage.key ?? stage.label} stage={stage} />
            ))}
          </div>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-gray-900">{labels.onboardingSteps}</h3>
          {!dashboard.completed_at ? (
            <button
              type="button"
              disabled={actionKey === "advance"}
              onClick={() => void advanceStep()}
              className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm text-emerald-800"
            >
              {labels.advanceStep}
            </button>
          ) : null}
        </div>
        <ol className="mt-3 space-y-1 text-sm text-gray-700">
          {dashboard.steps.map((step) => (
            <li
              key={step.step_key}
              className={`rounded px-2 py-1 ${step.current ? "bg-emerald-50 font-medium text-emerald-900" : ""}`}
            >
              {step.completed ? "✓ " : step.current ? "→ " : "○ "}
              {step.step_key.replace(/_/g, " ")}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-gray-900">{labels.checklist}</h3>
        <ul className="mt-3 space-y-2">
          {dashboard.checklist.map((item) => (
            <li key={item.checklist_key} className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 p-3">
              <span className={`text-sm ${item.completed ? "text-gray-500 line-through" : "text-gray-900"}`}>
                {item.title}
              </span>
              {!item.completed && !dashboard.completed_at ? (
                <button
                  type="button"
                  disabled={actionKey === item.checklist_key}
                  onClick={() => void completeItem(item.checklist_key)}
                  className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700"
                >
                  {labels.markComplete}
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        {!dashboard.completed_at && (dashboard.completion_percentage ?? 0) >= 50 ? (
          <button
            type="button"
            disabled={actionKey === "complete"}
            onClick={() => void finishOnboarding()}
            className="mt-4 rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-900"
          >
            {labels.completeOnboarding}
          </button>
        ) : null}
      </section>

      {rec?.next_step_hint ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.recommendations}</h3>
          <p className="mt-2 text-sm text-gray-700">{rec.next_step_hint}</p>
          {(rec.knowledge_articles?.length ?? 0) > 0 ? (
            <ul className="mt-3 space-y-1 text-sm text-gray-600">
              {rec.knowledge_articles!.map((article, i) => (
                <li key={String(article.id ?? i)}>
                  {typeof article.title === "string" ? article.title : labels.knowledgeArticle}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(dashboard.early_success_moments?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.earlySuccessMoments}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.early_success_moments!.map((moment) => (
              <SuccessMomentCard key={moment.key ?? moment.scenario} moment={moment} />
            ))}
          </div>
        </section>
      ) : null}

      {(dashboard.customer_success_objectives?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.customerSuccessObjectives}</h3>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {dashboard.customer_success_objectives!.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.selfLoveConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.practices?.length ? (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
              {dashboard.self_love_connection.practices.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.trustConnection}</h3>
          <p className="mt-2 text-sm text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_know?.length ? (
            <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
              {dashboard.trust_connection.users_should_know.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {(dashboard.success_criteria?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.success_criteria!.map((criterion) => (
              <li
                key={criterion.key ?? criterion.label}
                className="flex items-start gap-2 rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span className={criterion.met ? "text-emerald-600" : "text-gray-400"}>
                  {criterion.met ? "✓" : "○"}
                </span>
                <div>
                  <span className="font-medium text-gray-900">{criterion.label}</span>
                  {criterion.note ? <p className="mt-0.5 text-xs text-gray-600">{criterion.note}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.blueprint_integration_links?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.integrationLinks}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.blueprint_integration_links!.map((link: IntegrationLink) => (
              <li key={link.route ?? link.label} className="text-sm">
                {link.route ? (
                  <Link href={link.route} className="font-medium text-emerald-800 hover:underline">
                    {link.label}
                  </Link>
                ) : (
                  <span className="font-medium text-gray-900">{link.label}</span>
                )}
                {link.note ? <p className="text-xs text-gray-600">{link.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(dashboard.vision_phrases?.length ?? 0) > 0 ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.vision_phrases!.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.principles?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-gray-900">{labels.principles}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
