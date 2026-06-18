"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseCuriosityDiscoveryEngineDashboard,
  type BlueprintObjective,
  type BlueprintSuccessCriterion,
  type CompanionGuidanceExample,
  type CuriosityDiscoveryEngineDashboard,
  type DiscoveryCategoryInfo,
  type DiscoveryPrompt,
  type DiscoveryQuestionExample,
  type DiscoverySignal,
  type IntegrationLink,
} from "@/lib/aipify/curiosity-discovery-engine";

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: BlueprintSuccessCriterion;
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <li className="rounded border border-gray-100 p-2 text-xs">
      <div className="flex items-start gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
            criterion.met ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {criterion.met ? metLabel : pendingLabel}
        </span>
        <span className="text-gray-800">{criterion.label}</span>
      </div>
      {criterion.note ? <p className="mt-1 text-gray-500">{criterion.note}</p> : null}
    </li>
  );
}

type Props = { labels: Record<string, string> };

function categoryBadgeClass(category?: string) {
  switch (category) {
    case "operational":
      return "bg-blue-100 text-blue-800";
    case "customer":
      return "bg-violet-100 text-violet-800";
    case "knowledge":
      return "bg-amber-100 text-amber-800";
    case "innovation":
      return "bg-emerald-100 text-emerald-800";
    case "human":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function statusBadgeClass(status?: string) {
  switch (status) {
    case "explored":
      return "bg-emerald-100 text-emerald-800";
    case "dismissed":
      return "bg-stone-100 text-stone-600";
    default:
      return "bg-sky-100 text-sky-800";
  }
}

function confidenceBadgeClass(confidence?: string) {
  switch (confidence) {
    case "high":
      return "bg-emerald-100 text-emerald-800";
    case "moderate":
      return "bg-sky-100 text-sky-800";
    case "low":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function CuriosityDiscoveryEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<CuriosityDiscoveryEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [updatingPrompt, setUpdatingPrompt] = useState<string | null>(null);
  const [encourageExperimentation, setEncourageExperimentation] = useState(true);
  const [promptCadence, setPromptCadence] = useState("weekly");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/curiosity-discovery-engine/dashboard");
    if (res.ok) {
      const parsed = parseCuriosityDiscoveryEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.encourage_experimentation === "boolean") {
        setEncourageExperimentation(parsed.settings.encourage_experimentation);
      }
      if (typeof parsed.settings?.prompt_cadence === "string") {
        setPromptCadence(parsed.settings.prompt_cadence);
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
    const res = await fetch("/api/aipify/curiosity-discovery-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        encourage_experimentation: encourageExperimentation,
        prompt_cadence: promptCadence,
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

  async function updatePrompt(promptId: string, action: "explore" | "dismiss") {
    setUpdatingPrompt(promptId);
    setActionError(null);
    const res = await fetch("/api/aipify/curiosity-discovery-engine/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt_id: promptId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.promptUpdateFailed);
    } else {
      await load();
    }
    setUpdatingPrompt(null);
  }

  async function exportReport() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/curiosity-discovery-engine/export", {
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
  const canExplore = Boolean(permissions.can_explore_prompts);
  const recentPrompts = dashboard.recent_prompts ?? [];
  const recentSignals = dashboard.recent_signals ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const categories = dashboard.discovery_categories ?? [];
  const questionExamples = dashboard.question_examples ?? [];
  const blueprintLinks = (dashboard.blueprint_integration_links ?? []) as IntegrationLink[];
  const blueprintObjectives = dashboard.blueprint_objectives ?? [];
  const successCriteria = dashboard.blueprint_success_criteria ?? [];
  const visionPhrases = dashboard.blueprint_vision_phrases ?? [];
  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-orange-200 bg-orange-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-orange-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-orange-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-orange-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-orange-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-orange-300 px-3 py-1 text-xs text-orange-800 disabled:opacity-50"
            disabled={exporting}
            onClick={() => void exportReport()}
          >
            {exporting ? labels.exporting : labels.exportReport}
          </button>
        ) : null}
      </div>

      <section className="rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-semibold">{labels.summary}</h3>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-gray-500">{labels.promptCount}</dt>
            <dd>{String(summary.prompt_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.pendingPrompts}</dt>
            <dd>{String(summary.pending_prompts ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.exploredPrompts}</dt>
            <dd>{String(summary.explored_prompts ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.signalCount}</dt>
            <dd>{String(summary.signal_count ?? 0)}</dd>
          </div>
        </dl>
      </section>

      {categories.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.discoveryCategories}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(categories as DiscoveryCategoryInfo[]).map((cat) => (
              <li key={cat.key ?? cat.label} className="rounded border border-orange-100 bg-orange-50/30 p-3">
                <div className="font-medium">{cat.label}</div>
                {Array.isArray(cat.bullets) && cat.bullets.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                    {cat.bullets.map((b, i) => (
                      <li key={i}>{String(b)}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {questionExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.questionExamples}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(questionExamples as DiscoveryQuestionExample[]).map((ex) => (
              <li key={ex.key} className="rounded border border-gray-100 p-2 text-xs italic text-gray-700">
                {ex.question}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentPrompts.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentPrompts}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentPrompts as DiscoveryPrompt[]).map((prompt) => (
              <li key={prompt.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${categoryBadgeClass(prompt.category)}`}
                  >
                    {prompt.category?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusBadgeClass(prompt.status)}`}
                  >
                    {prompt.status}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium text-gray-800">{prompt.prompt}</p>
                {prompt.context_summary ? (
                  <p className="mt-1 text-xs text-gray-500">{prompt.context_summary}</p>
                ) : null}
                {canExplore && prompt.status === "pending" && prompt.id ? (
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="rounded border border-orange-300 px-2 py-0.5 text-xs text-orange-800 disabled:opacity-50"
                      disabled={updatingPrompt === prompt.id}
                      onClick={() => void updatePrompt(prompt.id!, "explore")}
                    >
                      {updatingPrompt === prompt.id ? labels.updating : labels.explorePrompt}
                    </button>
                    <button
                      type="button"
                      className="rounded border border-gray-300 px-2 py-0.5 text-xs text-gray-700 disabled:opacity-50"
                      disabled={updatingPrompt === prompt.id}
                      onClick={() => void updatePrompt(prompt.id!, "dismiss")}
                    >
                      {labels.dismissPrompt}
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentSignals.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentSignals}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentSignals as DiscoverySignal[]).map((sig) => (
              <li key={sig.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${categoryBadgeClass(sig.category)}`}
                  >
                    {sig.category?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs uppercase ${confidenceBadgeClass(sig.confidence)}`}
                  >
                    {sig.confidence}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-700">{sig.summary}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.trust_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.trust_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.trustNote}</h4>
              <p className="mt-1">{dashboard.trust_note}</p>
            </div>
          ) : null}
        </section>
      )}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.discoverySettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.promptCadence}</span>
              <select
                value={promptCadence}
                onChange={(e) => setPromptCadence(e.target.value)}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
              >
                <option value="weekly">{labels.cadenceWeekly}</option>
                <option value="monthly">{labels.cadenceMonthly}</option>
                <option value="quarterly">{labels.cadenceQuarterly}</option>
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={encourageExperimentation}
                onChange={(e) => setEncourageExperimentation(e.target.checked)}
              />
              {labels.encourageExperimentationToggle}
            </label>
            <button
              type="button"
              disabled={savingSettings}
              onClick={() => void saveSettings()}
              className="rounded border border-orange-300 px-3 py-1 text-xs text-orange-800 disabled:opacity-50"
            >
              {savingSettings ? labels.saving : labels.saveSettings}
            </button>
          </div>
        </section>
      ) : null}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-orange-700 underline">
                    {key.replace(/_/g, " ")}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}

      {dashboard.implementation_blueprint_phase80 ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50/40 p-6 space-y-6">
          <div>
            <h2 className="text-sm font-semibold">{labels.blueprintPhase80Title}</h2>
            <p className="mt-1 text-xs text-amber-800">
              {dashboard.implementation_blueprint_phase80.phase}
              {dashboard.implementation_blueprint_phase80.engine_phase
                ? ` · ${dashboard.implementation_blueprint_phase80.engine_phase}`
                : ""}
            </p>
            {dashboard.opportunity_exploration_note ? (
              <p className="mt-2 text-sm text-amber-900">{dashboard.opportunity_exploration_note}</p>
            ) : null}
            <p className="mt-2 text-xs text-amber-800">
              {dashboard.blueprint_distinction_note ?? labels.blueprintDistinctionNote}
            </p>
            {dashboard.blueprint_mission ? (
              <p className="mt-2 text-sm font-medium text-amber-900">{dashboard.blueprint_mission}</p>
            ) : null}
            {dashboard.blueprint_philosophy ? (
              <p className="mt-2 text-sm text-amber-900">{dashboard.blueprint_philosophy}</p>
            ) : null}
            {dashboard.blueprint_abos_principle ? (
              <p className="mt-1 text-xs font-medium text-amber-900">{dashboard.blueprint_abos_principle}</p>
            ) : null}
          </div>

          {engagement ? (
            <div className="rounded-lg border border-amber-100 bg-white/60 p-4">
              <h3 className="text-sm font-semibold">{labels.blueprintEngagementSummary}</h3>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-gray-500">{labels.promptCount}</dt>
                  <dd>{String(engagement.prompt_count ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.exploredPrompts}</dt>
                  <dd>{String(engagement.explored_prompts ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.signalCount}</dt>
                  <dd>{String(engagement.signal_count ?? 0)}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">{labels.blueprintOpportunityQuestions}</dt>
                  <dd>{String(engagement.opportunity_questions ?? 0)}</dd>
                </div>
              </dl>
            </div>
          ) : null}

          {blueprintObjectives.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {blueprintObjectives.map((obj) => (
                  <ObjectiveCard key={obj.key ?? obj.label} objective={obj} />
                ))}
              </div>
            </div>
          ) : null}

          {dashboard.opportunity_sources?.principle ? (
            <div className="text-sm">
              <h3 className="text-sm font-semibold">{labels.blueprintOpportunitySources}</h3>
              <p className="mt-2 text-gray-700">{dashboard.opportunity_sources.principle}</p>
              {dashboard.opportunity_sources.sources?.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {dashboard.opportunity_sources.sources.map((src) => (
                    <ObjectiveCard key={src.key ?? src.label} objective={src} />
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {dashboard.opportunity_questions?.questions?.length ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintOpportunityQuestions}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {dashboard.opportunity_questions.questions.map((q) => (
                  <li key={q.key} className="rounded border border-amber-100 p-2 text-xs text-gray-700">
                    {q.emoji ? `${q.emoji} ` : ""}
                    {q.question}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {dashboard.opportunity_evaluation?.criteria?.length ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintOpportunityEvaluation}</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {dashboard.opportunity_evaluation.criteria.map((c) => (
                  <ObjectiveCard key={c.key ?? c.label} objective={c} />
                ))}
              </div>
            </div>
          ) : null}

          {dashboard.companion_guidance?.examples?.length ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintCompanionGuidance}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {(dashboard.companion_guidance.examples as CompanionGuidanceExample[]).map((ex) => (
                  <li key={ex.key} className="rounded border border-gray-100 p-2 text-xs text-gray-700">
                    {ex.emoji ? `${ex.emoji} ` : ""}
                    {ex.prompt}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {dashboard.innovation_connection?.principle ? (
            <div className="text-sm">
              <h3 className="text-sm font-semibold">{labels.blueprintInnovationConnection}</h3>
              <p className="mt-2 text-gray-700">{dashboard.innovation_connection.principle}</p>
              {dashboard.innovation_connection.innovation_lab_note ? (
                <p className="mt-1 text-xs text-gray-600">{dashboard.innovation_connection.innovation_lab_note}</p>
              ) : null}
            </div>
          ) : null}

          {dashboard.leadership_insights?.insight_types?.length ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintLeadershipInsights}</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {dashboard.leadership_insights.insight_types.map((ins) => (
                  <li key={ins.key} className="rounded border border-gray-100 p-2 text-xs">
                    <span className="font-medium">
                      {ins.emoji ? `${ins.emoji} ` : ""}
                      {ins.label}
                    </span>
                    {ins.description ? <p className="mt-1 text-gray-600">{ins.description}</p> : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {dashboard.limitation_principles?.forbidden?.length ? (
            <div className="text-sm">
              <h3 className="text-sm font-semibold">{labels.blueprintLimitationPrinciples}</h3>
              <p className="mt-2 text-gray-700">{dashboard.limitation_principles.principle}</p>
              <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
                {dashboard.limitation_principles.forbidden.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {dashboard.blueprint_self_love_connection?.journey_phrase ? (
            <div className="text-xs text-gray-600">
              <h4 className="font-semibold text-gray-700">{labels.blueprintSelfLoveConnection}</h4>
              <p className="mt-1 italic">{dashboard.blueprint_self_love_connection.journey_phrase}</p>
            </div>
          ) : null}

          {dashboard.blueprint_trust_connection?.principle ? (
            <div className="text-xs text-gray-600">
              <h4 className="font-semibold text-gray-700">{labels.blueprintTrustConnection}</h4>
              <p className="mt-1">{dashboard.blueprint_trust_connection.principle}</p>
            </div>
          ) : null}

          {successCriteria.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintSuccessCriteria}</h3>
              <ul className="mt-3 space-y-2">
                {successCriteria.map((c) => (
                  <SuccessCriterionRow
                    key={c.key ?? c.label}
                    criterion={c}
                    metLabel={labels.criterionMet}
                    pendingLabel={labels.criterionPending}
                  />
                ))}
              </ul>
            </div>
          ) : null}

          {visionPhrases.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintVisionPhrases}</h3>
              <ul className="mt-3 space-y-1 text-xs italic text-gray-700">
                {visionPhrases.map((phrase) => (
                  <li key={phrase}>{phrase}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {blueprintLinks.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold">{labels.blueprintIntegrationLinks}</h3>
              <ul className="mt-2 flex flex-wrap gap-2 text-xs">
                {blueprintLinks.map((link) =>
                  link.route ? (
                    <li key={link.route}>
                      <Link href={link.route} className="text-amber-800 underline">
                        {link.label ?? link.route}
                      </Link>
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          ) : null}

          {dashboard.blueprint_privacy_note ? (
            <p className="text-xs text-gray-500">{dashboard.blueprint_privacy_note}</p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
