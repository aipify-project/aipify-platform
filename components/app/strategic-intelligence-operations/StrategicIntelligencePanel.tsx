"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import { PlatformEmptyState } from "@/components/platform/PlatformEmptyState";
import { AipifyModuleAccessDenied } from "@/components/ui/aipify-module-access-denied";
import { AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import type {
  BoardReport,
  StrategicBriefing,
  StrategicForecast,
  StrategicInsight,
  StrategicIntelligenceCenter,
  StrategicIntelligenceLabels,
  StrategicIntelligenceTab,
  StrategicOpportunity,
  StrategicRecommendation,
  StrategicTrend,
} from "@/lib/strategic-intelligence-operations";
import { parseStrategicIntelligenceCenter } from "@/lib/strategic-intelligence-operations/parse";

type Tab = StrategicIntelligenceTab;

const STATUS_STYLE: Record<string, string> = {
  excellent: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  healthy: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  stable: "bg-sky-50 text-sky-900 ring-sky-200",
  needs_attention: "bg-amber-50 text-amber-900 ring-amber-200",
  critical: "bg-red-50 text-red-900 ring-red-200",
  open: "bg-amber-50 text-amber-900 ring-amber-200",
  acknowledged: "bg-sky-50 text-sky-900 ring-sky-200",
  implemented: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  ready: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  draft: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  informational: "bg-aipify-surface-muted text-aipify-text-secondary ring-aipify-border",
  moderate: "bg-amber-50 text-amber-900 ring-amber-200",
  high: "bg-orange-50 text-orange-900 ring-orange-200",
};

type Props = {
  labels: StrategicIntelligenceLabels;
  initialTab?: Tab;
  titleOverride?: string;
  visibleTabs?: Tab[];
};

export function StrategicIntelligencePanel({ labels, initialTab = "overview", titleOverride, visibleTabs }: Props) {
  const [center, setCenter] = useState<StrategicIntelligenceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [busy, setBusy] = useState(false);
  const [insightTitle, setInsightTitle] = useState("");
  const [recommendationTitle, setRecommendationTitle] = useState("");
  const [forecastTitle, setForecastTitle] = useState("");
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [reportTitle, setReportTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/app/strategic-intelligence-operations");
    if (res.ok) setCenter(parseStrategicIntelligenceCenter(await res.json()));
    else setCenter(null);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  async function runAction(action_type: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    await fetch("/api/app/strategic-intelligence-operations/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action_type, payload }),
    });
    setBusy(false);
    await load();
  }

  if (loading && !center) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!center?.found) {
    return <AipifyModuleAccessDenied message={labels.accessDenied} />;
  }

  const overview = center.overview ?? {};
  const health = center.organization_health ?? {};
  const briefing = center.executive_briefing;
  const briefings = center.briefings ?? [];
  const insights = center.insights ?? [];
  const recommendations = center.recommendations ?? [];
  const forecasts = center.forecasts ?? [];
  const trends = center.trends ?? [];
  const opportunities = center.opportunities ?? [];
  const riskIntel = center.risk_intelligence ?? {};
  const executive = center.executive_dashboard ?? {};
  const boardReports = center.board_reports ?? [];
  const reports = center.reports ?? {};
  const advisory = center.companion_advisory ?? {};
  const companion = center.companion_insights ?? {};

  const allTabs: { id: Tab; label: string }[] = [
    { id: "overview", label: labels.overview },
    { id: "executive_briefing", label: labels.executiveBriefing },
    { id: "insights", label: labels.insights },
    { id: "recommendations", label: labels.recommendations },
    { id: "forecasts", label: labels.forecasts },
    { id: "trends", label: labels.trends },
    { id: "opportunities", label: labels.opportunities },
    { id: "risks", label: labels.risks },
    { id: "reports", label: labels.reports },
    { id: "executive_dashboard", label: labels.executiveDashboard },
  ];
  const tabs = visibleTabs ? allTabs.filter((t) => visibleTabs.includes(t.id)) : allTabs;

  const healthStatus = String(health.health_status ?? overview.health_status ?? "stable");
  const healthScore = String(overview.organization_health_score ?? health.organization_health_score ?? "—");

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <header>
        <h1 className="text-2xl font-semibold text-aipify-text">{titleOverride ?? labels.title}</h1>
        <p className="mt-1 text-sm text-aipify-text-secondary">{labels.subtitle}</p>
        {center.principle ? <p className="mt-2 text-xs text-aipify-text-muted">{center.principle}</p> : null}
      </header>

      <nav className="flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={
              tab === item.id
                ? `${AipifyShellClasses.primaryButton} text-sm`
                : `${AipifyShellClasses.secondaryButton} text-sm`
            }
          >
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "overview" ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <p className="text-xs text-aipify-text-muted">{labels.organizationHealthScore}</p>
              <p className="mt-1 text-xl font-semibold text-aipify-text">{healthScore}</p>
              <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[healthStatus] ?? STATUS_STYLE.stable}`}>
                {healthStatus.replace(/_/g, " ")}
              </span>
            </div>
            {(
              [
                [labels.openInsights, overview.open_insights],
                [labels.openRecommendations, overview.open_recommendations],
                [labels.activeForecasts, overview.active_forecasts],
                [labels.identifiedOpportunities, overview.identified_opportunities],
                [labels.trendsTracked, overview.trends_tracked],
                [labels.boardReportsReady, overview.board_reports_ready],
              ] as [string, string | number | undefined][]
            ).map(([label, value]) => (
              <div key={String(label)} className={`${AipifyShellClasses.surfaceCard} p-4`}>
                <p className="text-xs text-aipify-text-muted">{label}</p>
                <p className="mt-1 text-xl font-semibold text-aipify-text">{value ?? "—"}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing", { briefing_type: "since_last_login" })} className={AipifyShellClasses.primaryButton}>
              {labels.generateBriefing}
            </button>
            <button type="button" disabled={busy} onClick={() => void runAction("refresh_health_score")} className={AipifyShellClasses.secondaryButton}>
              {labels.refreshHealthScore}
            </button>
          </div>

          {briefing?.id ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.executiveBriefing}</h2>
              <p className="mt-1 text-xs text-aipify-text-muted capitalize">{briefing.briefing_type.replace(/_/g, " ")}</p>
              <h3 className="mt-2 font-medium text-aipify-text">{briefing.title}</h3>
              {briefing.executive_summary ? <p className="mt-2 text-sm text-aipify-text-secondary">{briefing.executive_summary}</p> : null}
            </section>
          ) : null}

          {companion ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.companionInsights}</h2>
              <div className="mt-3 grid gap-4 sm:grid-cols-2 text-sm">
                {Array.isArray(companion.top_recommendations) && (companion.top_recommendations as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.recommendations}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(companion.top_recommendations as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.title ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {Array.isArray(companion.top_opportunities) && (companion.top_opportunities as Record<string, unknown>[]).length > 0 ? (
                  <div>
                    <p className="font-medium text-aipify-text">{labels.opportunities}</p>
                    <ul className="mt-2 space-y-1 text-aipify-text-secondary">
                      {(companion.top_opportunities as Record<string, unknown>[]).map((row, i) => (
                        <li key={i}>{String(row.title ?? "")}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          <p className="text-sm text-aipify-text-secondary">
            {labels.decisionSupport}:{" "}
            <Link href="/app/intelligence/decisions" className="text-aipify-accent underline">
              /app/intelligence/decisions
            </Link>
          </p>
        </>
      ) : null}

      {tab === "executive_briefing" ? (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing", { briefing_type: "daily" })} className={AipifyShellClasses.secondaryButton}>
              Daily
            </button>
            <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing", { briefing_type: "weekly" })} className={AipifyShellClasses.secondaryButton}>
              Weekly
            </button>
            <button type="button" disabled={busy} onClick={() => void runAction("generate_briefing", { briefing_type: "since_last_login" })} className={AipifyShellClasses.primaryButton}>
              {labels.generateBriefing}
            </button>
          </div>
          {briefings.length === 0 && !briefing?.id ? (
            <PlatformEmptyState title={labels.executiveBriefing} message={labels.emptyHint} />
          ) : (
            (briefings.length > 0 ? briefings : briefing ? [briefing] : []).map((b: StrategicBriefing) => (
              <div key={b.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted capitalize">{b.briefing_type.replace(/_/g, " ")} · {b.generated_at ? new Date(b.generated_at).toLocaleDateString() : ""}</p>
                <h3 className="font-semibold text-aipify-text">{b.title}</h3>
                {b.executive_summary ? <p className="mt-2 text-aipify-text-secondary">{b.executive_summary}</p> : null}
                {b.what_changed ? (
                  <div className="mt-3">
                    <p className="font-medium text-aipify-text">{labels.whatChanged}</p>
                    <p className="text-aipify-text-secondary">{b.what_changed}</p>
                  </div>
                ) : null}
                {b.requires_attention ? (
                  <div className="mt-3">
                    <p className="font-medium text-aipify-text">{labels.requiresAttention}</p>
                    <p className="text-aipify-text-secondary">{b.requires_attention}</p>
                  </div>
                ) : null}
                {b.recommended_focus ? (
                  <div className="mt-3">
                    <p className="font-medium text-aipify-text">{labels.recommendedFocus}</p>
                    <p className="text-aipify-text-secondary">{b.recommended_focus}</p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "insights" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={insightTitle} onChange={(e) => setInsightTitle(e.target.value)} placeholder={labels.insightTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !insightTitle.trim()} onClick={() => void runAction("generate_insight", { title: insightTitle.trim() }).then(() => setInsightTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.generateInsight}
            </button>
          </div>
          {insights.length === 0 ? (
            <PlatformEmptyState title={labels.noInsights} message={labels.emptyHint} />
          ) : (
            insights.map((item: StrategicInsight) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{item.insight_number ?? item.id.slice(0, 8)}</p>
                    <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                    <p className="capitalize text-aipify-text-secondary">{item.source_domain.replace(/_/g, " ")} · {item.insight_type.replace(/_/g, " ")}</p>
                    {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[item.severity] ?? STATUS_STYLE.informational}`}>
                    {item.severity.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "recommendations" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={recommendationTitle} onChange={(e) => setRecommendationTitle(e.target.value)} placeholder={labels.recommendationTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !recommendationTitle.trim()} onClick={() => void runAction("generate_recommendation", { title: recommendationTitle.trim() }).then(() => setRecommendationTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.generateRecommendation}
            </button>
          </div>
          {recommendations.length === 0 ? (
            <PlatformEmptyState title={labels.noRecommendations} message={labels.emptyHint} />
          ) : (
            recommendations.map((item: StrategicRecommendation) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-xs text-aipify-text-muted">{item.recommendation_number ?? item.id.slice(0, 8)}</p>
                    <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                    <p className="capitalize text-aipify-text-secondary">{item.category.replace(/_/g, " ")} · {item.confidence} confidence</p>
                    {item.description ? <p className="mt-1 text-aipify-text-secondary">{item.description}</p> : null}
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[item.status] ?? STATUS_STYLE.open}`}>
                    {item.status.replace(/_/g, " ")}
                  </span>
                </div>
                {item.status === "open" ? (
                  <button type="button" disabled={busy} onClick={() => void runAction("acknowledge_recommendation", { recommendation_id: item.id })} className={`mt-3 ${AipifyShellClasses.secondaryButton}`}>
                    {labels.acknowledgeRecommendation}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "forecasts" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={forecastTitle} onChange={(e) => setForecastTitle(e.target.value)} placeholder={labels.forecastTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !forecastTitle.trim()} onClick={() => void runAction("generate_forecast", { title: forecastTitle.trim() }).then(() => setForecastTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.generateForecast}
            </button>
          </div>
          {forecasts.length === 0 ? (
            <PlatformEmptyState title={labels.noForecasts} message={labels.emptyHint} />
          ) : (
            forecasts.map((item: StrategicForecast) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{item.forecast_number ?? item.id.slice(0, 8)}</p>
                <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                <p className="capitalize text-aipify-text-secondary">{item.forecast_type.replace(/_/g, " ")} · {item.period_label.replace(/_/g, " ")} · {item.forecast_direction.replace(/_/g, " ")}</p>
                {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "trends" ? (
        <div className="space-y-4">
          {trends.length === 0 ? (
            <PlatformEmptyState title={labels.trends} message={labels.emptyHint} />
          ) : (
            trends.map((item: StrategicTrend) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                <p className="capitalize text-aipify-text-secondary">{item.category.replace(/_/g, " ")} · {item.trend_direction.replace(/_/g, " ")}</p>
                {item.summary ? <p className="mt-1 text-aipify-text-secondary">{item.summary}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "opportunities" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={opportunityTitle} onChange={(e) => setOpportunityTitle(e.target.value)} placeholder={labels.opportunityTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !opportunityTitle.trim()} onClick={() => void runAction("generate_opportunity", { title: opportunityTitle.trim() }).then(() => setOpportunityTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.generateOpportunity}
            </button>
          </div>
          {opportunities.length === 0 ? (
            <PlatformEmptyState title={labels.noOpportunities} message={labels.emptyHint} />
          ) : (
            opportunities.map((item: StrategicOpportunity) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{item.opportunity_number ?? item.id.slice(0, 8)}</p>
                <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                <p className="capitalize text-aipify-text-secondary">{item.opportunity_type.replace(/_/g, " ")} · {item.status.replace(/_/g, " ")}</p>
                {item.description ? <p className="mt-1 text-aipify-text-secondary">{item.description}</p> : null}
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "risks" ? (
        <div className="space-y-4">
          <section className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
            <h2 className="font-semibold text-aipify-text">{labels.risks}</h2>
            <p className="mt-2 text-aipify-text-secondary">
              Critical risks: {String(riskIntel.critical_risks ?? 0)}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              {riskIntel.risk_engine ? (
                <Link href={String(riskIntel.risk_engine)} className="text-aipify-accent underline">
                  Risk Center
                </Link>
              ) : null}
              {riskIntel.governance_engine ? (
                <Link href={String(riskIntel.governance_engine)} className="text-aipify-accent underline">
                  Governance Center
                </Link>
              ) : null}
              {riskIntel.quality_engine ? (
                <Link href={String(riskIntel.quality_engine)} className="text-aipify-accent underline">
                  Quality & Compliance
                </Link>
              ) : null}
            </div>
          </section>
        </div>
      ) : null}

      {tab === "reports" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} grid gap-3 p-4 sm:grid-cols-2`}>
            <input value={reportTitle} onChange={(e) => setReportTitle(e.target.value)} placeholder={labels.reportTitle} className={AipifyShellClasses.input} />
            <button type="button" disabled={busy || !reportTitle.trim()} onClick={() => void runAction("create_board_report", { title: reportTitle.trim() }).then(() => setReportTitle(""))} className={AipifyShellClasses.primaryButton}>
              {labels.createBoardReport}
            </button>
          </div>
          <section className={`${AipifyShellClasses.surfaceCard} space-y-2 p-4 text-sm`}>
            <p>{labels.recommendations}: {String(reports.recommendation_usage ?? 0)} implemented</p>
            <p>{labels.opportunities}: {String(reports.opportunities_discovered ?? 0)} discovered</p>
            <p>{labels.forecasts}: {String(reports.forecast_count ?? 0)} generated</p>
          </section>
          {boardReports.length === 0 ? (
            <PlatformEmptyState title={labels.noBoardReports} message={labels.emptyHint} />
          ) : (
            boardReports.map((item: BoardReport) => (
              <div key={item.id} className={`${AipifyShellClasses.surfaceCard} p-4 text-sm`}>
                <p className="text-xs text-aipify-text-muted">{item.report_number ?? item.id.slice(0, 8)}</p>
                <h3 className="font-semibold text-aipify-text">{item.title}</h3>
                <p className="capitalize text-aipify-text-secondary">{item.report_type.replace(/_/g, " ")} · {item.status.replace(/_/g, " ")}{item.exportable ? " · Exportable" : ""}</p>
              </div>
            ))
          )}
        </div>
      ) : null}

      {tab === "executive_dashboard" ? (
        <div className="space-y-4">
          <div className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <h2 className="text-sm font-semibold text-aipify-text">{labels.organizationHealthScore}</h2>
            <p className="mt-2 text-2xl font-semibold text-aipify-text">{healthScore}</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset capitalize ${STATUS_STYLE[healthStatus] ?? STATUS_STYLE.stable}`}>
              {healthStatus.replace(/_/g, " ")}
            </span>
          </div>
          <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
            <h2 className="text-sm font-semibold text-aipify-text">{labels.recommendedFocus}</h2>
            <ul className="mt-3 space-y-2 text-sm text-aipify-text-secondary">
              {Array.isArray(executive.priorities) && (executive.priorities as Record<string, unknown>[]).length > 0
                ? (executive.priorities as Record<string, unknown>[]).map((row, i) => (
                    <li key={i}>{String(row.title ?? "")} · {String(row.category ?? "").replace(/_/g, " ")}</li>
                  ))
                : <li>{labels.noRecommendations}</li>}
            </ul>
          </section>
          {advisory.prompts && Array.isArray(advisory.prompts) ? (
            <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
              <h2 className="text-sm font-semibold text-aipify-text">{labels.companionAdvisory}</h2>
              <p className="mt-1 text-xs text-aipify-text-muted">{String(advisory.role ?? "")}</p>
              <ul className="mt-3 space-y-1 text-sm text-aipify-text-secondary">
                {(advisory.prompts as string[]).map((prompt, i) => (
                  <li key={i}>{prompt}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      ) : null}

      {center.audit_recent && center.audit_recent.length > 0 ? (
        <section className={`${AipifyShellClasses.surfaceCard} p-4`}>
          <h2 className="text-sm font-semibold text-aipify-text">{labels.auditLog}</h2>
          <ul className="mt-3 space-y-1 text-xs text-aipify-text-secondary">
            {center.audit_recent.slice(0, 10).map((entry, i) => (
              <li key={i}>{entry.summary} · {entry.created_at ? new Date(entry.created_at).toLocaleString() : ""}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
