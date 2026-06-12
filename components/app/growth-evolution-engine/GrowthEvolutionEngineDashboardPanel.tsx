"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseGrowthEvolutionEngineDashboard,
  type BlueprintIntegrationLink,
  type BlueprintObjective,
  type BlueprintSection,
  type BlueprintSuccessCriterion,
  type CompanionExample,
  type CompanionGrowthFeedbackEvent,
  type GrowthEvolutionEngineDashboard,
  type GrowthEvolutionRecommendation,
  type GrowthEvolutionSignal,
  type GrowthDimension,
  type EvolutionCapability,
  type LearningCycleStep,
} from "@/lib/aipify/growth-evolution-engine";

type Props = { labels: Record<string, string> };

function riskBadgeClass(value?: string) {
  switch (value) {
    case "high":
      return "bg-orange-100 text-orange-800";
    case "moderate":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function trendBadgeClass(value?: string) {
  switch (value) {
    case "up":
      return "bg-emerald-100 text-emerald-800";
    case "down":
      return "bg-orange-100 text-orange-800";
    case "emerging":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function RecommendationRow({
  recommendation,
  labels,
  onReview,
  busy,
  canReview,
}: {
  recommendation: GrowthEvolutionRecommendation;
  labels: Record<string, string>;
  onReview: (id: string, action: "accept" | "dismiss" | "defer") => void;
  busy: boolean;
  canReview: boolean;
}) {
  if (!recommendation.id) return null;
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-3 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">
          {(recommendation.dimension ?? "operational").replace(/_/g, " ")}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs uppercase ${riskBadgeClass(recommendation.risk_level)}`}
        >
          {recommendation.risk_level ?? "moderate"}
        </span>
      </div>
      {recommendation.title ? <p className="mt-1 font-medium text-gray-900">{recommendation.title}</p> : null}
      {recommendation.summary ? <p className="mt-1 text-xs text-gray-700">{recommendation.summary}</p> : null}
      {recommendation.evidence_summary ? (
        <p className="mt-1 text-xs text-indigo-700">
          <span className="font-medium">{labels.evidence}:</span> {recommendation.evidence_summary}
        </p>
      ) : null}
      {recommendation.trade_offs ? (
        <p className="mt-1 text-xs text-gray-600">
          <span className="font-medium">{labels.tradeOffs}:</span> {recommendation.trade_offs}
        </p>
      ) : null}
      {canReview ? (
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onReview(recommendation.id!, "accept")}
            className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50"
          >
            {labels.accept}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onReview(recommendation.id!, "defer")}
            className="rounded border border-amber-200 px-2 py-1 text-xs text-amber-800 disabled:opacity-50"
          >
            {labels.defer}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onReview(recommendation.id!, "dismiss")}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
        </div>
      ) : null}
    </li>
  );
}

function SignalRow({ signal, labels }: { signal: GrowthEvolutionSignal; labels: Record<string, string> }) {
  return (
    <li className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">
          {(signal.dimension ?? "operational").replace(/_/g, " ")}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${trendBadgeClass(signal.trend_direction)}`}>
          {signal.trend_direction ?? "stable"}
        </span>
      </div>
      <p className="mt-1 text-xs capitalize text-gray-500">
        {(signal.signal_type ?? "").replace(/_/g, " ")} · {labels.confidence}: {signal.confidence ?? "moderate"}
      </p>
      {signal.summary ? <p className="mt-1 text-xs text-gray-700">{signal.summary}</p> : null}
    </li>
  );
}

export function GrowthEvolutionEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<GrowthEvolutionEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [cadence, setCadence] = useState("monthly");
  const [celebrateProgress, setCelebrateProgress] = useState(true);
  const [feedbackPromptsEnabled, setFeedbackPromptsEnabled] = useState(true);
  const [adaptivePreferencesEnabled, setAdaptivePreferencesEnabled] = useState(true);
  const [companionRefinementOptIn, setCompanionRefinementOptIn] = useState(true);
  const [identityCrossLinkEnabled, setIdentityCrossLinkEnabled] = useState(true);
  const [helpfulnessFrequency, setHelpfulnessFrequency] = useState("occasional");
  const [savingAdaptive, setSavingAdaptive] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/growth-evolution-engine/dashboard");
    if (res.ok) {
      const parsed = parseGrowthEvolutionEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.learning_cycle_cadence === "string") {
        setCadence(parsed.settings.learning_cycle_cadence);
      }
      if (typeof parsed.settings?.celebrate_progress === "boolean") {
        setCelebrateProgress(parsed.settings.celebrate_progress);
      }
      if (typeof parsed.adaptive_settings?.feedback_prompts_enabled === "boolean") {
        setFeedbackPromptsEnabled(parsed.adaptive_settings.feedback_prompts_enabled);
      }
      if (typeof parsed.adaptive_settings?.adaptive_preferences_enabled === "boolean") {
        setAdaptivePreferencesEnabled(parsed.adaptive_settings.adaptive_preferences_enabled);
      }
      if (typeof parsed.adaptive_settings?.companion_refinement_opt_in === "boolean") {
        setCompanionRefinementOptIn(parsed.adaptive_settings.companion_refinement_opt_in);
      }
      if (typeof parsed.adaptive_settings?.identity_cross_link_enabled === "boolean") {
        setIdentityCrossLinkEnabled(parsed.adaptive_settings.identity_cross_link_enabled);
      }
      if (typeof parsed.adaptive_settings?.helpfulness_prompt_frequency === "string") {
        setHelpfulnessFrequency(parsed.adaptive_settings.helpfulness_prompt_frequency);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function reviewRecommendation(id: string, action: "accept" | "dismiss" | "defer") {
    setBusyId(id);
    setActionError(null);
    const res = await fetch("/api/aipify/growth-evolution-engine/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recommendation_id: id, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function saveAdaptiveSettings() {
    setSavingAdaptive(true);
    setActionError(null);
    const res = await fetch("/api/aipify/growth-evolution-engine/adaptive-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        feedback_prompts_enabled: feedbackPromptsEnabled,
        adaptive_preferences_enabled: adaptivePreferencesEnabled,
        companion_refinement_opt_in: companionRefinementOptIn,
        identity_cross_link_enabled: identityCrossLinkEnabled,
        helpfulness_prompt_frequency: helpfulnessFrequency,
        celebrate_progress_enabled: celebrateProgress,
      }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.settingsFailed);
    } else {
      await load();
    }
    setSavingAdaptive(false);
  }

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/growth-evolution-engine/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learning_cycle_cadence: cadence,
        celebrate_progress: celebrateProgress,
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

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/growth-evolution-engine/export", {
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

  if (loading) return <div className="text-sm text-gray-600">{labels.loading}</div>;
  if (!dashboard?.has_organization) return null;

  const summary = dashboard.summary ?? {};
  const integrationLinks = dashboard.integration_links ?? {};
  const permissions = dashboard.permissions ?? {};
  const canReview = Boolean(permissions.can_review);
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const recommendations = dashboard.pending_recommendations ?? [];
  const signals = dashboard.recent_signals ?? [];
  const dimensions = dashboard.growth_dimensions ?? [];
  const cycleSteps = dashboard.learning_cycle_steps ?? [];
  const capabilities = dashboard.evolution_capabilities ?? [];
  const blueprintLinks = dashboard.cgadbp_integration_links ?? [];
  const recentFeedback = dashboard.recent_feedback ?? [];
  const adaptiveSummary = dashboard.cgadbp_adaptive_summary ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/app/proactive-companion-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.proactiveCompanion}
        </Link>
        <Link
          href="/app/continuous-improvement-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.continuousImprovement}
        </Link>
        <Link href="/app/learning" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.learning}
        </Link>
        <Link href="/app/assistant/identity" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.identity}
        </Link>
        <Link href="/app/companion-identity-engine" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.companionIdentity}
        </Link>
        {blueprintLinks.slice(0, 4).map((link: BlueprintIntegrationLink) =>
          link.route ? (
            <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
              {link.label ?? link.route}
            </Link>
          ) : null
        )}
      </div>

      {dashboard.implementation_blueprint ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
          <h2 className="text-sm font-semibold text-violet-900">{labels.blueprintTitle}</h2>
          <p className="mt-1 text-xs uppercase tracking-wide text-violet-700">
            {String(dashboard.implementation_blueprint.phase ?? labels.blueprintPhase58)}
          </p>
          {dashboard.blueprint_mission ? (
            <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.blueprint_mission}</p>
          ) : null}
          {dashboard.blueprint_philosophy ? (
            <p className="mt-2 text-sm text-violet-900">{dashboard.blueprint_philosophy}</p>
          ) : null}
          {dashboard.blueprint_abos_principle ? (
            <p className="mt-2 text-xs text-violet-800">{dashboard.blueprint_abos_principle}</p>
          ) : null}
          {dashboard.cgadbp_distinction_note ? (
            <p className="mt-2 text-xs text-violet-700">{dashboard.cgadbp_distinction_note}</p>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-sm text-gray-700">{dashboard.mission}</p> : null}
        {dashboard.vision ? <p className="mt-2 text-sm italic text-emerald-900">{dashboard.vision}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-emerald-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.self_love_note ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.self_love_note}</p>
        ) : null}
        {dashboard.proactive_companion_note ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.proactive_companion_note}</p>
        ) : null}
        {dashboard.trust_engine_note ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.trust_engine_note}</p>
        ) : null}
      </section>

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.pendingRecommendations}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_recommendations ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.acceptedRecommendations}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.accepted_recommendations ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.recentSignals}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.recent_signals ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.feedbackSignals30d}</p>
          <p className="mt-1 text-2xl font-semibold">{String(adaptiveSummary.feedback_events_30d ?? 0)}</p>
        </div>
      </section>

      {dashboard.cgadbp_objectives && dashboard.cgadbp_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.cgadbp_objectives.map((objective: BlueprintObjective) => (
              <div key={objective.key ?? objective.label} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <span className="font-medium">
                  {objective.emoji ? `${objective.emoji} ` : ""}
                  {objective.label}
                </span>
                {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.cgadbp_feedback_collection ? (
        <BlueprintSectionBlock section={dashboard.cgadbp_feedback_collection} title={labels.feedbackCollection} />
      ) : null}

      {dashboard.cgadbp_companion_evolution_principles ? (
        <BlueprintSectionBlock
          section={dashboard.cgadbp_companion_evolution_principles}
          title={labels.companionEvolutionPrinciples}
          showExamples
        />
      ) : null}

      {dashboard.cgadbp_organizational_learning ? (
        <BlueprintSectionBlock section={dashboard.cgadbp_organizational_learning} title={labels.organizationalLearning} />
      ) : null}

      {dashboard.cgadbp_individual_adaptation ? (
        <BlueprintSectionBlock
          section={dashboard.cgadbp_individual_adaptation}
          title={labels.individualAdaptation}
          showExamples
          exampleKey="preference_examples"
        />
      ) : null}

      {dashboard.cgadbp_self_love_connection ? (
        <BlueprintSectionBlock section={dashboard.cgadbp_self_love_connection} title={labels.selfLoveConnection} />
      ) : null}

      {dashboard.cgadbp_innovation_balance ? (
        <BlueprintSectionBlock section={dashboard.cgadbp_innovation_balance} title={labels.innovationBalance} />
      ) : null}

      {dashboard.cgadbp_trust_connection ? (
        <BlueprintSectionBlock section={dashboard.cgadbp_trust_connection} title={labels.trustConnection} />
      ) : null}

      {recentFeedback.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.recentFeedback}</h3>
          <ul className="mt-3 space-y-2">
            {recentFeedback.map((event: CompanionGrowthFeedbackEvent) => (
              <li key={event.id} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium capitalize">{(event.feedback_type ?? "").replace(/_/g, " ")}</span>
                  {event.helpfulness_rating ? (
                    <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs capitalize">{event.helpfulness_rating}</span>
                  ) : null}
                </div>
                {event.summary ? <p className="mt-1 text-xs text-gray-700">{event.summary}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.learningCycle}</h3>
        <ol className="mt-3 flex flex-wrap gap-2">
          {cycleSteps.map((step: LearningCycleStep) => (
            <li
              key={String(step.key ?? step.step)}
              className="rounded-lg border border-emerald-100 bg-emerald-50/50 px-3 py-2 text-xs"
              title={step.description}
            >
              <span className="font-medium">{step.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.growthDimensions}</h3>
        <ul className="mt-3 space-y-2">
          {dimensions.map((dim: GrowthDimension) => (
            <li key={String(dim.key)} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium">{dim.label}</span>
              {dim.description ? <p className="mt-1 text-xs text-gray-600">{dim.description}</p> : null}
              {Array.isArray(dim.examples) && dim.examples.length > 0 ? (
                <ul className="mt-1 list-disc pl-4 text-xs text-gray-600">
                  {dim.examples.map((ex) => (
                    <li key={ex}>{ex}</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.evolutionCapabilities}</h3>
        <ul className="mt-3 space-y-2">
          {capabilities.map((cap: EvolutionCapability) => (
            <li key={String(cap.key)} className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
              <span className="font-medium">{cap.label}</span>
              {cap.description ? <p className="mt-1 text-xs text-gray-600">{cap.description}</p> : null}
              {Array.isArray(cap.example_phrases) && cap.example_phrases.length > 0 ? (
                <ul className="mt-1 space-y-1 text-xs italic text-indigo-700">
                  {cap.example_phrases.map((phrase) => (
                    <li key={phrase}>&ldquo;{phrase}&rdquo;</li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.recentSignalsTitle ?? labels.recentSignals}</h3>
        {signals.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noSignals}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {signals.map((signal) => (
              <SignalRow key={signal.id} signal={signal} labels={labels} />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.pendingRecommendationsTitle}</h3>
        {recommendations.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noRecommendations}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recommendations.map((rec: GrowthEvolutionRecommendation) => (
              <RecommendationRow
                key={rec.id}
                recommendation={rec}
                labels={labels}
                onReview={(id, action) => void reviewRecommendation(id, action)}
                busy={busyId === rec.id}
                canReview={canReview}
              />
            ))}
          </ul>
        )}
      </section>

      {canManage ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.adaptiveSettings}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.adaptiveSettingsNote}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={feedbackPromptsEnabled}
                onChange={(e) => setFeedbackPromptsEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>{labels.feedbackPromptsEnabled}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={adaptivePreferencesEnabled}
                onChange={(e) => setAdaptivePreferencesEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>{labels.adaptivePreferencesEnabled}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={companionRefinementOptIn}
                onChange={(e) => setCompanionRefinementOptIn(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>{labels.companionRefinementOptIn}</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={identityCrossLinkEnabled}
                onChange={(e) => setIdentityCrossLinkEnabled(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>{labels.identityCrossLinkEnabled}</span>
            </label>
            <label className="text-sm">
              <span className="block text-xs text-gray-500">{labels.helpfulnessFrequency}</span>
              <select
                value={helpfulnessFrequency}
                onChange={(e) => setHelpfulnessFrequency(e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5"
              >
                <option value="never">{labels.frequencyNever}</option>
                <option value="occasional">{labels.frequencyOccasional}</option>
                <option value="after_sessions">{labels.frequencyAfterSessions}</option>
                <option value="weekly">{labels.frequencyWeekly}</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            disabled={savingAdaptive}
            onClick={() => void saveAdaptiveSettings()}
            className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {savingAdaptive ? labels.saving : labels.saveAdaptiveSettings}
          </button>
        </section>
      ) : null}

      {canManage ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.settings}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block text-xs text-gray-500">{labels.learningCycleCadence}</span>
              <select
                value={cadence}
                onChange={(e) => setCadence(e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5"
              >
                <option value="weekly">{labels.cadenceWeekly}</option>
                <option value="biweekly">{labels.cadenceBiweekly}</option>
                <option value="monthly">{labels.cadenceMonthly}</option>
                <option value="quarterly">{labels.cadenceQuarterly}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={celebrateProgress}
                onChange={(e) => setCelebrateProgress(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span>{labels.celebrateProgress}</span>
            </label>
          </div>
          <button
            type="button"
            disabled={savingSettings}
            onClick={() => void saveSettings()}
            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {savingSettings ? labels.saving : labels.saveSettings}
          </button>
        </section>
      ) : null}

      {dashboard.cgadbp_success_criteria && dashboard.cgadbp_success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-3 space-y-2">
            {dashboard.cgadbp_success_criteria.map((criterion: BlueprintSuccessCriterion) => (
              <li key={criterion.key ?? criterion.label} className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium">{criterion.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                    {criterion.met ? labels.criterionMet : labels.criterionPending}
                  </span>
                </div>
                {criterion.note ? <p className="mt-1 text-xs text-gray-600">{criterion.note}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.cgadbp_vision_phrases && dashboard.cgadbp_vision_phrases.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-3 space-y-1 text-sm italic text-emerald-800">
            {dashboard.cgadbp_vision_phrases.map((phrase) => (
              <li key={phrase}>&ldquo;{phrase}&rdquo;</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {Object.entries(integrationLinks).map(([key, href]) =>
            typeof href === "string" ? (
              <Link key={key} href={href} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm capitalize">
                {key.replace(/_/g, " ")}
              </Link>
            ) : null
          )}
          {blueprintLinks.map((link: BlueprintIntegrationLink) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      </section>

      {dashboard.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}

      {canExport ? (
        <button
          type="button"
          disabled={exporting}
          onClick={() => void exportReport()}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
        >
          {exporting ? labels.exporting : labels.exportReport}
        </button>
      ) : null}
    </div>
  );
}

function BlueprintSectionBlock({
  section,
  title,
  showExamples,
  exampleKey = "companion_examples",
}: {
  section: BlueprintSection;
  title: string;
  showExamples?: boolean;
  exampleKey?: string;
}) {
  const examples = (section[exampleKey] as CompanionExample[] | undefined) ?? section.companion_examples;
  return (
    <section className="rounded-xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      {section.principle ? <p className="mt-1 text-xs text-gray-500">{section.principle}</p> : null}
      {section.qualities && section.qualities.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
          {section.qualities.map((q) => <li key={q}>{q}</li>)}
        </ul>
      ) : null}
      {section.practices && section.practices.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
          {section.practices.map((p) => <li key={p}>{p}</li>)}
        </ul>
      ) : null}
      {section.users_should_know && section.users_should_know.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-gray-600">
          {section.users_should_know.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {section.should_avoid && section.should_avoid.length > 0 ? (
        <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-orange-700">
          {section.should_avoid.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ) : null}
      {showExamples && examples && examples.length > 0 ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {examples.map((ex: CompanionExample) => (
            <div key={ex.key ?? ex.example} className="rounded-lg border border-indigo-100 bg-indigo-50/50 px-3 py-2 text-xs text-indigo-900">
              {ex.emoji ? <span className="mr-1">{ex.emoji}</span> : null}
              {ex.example ?? ex.text}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
