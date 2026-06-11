"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { parseBusinessPulseCenter, type BusinessPulseCenter, type PulseAlert } from "@/lib/aipify/business-pulse";

type BusinessPulsePanelProps = {
  executiveReport?: boolean;
  labels: {
    title: string;
    subtitle: string;
    loading: string;
    back: string;
    youControl: string;
    privacy: string;
    upgradeTitle: string;
    upgradeBody: string;
    upgradeCta: string;
    recalculate: string;
    executiveReport: string;
    viewExecutiveReport: string;
    sections: {
      today: string;
      changed: string;
      attention: string;
      normal: string;
      focus: string;
      alerts: string;
      history: string;
      sources: string;
    };
    statuses: Record<string, string>;
    areas: Record<string, string>;
    severities: Record<string, string>;
    actions: {
      acknowledge: string;
      dismiss: string;
    };
    emptyAlerts: string;
    emptyHistory: string;
  };
};

const STATUS_STYLES: Record<string, string> = {
  normal: "bg-emerald-50 text-emerald-800 border-emerald-100",
  worth_reviewing: "bg-sky-50 text-sky-800 border-sky-100",
  needs_attention: "bg-amber-50 text-amber-900 border-amber-100",
  requires_action: "bg-orange-50 text-orange-900 border-orange-100",
};

const SEVERITY_STYLES: Record<string, string> = {
  info: "bg-gray-100 text-gray-700",
  review: "bg-sky-100 text-sky-800",
  attention: "bg-amber-100 text-amber-900",
  action_required: "bg-orange-100 text-orange-900",
};

export function BusinessPulsePanel({ executiveReport = false, labels }: BusinessPulsePanelProps) {
  const [center, setCenter] = useState<BusinessPulseCenter | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/aipify/business-pulse");
    if (res.ok) setCenter(parseBusinessPulseCenter(await res.json()));
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function recalculate() {
    await fetch("/api/aipify/business-pulse/recalculate", { method: "POST" });
    void refresh();
  }

  async function acknowledgeAlert(id: string) {
    await fetch(`/api/aipify/business-pulse/alerts/${id}/acknowledge`, { method: "POST" });
    void refresh();
  }

  async function dismissAlert(id: string) {
    await fetch(`/api/aipify/business-pulse/alerts/${id}/dismiss`, { method: "POST" });
    void refresh();
  }

  if (loading) return <p className="text-sm text-gray-500">{labels.loading}</p>;

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

  const alerts = center.alerts ?? [];
  const areas = center.areas ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href={executiveReport ? "/app/business-pulse" : "/app"} className="text-sm text-indigo-600 hover:underline">
            {labels.back}
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-gray-900">
            {executiveReport ? labels.executiveReport : labels.title}
          </h1>
          <p className="mt-1 text-sm text-gray-600">{labels.subtitle}</p>
        </div>
        <div className="flex gap-2">
          {!executiveReport && center.enterprise_features ? (
            <Link
              href="/app/business-pulse/executive-report"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {labels.viewExecutiveReport}
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => void recalculate()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            {labels.recalculate}
          </button>
        </div>
      </div>

      <p className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-900">
        {labels.youControl}
      </p>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.today}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-sm font-medium ${STATUS_STYLES[center.overall_status ?? "normal"]}`}
          >
            {labels.statuses[center.overall_status ?? "normal"]}
          </span>
          <p className="text-sm text-gray-700">{center.briefing}</p>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <div key={area.area} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{labels.areas[area.area] ?? area.area}</h3>
              <span
                className={`rounded-full border px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[area.status]}`}
              >
                {labels.statuses[area.status]}
              </span>
            </div>
            {area.summary ? <p className="mt-2 text-sm text-gray-600">{area.summary}</p> : null}
          </div>
        ))}
      </div>

      {(center.since_yesterday?.length || center.since_last_week?.length) ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.changed}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {(center.since_yesterday ?? []).map((item, i) => (
              <li key={`y-${i}`}>
                · {typeof item === "string" ? item : formatAnomaly(item)}
              </li>
            ))}
            {(center.since_last_week ?? []).map((item, i) => (
              <li key={`w-${i}`}>
                · {typeof item === "string" ? item : formatAnomaly(item)}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {(center.recommended_focus?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.focus}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {center.recommended_focus!.map((item, i) => (
              <li key={i}>· {typeof item === "string" ? item : JSON.stringify(item)}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.attention}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {(center.attention_areas ?? []).length > 0 ? (
              center.attention_areas!.map((a) => (
                <li key={a}>· {labels.areas[a] ?? a}</li>
              ))
            ) : (
              <li className="text-gray-500">—</li>
            )}
          </ul>
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.normal}</h2>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {(center.normal_areas ?? []).length > 0 ? (
              center.normal_areas!.map((a) => (
                <li key={a}>· {labels.areas[a] ?? a}</li>
              ))
            ) : (
              <li className="text-gray-500">—</li>
            )}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.alerts}</h2>
        {alerts.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyAlerts}</p>
        ) : (
          <ul className="mt-3 space-y-3">
            {alerts.map((alert: PulseAlert) => (
              <li key={alert.id} className="rounded-xl border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.description}</p>
                    {alert.recommendation_text ? (
                      <p className="mt-1 text-sm text-gray-500">{alert.recommendation_text}</p>
                    ) : null}
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${SEVERITY_STYLES[alert.severity]}`}>
                    {labels.severities[alert.severity]}
                  </span>
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => void acknowledgeAlert(alert.id)}
                    className="text-sm text-indigo-600 hover:underline"
                  >
                    {labels.actions.acknowledge}
                  </button>
                  <button
                    type="button"
                    onClick={() => void dismissAlert(alert.id)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {labels.actions.dismiss}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">{labels.sections.history}</h2>
        {(center.history ?? []).length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">{labels.emptyHistory}</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm text-gray-700">
            {center.history!.map((h) => (
              <li key={h.id} className="flex justify-between gap-4 border-b border-gray-50 pb-2">
                <span>{h.pulse_date}</span>
                <span>{labels.statuses[h.overall_status]}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {(center.data_sources?.length ?? 0) > 0 ? (
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">{labels.sections.sources}</h2>
          <ul className="mt-2 flex flex-wrap gap-2">
            {center.data_sources!.map((source) => (
              <li
                key={source}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
              >
                {source}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {center.privacy_note ? (
        <p className="text-xs text-gray-500">
          {labels.privacy}: {center.privacy_note}
        </p>
      ) : null}
    </div>
  );
}

function formatAnomaly(item: unknown): string {
  if (!item || typeof item !== "object") return String(item);
  const a = item as Record<string, unknown>;
  const metric = a.metric_name ?? "metric";
  const diff = a.difference_percent;
  if (typeof diff === "number") {
    return `${metric}: ${diff > 0 ? "+" : ""}${diff}% compared with expected`;
  }
  return String(metric);
}
