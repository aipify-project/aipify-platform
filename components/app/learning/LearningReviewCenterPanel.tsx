"use client";

import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import type { ConfidenceLevel, LearningCenterBundle, LearningMode } from "@/lib/learning";
import { LEARNING_MODES } from "@/lib/learning";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type LearningReviewCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    loading: string;
    empty: string;
    pulseLabel: string;
    sections: {
      mode: string;
      learnings: string;
      suggestions: string;
      history: string;
      governance: string;
    };
    modes: Record<LearningMode, string>;
    modeDescriptions: Record<LearningMode, string>;
    confidence: Record<ConfidenceLevel, string>;
    adaptiveConsent: string;
    adaptiveRequired: string;
    save: string;
    saved: string;
    remove: string;
    disable: string;
    noLearnings: string;
    noSuggestions: string;
    noHistory: string;
    rollout: string;
  };
};

export function LearningReviewCenterPanel({ locale, labels }: LearningReviewCenterPanelProps) {
  const [bundle, setBundle] = useState<LearningCenterBundle | null>(null);
  const [mode, setMode] = useState<LearningMode>("assisted");
  const [adaptiveConsent, setAdaptiveConsent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_learning_center");
    if (!error && data?.has_customer) {
      const next = data as LearningCenterBundle;
      setBundle(next);
      setMode(next.learning_mode ?? "assisted");
      setAdaptiveConsent(next.adaptive_consent ?? false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveSettings(
    nextMode: LearningMode = mode,
    nextConsent: boolean = adaptiveConsent
  ) {
    const supabase = createClient();
    await supabase.rpc("update_customer_learning_settings", {
      p_learning_mode: nextMode,
      p_adaptive_consent: nextMode === "adaptive" ? nextConsent : null,
    });
    setMode(nextMode);
    setAdaptiveConsent(nextConsent);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
    await refresh();
  }

  async function disableLearning() {
    await saveSettings("disabled", false);
  }

  async function removeLearning(id: string) {
    const supabase = createClient();
    await supabase.rpc("remove_customer_learning_memory", { p_memory_id: id });
    await refresh();
  }

  if (loading) return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;

  if (!bundle?.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.empty} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const learnings = bundle.recent_learnings ?? [];
  const suggestions = bundle.suggested_improvements ?? [];
  const history = bundle.approval_history ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 text-sm text-indigo-700">{bundle.principle ?? labels.principle}</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.mode}</h2>
        <div className="mt-3 space-y-3">
          {LEARNING_MODES.map((item) => (
            <label key={item} className="flex cursor-pointer gap-3 rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
              <input
                type="radio"
                name="learning_mode"
                checked={mode === item}
                onChange={() => setMode(item)}
                disabled={item === "adaptive" && !bundle.adaptive_allowed}
              />
              <span>
                <span className="block text-sm font-medium text-gray-900">{labels.modes[item]}</span>
                <span className="block text-xs text-gray-500">{labels.modeDescriptions[item]}</span>
              </span>
            </label>
          ))}
        </div>
        {mode === "adaptive" && (
          <label className="mt-4 flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={adaptiveConsent}
              onChange={(e) => setAdaptiveConsent(e.target.checked)}
            />
            {labels.adaptiveConsent}
          </label>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void saveSettings()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
          >
            {saved ? labels.saved : labels.save}
          </button>
          <button
            type="button"
            onClick={() => void disableLearning()}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.disable}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.learnings}</h2>
        {learnings.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noLearnings}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {learnings.map((entry) => (
              <li key={entry.id} className="rounded-xl border border-gray-100 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium text-gray-900">{entry.pattern_type}</p>
                  <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {labels.confidence[entry.confidence_level]}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-700">{entry.explanation}</p>
                <p className="mt-2 text-xs text-gray-400">{formatDate(entry.learned_at, locale)}</p>
                <button
                  type="button"
                  onClick={() => void removeLearning(entry.id)}
                  className="mt-3 text-sm text-rose-600 hover:underline"
                >
                  {labels.remove}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.suggestions}</h2>
        {suggestions.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noSuggestions}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {suggestions.map((item) => (
              <li key={item.id} className="text-sm text-gray-700">
                <span className="font-medium">{item.title}</span> — {item.description}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.history}</h2>
        {history.length === 0 ? (
          <p className="mt-3 text-sm text-gray-500">{labels.noHistory}</p>
        ) : (
          <ul className="mt-3 space-y-1 text-sm text-gray-600">
            {history.map((item) => (
              <li key={item.id}>
                {item.action_type} · {formatDate(item.created_at, locale)}
              </li>
            ))}
          </ul>
        )}
      </section>

      {bundle.governance && (
        <p className="text-xs text-gray-500">
          {labels.rollout}: {bundle.governance.rollout_stage} ({bundle.governance.environment_type})
        </p>
      )}
    </div>
  );
}
