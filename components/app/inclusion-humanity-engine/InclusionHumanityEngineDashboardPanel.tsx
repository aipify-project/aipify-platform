"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parseInclusionHumanityEngineDashboard,
  type InclusionHumanityEngineDashboard,
  type InclusionPrinciple,
  type InclusionReflection,
  type InappropriateBehaviorGuidance,
} from "@/lib/aipify/inclusion-humanity-engine";

type Props = { labels: Record<string, string> };

function ReflectionRow({
  reflection,
  labels,
  onAcknowledge,
  onDismiss,
  busy,
  canManage,
}: {
  reflection: InclusionReflection;
  labels: Record<string, string>;
  onAcknowledge: (id: string) => void;
  onDismiss: (id: string) => void;
  busy: boolean;
  canManage: boolean;
}) {
  if (!reflection.id) return null;
  const suggested = reflection.suggested_response ?? {};
  const phrases = Array.isArray(suggested.phrases) ? suggested.phrases : [];
  return (
    <li className="rounded-lg border border-gray-100 bg-white px-3 py-2 text-sm">
      <p className="font-medium text-gray-900">{reflection.prompt}</p>
      {reflection.context_summary ? (
        <p className="mt-1 text-xs text-gray-600">{reflection.context_summary}</p>
      ) : null}
      {phrases.length > 0 ? (
        <ul className="mt-2 list-inside list-disc text-xs text-gray-600">
          {phrases.map((p, i) => (
            <li key={i}>{String(p)}</li>
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

export function InclusionHumanityEngineDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<InclusionHumanityEngineDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [deEscalationEnabled, setDeEscalationEnabled] = useState(true);
  const [boundaryFirmness, setBoundaryFirmness] = useState("balanced");
  const [celebrateWins, setCelebrateWins] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/inclusion-humanity-engine/dashboard");
    if (res.ok) {
      const parsed = parseInclusionHumanityEngineDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.de_escalation_enabled === "boolean") {
        setDeEscalationEnabled(parsed.settings.de_escalation_enabled);
      }
      if (typeof parsed.settings?.boundary_firmness === "string") {
        setBoundaryFirmness(parsed.settings.boundary_firmness);
      }
      if (typeof parsed.settings?.celebrate_inclusive_wins === "boolean") {
        setCelebrateWins(parsed.settings.celebrate_inclusive_wins);
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
    const res = await fetch("/api/aipify/inclusion-humanity-engine/reflections", {
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
    const res = await fetch("/api/aipify/inclusion-humanity-engine/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        de_escalation_enabled: deEscalationEnabled,
        boundary_firmness: boundaryFirmness,
        celebrate_inclusive_wins: celebrateWins,
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
    const res = await fetch("/api/aipify/inclusion-humanity-engine/export", {
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
  const canManageSettings = Boolean(permissions.can_manage_settings);
  const canExport = Boolean(permissions.can_export);
  const statedPrinciples = dashboard.stated_principles ?? [];
  const pendingReflections = dashboard.pending_reflections ?? [];
  const integrationLinks = dashboard.integration_links ?? {};
  const incidentsSummary = dashboard.recent_incidents_summary ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-teal-200 bg-teal-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-teal-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs text-teal-700">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs text-teal-700">{dashboard.vision}</p> : null}
        <p className="mt-2 text-xs text-teal-700">{dashboard.distinction_note ?? labels.distinctionNote}</p>
      </section>

      {actionError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{actionError}</div>
      )}

      <div className="flex flex-wrap gap-2">
        {canExport ? (
          <button
            type="button"
            className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
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
            <dt className="text-gray-500">{labels.activePrinciples}</dt>
            <dd>{String(summary.active_principles ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.pendingReflections}</dt>
            <dd>{String(summary.pending_reflections ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.incidents30Days}</dt>
            <dd>{String(summary.incidents_30_days ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.deEscalationEnabled}</dt>
            <dd>{summary.de_escalation_enabled ? labels.yes : labels.no}</dd>
          </div>
        </dl>
      </section>

      {canManageSettings ? (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.inclusionSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={deEscalationEnabled}
                onChange={(e) => setDeEscalationEnabled(e.target.checked)}
              />
              {labels.deEscalationToggle}
            </label>
            <div>
              <label className="text-xs font-medium text-gray-600" htmlFor="boundary-firmness">
                {labels.boundaryFirmness}
              </label>
              <select
                id="boundary-firmness"
                className="mt-1 block rounded border border-gray-200 px-3 py-2 text-sm"
                value={boundaryFirmness}
                onChange={(e) => setBoundaryFirmness(e.target.value)}
              >
                <option value="gentle">{labels.firmnessGentle}</option>
                <option value="balanced">{labels.firmnessBalanced}</option>
                <option value="firm">{labels.firmnessFirm}</option>
              </select>
            </div>
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
              className="rounded border border-teal-300 px-3 py-1 text-xs text-teal-800 disabled:opacity-50"
            >
              {savingSettings ? labels.saving : labels.saveSettings}
            </button>
          </div>
        </section>
      ) : null}

      {dashboard.communication_principles && dashboard.communication_principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communicationPrinciples}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.communication_principles.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {statedPrinciples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.statedPrinciples}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(statedPrinciples as InclusionPrinciple[]).map((p) => (
              <li key={p.id ?? p.principle_key} className="rounded border border-teal-100 bg-teal-50/30 p-3">
                <div className="font-medium">{p.label}</div>
                <div className="mt-1 text-xs text-gray-600">{p.description}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.inappropriate_behavior_guidance &&
        dashboard.inappropriate_behavior_guidance.length > 0 && (
          <section className="rounded-lg border border-gray-200 p-4">
            <h3 className="text-sm font-semibold">{labels.inappropriateBehavior}</h3>
            <ul className="mt-3 space-y-3 text-sm">
              {(dashboard.inappropriate_behavior_guidance as InappropriateBehaviorGuidance[]).map(
                (g, i) => (
                  <li key={i} className="rounded border border-gray-100 p-3">
                    <p className="font-medium">{g.situation}</p>
                    {g.guidance ? <p className="mt-1 text-xs text-gray-600">{g.guidance}</p> : null}
                    {Array.isArray(g.example_phrases) && g.example_phrases.length > 0 ? (
                      <ul className="mt-2 list-inside list-disc text-xs text-gray-500">
                        {g.example_phrases.map((phrase, j) => (
                          <li key={j}>{String(phrase)}</li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                )
              )}
            </ul>
          </section>
        )}

      {dashboard.boundary_principles && dashboard.boundary_principles.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaryPrinciples}</h3>
          <ul className="mt-2 list-inside list-disc text-sm text-gray-700">
            {dashboard.boundary_principles.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </section>
      )}

      {pendingReflections.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.reflections}</h3>
          <ul className="mt-3 space-y-2">
            {(pendingReflections as InclusionReflection[]).map((r) => (
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

      {incidentsSummary.total_30_days != null && Number(incidentsSummary.total_30_days) > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.incidentsSummary}</h3>
          <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-gray-500">{labels.incidents30Days}</dt>
              <dd>{String(incidentsSummary.total_30_days)}</dd>
            </div>
            {incidentsSummary.de_escalated_count != null ? (
              <div>
                <dt className="text-gray-500">{labels.deEscalatedCount}</dt>
                <dd>{String(incidentsSummary.de_escalated_count)}</dd>
              </div>
            ) : null}
          </dl>
        </section>
      )}

      {dashboard.kc_faq_topics && dashboard.kc_faq_topics.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.kcFaqTopics}</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {dashboard.kc_faq_topics.map((topic, i) => (
              <li key={i} className="rounded border border-gray-100 p-2">
                <p className="font-medium">{topic.topic}</p>
                {topic.summary ? <p className="mt-1 text-xs text-gray-600">{topic.summary}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.self_love_note || dashboard.trust_engine_note || dashboard.purpose_values_note) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {dashboard.self_love_note ? <p className="mt-1">{dashboard.self_love_note}</p> : null}
          {dashboard.trust_engine_note ? <p className="mt-2">{dashboard.trust_engine_note}</p> : null}
          {dashboard.purpose_values_note ? <p className="mt-2">{dashboard.purpose_values_note}</p> : null}
        </section>
      )}

      {Object.keys(integrationLinks).length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.integrationLinks}</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-xs">
            {Object.entries(integrationLinks).map(([key, href]) =>
              typeof href === "string" ? (
                <li key={key}>
                  <Link href={href} className="text-teal-700 underline">
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
