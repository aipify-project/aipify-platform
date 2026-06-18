"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseEnterpriseTrustConfidenceCenter,
  type EnterpriseTrustConfidenceCenter,
} from "@/lib/aipify/enterprise-trust-reputation-confidence-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "healthy":
    case "strong":
    case "resolved":
    case "achieved":
    case "published":
    case "positive":
    case "improving":
      return "bg-emerald-100 text-emerald-800";
    case "review":
    case "stable":
    case "investigating":
    case "moderate":
    case "neutral":
      return "bg-amber-100 text-amber-800";
    case "degraded":
    case "weak":
    case "open":
    case "critical":
    case "high":
    case "negative":
    case "declining":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function EnterpriseTrustConfidenceDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<EnterpriseTrustConfidenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/enterprise-trust-reputation-confidence-engine/dashboard");
    if (res.ok) {
      setCenter(parseEnterpriseTrustConfidenceCenter(await res.json()));
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
    const res = await fetch("/api/aipify/enterprise-trust-reputation-confidence-engine/actions", {
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
        <AipifyLoader label={labels.loading} centered />
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
  const exec = center.executive_dashboard ?? {};

  return (
    <div className="space-y-6">
      {actionError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{actionError}</div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-blue-50/40 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricTrust, metricValue(overview.trust_score)],
            [labels.metricReliability, metricValue(overview.reliability_score)],
            [labels.metricAvailability, metricValue(overview.platform_availability)],
            [labels.metricConfidence, metricValue(overview.customer_confidence)],
            [labels.metricServiceQuality, metricValue(overview.service_quality)],
            [labels.metricTransparency, metricValue(overview.transparency_score)],
            [labels.metricHealth, metricValue(overview.trust_health_score)],
            [labels.metricMilestones, metricValue(overview.milestones_achieved)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.trust_engine_route ? (
            <Link href={center.trust_engine_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openTrustEngine}
            </Link>
          ) : null}
          {center.license_route ? (
            <Link href={center.license_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openLicense}
            </Link>
          ) : null}
          {center.security_settings_route ? (
            <Link href={center.security_settings_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openSecurity}
            </Link>
          ) : null}
          {center.platform_excellence_route ? (
            <Link href={center.platform_excellence_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openExcellence}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="reliability" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.reliabilityTitle}</h2>
        {center.reliability_metrics?.length ? (
          <ul className="mt-4 space-y-3">
            {center.reliability_metrics.map((m) => (
              <li key={m.id ?? m.metric_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{m.metric_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(m.status)}`}>{m.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {m.metric_type} · {labels.scoreLabel} {m.score}
                </p>
                {m.summary ? <p className="mt-1 text-sm text-gray-600">{m.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noReliability}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("complete_reliability_review", { metric_key: "REL-AVAIL" })}
          className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {labels.completeReliabilityReview}
        </button>
      </section>

      <section id="transparency" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.transparencyTitle}</h2>
        {center.transparency_items?.length ? (
          <ul className="mt-4 space-y-3">
            {center.transparency_items.map((t) => (
              <li key={t.id ?? t.item_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{t.item_title}</p>
                <p className="text-xs text-gray-500">
                  {t.item_type} · {t.visibility} · {t.status}
                </p>
                {t.summary ? <p className="mt-1 text-sm text-gray-600">{t.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noTransparency}</p>
        )}
        {center.trust_signals?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.trustSignalsTitle}</h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {center.trust_signals.map((s) => (
                <li key={s.id ?? s.signal_key} className="rounded-lg border border-gray-100 p-3 text-sm">
                  <p className="font-medium text-gray-900">{s.signal_title}</p>
                  <p className="text-xs text-gray-500">
                    {s.value_text} · {s.status}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("publish_transparency_update", { item_title: "Operational update", item_type: "operational_history" })}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.publishTransparency}
        </button>
      </section>

      {center.service_quality?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.serviceQualityTitle}</h2>
          <ul className="mt-4 space-y-3">
            {center.service_quality.map((q) => (
              <li key={q.id ?? q.quality_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{q.quality_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(q.trend)}`}>{q.trend}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {q.quality_domain} · {q.score}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section id="reputation" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.reputationTitle}</h2>
        {center.reputation_records?.length ? (
          <ul className="mt-4 space-y-3">
            {center.reputation_records.map((r) => (
              <li key={r.id ?? r.record_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.record_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.sentiment)}`}>{r.sentiment}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {r.record_type} · {r.score}
                </p>
                {r.summary ? <p className="mt-1 text-sm text-gray-600">{r.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noReputation}</p>
        )}
      </section>

      <section id="incidents" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.incidentsTitle}</h2>
        {center.incidents?.length ? (
          <ul className="mt-4 space-y-3">
            {center.incidents.map((i) => (
              <li key={i.id ?? i.incident_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{i.incident_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(i.status)}`}>{i.status}</span>
                </div>
                <p className="text-xs text-gray-500">{i.severity}</p>
                {i.summary ? <p className="mt-1 text-sm text-gray-600">{i.summary}</p> : null}
                {i.lessons_learned ? (
                  <p className="mt-1 text-xs text-gray-500">
                    {labels.lessonsLabel}: {i.lessons_learned}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noIncidents}</p>
        )}
        {center.trust_milestones?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.milestonesTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.trust_milestones.map((m) => (
                <li key={m.id ?? m.milestone_key} className="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-700">
                  <span>{m.milestone_title}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(m.status)}`}>{m.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("record_incident", { incident_title: "Service incident", severity: "low" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.recordIncident}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("resolve_incident", { incident_key: "INC-001", resolution_summary: "Resolved with full transparency." })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.resolveIncident}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("achieve_trust_milestone", { milestone_title: "Trust milestone", milestone_type: "platform_achievement" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.achieveMilestone}
          </button>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.intelligenceTitle}</h2>
          {center.intelligence_signals?.length ? (
            <ul className="mt-4 space-y-3">
              {center.intelligence_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
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
            <ul className="mt-4 space-y-3">
              {center.advisor_signals.map((s) => (
                <li key={s.id ?? s.signal_type} className="rounded-lg border border-gray-100 p-3">
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
            <p className="mt-4 text-sm text-gray-500">{labels.noAdvisor}</p>
          )}
        </section>
      </div>

      <section id="governance" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.governanceTitle}</h2>
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          <li>{labels.governanceTransparency}</li>
          <li>{labels.governanceIncident}</li>
          <li>{labels.governanceHumanOversight}</li>
          <li>{labels.governanceAudit}</li>
        </ul>
        <p className="mt-4 text-xs text-gray-500">{center.distinction_note}</p>
      </section>

      <section id="analytics" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.analyticsTitle}</h2>
        {center.audit_logs?.length ? (
          <ul className="mt-4 space-y-2">
            {center.audit_logs.map((log) => (
              <li key={String(log.id)} className="flex justify-between gap-4 text-sm text-gray-700">
                <span>{String(log.summary ?? "")}</span>
                <span className="shrink-0 text-xs uppercase text-gray-400">{String(log.event_type ?? "")}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noAudit}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_trust_score")}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.updateTrustScore}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("refresh_analytics")}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.refreshAnalytics}
          </button>
        </div>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.trustExecutiveLabel} {String(exec.trust_score ?? "—")} ·{" "}
          {labels.reliabilityExecutiveLabel} {String(exec.platform_reliability ?? "—")} · {labels.confidenceExecutiveLabel}{" "}
          {String(exec.customer_confidence ?? "—")} · {labels.qualityExecutiveLabel} {String(exec.service_quality ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
