"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCustomerOnboardingEngineDashboard,
  type CustomerOnboardingEngineDashboard,
} from "@/lib/aipify/customer-onboarding-engine";

type CustomerOnboardingEngineDashboardPanelProps = {
  labels: Record<string, string>;
};

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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const rec = dashboard.recommendations;

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
      </div>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold text-emerald-900">{labels.customerOnboarding}</h2>
        <p className="mt-2 text-sm text-emerald-900">{dashboard.philosophy}</p>
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
