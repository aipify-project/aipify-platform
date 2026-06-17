"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ORCHESTRATION_CORE_PRINCIPLE,
  ORCHESTRATION_RESPONSE_PRINCIPLE,
  ORCHESTRATION_VISION,
  parseCompanionOrchestrationCenter,
  parseOrchestrationResult,
  type CompanionOrchestrationCenter,
  type OrchestrationResult,
} from "@/lib/companion-orchestration";

type PanelLabels = {
  title: string;
  subtitle: string;
  loading: string;
  corePrinciple: string;
  visionTitle: string;
  responsePrincipleTitle: string;
  healthTitle: string;
  registryTitle: string;
  eventsTitle: string;
  conflictsTitle: string;
  settingsTitle: string;
  testTitle: string;
  testPlaceholder: string;
  testSubmit: string;
  testResponseLabel: string;
  orchestrationEnabled: string;
  sensitivity: string;
  notificationLevel: string;
  saveSettings: string;
  activeCompanions: string;
  events30d: string;
  conflictsResolved: string;
  avgEffectiveness: string;
  avgAcceptance: string;
  multiCompanionEvents: string;
  priority: string;
  status: string;
  usage: string;
  effectiveness: string;
  acceptance: string;
  enabled: string;
  disabled: string;
  capabilitiesActivated: string;
  conflictDetected: string;
  privacyNote: string;
  actionMemoryLink: string;
  lifeEventsLink: string;
  companionActionsLink: string;
  sensitivityLevels: Record<string, string>;
  notificationLevels: Record<string, string>;
  priorityLevels: Record<string, string>;
};

type CompanionOrchestrationPanelProps = {
  labels: PanelLabels;
};

const EXAMPLE_REQUESTS = [
  "Help me prepare for my trip.",
  "My wife's birthday is next week and we leave for Italy the day after.",
  "I feel overwhelmed.",
];

export function CompanionOrchestrationPanel({ labels }: CompanionOrchestrationPanelProps) {
  const [center, setCenter] = useState<CompanionOrchestrationCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [testRequest, setTestRequest] = useState("");
  const [testResult, setTestResult] = useState<OrchestrationResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [orchestrationEnabled, setOrchestrationEnabled] = useState(true);
  const [sensitivity, setSensitivity] = useState("balanced");
  const [notificationLevel, setNotificationLevel] = useState("important");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/companion-orchestration/center");
    if (res.ok) {
      const parsed = parseCompanionOrchestrationCenter(await res.json());
      setCenter(parsed);
      if (parsed.settings) {
        setOrchestrationEnabled(parsed.settings.orchestration_enabled);
        setSensitivity(String(parsed.settings.sensitivity));
        setNotificationLevel(String(parsed.settings.notification_level));
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const postAction = async (payload: Record<string, unknown>) => {
    const res = await fetch("/api/companion-orchestration/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = (await res.json()) as { error?: string };
      throw new Error(err.error ?? "Request failed");
    }
    return res.json();
  };

  const runTest = async (request: string) => {
    setTesting(true);
    setTestRequest(request);
    try {
      const data = await postAction({ action: "orchestrate", request });
      setTestResult(parseOrchestrationResult(data));
      await load();
    } catch {
      setTestResult(null);
    } finally {
      setTesting(false);
    }
  };

  const saveSettings = async () => {
    await postAction({
      action: "update_settings",
      orchestration_enabled: orchestrationEnabled,
      sensitivity,
      notification_level: notificationLevel,
    });
    await load();
  };

  const toggleCompanion = async (companionKey: string, currentStatus: string) => {
    await postAction({
      action: "update_registry",
      companion_key: companionKey,
      status: currentStatus === "enabled" ? "disabled" : "enabled",
    });
    await load();
  };

  if (loading) return <p className="p-6 text-sm text-gray-500">{labels.loading}</p>;

  const metrics = center?.health_metrics;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap gap-3 text-sm">
        {center?.links?.action_memory && (
          <Link href={center.links.action_memory} className="text-fuchsia-600 hover:underline">
            {labels.actionMemoryLink}
          </Link>
        )}
        {center?.links?.life_events && (
          <Link href={center.links.life_events} className="text-fuchsia-600 hover:underline">
            {labels.lifeEventsLink}
          </Link>
        )}
        <Link href="/app/companion/actions" className="text-fuchsia-600 hover:underline">
          {labels.companionActionsLink}
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        <p className="mt-3 rounded-xl border border-fuchsia-100 bg-fuchsia-50 px-4 py-3 text-sm text-fuchsia-900">
          {labels.corePrinciple}: {ORCHESTRATION_CORE_PRINCIPLE}
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {labels.visionTitle}: {ORCHESTRATION_VISION}
        </p>
        <p className="mt-1 text-sm text-gray-600">
          {labels.responsePrincipleTitle}: {ORCHESTRATION_RESPONSE_PRINCIPLE}
        </p>
      </div>

      {metrics && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.healthTitle}</h2>
          <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Metric label={labels.activeCompanions} value={metrics.active_companions} />
            <Metric label={labels.events30d} value={metrics.orchestration_events_30d} />
            <Metric label={labels.conflictsResolved} value={metrics.conflicts_resolved} />
            <Metric label={labels.avgEffectiveness} value={`${metrics.avg_effectiveness}%`} />
            <Metric label={labels.avgAcceptance} value={`${metrics.avg_acceptance_rate}%`} />
            <Metric label={labels.multiCompanionEvents} value={metrics.multi_companion_events} />
          </dl>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.testTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{labels.responsePrincipleTitle}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {EXAMPLE_REQUESTS.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => void runTest(example)}
              disabled={testing || !center?.can_record}
              className="rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1.5 text-xs text-fuchsia-900 hover:bg-fuchsia-100 disabled:opacity-50"
            >
              {example}
            </button>
          ))}
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (testRequest.trim()) void runTest(testRequest.trim());
          }}
        >
          <input
            value={testRequest}
            onChange={(e) => setTestRequest(e.target.value)}
            placeholder={labels.testPlaceholder}
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
            disabled={!center?.can_record}
          />
          <button
            type="submit"
            disabled={testing || !center?.can_record || !testRequest.trim()}
            className="rounded-lg bg-fuchsia-700 px-4 py-2 text-sm font-medium text-white hover:bg-fuchsia-800 disabled:opacity-50"
          >
            {labels.testSubmit}
          </button>
        </form>
        {testResult && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">
              {labels.testResponseLabel}
            </p>
            <p className="mt-2 text-sm text-emerald-950">{testResult.coordinated_response}</p>
            {testResult.conflict_detected && testResult.conflict_resolution && (
              <p className="mt-2 text-sm text-amber-900">
                {labels.conflictDetected}: {testResult.conflict_resolution}
              </p>
            )}
            {testResult.activated_companion_keys.length > 0 && (
              <p className="mt-2 text-xs text-gray-600">
                {labels.capabilitiesActivated}: {testResult.activated_companion_keys.length}
              </p>
            )}
          </div>
        )}
      </section>

      {center?.can_manage && (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.settingsTitle}</h2>
          <div className="mt-4 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={orchestrationEnabled}
                onChange={(e) => setOrchestrationEnabled(e.target.checked)}
              />
              {labels.orchestrationEnabled}
            </label>
            <label className="block text-sm">
              {labels.sensitivity}
              <select
                value={sensitivity}
                onChange={(e) => setSensitivity(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2"
              >
                {Object.entries(labels.sensitivityLevels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              {labels.notificationLevel}
              <select
                value={notificationLevel}
                onChange={(e) => setNotificationLevel(e.target.value)}
                className="mt-1 block w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2"
              >
                {Object.entries(labels.notificationLevels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              onClick={() => void saveSettings()}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              {labels.saveSettings}
            </button>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.registryTitle}</h2>
        <div className="mt-4 space-y-3">
          {center?.registry.map((entry) => (
            <div
              key={entry.companion_key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/80 px-4 py-3"
            >
              <div>
                <p className="font-medium text-gray-900">{entry.display_label}</p>
                <p className="text-xs text-gray-500">
                  {labels.priority}{" "}
                  {labels.priorityLevels[String(entry.priority_level)] ?? entry.priority_level} ·{" "}
                  {labels.usage}: {entry.usage_count} · {labels.effectiveness}:{" "}
                  {Math.round(entry.effectiveness_score)}% · {labels.acceptance}:{" "}
                  {Math.round(entry.recommendation_acceptance_rate)}%
                </p>
              </div>
              {center.can_manage && (
                <button
                  type="button"
                  onClick={() => void toggleCompanion(entry.companion_key, entry.status)}
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    entry.status === "enabled"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {entry.status === "enabled" ? labels.enabled : labels.disabled}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.eventsTitle}</h2>
          <ul className="mt-4 space-y-3">
            {center?.recent_events.map((event) => (
              <li key={event.event_key} className="rounded-xl border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-900">{event.request_summary}</p>
                <p className="mt-1 text-gray-700">{event.coordinated_response}</p>
                <p className="mt-2 text-xs text-gray-500">
                  {event.activated_companion_keys.length} {labels.capabilitiesActivated.toLowerCase()}
                  {event.conflict_detected ? ` · ${labels.conflictDetected}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.conflictsTitle}</h2>
          <ul className="mt-4 space-y-3">
            {(center?.recent_conflicts.length ?? 0) === 0 ? (
              <li className="text-sm text-gray-500">—</li>
            ) : (
              center?.recent_conflicts.map((conflict) => (
                <li key={conflict.conflict_key} className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 text-sm">
                  <p className="text-gray-900">{conflict.conflict_summary}</p>
                  {conflict.resolution_message && (
                    <p className="mt-1 text-amber-900">{conflict.resolution_message}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      </section>

      {center?.privacy_note && (
        <p className="text-xs text-gray-500">
          {labels.privacyNote}: {center.privacy_note}
        </p>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</dt>
      <dd className="mt-1 text-2xl font-semibold text-gray-900">{value}</dd>
    </div>
  );
}
