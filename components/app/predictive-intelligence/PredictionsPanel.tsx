"use client";

import { AipifyLoadingState } from "@/components/ui/aipify-loading-state";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  parsePredictionsCenter,
  type PredictionsCenter,
  type PredictiveAlert,
} from "@/lib/aipify/predictive-intelligence";

type PredictionsPanelProps = {
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    refresh: string;
    notEnabledTitle: string;
    notEnabledBody: string;
    enableCta: string;
    openAlerts: string;
    upcomingWeek: string;
    horizon: string;
    noAlerts: string;
    predictedDate: string;
    severities: Record<string, string>;
    alertTypes: Record<string, string>;
    actions: {
      acknowledge: string;
      resolve: string;
      dismiss: string;
      snooze: string;
    };
    settingsLink: string;
  };
};

const SEVERITY_STYLES: Record<string, string> = {
  critical: "bg-rose-100 text-rose-900",
  high: "bg-orange-100 text-orange-900",
  medium: "bg-amber-100 text-amber-900",
  low: "bg-sky-100 text-sky-900",
  info: "bg-gray-100 text-gray-700",
};

export function PredictionsPanel({ labels }: PredictionsPanelProps) {
  const [center, setCenter] = useState<PredictionsCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/aipify/predictions");
    if (res.ok) setCenter(parsePredictionsCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function runDetection() {
    await fetch("/api/aipify/predictions/generate", { method: "POST" });
    void refresh();
  }

  async function updateAlert(id: string, status: string) {
    await fetch(`/api/aipify/predictions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    void refresh();
  }

  if (loading) return <AipifyLoadingState message={labels.loading} centered />;
  if (!center?.has_customer) return <p className="text-sm text-gray-500">{labels.loading}</p>;

  if (center.upgrade_required || !center.has_access) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.upgradeTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.upgradeBody}</p>
          <Link
            href="/app/settings/billing"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.upgradeCta}
          </Link>
        </div>
      </div>
    );
  }

  if (center.enabled === false) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 p-6">
        <Link href="/app" className="text-sm text-indigo-600 hover:underline">
          {labels.back}
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">{labels.title}</h1>
        <p className="text-sm text-gray-600">{labels.subtitle}</p>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900">{labels.notEnabledTitle}</h2>
          <p className="mt-2 text-sm text-gray-600">{labels.notEnabledBody}</p>
          <p className="mt-3 text-xs text-gray-500">{center.privacy_note}</p>
          <Link
            href="/app/settings/predictions"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.enableCta}
          </Link>
        </div>
      </div>
    );
  }

  const alerts = center.alerts ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-indigo-600 hover:underline">
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">{labels.title}</h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
          <p className="mt-2 text-xs text-gray-500">{center.privacy_note}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void runDetection()}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.refresh}
          </button>
          <Link
            href="/app/settings/predictions"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            {labels.settingsLink}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.openAlerts}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{center.open_alerts ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.upcomingWeek}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{center.upcoming_week ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            {labels.horizon}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {center.prediction_horizon_days ?? 14}d
          </p>
        </div>
      </div>

      <section className="space-y-3">
        {alerts.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-sm text-gray-600">
            {labels.noAlerts}
          </p>
        ) : (
          alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              labels={labels}
              onAction={updateAlert}
            />
          ))
        )}
      </section>
    </div>
  );
}

function AlertCard({
  alert,
  labels,
  onAction,
}: {
  alert: PredictiveAlert;
  labels: PredictionsPanelProps["labels"];
  onAction: (id: string, status: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info}`}
        >
          {labels.severities[alert.severity] ?? alert.severity}
        </span>
        <span className="text-xs text-gray-500">
          {labels.alertTypes[alert.alert_type] ?? alert.alert_type}
        </span>
        {alert.predicted_date ? (
          <span className="text-xs text-gray-400">
            {labels.predictedDate}: {alert.predicted_date}
          </span>
        ) : null}
        <span className="text-xs text-gray-400">
          {Math.round(alert.confidence_score * 100)}% confidence
        </span>
      </div>
      <h3 className="mt-2 font-semibold text-gray-900">{alert.title}</h3>
      <p className="mt-1 text-sm text-gray-600">{alert.summary}</p>
      {alert.recommendation ? (
        <p className="mt-2 text-sm text-indigo-700">{alert.recommendation}</p>
      ) : null}
      <div className="mt-4 flex flex-wrap gap-2">
        {alert.status === "open" ? (
          <button
            type="button"
            onClick={() => onAction(alert.id, "acknowledged")}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
          >
            {labels.actions.acknowledge}
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => onAction(alert.id, "resolved")}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          {labels.actions.resolve}
        </button>
        <button
          type="button"
          onClick={() => onAction(alert.id, "snoozed")}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          {labels.actions.snooze}
        </button>
        <button
          type="button"
          onClick={() => onAction(alert.id, "dismissed")}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50"
        >
          {labels.actions.dismiss}
        </button>
      </div>
    </article>
  );
}
