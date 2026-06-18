"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseExplanationDetail, type ExplanationDetail } from "@/lib/aipify/trust-engine";

type ExplanationDetailPanelProps = {
  explanationId: string;
  labels: Record<string, string>;
};

export function ExplanationDetailPanel({ explanationId, labels }: ExplanationDetailPanelProps) {
  const [detail, setDetail] = useState<ExplanationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/aipify/explanations/${explanationId}`);
    if (res.ok) setDetail(parseExplanationDetail(await res.json()));
    else setDetail(null);
    setLoading(false);
  }, [explanationId]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitFeedback = async (rating: string) => {
    setBusy(true);
    await fetch(`/api/aipify/explanations/${explanationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating }),
    });
    await load();
    setBusy(false);
  };

  const override = async () => {
    setBusy(true);
    await fetch(`/api/aipify/explanations/${explanationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "override", reason: "Human override" }),
    });
    await load();
    setBusy(false);
  };

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!detail) return <div className="text-sm text-gray-600">{labels.notFound}</div>;

  const { explanation: exp, events } = detail;
  const layers = exp.explanation_layers ?? {};

  return (
    <div className="space-y-6">
      <Link href="/app/trust" className="text-sm text-violet-700 hover:underline">
        ← {labels.back}
      </Link>

      <div>
        <h2 className="text-xl font-bold text-gray-900">{exp.summary}</h2>
        <p className="mt-2 text-sm capitalize text-gray-500">
          {exp.decision_type.replace(/_/g, " ")} · {exp.source_module} · {labels.confidence}: {exp.confidence_level}
        </p>
      </div>

      {layers.simple ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/50 p-4 text-sm">
          <h3 className="font-semibold text-violet-900">{labels.simpleExplanation}</h3>
          <p className="mt-1 text-gray-700">{layers.simple}</p>
        </section>
      ) : null}

      {exp.reasoning ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.reasoning}</h3>
          <p className="mt-1 text-sm text-gray-700">{exp.reasoning}</p>
        </section>
      ) : null}

      {layers.operational ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.operationalExplanation}</h3>
          <p className="mt-1 text-sm text-gray-700">{layers.operational}</p>
        </section>
      ) : null}

      {layers.technical ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.technicalExplanation}</h3>
          <p className="mt-1 text-sm text-gray-700">{layers.technical}</p>
        </section>
      ) : null}

      {exp.information_used.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.informationUsed}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {exp.information_used.map((item) => (
              <li key={item}>{item.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {exp.rules_applied.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.rulesApplied}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {exp.rules_applied.map((rule) => (
              <li key={rule}>{rule.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {exp.alternatives_considered.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.alternatives}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {exp.alternatives_considered.map((alt) => (
              <li key={alt}>{alt.replace(/_/g, " ")}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {exp.recommended_actions.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.nextActions}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {exp.recommended_actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="flex flex-wrap gap-2">
        <button type="button" disabled={busy} onClick={() => void submitFeedback("helpful")}
          className="rounded border border-gray-300 px-3 py-1 text-xs hover:border-violet-300 disabled:opacity-50">
          {labels.helpful}
        </button>
        <button type="button" disabled={busy} onClick={() => void submitFeedback("unclear")}
          className="rounded border border-gray-300 px-3 py-1 text-xs hover:border-violet-300 disabled:opacity-50">
          {labels.unclear}
        </button>
        <button type="button" disabled={busy || exp.overridden} onClick={() => void override()}
          className="rounded border border-rose-200 px-3 py-1 text-xs text-rose-800 hover:bg-rose-50 disabled:opacity-50">
          {labels.override}
        </button>
      </section>

      {events.length > 0 ? (
        <section>
          <h3 className="text-sm font-semibold text-gray-900">{labels.eventHistory}</h3>
          <ul className="mt-2 space-y-1 text-xs text-gray-600">
            {events.map((e, i) => (
              <li key={i} className="capitalize">{e.event_type} · {e.actor}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="text-xs text-gray-500">{labels.governanceNote}</p>
    </div>
  );
}
