"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyEmptyState } from "@/components/branding";
import { explainConfidence } from "@/lib/learning/confidence";
import { LEARNING_MODES, type LearningMode } from "@/lib/learning/modes";
import { parseLearningCenterBundle } from "@/lib/learning/parse";
import type { LearningCenterBundle, LearningMemoryEntry } from "@/lib/learning/types";
import { formatDate } from "@/lib/i18n/format-date";
import { createClient } from "@/lib/supabase/client";

type LearningReviewCenterPanelProps = {
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    principle: string;
    loading: string;
    emptyLearnings: string;
    emptySuggestions: string;
    emptyHistory: string;
    pulseLabel: string;
    sections: {
      mode: string;
      recent: string;
      suggestions: string;
      history: string;
    };
    modes: Record<LearningMode, { title: string; description: string }>;
    adaptiveConsent: string;
    adaptiveConsentHint: string;
    saveMode: string;
    saving: string;
    saved: string;
    removeLearning: string;
    removing: string;
    confidence: string;
    learnedAt: string;
    patternType: string;
    sourceType: string;
    viewRecommendations: string;
    rolloutStage: string;
    confidenceLabels: {
      low: string;
      medium: string;
      high: (count: number) => string;
    };
    confidenceBadges: Record<string, string>;
  };
};

const CONFIDENCE_STYLES: Record<string, string> = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-amber-100 text-amber-900",
  high: "bg-emerald-100 text-emerald-900",
};

const MODE_STYLES: Record<LearningMode, string> = {
  disabled: "border-gray-200 bg-gray-50",
  assisted: "border-indigo-300 bg-indigo-50",
  adaptive: "border-violet-300 bg-violet-50",
};

export function LearningReviewCenterPanel({ locale, labels }: LearningReviewCenterPanelProps) {
  const [bundle, setBundle] = useState<LearningCenterBundle>({ has_customer: false });
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<LearningMode>("assisted");
  const [adaptiveConsent, setAdaptiveConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase.rpc("get_customer_learning_center");
    const parsed = parseLearningCenterBundle(error ? null : data);
    setBundle(parsed);
    if (parsed.learning_mode) setSelectedMode(parsed.learning_mode);
    if (parsed.adaptive_consent) setAdaptiveConsent(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function saveMode() {
    setSaving(true);
    setSaved(false);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("update_customer_learning_settings", {
        p_learning_mode: selectedMode,
        p_adaptive_consent: adaptiveConsent,
      });
      if (!error) {
        setSaved(true);
        await refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  async function removeLearning(memoryId: string) {
    setRemovingId(memoryId);
    try {
      const supabase = createClient();
      const { error } = await supabase.rpc("remove_customer_learning_memory", {
        p_memory_id: memoryId,
      });
      if (!error) await refresh();
    } finally {
      setRemovingId(null);
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-600">{labels.loading}</div>;
  }

  if (!bundle.has_customer) {
    return (
      <div className="p-6">
        <AipifyEmptyState message={labels.emptyLearnings} pulseLabel={labels.pulseLabel} />
      </div>
    );
  }

  const learnings = bundle.recent_learnings ?? [];
  const suggestions = bundle.suggested_improvements ?? [];
  const history = bundle.approval_history ?? [];
  const adaptiveBlocked = selectedMode === "adaptive" && !adaptiveConsent;

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-900">
          {bundle.principle ?? labels.principle}
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.mode}</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {LEARNING_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => setSelectedMode(mode)}
              className={`rounded-xl border p-4 text-left transition ${
                selectedMode === mode ? MODE_STYLES[mode] : "border-gray-200 bg-white"
              }`}
            >
              <p className="font-semibold text-gray-900">{labels.modes[mode].title}</p>
              <p className="mt-1 text-xs text-gray-600">{labels.modes[mode].description}</p>
            </button>
          ))}
        </div>

        {selectedMode === "adaptive" && (
          <label className="flex items-start gap-3 rounded-lg border border-violet-200 bg-violet-50 p-4 text-sm">
            <input
              type="checkbox"
              checked={adaptiveConsent}
              onChange={(e) => setAdaptiveConsent(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-medium text-gray-900">{labels.adaptiveConsent}</span>
              <span className="mt-1 block text-gray-600">{labels.adaptiveConsentHint}</span>
            </span>
          </label>
        )}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void saveMode()}
            disabled={saving || adaptiveBlocked}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? labels.saving : labels.saveMode}
          </button>
          {saved && <span className="text-sm text-emerald-700">{labels.saved}</span>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.recent}</h2>
        {learnings.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyLearnings}</p>
        ) : (
          <ul className="space-y-3">
            {learnings.map((entry) => (
              <LearningCard
                key={entry.id}
                entry={entry}
                locale={locale}
                labels={labels}
                removing={removingId === entry.id}
                onRemove={() => void removeLearning(entry.id)}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.suggestions}</h2>
        {suggestions.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptySuggestions}</p>
        ) : (
          <ul className="space-y-3">
            {suggestions.map((item) => (
              <li
                key={item.id}
                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[item.confidence_level] ?? CONFIDENCE_STYLES.medium}`}
                  >
                    {labels.confidenceBadges[item.confidence_level] ?? item.confidence_level}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{item.description}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {explainConfidence(item.confidence_score, 0, labels.confidenceLabels)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <p className="text-sm text-gray-500">
          <Link href="/app/recommendations" className="text-indigo-600 hover:underline">
            {labels.viewRecommendations}
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">{labels.sections.history}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">{labels.emptyHistory}</p>
        ) : (
          <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200 bg-white">
            {history.map((item) => (
              <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <span className="text-gray-700">{item.action_type}</span>
                <span className="text-xs text-gray-400">{formatDate(item.created_at, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {bundle.governance?.rollout_stage && (
        <p className="text-xs text-gray-400">
          {labels.rolloutStage}: {bundle.governance.rollout_stage}
        </p>
      )}
    </div>
  );
}

function LearningCard({
  entry,
  locale,
  labels,
  removing,
  onRemove,
}: {
  entry: LearningMemoryEntry;
  locale: string;
  labels: LearningReviewCenterPanelProps["labels"];
  removing: boolean;
  onRemove: () => void;
}) {
  return (
    <li className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded px-2 py-0.5 text-xs font-medium ${CONFIDENCE_STYLES[entry.confidence_level] ?? CONFIDENCE_STYLES.medium}`}
            >
              {labels.confidenceBadges[entry.confidence_level] ?? entry.confidence_level}
            </span>
            <span className="text-xs text-gray-500">
              {labels.patternType}: {entry.pattern_type}
            </span>
          </div>
          <p className="mt-2 text-sm text-gray-900">{entry.explanation}</p>
          <p className="mt-2 text-xs text-gray-500">
            {explainConfidence(entry.confidence_score, 0, labels.confidenceLabels)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {labels.learnedAt} {formatDate(entry.learned_at, locale)}
            {entry.skill_key ? ` · ${entry.skill_key}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="shrink-0 text-xs text-rose-600 hover:underline disabled:opacity-50"
        >
          {removing ? labels.removing : labels.removeLearning}
        </button>
      </div>
    </li>
  );
}
