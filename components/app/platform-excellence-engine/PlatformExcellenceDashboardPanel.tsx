"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parsePlatformExcellenceCenter,
  type PlatformExcellenceCenter,
} from "@/lib/aipify/platform-excellence-engine";

type Props = { labels: Record<string, string> };

function metricValue(value: unknown): string | number {
  if (typeof value === "number") return value;
  if (typeof value === "string") return value;
  return 0;
}

function statusBadgeClass(status?: string): string {
  switch (status) {
    case "completed":
    case "pass":
    case "active":
    case "improving":
      return "bg-emerald-100 text-emerald-800";
    case "in_progress":
    case "review":
    case "scheduled":
    case "moderate":
    case "stable":
      return "bg-amber-100 text-amber-800";
    case "fail":
    case "failed":
    case "high":
    case "declining":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export function PlatformExcellenceDashboardPanel({ labels }: Props) {
  const [center, setCenter] = useState<PlatformExcellenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [acting, setActing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setActionError(null);
    const res = await fetch("/api/aipify/platform-excellence-engine/dashboard");
    if (res.ok) {
      setCenter(parsePlatformExcellenceCenter(await res.json()));
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
    const res = await fetch("/api/aipify/platform-excellence-engine/actions", {
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

      <section className="rounded-xl border border-slate-200 bg-gradient-to-br from-emerald-50/40 to-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.overviewTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">{center.philosophy}</p>
        <p className="mt-2 text-xs text-gray-500">{center.abos_principle}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [labels.metricQuality, metricValue(overview.platform_quality_score)],
            [labels.metricConsistency, metricValue(overview.consistency_score)],
            [labels.metricUx, metricValue(overview.ux_score)],
            [labels.metricPerformance, metricValue(overview.performance_score)],
            [labels.metricAccessibility, metricValue(overview.accessibility_score)],
            [labels.metricGovernance, metricValue(overview.governance_score)],
            [labels.metricHealth, metricValue(overview.excellence_health_score)],
            [labels.metricIssues, metricValue(overview.consistency_issues)],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-lg border border-white bg-white/90 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {center.quality_guardian_route ? (
            <Link href={center.quality_guardian_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openQualityGuardian}
            </Link>
          ) : null}
          {center.customer_experience_route ? (
            <Link href={center.customer_experience_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openCustomerExperience}
            </Link>
          ) : null}
          {center.observability_route ? (
            <Link href={center.observability_route} className="rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-700 hover:border-gray-400">
              {labels.openObservability}
            </Link>
          ) : null}
        </div>
      </section>

      <section id="quality-reviews" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.qualityReviewsTitle}</h2>
        {center.quality_reviews?.length ? (
          <ul className="mt-4 space-y-3">
            {center.quality_reviews.map((r) => (
              <li key={r.id ?? r.review_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{r.review_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(r.status)}`}>{r.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {r.review_type} · {r.target_scope} · {labels.scoreLabel} {r.score}
                </p>
                {r.summary ? <p className="mt-1 text-sm text-gray-600">{r.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noReviews}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("complete_quality_review", { review_key: "QR-UX", score: 90 })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.completeReview}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_performance_review", { review_title: "Performance review" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.generatePerformanceReview}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("generate_accessibility_review", { review_title: "Accessibility review" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.generateAccessibilityReview}
          </button>
        </div>
      </section>

      <section id="consistency" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.consistencyTitle}</h2>
        {center.consistency_checks?.length ? (
          <ul className="mt-4 space-y-3">
            {center.consistency_checks.map((c) => (
              <li key={c.id ?? c.check_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{c.check_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(c.status)}`}>{c.status}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {c.check_category} · {c.severity}
                </p>
                {c.summary ? <p className="mt-1 text-sm text-gray-600">{c.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noConsistency}</p>
        )}
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("record_consistency_issue", { check_title: "Design pattern gap", check_category: "design_pattern" })}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.recordConsistencyIssue}
        </button>
      </section>

      {center.quality_scores?.length ? (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">{labels.qualityScoresTitle}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {center.quality_scores.map((q) => (
              <li key={q.id ?? q.score_key} className="rounded-lg border border-gray-100 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-gray-900">{q.score_title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusBadgeClass(q.trend)}`}>{q.trend}</span>
                </div>
                <p className="text-xs text-gray-500">
                  {q.score_dimension} · {q.score_value}
                </p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_quality_score", { score_key: "QS-DESIGN", score_value: 88 })}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.updateQualityScore}
          </button>
        </section>
      ) : null}

      <section id="standards" className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">{labels.standardsTitle}</h2>
        {center.platform_standards?.length ? (
          <ul className="mt-4 space-y-3">
            {center.platform_standards.map((s) => (
              <li key={s.id ?? s.standard_key} className="rounded-lg border border-gray-100 p-3">
                <p className="font-medium text-gray-900">{s.standard_title}</p>
                <p className="text-xs text-gray-500">
                  {s.standard_type} · v{s.version} · {s.status}
                </p>
                {s.summary ? <p className="mt-1 text-sm text-gray-600">{s.summary}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-gray-500">{labels.noStandards}</p>
        )}
        {center.review_schedules?.length ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800">{labels.schedulesTitle}</h3>
            <ul className="mt-3 space-y-2">
              {center.review_schedules.map((s) => (
                <li key={s.id ?? s.schedule_key} className="text-sm text-gray-700">
                  {s.schedule_title} · {s.schedule_type} · {s.status}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("update_platform_standard", { standard_key: "STD-UI", version: "1.1" })}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {labels.updateStandard}
          </button>
          <button
            type="button"
            disabled={acting}
            onClick={() => void runAction("schedule_review", { schedule_title: "Regression review", schedule_type: "regression" })}
            className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {labels.scheduleReview}
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
        <button
          type="button"
          disabled={acting}
          onClick={() => void runAction("refresh_analytics")}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {labels.refreshAnalytics}
        </button>
      </section>

      <section className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-xs text-gray-500">
        <p className="font-medium text-gray-700">{labels.executiveTitle}</p>
        <p className="mt-1">
          {labels.executiveSummary}: {labels.qualityExecutiveLabel} {String(exec.platform_quality ?? "—")} ·{" "}
          {labels.consistencyExecutiveLabel} {String(exec.consistency ?? "—")} · {labels.performanceExecutiveLabel}{" "}
          {String(exec.performance ?? "—")} · {labels.accessibilityExecutiveLabel} {String(exec.accessibility ?? "—")}
        </p>
        {center.privacy_note ? <p className="mt-2">{center.privacy_note}</p> : null}
      </section>
    </div>
  );
}
