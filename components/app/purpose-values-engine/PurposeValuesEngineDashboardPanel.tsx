"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePurposeValuesEngineDashboard,
  type BlueprintObjective,
  type OrganizationStatedValue,
  type PurposeDiscoveryQuestion,
  type PurposeValuesEngineDashboard,
  type ValueInAction,
  type ValuesAlignmentSignal,
  type ValuesReflection,
} from "@/lib/aipify/purpose-values-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: BlueprintObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function DiscoveryQuestionCard({ question }: { question: PurposeDiscoveryQuestion }) {
  return (
    <div className="rounded-lg border border-violet-100 bg-violet-50/40 px-3 py-2 text-sm">
      <span className="font-medium">
        {question.emoji ? `${question.emoji} ` : ""}
        {question.question}
      </span>
      {question.description ? <p className="mt-1 text-xs text-gray-600">{question.description}</p> : null}
    </div>
  );
}

function ValueInActionCard({ value }: { value: ValueInAction }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{value.label}</span>
      {value.behaviors && value.behaviors.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {value.behaviors.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function SuccessCriterionRow({
  criterion,
  metLabel,
  pendingLabel,
}: {
  criterion: { key?: string; label?: string; met?: boolean; note?: string | null };
  metLabel: string;
  pendingLabel: string;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-2 rounded border border-gray-100 px-3 py-2 text-sm">
      <span className="text-gray-800">{criterion.label}</span>
      <span className={criterion.met ? "text-xs text-green-700" : "text-xs text-amber-700"}>
        {criterion.met ? metLabel : pendingLabel}
      </span>
      {criterion.note ? <p className="w-full text-xs text-gray-500">{criterion.note}</p> : null}
    </div>
  );
}

function signalBadgeClass(signalType?: string) {
  switch (signalType) {
    case "alignment":
    case "celebration":
      return "bg-emerald-100 text-emerald-800";
    case "drift":
    case "tension":
      return "bg-amber-100 text-amber-800";
    case "opportunity":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function ReflectionRow({
  reflection,
  labels,
  onAcknowledge,
  onDismiss,
  busy,
  canManage,
}: {
  reflection: ValuesReflection;
  labels: Record<string, string>;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
  canManage: boolean;
}) {
  if (!reflection.id) return null;
  const considerations = Array.isArray(reflection.suggested_considerations)
    ? reflection.suggested_considerations
    : [];
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{reflection.prompt}</p>
      {reflection.context_summary ? (
        <p className="mt-1 text-xs text-gray-600">{reflection.context_summary}</p>
      ) : null}
      {considerations.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {considerations.map((c, i) => (
            <li key={i}>{String(c)}</li>
          ))}
        </ul>
      ) : null}
      {canManage ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAcknowledge(reflection.id!)}
            className="rounded border border-emerald-200 px-2 py-1 text-xs text-emerald-800 disabled:opacity-50"
          >
            {labels.acknowledge}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onDismiss(reflection.id!)}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function PurposeValuesEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PurposeValuesEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [purposeStatement, setPurposeStatement] = useState("");
  const [reflectionEnabled, setReflectionEnabled] = useState(true);
  const [celebrateWins, setCelebrateWins] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/purpose-values-engine/dashboard");
    if (res.ok) {
      const parsed = parsePurposeValuesEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.purpose_statement === "string") {
        setPurposeStatement(parsed.settings.purpose_statement);
      }
      if (typeof parsed.settings?.reflection_enabled === "boolean") {
        setReflectionEnabled(parsed.settings.reflection_enabled);
      }
      if (typeof parsed.settings?.celebrate_value_aligned_wins === "boolean") {
        setCelebrateWins(parsed.settings.celebrate_value_aligned_wins);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function reflectionAction(reflectionId: string, action: "acknowledge" | "dismiss") {
    setBusyId(reflectionId);
    setActionError(null);
    const res = await fetch("/api/aipify/purpose-values-engine/reflections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reflection_id: reflectionId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function saveSettings() {
    setSavingSettings(true);
    setActionError(null);
    const res = await fetch("/api/aipify/purpose-values-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        purpose_statement: purposeStatement,
        reflection_enabled: reflectionEnabled,
        celebrate_value_aligned_wins: celebrateWins,
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
    const res = await fetch("/api/aipify/purpose-values-engine/export", {
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
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const statedValues = dashboard.stated_values ?? [];
  const recentSignals = dashboard.recent_signals ?? [];
  const pendingReflections = dashboard.pending_reflections ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const blueprintLinks = dashboard.blueprint_integration_links ?? [];
  const engagement = dashboard.engagement_summary;

  return (
    <div className="space-y-6">
      {blueprintLinks.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {blueprintLinks.map((link) =>
            link.route ? (
              <Link key={link.route} href={link.route} className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
                {link.label ?? link.route}
              </Link>
            ) : null
          )}
        </div>
      ) : null}

      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-violet-800">{dashboard.mission}</p> : null}
        {dashboard.vision ? <p className="mt-1 text-xs text-violet-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
        {dashboard.implementation_blueprint_phase64?.phase ? (
          <p className="mt-1 text-xs text-violet-600">
            {dashboard.implementation_blueprint_phase64.phase}
            {dashboard.implementation_blueprint_phase64.engine_phase
              ? ` · ${dashboard.implementation_blueprint_phase64.engine_phase}`
              : ""}
          </p>
        ) : null}
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-violet-900">{dashboard.blueprint_mission}</p>
        ) : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-violet-900">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-2 text-xs text-violet-700">{dashboard.blueprint_distinction_note}</p>
        ) : null}
        {dashboard.purpose_values_note ? (
          <p className="mt-2 text-xs text-violet-800">{dashboard.purpose_values_note}</p>
        ) : null}
      </section>

      {dashboard.blueprint_objectives && dashboard.blueprint_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.blueprintObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.blueprint_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.purpose_discovery?.questions && dashboard.purpose_discovery.questions.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.purposeDiscovery}</h3>
          {dashboard.purpose_discovery.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.purpose_discovery.principle}</p>
          ) : null}
          <div className="mt-3 space-y-2">
            {dashboard.purpose_discovery.questions.map((q) => (
              <DiscoveryQuestionCard key={q.key ?? q.question} question={q} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.values_exploration?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.valuesExploration}</h3>
          <p className="mt-2 text-gray-700">{dashboard.values_exploration.principle}</p>
          {dashboard.values_exploration.dimensions && dashboard.values_exploration.dimensions.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.values_exploration.dimensions.map((dim) => (
                <ObjectiveCard key={dim.key ?? dim.label} objective={dim} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.values_in_action && dashboard.values_in_action.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.valuesInAction}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.values_in_action.map((value) => (
              <ValueInActionCard key={value.value_key ?? value.label} value={value} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.decision_alignment?.prompts && dashboard.decision_alignment.prompts.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.decisionAlignment}</h3>
          {dashboard.decision_alignment.principle ? (
            <p className="mt-2 text-sm text-gray-700">{dashboard.decision_alignment.principle}</p>
          ) : null}
          <ul className="mt-3 space-y-2 text-sm">
            {dashboard.decision_alignment.prompts.map((prompt, i) => (
              <li key={i} className="rounded border border-gray-100 p-2">
                <p className="font-medium">
                  {prompt.emoji ? `${prompt.emoji} ` : ""}
                  {prompt.prompt}
                </p>
                {prompt.consideration ? (
                  <p className="mt-1 text-xs text-gray-600">{prompt.consideration}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.organizational_storytelling?.principle ? (
        <section className="rounded-lg border border-amber-100 bg-amber-50/40 p-4 text-sm text-amber-900">
          <h3 className="text-sm font-semibold">{labels.organizationalStorytelling}</h3>
          <p className="mt-2">{dashboard.organizational_storytelling.principle}</p>
          {dashboard.organizational_storytelling.story_types &&
          dashboard.organizational_storytelling.story_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {dashboard.organizational_storytelling.story_types.map((story) => (
                <ObjectiveCard key={story.key ?? story.label} objective={story} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.practices &&
          dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.leadership_insights?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.leadershipInsights}</h3>
          <p className="mt-2 text-gray-700">{dashboard.leadership_insights.principle}</p>
          {dashboard.leadership_insights.insight_types &&
          dashboard.leadership_insights.insight_types.length > 0 ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {dashboard.leadership_insights.insight_types.map((insight) => (
                <ObjectiveCard key={insight.key ?? insight.label} objective={insight} />
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_see &&
          dashboard.trust_connection.users_should_see.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.users_should_see.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.dogfooding?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.dogfooding}</h3>
          <p className="mt-2 text-gray-700">{dashboard.dogfooding.principle}</p>
        </section>
      ) : null}

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>
              {labels.activeStatedValues}: {engagement.active_stated_values ?? 0}
            </span>
            <span>
              {labels.recentAlignmentSignals}: {engagement.recent_alignment_signals ?? 0}
            </span>
            <span>
              {labels.pendingReflectionsCount}: {engagement.pending_reflections ?? 0}
            </span>
          </div>
        </section>
      ) : null}

      {dashboard.success_criteria && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <div className="mt-3 space-y-2">
            {dashboard.success_criteria.map((criterion) => (
              <SuccessCriterionRow
                key={criterion.key ?? criterion.label}
                criterion={criterion}
                metLabel={labels.criterionMet}
                pendingLabel={labels.criterionPending}
              />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/30 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-violet-900">
            {dashboard.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.privacy_note ? (
        <p className="text-xs text-gray-500">{dashboard.privacy_note}</p>
      ) : null}

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
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
            <dt className="text-gray-500">{labels.activeValues}</dt>
            <dd>{String(summary.active_values ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.pendingReflections}</dt>
            <dd>{String(summary.pending_reflections ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.recentSignals}</dt>
            <dd>{String(summary.recent_signals ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.hasPurposeStatement}</dt>
            <dd>{summary.has_purpose_statement ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.purposeSettings}</h3>
          <div className="mt-3 space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600" htmlFor="purpose-statement">
                {labels.purposeStatement}
              </label>
              <textarea
                id="purpose-statement"
                rows={3}
                className="mt-1 w-full rounded border border-gray-200 px-3 py-2 text-sm"
                value={purposeStatement}
                onChange={(e) => setPurposeStatement(e.target.value)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={reflectionEnabled}
                onChange={(e) => setReflectionEnabled(e.target.checked)}
              />
              {labels.reflectionEnabled}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={celebrateWins}
                onChange={(e) => setCelebrateWins(e.target.checked)}
              />
              {labels.celebrateWins}
            </label>
            <button
              type="button"
              disabled={savingSettings}
              onClick={() => void saveSettings()}
              className="rounded border border-violet-300 px-3 py-1 text-xs text-violet-800 disabled:opacity-50"
            >
              {savingSettings ? labels.saving : labels.saveSettings}
            </button>
          </div>
        </section>
      ) : null}

      {statedValues.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.statedValues}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(statedValues as OrganizationStatedValue[]).map((v) => (
              <li key={v.id ?? v.value_key} className="rounded border border-violet-100 bg-violet-50/30 p-3">
                <div className="font-medium">{v.label}</div>
                <div className="mt-1 text-xs text-gray-600">{v.description}</div>
                {Array.isArray(v.operational_hints) && v.operational_hints.length > 0 ? (
                  <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
                    {v.operational_hints.map((h, i) => (
                      <li key={i}>{String(h)}</li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pendingReflections.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reflections}</h3>
          <ul className="mt-3 space-y-2">
            {(pendingReflections as ValuesReflection[]).map((r) => (
              <ReflectionRow
                key={r.id}
                reflection={r}
                labels={labels}
                busy={busyId === r.id}
                canManage={canManage}
                onAcknowledge={(id) => void reflectionAction(id, "acknowledge")}
                onDismiss={(id) => void reflectionAction(id, "dismiss")}
              />
            ))}
          </ul>
        </section>
      )}

      {recentSignals.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.alignmentSignals}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentSignals as ValuesAlignmentSignal[]).map((s) => (
              <li key={s.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium capitalize">{s.value_key?.replace(/_/g, " ")}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs uppercase ${signalBadgeClass(s.signal_type)}`}
                  >
                    {s.signal_type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-700">{s.summary}</p>
                {s.alignment_score != null ? (
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.alignmentScore}: {String(s.alignment_score)}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.decision_support_examples && dashboard.decision_support_examples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.decisionSupport}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.decision_support_examples.map((ex, i) => (
              <li key={i} className="rounded border border-gray-100 p-2">
                <p className="font-medium">{ex.prompt}</p>
                {ex.consideration ? <p className="mt-1 text-xs text-gray-600">{ex.consideration}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.culture_support_areas && dashboard.culture_support_areas.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.cultureSupport}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.culture_support_areas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.trust_engine_note || dashboard.growth_evolution_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? <p className="mt-1">{dashboard.self_love_note}</p> : null}
          {dashboard.trust_engine_note ? <p className="mt-2">{dashboard.trust_engine_note}</p> : null}
          {dashboard.growth_evolution_note ? <p className="mt-2">{dashboard.growth_evolution_note}</p> : null}
        </section>
      )}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-violet-700 underline">
                    {key.replace(/_/g, " ")}
                  </Link>
                </li>
              ) : null
            )}
          </ul>
        </section>
      )}
    </div>
  );
}
