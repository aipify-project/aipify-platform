"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import { useCallback, useEffect, useState } from "react";
import {
  parseOutcomesDashboard,
  type OutcomesDashboard,
  type SuccessHypothesis,
  type ValidationResult,
} from "@/lib/aipify/outcomes";

type OutcomesDashboardPanelProps = {
  labels: Record<string, string>;
};

function statusClass(status?: string) {
  switch (status) {
    case "validated":
      return "text-emerald-700";
    case "partially_validated":
      return "text-amber-700";
    case "not_validated":
      return "text-red-700";
    default:
      return "text-gray-700";
  }
}

function scoreBandClass(score?: number) {
  if (!score) return "text-gray-700";
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-teal-700";
  if (score >= 40) return "text-amber-700";
  return "text-orange-700";
}

function HypothesisCard({
  hypothesis,
  labels,
  acting,
  onValidate,
}: {
  hypothesis: SuccessHypothesis;
  labels: Record<string, string>;
  acting: string | null;
  onValidate: (id: string, status: string) => void;
}) {
  const busy = acting === hypothesis.id;
  const canValidate = ["measuring", "in_review", "hypothesis"].includes(hypothesis.status);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <span className="text-xs text-gray-500 capitalize">{hypothesis.category?.replace(/_/g, " ")}</span>
          <h3 className="mt-0.5 font-semibold text-gray-900">{hypothesis.title}</h3>
        </div>
        <span className={`text-sm font-medium capitalize ${statusClass(hypothesis.status)}`}>
          {hypothesis.status?.replace(/_/g, " ")}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{hypothesis.expected_outcome}</p>
      {hypothesis.validation_window_label ? (
        <p className="mt-1 text-xs text-gray-500">
          {labels.validationWindow}: {hypothesis.validation_window_label}
        </p>
      ) : null}
      {canValidate ? (
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onValidate(hypothesis.id, "validated")}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {labels.markValidated}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onValidate(hypothesis.id, "partially_validated")}
            className="rounded-md border border-amber-300 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
          >
            {labels.markPartial}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onValidate(hypothesis.id, "not_validated")}
            className="rounded-md border border-red-300 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            {labels.markFailed}
          </button>
        </div>
      ) : null}
    </article>
  );
}

function ResultList({ items, labels }: { items: ValidationResult[]; labels: Record<string, string> }) {
  if (items.length === 0) return <p className="text-sm text-gray-500">{labels.none}</p>;
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
          <span className="font-medium text-gray-900">{item.title}</span>
          {item.findings ? <p className="mt-1 text-gray-600">{item.findings}</p> : null}
          {item.lessons_learned ? (
            <p className="mt-1 text-xs text-violet-700">
              {labels.lessonsLearned}: {item.lessons_learned}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function OutcomesDashboardPanel({ labels }: OutcomesDashboardPanelProps) {
  const [dashboard, setDashboard] = useState<OutcomesDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/outcomes/dashboard");
    if (res.ok) setDashboard(parseOutcomesDashboard(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const generateBriefing = async () => {
    await fetch("/api/aipify/outcomes/briefings/generate", { method: "POST" });
    await load();
  };

  const validateHypothesis = async (id: string, status: string) => {
    setActing(id);
    await fetch(`/api/aipify/outcomes/hypotheses/${id}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        validation_status: status,
        findings:
          status === "validated"
            ? "Expected outcomes achieved based on available evidence."
            : status === "partially_validated"
              ? "Mixed results — some metrics met, others did not."
              : "Expected outcomes not achieved. Lessons captured for organizational learning.",
        lessons_learned:
          status === "not_validated"
            ? "Assumptions should be revised before retrying similar initiatives."
            : null,
      }),
    });
    setActing(null);
    await load();
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_customer) return null;

  const openHypotheses = dashboard.hypotheses.filter((h) =>
    ["measuring", "in_review", "hypothesis"].includes(h.status)
  );

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold text-teal-900">{labels.successScore}</h2>
        <p className={`mt-2 text-4xl font-bold ${scoreBandClass(dashboard.validated_success_score)}`}>
          {dashboard.validated_success_score ?? 0}
          <span className="text-lg font-normal text-gray-500">/100</span>
        </p>
        <p className="mt-1 text-sm text-teal-800">{dashboard.philosophy}</p>
        <p className="mt-1 text-xs text-teal-700">{dashboard.safety_note}</p>
        {dashboard.total_value_generated != null && dashboard.total_value_generated > 0 ? (
          <p className="mt-3 text-sm text-gray-700">
            {labels.totalValue}: {dashboard.total_value_generated.toFixed(0)}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void generateBriefing()}
          className="mt-4 rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
        >
          {labels.generateBriefing}
        </button>
      </section>

      {dashboard.score_components ? (
        <section className="rounded-xl border border-gray-200 p-4">
          <h2 className="text-sm font-semibold text-gray-900">{labels.scoreComponents}</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(dashboard.score_components).map(([key, value]) => (
              <div key={key} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs capitalize text-gray-500">{key.replace(/_/g, " ")}</p>
                <p className="text-lg font-semibold text-gray-900">{Math.round(value)}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="text-sm font-semibold text-gray-900">{labels.openHypotheses}</h2>
        {openHypotheses.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.noHypotheses}</p>
        ) : (
          <div className="mt-3 space-y-3">
            {openHypotheses.map((h) => (
              <HypothesisCard
                key={h.id}
                hypothesis={h}
                labels={labels}
                acting={acting}
                onValidate={validateHypothesis}
              />
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-emerald-800">{labels.validatedInitiatives}</h2>
          <div className="mt-3">
            <ResultList items={dashboard.validated_initiatives} labels={labels} />
          </div>
        </div>
        {dashboard.show_failed_initiatives !== false ? (
          <div>
            <h2 className="text-sm font-semibold text-red-800">{labels.failedInitiatives}</h2>
            <div className="mt-3">
              <ResultList items={dashboard.failed_initiatives} labels={labels} />
            </div>
          </div>
        ) : null}
      </section>

      {dashboard.roi_reports.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.roiSummaries}</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs text-gray-500">
                  <th className="pb-2 pr-4">{labels.initiative}</th>
                  <th className="pb-2 pr-4">{labels.estimatedRoi}</th>
                  <th className="pb-2 pr-4">{labels.actualRoi}</th>
                  <th className="pb-2">{labels.variance}</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.roi_reports.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4 text-gray-900">{r.title}</td>
                    <td className="py-2 pr-4">{r.estimated_roi?.toFixed(0)}</td>
                    <td className="py-2 pr-4">{r.actual_roi?.toFixed(0)}</td>
                    <td className={`py-2 ${r.variance >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                      {r.variance >= 0 ? "+" : ""}
                      {r.variance?.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {dashboard.kpis.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.kpiFramework}</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.kpis.map((k) => (
              <div key={k.id} className="rounded-lg border border-gray-200 p-3">
                <p className="font-medium text-gray-900">{k.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {k.current_value}
                  {k.target_value != null ? (
                    <span className="text-sm font-normal text-gray-500"> / {k.target_value} {k.unit}</span>
                  ) : (
                    <span className="text-sm font-normal text-gray-500"> {k.unit}</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.lessons_learned.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.lessonsLearned}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.lessons_learned.map((l, i) => (
              <li key={i} className="rounded-lg border border-violet-100 bg-violet-50 px-3 py-2 text-sm text-violet-900">
                {l.title ? <span className="font-medium">{l.title}: </span> : null}
                {l.lessons_learned}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.briefings.length > 0 ? (
        <section>
          <h2 className="text-sm font-semibold text-gray-900">{labels.briefings}</h2>
          <ul className="mt-3 space-y-2">
            {dashboard.briefings.map((b) => (
              <li key={b.id} className="rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-700">
                {b.summary}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
