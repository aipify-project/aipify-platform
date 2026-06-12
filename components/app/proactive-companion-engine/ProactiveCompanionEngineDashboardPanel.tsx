"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseProactiveCompanionEngineDashboard,
  type CompanionExample,
  type ProactiveCompanionEngineDashboard,
  type ProactiveCompanionNudge,
  type ProactiveExampleCategory,
  type ProactiveObjective,
} from "@/lib/aipify/proactive-companion-engine";

type Props = { labels: Record<string, string> };

function ObjectiveCard({ objective }: { objective: ProactiveObjective }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{objective.label}</span>
      {objective.description ? <p className="mt-1 text-xs text-gray-600">{objective.description}</p> : null}
    </div>
  );
}

function ExampleCategoryCard({ category }: { category: ProactiveExampleCategory }) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
      <span className="font-medium">{category.label}</span>
      {category.signals && category.signals.length > 0 ? (
        <ul className="mt-1 list-inside list-disc space-y-0.5 text-xs text-gray-600">
          {category.signals.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function CompanionExampleCard({ example }: { example: CompanionExample }) {
  return (
    <div className="rounded-lg border border-indigo-100 bg-indigo-50/40 px-3 py-2 text-sm">
      {example.scenario ? <p className="text-xs font-medium text-indigo-900">{example.scenario}</p> : null}
      {example.example ? <p className="mt-1 text-xs text-indigo-800">{example.example}</p> : null}
    </div>
  );
}

function badgeClass(value?: string) {
  switch (value) {
    case "high":
      return "bg-orange-100 text-orange-800";
    case "normal":
      return "bg-amber-100 text-amber-800";
    case "low":
      return "bg-emerald-100 text-emerald-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function NudgeRow({
  nudge,
  labels,
  onDismiss,
  onSnooze,
  busy,
  canDismiss,
}: {
  nudge: ProactiveCompanionNudge;
  labels: Record<string, string>;
  onDismiss: (id: string) => void;
  onSnooze: (id: string) => void;
  busy: boolean;
  canDismiss: boolean;
}) {
  if (!nudge.id) return null;
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-medium capitalize text-gray-900">
          {(nudge.category ?? "operational").replace(/_/g, " ")}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-xs uppercase ${badgeClass(nudge.priority)}`}>
          {nudge.priority ?? "normal"}
        </span>
      </div>
      {nudge.summary ? <p className="mt-1 text-xs text-gray-700">{nudge.summary}</p> : null}
      {nudge.suggested_action ? (
        <p className="mt-1 text-xs text-indigo-700">{nudge.suggested_action}</p>
      ) : null}
      {canDismiss ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onDismiss(nudge.id!)}
            className="rounded border border-gray-200 px-2 py-1 text-xs text-gray-700 disabled:opacity-50"
          >
            {labels.dismiss}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => onSnooze(nudge.id!)}
            className="rounded border border-indigo-200 px-2 py-1 text-xs text-indigo-800 disabled:opacity-50"
          >
            {labels.snooze}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function ProactiveCompanionEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<ProactiveCompanionEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [frequency, setFrequency] = useState("normal");
  const [communicationStyle, setCommunicationStyle] = useState("supportive");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/dashboard");
    if (res.ok) {
      const parsed = parseProactiveCompanionEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.user_preferences?.frequency === "string") {
        setFrequency(parsed.user_preferences.frequency);
      }
      if (typeof parsed.user_preferences?.communication_style === "string") {
        setCommunicationStyle(parsed.user_preferences.communication_style);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function nudgeAction(nudgeId: string, action: "dismiss" | "snooze") {
    setBusyId(nudgeId);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/nudges", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nudge_id: nudgeId, action }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setBusyId(null);
  }

  async function savePreferences() {
    setSavingPrefs(true);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frequency, communication_style: communicationStyle }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.preferencesFailed);
    } else {
      await load();
    }
    setSavingPrefs(false);
  }

  async function exportSummary() {
    setExporting(true);
    setActionError(null);
    const res = await fetch("/api/aipify/proactive-companion-engine/export", {
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
  const canDismiss = Boolean(permissions.can_dismiss);
  const canManagePrefs = Boolean(permissions.can_manage_preferences);
  const nudges = dashboard.active_nudges ?? [];
  const categories = dashboard.assistance_categories ?? [];
  const styleExamples = dashboard.companion_style_examples ?? [];
  const boundaries = dashboard.boundaries ?? [];
  const engagement = dashboard.engagement_summary;
  const blueprintLinks = dashboard.blueprint_integration_links ?? [];

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

      <div className="flex flex-wrap gap-2">
        <Link href="/app/command-center" className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm">
          {labels.commandCenter}
        </Link>
        <Link
          href="/app/settings/companion-presence"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.companionPresence}
        </Link>
        <Link
          href="/app/notification-communication-engine"
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm"
        >
          {labels.notificationEngine}
        </Link>
      </div>

      <section className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-sm text-gray-700">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.self_love_note ? (
          <p className="mt-2 text-xs text-gray-600">{dashboard.self_love_note}</p>
        ) : null}
        {dashboard.distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.distinction_note}</p>
        ) : null}
        {dashboard.implementation_blueprint?.phase ? (
          <p className="mt-1 text-xs text-indigo-600">
            {dashboard.implementation_blueprint.phase}
            {dashboard.implementation_blueprint.engine_phase ? ` · ${dashboard.implementation_blueprint.engine_phase}` : ""}
          </p>
        ) : null}
        {dashboard.blueprint_mission ? (
          <p className="mt-2 text-sm font-medium text-indigo-900">{dashboard.blueprint_mission}</p>
        ) : null}
        {dashboard.blueprint_philosophy ? (
          <p className="mt-2 text-sm text-indigo-900">{dashboard.blueprint_philosophy}</p>
        ) : null}
        {dashboard.blueprint_abos_principle ? (
          <p className="mt-2 text-xs text-indigo-800">{dashboard.blueprint_abos_principle}</p>
        ) : null}
        {dashboard.blueprint_distinction_note ? (
          <p className="mt-2 text-xs text-indigo-700">{dashboard.blueprint_distinction_note}</p>
        ) : null}
      </section>

      {engagement ? (
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-sm font-semibold">{labels.engagementSummary}</h3>
          <div className="mt-3 grid gap-2 text-xs text-gray-600 sm:grid-cols-3">
            <span>
              {labels.nudgesTotal}: {engagement.nudges_total ?? 0}
            </span>
            <span>
              {labels.pendingNudges}: {engagement.pending_nudges ?? 0}
            </span>
            <span>
              {labels.actedNudges}: {engagement.acted_nudges ?? 0}
            </span>
            <span>
              {labels.nudgesLast30d}: {engagement.nudges_last_30d ?? 0}
            </span>
            <span>
              {labels.categoriesUsed}: {engagement.categories_used ?? 0}
            </span>
            <span>
              {labels.auditEvents}: {engagement.audit_events_total ?? 0}
            </span>
          </div>
        </section>
      ) : null}

      {dashboard.proactive_objectives && dashboard.proactive_objectives.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.proactiveObjectives}</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.proactive_objectives.map((objective) => (
              <ObjectiveCard key={objective.key ?? objective.label} objective={objective} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.proactive_examples?.categories && dashboard.proactive_examples.categories.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.proactiveExamples}</h3>
          {dashboard.proactive_examples.principle ? (
            <p className="mt-1 text-xs text-gray-500">{dashboard.proactive_examples.principle}</p>
          ) : null}
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {dashboard.proactive_examples.categories.map((category) => (
              <ExampleCategoryCard key={category.domain ?? category.label} category={category} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.companion_examples && dashboard.companion_examples.length > 0 ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.companionExamples}</h3>
          <div className="mt-3 space-y-3">
            {dashboard.companion_examples.map((example) => (
              <CompanionExampleCard key={example.key ?? example.scenario} example={example} />
            ))}
          </div>
        </section>
      ) : null}

      {dashboard.blueprint_boundaries?.should_avoid && dashboard.blueprint_boundaries.should_avoid.length > 0 ? (
        <section className="rounded-lg border border-violet-100 bg-violet-50/40 p-4 text-sm text-violet-900">
          <h3 className="text-sm font-semibold">{labels.blueprintBoundaries}</h3>
          {dashboard.blueprint_boundaries.principle ? (
            <p className="mt-2">{dashboard.blueprint_boundaries.principle}</p>
          ) : null}
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs">
            {dashboard.blueprint_boundaries.should_avoid.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {dashboard.self_love_connection?.principle ? (
        <section className="rounded-lg border border-rose-100 bg-rose-50/40 p-4 text-sm text-rose-900">
          <h3 className="text-sm font-semibold">{labels.selfLoveConnection}</h3>
          <p className="mt-2">{dashboard.self_love_connection.principle}</p>
          {dashboard.self_love_connection.practices && dashboard.self_love_connection.practices.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs">
              {dashboard.self_love_connection.practices.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {dashboard.trust_connection?.principle ? (
        <section className="rounded-lg border border-gray-200 p-4 text-sm">
          <h3 className="text-sm font-semibold">{labels.trustConnection}</h3>
          <p className="mt-2 text-gray-700">{dashboard.trust_connection.principle}</p>
          {dashboard.trust_connection.users_should_know &&
          dashboard.trust_connection.users_should_know.length > 0 ? (
            <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-gray-600">
              {dashboard.trust_connection.users_should_know.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {Array.isArray(dashboard.success_criteria) && dashboard.success_criteria.length > 0 ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.successCriteria}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.success_criteria.map((item) => {
              const label = typeof item.label === "string" ? item.label : String(item.key ?? "");
              const met = Boolean(item.met);
              return (
                <li key={item.key ?? label} className="flex items-start gap-2">
                  <span className={met ? "text-emerald-600" : "text-gray-400"}>{met ? "✓" : "○"}</span>
                  <span>
                    {label}
                    {item.note ? <span className="block text-xs text-gray-500">{item.note}</span> : null}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {dashboard.vision_phrases && dashboard.vision_phrases.length > 0 ? (
        <section className="rounded-lg border border-indigo-100 bg-indigo-50/30 p-4">
          <h3 className="text-sm font-semibold">{labels.visionPhrases}</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-indigo-900">
            {dashboard.vision_phrases.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.pendingNudges}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.pending_nudges ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.snoozedNudges}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.snoozed_nudges ?? 0)}</p>
        </div>
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="text-xs uppercase text-gray-500">{labels.dismissedToday}</p>
          <p className="mt-1 text-2xl font-semibold">{String(summary.dismissed_today ?? 0)}</p>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.assistanceCategories}</h3>
        <ul className="mt-3 space-y-2">
          {categories.map((cat) => (
            <li key={String(cat.key)} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm">
              <span className="font-medium">{cat.label}</span>
              {cat.description ? <p className="mt-1 text-xs text-gray-600">{cat.description}</p> : null}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.activeNudges}</h3>
        {nudges.length === 0 ? (
          <p className="mt-2 text-sm text-gray-600">{labels.noNudges}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {nudges.map((nudge) => (
              <NudgeRow
                key={nudge.id}
                nudge={nudge}
                labels={labels}
                onDismiss={(id) => void nudgeAction(id, "dismiss")}
                onSnooze={(id) => void nudgeAction(id, "snooze")}
                busy={busyId === nudge.id}
                canDismiss={canDismiss}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.companionStyle}</h3>
        <ul className="mt-3 space-y-2">
          {styleExamples.map((ex, i) => (
            <li key={`${ex.style}-${i}`} className="text-sm text-gray-700">
              <span className="font-medium capitalize">{ex.style}:</span> {ex.example}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold">{labels.boundaries}</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-700">
          {boundaries.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      {canManagePrefs ? (
        <section className="rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold">{labels.preferences}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block text-xs text-gray-500">{labels.frequency}</span>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5"
              >
                <option value="low">{labels.frequencyLow}</option>
                <option value="normal">{labels.frequencyNormal}</option>
                <option value="high">{labels.frequencyHigh}</option>
              </select>
            </label>
            <label className="text-sm">
              <span className="block text-xs text-gray-500">{labels.communicationStyle}</span>
              <select
                value={communicationStyle}
                onChange={(e) => setCommunicationStyle(e.target.value)}
                className="mt-1 w-full rounded border border-gray-200 px-2 py-1.5"
              >
                <option value="supportive">{labels.styleSupportive}</option>
                <option value="balanced">{labels.styleBalanced}</option>
                <option value="minimal">{labels.styleMinimal}</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            disabled={savingPrefs}
            onClick={() => void savePreferences()}
            className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {savingPrefs ? labels.saving : labels.savePreferences}
          </button>
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
        </div>
      </section>

      <button
        type="button"
        disabled={exporting}
        onClick={() => void exportSummary()}
        className="rounded-lg border border-gray-200 px-4 py-2 text-sm disabled:opacity-50"
      >
        {exporting ? labels.exporting : labels.exportSummary}
      </button>
    </div>
  );
}
