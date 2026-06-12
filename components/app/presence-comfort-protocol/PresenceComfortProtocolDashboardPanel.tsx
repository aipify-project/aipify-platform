"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePresenceComfortDashboard,
  type BoundaryPhrases,
  type ComfortRoseExample,
  type ComfortRoseMoment,
  type PresenceComfortDashboard,
  type ProtocolAppliesItem,
  type SelfLoveExample,
} from "@/lib/aipify/presence-comfort-protocol";

type Props = { labels: Record<string, string> };

function momentTypeBadgeClass(momentType?: string) {
  switch (momentType) {
    case "loneliness":
      return "bg-slate-100 text-slate-800";
    case "exhaustion":
      return "bg-amber-100 text-amber-800";
    case "discouragement":
      return "bg-orange-100 text-orange-800";
    case "gratitude":
      return "bg-rose-100 text-rose-800";
    case "achievement":
      return "bg-emerald-100 text-emerald-800";
    case "vulnerability":
      return "bg-violet-100 text-violet-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

function statusBadgeClass(status?: string) {
  switch (status) {
    case "supported":
      return "bg-emerald-100 text-emerald-800";
    case "acknowledged":
      return "bg-sky-100 text-sky-800";
    case "pending":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

export function PresenceComfortProtocolDashboardPanel({ labels }: Props) {
  const [dashboard, setDashboard] = useState<PresenceComfortDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [comfortRosesEnabled, setComfortRosesEnabled] = useState(true);
  const [encourageHumanConnection, setEncourageHumanConnection] = useState(true);
  const [protocolSensitivity, setProtocolSensitivity] = useState("balanced");

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/presence-comfort-protocol/dashboard");
    if (res.ok) {
      const parsed = parsePresenceComfortDashboard(await res.json());
      setDashboard(parsed);
      if (typeof parsed.settings?.comfort_roses_enabled === "boolean") {
        setComfortRosesEnabled(parsed.settings.comfort_roses_enabled);
      }
      if (typeof parsed.settings?.encourage_human_connection === "boolean") {
        setEncourageHumanConnection(parsed.settings.encourage_human_connection);
      }
      if (typeof parsed.settings?.protocol_sensitivity === "string") {
        setProtocolSensitivity(parsed.settings.protocol_sensitivity);
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
    const res = await fetch("/api/aipify/presence-comfort-protocol/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        comfort_roses_enabled: comfortRosesEnabled,
        encourage_human_connection: encourageHumanConnection,
        protocol_sensitivity: protocolSensitivity,
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
    const res = await fetch("/api/aipify/presence-comfort-protocol/export", {
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
  const recentSummary = dashboard.recent_summary ?? {};
  const permissions = dashboard.permissions ?? {};
  const canManage = Boolean(permissions.can_manage);
  const canExport = Boolean(permissions.can_export);
  const recentMoments = dashboard.recent_moments ?? [];
  const whenApplies = dashboard.when_protocol_applies ?? [];
  const comfortRoses = dashboard.comfort_rose_examples ?? [];
  const boundaryPhrases = dashboard.boundary_phrases;
  const selfLoveExamples = dashboard.self_love_examples ?? [];
  const humanConnectionPrompts = dashboard.human_connection_prompts ?? [];
  const communicationPrinciples = dashboard.communication_principles ?? [];
  const integrationLinks = dashboard.integration_links ?? {};

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-violet-200 bg-violet-50/50 p-6">
        <h2 className="text-sm font-semibold">{labels.engineTitle}</h2>
        <p className="mt-2 text-sm">{dashboard.philosophy}</p>
        {dashboard.mission ? <p className="mt-2 text-xs text-violet-800">{dashboard.mission}</p> : null}
        {dashboard.abos_principle ? (
          <p className="mt-1 text-xs font-medium text-violet-900">{dashboard.abos_principle}</p>
        ) : null}
        {dashboard.vision ? <p className="mt-1 text-xs italic text-violet-700">{dashboard.vision}</p> : null}
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
            <dt className="text-gray-500">{labels.protocolEventCount}</dt>
            <dd>{String(summary.protocol_event_count ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.comfortRosesUsed}</dt>
            <dd>{String(recentSummary.comfort_roses_used ?? 0)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">{labels.protocolSensitivity}</dt>
            <dd className="capitalize">{String(summary.protocol_sensitivity ?? protocolSensitivity)}</dd>
          </div>
        </dl>
      </section>

      {whenApplies.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.whenProtocolApplies}</h3>
          <ul className="mt-3 space-y-3 text-sm">
            {(whenApplies as ProtocolAppliesItem[]).map((item) => (
              <li key={item.key ?? item.label} className="rounded border border-violet-100 bg-violet-50/30 p-3">
                <div className="font-medium">{item.label}</div>
                {item.description ? <p className="mt-1 text-xs text-gray-600">{item.description}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {communicationPrinciples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.communicationPrinciples}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-gray-600">
            {communicationPrinciples.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {comfortRoses.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.comfortRoseExamples}</h3>
          <p className="mt-1 text-xs text-gray-500">{labels.comfortRoseHint}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {(comfortRoses as ComfortRoseExample[]).map((rose, i) => (
              <li key={i} className="rounded border border-rose-100 bg-rose-50/40 px-3 py-2 text-xs">
                {rose.rose ? <span className="mr-1">🌹</span> : null}
                {rose.phrase}
                {rose.intent ? (
                  <span className="ml-2 text-gray-500">({rose.intent.replace(/_/g, " ")})</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      {boundaryPhrases && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.boundaryPhrases}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-xs">
            <div>
              <h4 className="font-semibold text-red-700">{labels.avoidPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).avoid ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-emerald-700">{labels.preferPhrases}</h4>
              <ul className="mt-2 list-inside list-disc text-gray-600">
                {((boundaryPhrases as BoundaryPhrases).prefer ?? []).map((p, i) => (
                  <li key={i}>{String(p)}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      )}

      {selfLoveExamples.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.selfLoveExamples}</h3>
          <ul className="mt-3 space-y-2 text-xs text-gray-600">
            {(selfLoveExamples as SelfLoveExample[]).map((item, i) => (
              <li key={i}>
                <span className="font-medium capitalize">{item.theme?.replace(/_/g, " ")}: </span>
                {item.example}
              </li>
            ))}
          </ul>
        </section>
      )}

      {humanConnectionPrompts.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.humanConnectionPrompts}</h3>
          <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-gray-600">
            {humanConnectionPrompts.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>
      )}

      {dashboard.gratitude_recognition_note && (
        <section className="rounded-lg border border-rose-100 bg-rose-50/30 p-4 text-xs text-gray-700">
          <h4 className="font-semibold text-rose-800">{labels.gratitudeRecognitionNote}</h4>
          <p className="mt-1">{dashboard.gratitude_recognition_note}</p>
        </section>
      )}

      {recentMoments.length > 0 && (
        <section className="rounded-lg border border-gray-200 p-4">
          <h3 className="text-sm font-semibold">{labels.recentMoments}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {(recentMoments as ComfortRoseMoment[]).map((moment) => (
              <li key={moment.id} className="rounded border border-gray-100 p-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${momentTypeBadgeClass(moment.moment_type)}`}
                  >
                    {moment.moment_type?.replace(/_/g, " ")}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs capitalize ${statusBadgeClass(moment.status)}`}
                  >
                    {moment.status}
                  </span>
                  {moment.rose_used ? (
                    <span className="text-xs text-rose-600">🌹 {labels.comfortRose}</span>
                  ) : null}
                </div>
                <p className="mt-1 text-xs text-gray-700">{moment.comfort_message}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dashboard.trust_note || recentSummary.protocol_events_last_30_days !== undefined) && (
        <section className="rounded-lg border border-gray-200 p-4 text-xs text-gray-600">
          {recentSummary.protocol_events_last_30_days !== undefined ? (
            <div>
              <h4 className="font-semibold text-gray-700">{labels.recentActivity}</h4>
              <p className="mt-1">
                {labels.eventsLast30Days}: {String(recentSummary.protocol_events_last_30_days ?? 0)}
                {" · "}
                {labels.humanConnectionRedirects}: {String(recentSummary.human_connection_redirects ?? 0)}
              </p>
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
          <h3 className="text-sm font-semibold">{labels.protocolSettings}</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={comfortRosesEnabled}
                onChange={(e) => setComfortRosesEnabled(e.target.checked)}
              />
              {labels.comfortRosesToggle}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={encourageHumanConnection}
                onChange={(e) => setEncourageHumanConnection(e.target.checked)}
              />
              {labels.encourageHumanConnectionToggle}
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span>{labels.protocolSensitivity}</span>
              <select
                value={protocolSensitivity}
                onChange={(e) => setProtocolSensitivity(e.target.value)}
                className="rounded border border-gray-200 px-2 py-1 text-sm"
              >
                <option value="balanced">{labels.sensitivityBalanced}</option>
                <option value="gentle">{labels.sensitivityGentle}</option>
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
