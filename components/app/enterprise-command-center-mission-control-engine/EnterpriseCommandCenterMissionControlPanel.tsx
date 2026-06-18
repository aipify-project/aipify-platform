"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { formatOverviewMetric } from "@/lib/ui/overview-metrics";
import {
  parseEnterpriseCommandCenterMissionControl,
  type EnterpriseCommandCenterMissionControl,
} from "@/lib/aipify/enterprise-command-center-mission-control-engine";

type Props = { labels: Record<string, string> };

function metricValue(obj: unknown, key: string): string | number {
  if (typeof obj === "object" && obj && key in (obj as Record<string, unknown>)) {
    const v = (obj as Record<string, unknown>)[key];
    if (typeof v === "number" || typeof v === "string") return v;
  }
  return "—";
}

export function EnterpriseCommandCenterMissionControlPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseCommandCenterMissionControl | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-command-center-mission-control-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseCommandCenterMissionControl(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.loadFailed);
    }
    setLoading(false);
  }, [labels.loadFailed]);

  useEffect(() => {
    void load();
  }, [load]);

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-command-center-mission-control-engine/actions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ...extra }),
    });
    if (!res.ok) {
      const body = (await res.json()) as { error?: string };
      setActionError(body.error ?? labels.actionFailed);
    } else {
      await load();
    }
    setActing(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <AipifyLoader centered />
        <span className="sr-only">{labels.loading}</span>
      </div>
    );
  }

  if (!center?.found || !center.has_access) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
        <p className="font-medium">{labels.accessRequiredTitle}</p>
        <p className="mt-2 text-sm">{center?.error ?? labels.accessRequiredBody}</p>
      </div>
    );
  }

  const overview = center.overview ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-950 via-indigo-900 to-slate-900 p-6 text-white shadow-lg">
        <h2 className="text-lg font-semibold">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-indigo-100">{center.philosophy}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            [labels.metricOrgHealth, formatOverviewMetric(overview.organization_health)],
            [labels.metricCommandHealth, formatOverviewMetric(overview.command_health_score)],
            [labels.metricRevenue, `${metricValue(overview.revenue, "growth_percent")}%`],
            [labels.metricWorkforce, metricValue(overview.workforce, "utilization")],
            [labels.metricCustomers, metricValue(overview.customers, "health_score")],
            [labels.metricProjects, metricValue(overview.projects, "active")],
            [labels.metricOperations, metricValue(overview.operations, "active")],
            [labels.metricRisks, metricValue(overview.risks, "open")],
            [labels.metricOpportunities, metricValue(overview.opportunities, "identified")],
            [labels.metricPriorities, formatOverviewMetric(overview.strategic_priorities)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-200">{label}</p>
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.operationsTitle}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_briefing", { briefing_period: "today" })}
            className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {acting ? labels.acting : labels.generateBriefing}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("refresh_health_scores")}
            className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50"
          >
            {labels.refreshHealth}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("acknowledge_attention")}
            className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50"
          >
            {labels.acknowledgeAttention}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_recommendation")}
            className="rounded-lg border border-indigo-200 px-4 py-2 text-sm font-medium text-indigo-800 disabled:opacity-50"
          >
            {labels.generateRecommendation}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.commandModulesTitle}</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {center.command_modules?.map((mod) => (
            <Link
              key={mod.id ?? mod.module_key}
              href={mod.route_path ?? "#"}
              id={mod.module_type ? `${mod.module_type}` : undefined}
              className="rounded-lg border border-gray-100 p-4 transition hover:border-indigo-200 hover:shadow-sm"
            >
              <p className="font-medium text-gray-900">{mod.module_name}</p>
              <p className="text-xs uppercase text-gray-500">{mod.module_type}</p>
              <p className="mt-2 text-sm text-gray-600">
                {labels.healthLabel}: {mod.health_score}%
              </p>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.healthScoresTitle}</h2>
          <ul className="mt-4 space-y-2">
            {center.health_scores?.map((h) => (
              <li key={h.id ?? h.score_key} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <span className="capitalize text-gray-700">{h.score_domain}</span>
                <span className="font-medium text-gray-900">
                  {h.score_value}% · {h.trend_direction}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.attentionTitle}</h2>
          {center.attention_items?.length ? (
            <ul className="mt-4 space-y-3">
              {center.attention_items.map((item) => (
                <li key={item.id ?? item.item_key} className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <p className="font-medium text-gray-900">{item.item_title}</p>
                  <p className="text-xs uppercase text-amber-700">
                    {item.attention_type} · {item.priority}
                  </p>
                  {item.recommendation ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {labels.recommendation}: {item.recommendation}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noAttention}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.missionFeedTitle}</h2>
          {center.mission_feed?.length ? (
            <ul className="mt-4 space-y-3">
              {center.mission_feed.map((event) => (
                <li key={event.id ?? event.event_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{event.event_title}</p>
                  <p className="text-xs uppercase text-gray-500">
                    {event.event_type} · {event.severity}
                  </p>
                  {event.event_summary ? <p className="mt-1 text-sm text-gray-600">{event.event_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noFeed}</p>
          )}
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.briefingsTitle}</h2>
          {center.briefings?.length ? (
            <ul className="mt-4 space-y-3">
              {center.briefings.map((b) => (
                <li key={b.id ?? b.briefing_key} className="rounded-lg border border-gray-100 p-3">
                  <p className="font-medium text-gray-900">{b.briefing_title}</p>
                  <p className="text-xs uppercase text-gray-500">{b.briefing_period}</p>
                  {b.executive_summary ? <p className="mt-1 text-sm text-gray-600">{b.executive_summary}</p> : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-gray-500">{labels.noBriefings}</p>
          )}
        </section>
      </div>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
        {center.intelligence_signals?.length ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {center.intelligence_signals.map((s) => (
              <li key={s.id ?? s.observation} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{s.observation}</p>
                {s.recommendation ? (
                  <p className="mt-1 text-sm text-gray-600">
                    {labels.recommendation}: {s.recommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noIntelligence}</p>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.advisorTitle}</h2>
        {center.advisor_signals?.length ? (
          <ul className="mt-4 space-y-4">
            {center.advisor_signals.map((s) => (
              <li key={s.id ?? s.observation} className="rounded-lg border border-indigo-50 bg-indigo-50/50 p-4">
                <p className="font-medium text-gray-900">{s.observation}</p>
                {s.impact ? <p className="mt-1 text-sm text-gray-600">{s.impact}</p> : null}
                {s.recommendation ? (
                  <p className="mt-2 text-sm font-medium text-indigo-900">
                    {labels.recommendation}: {s.recommendation}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
        )}
        <p className="mt-4 text-sm text-gray-500">{center.privacy_note}</p>
      </section>
    </div>
  );
}
