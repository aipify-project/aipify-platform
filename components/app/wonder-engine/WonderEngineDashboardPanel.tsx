"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseWonderEngineDashboard,
  type WonderEngineDashboard,
  type WonderMoment,
  type WonderMomentTypeInfo,
  type WonderReflection,
  type WonderReflectionPromptExample,
} from "@/lib/aipify/wonder-engine";

type Props = { labels: Record<string, string> };

function momentBadgeClass(momentType?: string) {
  switch (momentType) {
    case "milestone":
      return "bg-violet-100 text-violet-800";
    case "challenge_overcome":
      return "bg-amber-100 text-amber-800";
    case "customer_impact":
      return "bg-sky-100 text-sky-800";
    case "team_extraordinary":
      return "bg-rose-100 text-rose-800";
    case "vision_becoming_reality":
      return "bg-emerald-100 text-emerald-800";
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
  canAcknowledge,
}: {
  reflection: WonderReflection;
  labels: Record<string, string>;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
  canAcknowledge: boolean;
}) {
  if (!reflection.id) return null;
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{reflection.prompt}</p>
      {reflection.context_summary ? (
        <p className="mt-1 text-xs text-gray-600">{reflection.context_summary}</p>
      ) : null}
      {reflection.suggested_pause_note ? (
        <p className="mt-1 text-xs italic text-violet-700">{reflection.suggested_pause_note}</p>
      ) : null}
      {canAcknowledge ? (
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => onAcknowledge(reflection.id!)}
            className="rounded border border-violet-200 px-2 py-1 text-xs text-violet-800 disabled:opacity-50"
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

export function WonderEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<WonderEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [wonderMomentsEnabled, setWonderMomentsEnabled] = useState(true);
  const [reflectionPromptsEnabled, setReflectionPromptsEnabled] = useState(true);
  const [celebrationCadence, setCelebrationCadence] = useState("normal");
  const [authenticityGuardrails, setAuthenticityGuardrails] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/wonder-engine/dashboard");
    if (res.ok) {
      const parsed = parseWonderEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.wonder_moments_enabled === "boolean") {
        setWonderMomentsEnabled(parsed.settings.wonder_moments_enabled);
      }
      if (typeof parsed.settings?.reflection_prompts_enabled === "boolean") {
        setReflectionPromptsEnabled(parsed.settings.reflection_prompts_enabled);
      }
      if (typeof parsed.settings?.celebration_cadence === "string") {
        setCelebrationCadence(parsed.settings.celebration_cadence);
      }
      if (typeof parsed.settings?.authenticity_guardrails === "boolean") {
        setAuthenticityGuardrails(parsed.settings.authenticity_guardrails);
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
    const res = await fetch("/api/aipify/wonder-engine/reflections", {
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

  async function acknowledgeMoment(momentId: string) {
    setBusyId(momentId);
    setActionError(null);
    const res = await fetch("/api/aipify/wonder-engine/moments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moment_id: momentId }),
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
    const res = await fetch("/api/aipify/wonder-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wonder_moments_enabled: wonderMomentsEnabled,
        reflection_prompts_enabled: reflectionPromptsEnabled,
        celebration_cadence: celebrationCadence,
        authenticity_guardrails: authenticityGuardrails,
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
    const res = await fetch("/api/aipify/wonder-engine/export", {
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
  const canAcknowledgeReflections = Boolean(permissions.can_acknowledge_reflections);
  const recentMoments = dashboard.recent_moments ?? [];
  const pendingReflections = dashboard.pending_reflections ?? [];
  const momentTypes = dashboard.moments_of_wonder_types ?? [];
  const promptExamples = dashboard.reflection_prompt_examples ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const boundaries = dashboard.boundaries ?? {};
  const shouldAvoid = Array.isArray(boundaries.should_avoid) ? boundaries.should_avoid : [];

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-violet-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-violet-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? (
          <p className="mt-1 text-xs italic text-violet-700">{dashboard.vision}</p>
        ) : null}
        <p className="mt-2 text-xs text-violet-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

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
            <dt className="text-gray-500">{labels.momentCount}</dt>
            <dd>{String(summary.moment_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.unacknowledgedMoments}</dt>
            <dd>{String(summary.unacknowledged_moments ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.pendingReflections}</dt>
            <dd>{String(summary.pending_reflections ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.celebrationCadence}</dt>
            <dd className="capitalize">{String(summary.celebration_cadence ?? "normal")}</dd>
          </div>
        </dl>
      </section>

      {momentTypes.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.momentsOfWonder}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(momentTypes as WonderMomentTypeInfo[]).map((mt) => (
              <li key={mt.key ?? mt.label} className="rounded border border-violet-100 bg-violet-50/30 p-3">
                <div className="font-medium">{mt.label}</div>
                {mt.description ? <p className="mt-1 text-xs text-gray-600">{mt.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {promptExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reflectionPrompts}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(promptExamples as WonderReflectionPromptExample[]).map((ex) => (
              <li key={ex.key ?? ex.prompt} className="rounded border border-gray-100 p-2">
                <p className="font-medium">{ex.prompt}</p>
                {ex.context ? <p className="mt-1 text-xs text-gray-600">{ex.context}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {recentMoments.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentMoments}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentMoments as WonderMoment[]).map((moment) => (
              <li key={moment.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${momentBadgeClass(moment.moment_type)}`}
                  >
                    {moment.moment_type?.replace(/_/g, " ")}
                  </span>
                  {moment.acknowledged ? (
                    <span className="text-xs text-emerald-700">{labels.acknowledged}</span>
                  ) : null}
                </div>
                <p className="mt-1 font-medium">{moment.title}</p>
                <p className="mt-1 text-xs text-gray-700">{moment.summary}</p>
                {moment.significance_note ? (
                  <p className="mt-1 text-xs italic text-violet-700">{moment.significance_note}</p>
                ) : null}
                {canManage && !moment.acknowledged && moment.id ? (
                  <button
                    type="button"
                    disabled={busyId === moment.id}
                    onClick={() => void acknowledgeMoment(moment.id!)}
                    className="mt-2 rounded border border-violet-200 px-2 py-1 text-xs text-violet-800 disabled:opacity-50"
                  >
                    {labels.acknowledgeMoment}
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {pendingReflections.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.pendingReflectionsTitle}</h3>
          <ul className="mt-3 space-y-2">
            {(pendingReflections as WonderReflection[]).map((reflection) => (
              <ReflectionRow
                key={reflection.id}
                reflection={reflection}
                labels={labels}
                onAcknowledge={(id) => void reflectionAction(id, "acknowledge")}
                onDismiss={(id) => void reflectionAction(id, "dismiss")}
                busy={busyId === reflection.id}
                canAcknowledge={canAcknowledgeReflections}
              />
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note ||
        dashboard.impact_note ||
        dashboard.legacy_note ||
        dashboard.companion_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.selfLoveNote}</h4>
              <p className="mt-1">{dashboard.self_love_note}</p>
            </div>
          ) : null}
          {dashboard.impact_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.impactNote}</h4>
              <p className="mt-1">{dashboard.impact_note}</p>
            </div>
          ) : null}
          {dashboard.legacy_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.legacyNote}</h4>
              <p className="mt-1">{dashboard.legacy_note}</p>
            </div>
          ) : null}
          {dashboard.companion_note ? (
            <div className="mt-3">
              <h4 className="font-semibold text-gray-700">{labels.companionNote}</h4>
              <p className="mt-1">{dashboard.companion_note}</p>
            </div>
          ) : null}
        </section>
      )}

      {shouldAvoid.length > 0 && (
        <section className="rounded-lg border border-amber-200 bg-amber-50/40 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaries}</h3>
          {boundaries.principle ? <p className="mt-1 text-xs text-amber-900">{boundaries.principle}</p> : null}
          <ul className="mt-2 list-inside list-disc text-xs text-amber-800">
            {shouldAvoid.map((item, i) => (
              <li key={i}>{String(item)}</li>
            ))}
          </ul>
        </section>
      )}

      {canManage ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.wonderSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={wonderMomentsEnabled}
                onChange={(e) => setWonderMomentsEnabled(e.target.checked)}
              />
              {labels.wonderMomentsToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={reflectionPromptsEnabled}
                onChange={(e) => setReflectionPromptsEnabled(e.target.checked)}
              />
              {labels.reflectionPromptsToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={authenticityGuardrails}
                onChange={(e) => setAuthenticityGuardrails(e.target.checked)}
              />
              {labels.authenticityGuardrails}
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.celebrationCadence}</span>
              <select
                value={celebrationCadence}
                onChange={(e) => setCelebrationCadence(e.target.value)}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
              >
                <option value="low">{labels.cadenceLow}</option>
                <option value="normal">{labels.cadenceNormal}</option>
              </select>
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
