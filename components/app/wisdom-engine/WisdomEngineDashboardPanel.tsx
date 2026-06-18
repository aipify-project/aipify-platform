"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseWisdomEngineDashboard,
  type ThoughtfulGuidanceExample,
  type WisdomEngineDashboard,
  type WisdomGuidancePrompt,
  type WisdomInsight,
  type WisdomSourceInfo,
} from "@/lib/aipify/wisdom-engine";

type Props = { labels: Record<string, string> };

function sourceBadgeClass(sourceType?: string) {
  switch (sourceType) {
    case "memory":
      return "bg-blue-100 text-blue-800";
    case "lesson":
      return "bg-amber-100 text-amber-800";
    case "impact":
      return "bg-emerald-100 text-emerald-800";
    case "relationship":
      return "bg-violet-100 text-violet-800";
    case "kc":
      return "bg-sky-100 text-sky-800";
    case "reflection":
      return "bg-rose-100 text-rose-800";
    case "outcome":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function WisdomEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<WisdomEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [updatingPrompt, setUpdatingPrompt] = useState<string | null>(null);
  const [humilityModeEnabled, setHumilityModeEnabled] = useState(true);
  const [tradeOffPromptsEnabled, setTradeOffPromptsEnabled] = useState(true);
  const [pauseBeforeMajorDecisions, setPauseBeforeMajorDecisions] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/wisdom-engine/dashboard");
    if (res.ok) {
      const parsed = parseWisdomEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.humility_mode_enabled === "boolean") {
        setHumilityModeEnabled(parsed.settings.humility_mode_enabled);
      }
      if (typeof parsed.settings?.trade_off_prompts_enabled === "boolean") {
        setTradeOffPromptsEnabled(parsed.settings.trade_off_prompts_enabled);
      }
      if (typeof parsed.settings?.pause_before_major_decisions === "boolean") {
        setPauseBeforeMajorDecisions(parsed.settings.pause_before_major_decisions);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/wisdom-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        humility_mode_enabled: humilityModeEnabled,
        trade_off_prompts_enabled: tradeOffPromptsEnabled,
        pause_before_major_decisions: pauseBeforeMajorDecisions,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.settingsFailed);
    } else {
      await load();
    }
    setSavingSettings(false);
  }

  async function reviewPrompt(promptId: string, action: "review" | "dismiss") {
    setUpdatingPrompt(promptId);
    setActionError(null);
    const res = await fetch("/api/aipify/wisdom-engine/guidance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt_id: promptId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.guidanceReviewFailed);
    } else {
      await load();
    }
    setUpdatingPrompt(null);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/wisdom-engine/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.exportFailed);
    }
    setExporting(false);
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const canReview = Boolean(permissions.can_review_guidance);
  const recentInsights = dashboard.recent_insights ?? [];
  const pendingPrompts = dashboard.pending_prompts ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const wisdomSources = dashboard.wisdom_sources ?? [];
  const wisdomPrinciples = dashboard.wisdom_principles ?? [];
  const guidanceExamples = dashboard.thoughtful_guidance_examples ?? [];
  const humilityExamples = dashboard.humility_examples ?? [];

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError}
        </div>
      ) : null}

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.engineTitle}</h2>
        {dashboard.distinction_note ? (
          <p className="mt-2 text-sm text-gray-600">{labels.distinctionNote}</p>
        ) : null}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {dashboard.philosophy ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {labels.philosophy}
              </h3>
              <p className="mt-1 text-sm text-gray-800">{dashboard.philosophy}</p>
            </div>
          ) : null}
          {dashboard.mission ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {labels.mission}
              </h3>
              <p className="mt-1 text-sm text-gray-800">{dashboard.mission}</p>
            </div>
          ) : null}
          {dashboard.abos_principle ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {labels.abosPrinciple}
              </h3>
              <p className="mt-1 text-sm text-gray-800">{dashboard.abos_principle}</p>
            </div>
          ) : null}
          {dashboard.vision ? (
            <div>
              <h3 className="text-xs font-medium uppercase tracking-wide text-gray-500">
                {labels.vision}
              </h3>
              <p className="mt-1 text-sm text-gray-800">{dashboard.vision}</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.summary}</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-gray-500">{labels.insightCount}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{String(summary.insight_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.pendingPrompts}</dt>
            <dd className="text-2xl font-semibold text-gray-900">{String(summary.pending_prompts ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.humilityMode}</dt>
            <dd className="text-sm font-medium text-gray-900">
              {summary.humility_mode_enabled ? labels.enabled : labels.disabled}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-gray-500">{labels.pauseBeforeDecisions}</dt>
            <dd className="text-sm font-medium text-gray-900">
              {summary.pause_before_major_decisions ? labels.enabled : labels.disabled}
            </dd>
          </div>
        </dl>
      </section>

      {wisdomSources.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.wisdomSources}</h2>
          <ul className="mt-4 space-y-3">
            {wisdomSources.map((source: WisdomSourceInfo) => (
              <li key={source.key} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${sourceBadgeClass(source.key)}`}>
                  {source.label ?? source.key}
                </span>
                {source.description ? (
                  <p className="mt-2 text-sm text-gray-700">{source.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {wisdomPrinciples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.wisdomPrinciples}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {wisdomPrinciples.map((principle) => (
              <li key={principle}>{principle}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {guidanceExamples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.guidanceExamples}</h2>
          <div className="mt-4 space-y-3">
            {guidanceExamples.map((example: ThoughtfulGuidanceExample) => (
              <div key={example.scenario} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm font-medium text-gray-900">{example.scenario}</p>
                {example.guidance ? (
                  <p className="mt-1 text-sm text-gray-700">{example.guidance}</p>
                ) : null}
                {example.trade_off ? (
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.tradeOff}: {example.trade_off}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {humilityExamples.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.humilityExamples}</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-gray-700">
            {humilityExamples.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.notes}</h2>
        <div className="mt-4 space-y-3 text-sm text-gray-700">
          {dashboard.self_love_note ? (
            <p>
              <span className="font-medium text-gray-900">{labels.selfLoveNote}: </span>
              {dashboard.self_love_note}
            </p>
          ) : null}
          {dashboard.growth_note ? (
            <p>
              <span className="font-medium text-gray-900">{labels.growthNote}: </span>
              {dashboard.growth_note}
            </p>
          ) : null}
          {dashboard.trust_note ? (
            <p>
              <span className="font-medium text-gray-900">{labels.trustNote}: </span>
              {dashboard.trust_note}
            </p>
          ) : null}
        </div>
      </section>

      {pendingPrompts.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.pendingGuidancePrompts}</h2>
          <ul className="mt-4 space-y-4">
            {pendingPrompts.map((prompt: WisdomGuidancePrompt) => (
              <li key={prompt.id} className="rounded-md border border-gray-100 p-4">
                <p className="text-sm font-medium text-gray-900">{prompt.prompt}</p>
                {prompt.context_summary ? (
                  <p className="mt-1 text-sm text-gray-600">{prompt.context_summary}</p>
                ) : null}
                {Array.isArray(prompt.considerations) && prompt.considerations.length > 0 ? (
                  <ul className="mt-2 list-disc pl-5 text-xs text-gray-600">
                    {prompt.considerations.map((item) => (
                      <li key={String(item)}>{String(item)}</li>
                    ))}
                  </ul>
                ) : null}
                {canReview && prompt.id ? (
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      disabled={updatingPrompt === prompt.id}
                      onClick={() => void reviewPrompt(prompt.id!, "review")}
                      className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                    >
                      {updatingPrompt === prompt.id ? labels.saving : labels.markReviewed}
                    </button>
                    <button
                      type="button"
                      disabled={updatingPrompt === prompt.id}
                      onClick={() => void reviewPrompt(prompt.id!, "dismiss")}
                      className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                      {labels.dismiss}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recentInsights.length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.recentInsights}</h2>
          <ul className="mt-4 space-y-3">
            {recentInsights.map((insight: WisdomInsight) => (
              <li key={insight.id} className="rounded-md border border-gray-100 bg-gray-50 p-3">
                <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${sourceBadgeClass(insight.source_type)}`}>
                  {insight.source_type}
                </span>
                {insight.summary ? (
                  <p className="mt-2 text-sm text-gray-800">{insight.summary}</p>
                ) : null}
                {insight.humility_note ? (
                  <p className="mt-1 text-xs italic text-gray-600">{insight.humility_note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.engineSettings}</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={humilityModeEnabled}
                onChange={(e) => setHumilityModeEnabled(e.target.checked)}
              />
              {labels.humilityModeToggle}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={tradeOffPromptsEnabled}
                onChange={(e) => setTradeOffPromptsEnabled(e.target.checked)}
              />
              {labels.tradeOffPromptsToggle}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={pauseBeforeMajorDecisions}
                onChange={(e) => setPauseBeforeMajorDecisions(e.target.checked)}
              />
              {labels.pauseBeforeDecisionsToggle}
            </label>
          </div>
          <button
            type="button"
            disabled={savingSettings}
            onClick={() => void saveSettings()}
            className="mt-4 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {savingSettings ? labels.saving : labels.saveSettings}
          </button>
        </section>
      ) : null}

      {Object.keys(integrationLinks).length > 0 ? (
        <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.integrationLinks}</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-sm text-blue-600 hover:underline">
                    {key.replace(/_/g, " ")}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      ) : null}

      {canExport ? (
        <div>
          <button
            type="button"
            disabled={exporting}
            onClick={() => void exportReport()}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        </div>
      ) : null}
    </div>
  );
}
