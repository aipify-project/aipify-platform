"use client";

import Link from "next/link";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  HeartPulse,
  HelpCircle,
  History,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
  PriorityRecommendationCard,
} from "@/components/app/design";
import { ExecutiveMetricCard } from "@/components/app/design/ExecutiveMetricCard";
import { MetricsLineChart } from "@/components/platform/metrics/MetricsCharts";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import { getSeverityPresentation } from "@/lib/design/semantic-status-system";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  CUSTOMER_HEALTH_SUPPORT_HREF,
  CUSTOMER_HEALTH_TREND_PERIODS,
  CUSTOMER_HEALTH_RECOMMENDATION_LINKS,
  NEEDS_ATTENTION_ACTION_LINKS,
  type CustomerHealthLabels,
  type CustomerHealthSortOption,
  type CustomerHealthTrendPeriod,
  type CustomerHealthWorkspaceResponse,
  parseCustomerHealthWorkspace,
  hasTrendChartData,
  mapRiskLevelToSeverityValue,
  resolveTrendIcon,
  sortHistoryEntries,
  sortNeedsAttention,
  sortOperationalSignals,
  sortRisks,
} from "@/lib/app-portal/customer-health";
import {
  mapRecommendationPriorityToSeverity,
  resolveOverviewHealthState,
  resolvePurposeSummaryKey,
} from "@/lib/app-portal/success-center/presentation";
import { SUCCESS_RECOMMENDATION_LINKS } from "@/lib/app-portal/success-center/config";

type Props = {
  labels: CustomerHealthLabels;
  locale: string;
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: HeartPulse,
  recommendedAction: Lightbulb,
  drivers: Activity,
  strengths: Sparkles,
  needsAttention: AlertTriangle,
  trend: BarChart3,
  risks: ShieldAlert,
  operationalSignals: TrendingUp,
  history: History,
  understanding: HelpCircle,
};

function SectionHeading({ id, title }: { id: string; title: string }) {
  const Icon = SECTION_ICONS[id] ?? HeartPulse;
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-700 ring-1 ring-violet-100"
        aria-hidden="true"
      >
        <Icon className="h-[18px] w-[18px] stroke-[1.75]" />
      </span>
      <h2 className={AppPremiumShell.sectionTitle}>{title}</h2>
    </div>
  );
}

function driverEffectSemantic(effect: string): string {
  if (effect === "positive") return "healthy";
  if (effect === "critical_negative") return "critical_health";
  if (effect === "strong_negative") return "poor";
  if (effect === "moderate_negative") return "moderate";
  return "unknown";
}

export function CustomerHealthPanel({ labels, locale }: Props) {
  const [data, setData] = useState<CustomerHealthWorkspaceResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [trendFilter, setTrendFilter] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [sortBy, setSortBy] = useState<CustomerHealthSortOption>("date_desc");
  const [trendPeriod, setTrendPeriod] = useState<CustomerHealthTrendPeriod>(30);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (priority) params.set("priority", priority);
    if (trendFilter) params.set("trend", trendFilter);
    if (periodFrom) params.set("period_from", periodFrom);
    if (search.trim()) params.set("search", search.trim());

    if (periodFrom) {
      params.set("period_from", periodFrom);
    } else {
      const trendFrom = new Date();
      trendFrom.setDate(trendFrom.getDate() - trendPeriod);
      params.set("period_from", trendFrom.toISOString().slice(0, 10));
    }

    const res = await fetch(`/api/aipify/customer-health?${params}`);
    if (res.ok) {
      setData(parseCustomerHealthWorkspace(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.errorBody);
      setData(null);
    }
    setLoading(false);
  }, [category, priority, trendFilter, periodFrom, search, trendPeriod, labels.errorBody]);

  useEffect(() => {
    void load();
  }, [load]);

  const overview = data?.overview;
  const healthState = overview
    ? resolveOverviewHealthState(overview.health_score, overview.health_state)
    : "unknown";
  const purposeKey = resolvePurposeSummaryKey(healthState);
  const trendState = overview?.trend_state ?? data?.trend_state ?? "insufficient_data";

  const sortedNeedsAttention = useMemo(
    () => sortNeedsAttention(data?.needs_attention ?? []),
    [data?.needs_attention]
  );
  const sortedRisks = useMemo(() => sortRisks(data?.risks ?? []), [data?.risks]);
  const sortedSignals = useMemo(
    () => sortOperationalSignals(data?.operational_signals ?? []),
    [data?.operational_signals]
  );
  const sortedHistory = useMemo(
    () => sortHistoryEntries(data?.health_history ?? [], sortBy),
    [data?.health_history, sortBy]
  );

  const trendChart = useMemo(() => {
    const points = data?.trend_points ?? [];
    if (!hasTrendChartData(points)) return null;
    return {
      data: points.map((p) => p.score),
      labels: points.map((p) =>
        new Date(p.recorded_at).toLocaleDateString(locale, { month: "short", day: "numeric" })
      ),
    };
  }, [data?.trend_points, locale]);

  if (loading) {
    return (
      <div className={AppPremiumShell.page}>
        <AppLoadingState message={labels.loading} />
      </div>
    );
  }

  if (error || !data?.found) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <AppErrorState
          title={labels.errorTitle}
          description={error || labels.errorBody}
          onRetry={() => void load()}
          retryLabel={labels.retry}
          returnHref={CUSTOMER_HEALTH_SUPPORT_HREF}
          returnLabel={labels.backToSupport}
        />
      </div>
    );
  }

  if (data.filtered_out) {
    return (
      <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
        <header className="space-y-4 border-b border-aipify-border pb-6">
          <PanelHeader labels={labels} />
        </header>
        <AppEmptyState
          title={labels.emptyTitle}
          description={labels.filters.all}
          actionHref={CUSTOMER_HEALTH_SUPPORT_HREF}
          actionLabel={labels.backToSupport}
        />
      </div>
    );
  }

  const showEmpty = data.has_activity === false;
  const riskSeverity = overview ? mapRiskLevelToSeverityValue(overview.risk_level) : "info";
  const riskPresentation = getSeverityPresentation(riskSeverity);
  const recommended = data.recommended_action;
  const recCopy = recommended
    ? labels.recommendations[recommended.key as keyof typeof labels.recommendations]
    : undefined;

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <header className="space-y-4 border-b border-aipify-border pb-6">
        <PanelHeader labels={labels} />
        {overview ? (
          <p className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/60 px-5 py-4 text-sm leading-relaxed text-aipify-text">
            {labels.purposeSummary[purposeKey]}
          </p>
        ) : null}
      </header>

      {showEmpty ? (
        <AppEmptyState
          title={labels.emptyTitle}
          description={labels.emptyBody}
          actionHref="/app/support/getting-started"
          actionLabel={labels.emptyAction}
        />
      ) : null}

      {overview ? (
        <section className="space-y-4">
          <SectionHeading id="overview" title={labels.sections.overview} />
          <div className="grid gap-4 lg:grid-cols-3">
            <ExecutiveMetricCard
              featured
              icon={<HeartPulse className="h-5 w-5" aria-hidden="true" />}
              label={labels.overview.healthScore}
              value={overview.health_score}
              description={overview.explanation}
              semanticType="health"
              semanticValue={healthState}
              statusLabel={labels.healthStates[healthState]}
              a11yLabel={`${labels.overview.healthState}: ${labels.healthStates[healthState]}`}
            />
            <ExecutiveMetricCard
              icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
              label={labels.overview.trend}
              value={`${resolveTrendIcon(trendState)} ${labels.trendStates[trendState]}`}
              description={`${labels.overview.scoreChange}: ${overview.score_change >= 0 ? "+" : ""}${overview.score_change}`}
              semanticType="health"
              semanticValue={healthState}
              statusLabel={labels.trendStates[trendState]}
            />
            <article
              className={`${AppPremiumShell.elevatedCard} border-l-4 p-5 ${riskPresentation.borderClassName} ${riskPresentation.backgroundClassName}`}
            >
              <p className={AppPremiumShell.metricLabel}>{labels.overview.riskLevel}</p>
              <div className="mt-3">
                <SemanticBadge
                  type="severity"
                  value={riskSeverity}
                  label={labels.riskLevels[overview.risk_level]}
                />
              </div>
              {overview.last_calculated_at ? (
                <p className="mt-4 text-xs text-aipify-text-muted">
                  {labels.overview.lastCalculated}:{" "}
                  {formatDateTime(overview.last_calculated_at, locale)}
                </p>
              ) : null}
              <p className={`mt-3 ${AppPremiumShell.metricDescription}`}>{labels.overview.advisory}</p>
            </article>
          </div>
        </section>
      ) : null}

      {recommended && recCopy ? (
        <section className="space-y-3">
          <SectionHeading id="recommendedAction" title={labels.sections.recommendedAction} />
          <PriorityRecommendationCard
            category={labels.sections.recommendedAction}
            title={recCopy.title}
            description={recCopy.reason}
            severityValue={mapRecommendationPriorityToSeverity(recommended.priority)}
            severityLabel={recommended.priority}
            workflowValue="open"
            workflowLabel={labels.sections.recommendedAction}
            actionHref={CUSTOMER_HEALTH_RECOMMENDATION_LINKS[recommended.key] ?? SUCCESS_RECOMMENDATION_LINKS[recommended.key]?.href}
            actionLabel={recCopy.action}
          />
        </section>
      ) : null}

      {(data.drivers?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="drivers" title={labels.sections.drivers} />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.drivers!.map((driver) => (
              <article key={driver.key} className={`${AppPremiumShell.elevatedCard} p-4`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-aipify-text">
                    {labels.drivers[driver.key as keyof typeof labels.drivers] ?? driver.key}
                  </p>
                  <SemanticBadge
                    type="health"
                    value={driverEffectSemantic(driver.effect)}
                    label={labels.driverEffects[driver.effect]}
                  />
                </div>
                <p className="mt-2 text-2xl font-semibold text-aipify-text">{driver.score}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {(data.strengths?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="strengths" title={labels.sections.strengths} />
          <div className="grid gap-3 sm:grid-cols-2">
            {data.strengths!.map((item) => (
              <article
                key={item.key}
                className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 ring-1 ring-emerald-100"
              >
                <p className="font-medium text-emerald-900">
                  {labels.strengths[item.key as keyof typeof labels.strengths] ?? item.key}
                </p>
                <p className="mt-1 text-sm text-emerald-800">{item.value}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {sortedNeedsAttention.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="needsAttention" title={labels.sections.needsAttention} />
          <ul className="space-y-3">
            {sortedNeedsAttention.map((item) => {
              const href = item.action_href ?? NEEDS_ATTENTION_ACTION_LINKS[item.key];
              return (
                <li
                  key={item.key}
                  className={`${AppPremiumShell.elevatedCard} flex flex-wrap items-center justify-between gap-3 border-l-4 p-4 ${getSeverityPresentation(item.severity).borderClassName}`}
                >
                  <div>
                    <p className="font-medium text-aipify-text">
                      {labels.needsAttention[item.key as keyof typeof labels.needsAttention] ??
                        item.key}
                    </p>
                    <p className="mt-1 text-sm text-aipify-text-secondary">{item.impact}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <SemanticBadge
                      type="severity"
                      value={item.severity}
                      label={item.severity}
                    />
                    {href ? (
                      <Link
                        href={href}
                        className="text-sm font-medium text-aipify-companion hover:underline"
                      >
                        {labels.recommendations.reviewSupport.action}
                      </Link>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading id="trend" title={labels.sections.trend} />
          <div className="flex flex-wrap gap-2">
            {CUSTOMER_HEALTH_TREND_PERIODS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setTrendPeriod(days)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                  trendPeriod === days
                    ? "bg-violet-600 text-white"
                    : "bg-aipify-surface-muted text-aipify-text-secondary ring-1 ring-aipify-border"
                }`}
              >
                {labels.trend.periods[String(days)]}
              </button>
            ))}
          </div>
        </div>
        {trendChart ? (
          <div className={`${AppPremiumShell.elevatedCard} p-4`}>
            <MetricsLineChart
              data={trendChart.data}
              labels={trendChart.labels}
              ariaLabel={labels.sections.trend}
            />
          </div>
        ) : (
          <p className="text-sm text-aipify-text-secondary">
            {trendState === "insufficient_data"
              ? labels.trend.insufficientData
              : labels.trend.empty}
          </p>
        )}
      </section>

      <FilterBar
        labels={labels}
        search={search}
        category={category}
        priority={priority}
        trend={trendFilter}
        periodFrom={periodFrom}
        sortBy={sortBy}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onPriorityChange={setPriority}
        onTrendChange={setTrendFilter}
        onPeriodFromChange={setPeriodFrom}
        onSortByChange={setSortBy}
      />

      {(sortedRisks.length > 0 || sortedSignals.length > 0) && (
        <section className="space-y-6">
          {sortedRisks.length > 0 ? (
            <div className="space-y-3">
              <SectionHeading id="risks" title={labels.sections.risks} />
              <ul className="space-y-2">
                {sortedRisks.map((risk) => (
                  <li
                    key={risk.key}
                    className={`${AppPremiumShell.elevatedCard} flex flex-wrap items-center justify-between gap-2 border-l-4 p-4 ${getSeverityPresentation(risk.severity).borderClassName}`}
                  >
                    <div>
                      <p className="font-medium text-aipify-text">
                        {labels.risks[risk.key as keyof typeof labels.risks] ?? risk.description}
                      </p>
                      <p className="mt-1 text-sm text-aipify-text-secondary">{risk.description}</p>
                    </div>
                    <SemanticBadge type="severity" value={risk.severity} label={risk.severity} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {sortedSignals.length > 0 ? (
            <div className="space-y-3">
              <SectionHeading id="operationalSignals" title={labels.sections.operationalSignals} />
              <ul className="space-y-2">
                {sortedSignals.map((signal) => (
                  <li key={signal.key} className={`${AppPremiumShell.elevatedCard} p-4`}>
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-medium text-aipify-text">
                        {labels.operationalSignals[
                          signal.key as keyof typeof labels.operationalSignals
                        ] ?? signal.key}
                      </p>
                      {signal.trend ? (
                        <span className="text-sm text-aipify-text-muted">
                          {labels.trendStates[signal.trend as keyof typeof labels.trendStates] ??
                            signal.trend}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 text-sm text-aipify-text-secondary">{signal.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      <section className="space-y-4">
        <SectionHeading id="history" title={labels.sections.history} />
        {sortedHistory.length > 0 ? (
          <ul className="space-y-2">
            {sortedHistory.map((entry) => (
              <li
                key={entry.id}
                className={`${AppPremiumShell.elevatedCard} flex flex-wrap items-center justify-between gap-2 p-4 text-sm`}
              >
                <div>
                  <p className="font-medium text-aipify-text">{entry.description}</p>
                  <p className="mt-1 text-aipify-text-muted">{entry.event_type}</p>
                </div>
                <div className="text-right text-aipify-text-secondary">
                  {entry.score != null ? (
                    <p>
                      {labels.history.score}: {entry.score}
                    </p>
                  ) : null}
                  <time dateTime={entry.recorded_at}>
                    {formatDateTime(entry.recorded_at, locale)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-aipify-text-secondary">{labels.history.empty}</p>
        )}
      </section>

      <section className="space-y-4">
        <SectionHeading id="understanding" title={labels.sections.understanding} />
        <dl className={`${AppPremiumShell.elevatedCard} space-y-4 p-6`}>
          {[1, 2, 3, 4].map((n) => (
            <div key={n}>
              <dt className="font-medium text-aipify-text">
                {labels.understanding[`q${n}` as keyof typeof labels.understanding]}
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">
                {labels.understanding[`a${n}` as keyof typeof labels.understanding]}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function PanelHeader({ labels }: { labels: CustomerHealthLabels }) {
  return (
    <>
      <nav className="text-sm text-aipify-text-muted" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          <li>{labels.breadcrumbSupport}</li>
          <li aria-hidden="true">→</li>
          <li className="font-medium text-aipify-text">{labels.breadcrumbCustomerHealth}</li>
        </ol>
      </nav>
      <Link
        href={CUSTOMER_HEALTH_SUPPORT_HREF}
        className={`inline-flex text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
      >
        ← {labels.backToSupport}
      </Link>
      <div className="space-y-2">
        <p className={AppPremiumShell.eyebrow}>{labels.eyebrow}</p>
        <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
        <p className={AppPremiumShell.pageDescription}>{labels.subtitle}</p>
      </div>
    </>
  );
}

function FilterBar({
  labels,
  search,
  category,
  priority,
  trend,
  periodFrom,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onPriorityChange,
  onTrendChange,
  onPeriodFromChange,
  onSortByChange,
}: {
  labels: CustomerHealthLabels;
  search: string;
  category: string;
  priority: string;
  trend: string;
  periodFrom: string;
  sortBy: CustomerHealthSortOption;
  onSearchChange: (v: string) => void;
  onCategoryChange: (v: string) => void;
  onPriorityChange: (v: string) => void;
  onTrendChange: (v: string) => void;
  onPeriodFromChange: (v: string) => void;
  onSortByChange: (v: CustomerHealthSortOption) => void;
}) {
  return (
    <section className="rounded-2xl border border-aipify-border bg-aipify-surface-muted/30 p-4">
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={labels.filters.search}
          className="min-w-[12rem] flex-1 rounded-lg border border-aipify-border bg-white px-3 py-2 text-sm"
        />
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="rounded-lg border border-aipify-border bg-white px-3 py-2 text-sm"
          aria-label={labels.filters.category}
        >
          <option value="">{labels.filters.category}</option>
          {Object.entries(labels.filters.categories).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="rounded-lg border border-aipify-border bg-white px-3 py-2 text-sm"
          aria-label={labels.filters.priority}
        >
          <option value="">{labels.filters.priority}</option>
          <option value="high">high</option>
          <option value="medium">medium</option>
          <option value="low">low</option>
        </select>
        <select
          value={trend}
          onChange={(e) => onTrendChange(e.target.value)}
          className="rounded-lg border border-aipify-border bg-white px-3 py-2 text-sm"
          aria-label={labels.filters.trend}
        >
          <option value="">{labels.filters.trend}</option>
          {Object.entries(labels.trendStates).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={periodFrom}
          onChange={(e) => onPeriodFromChange(e.target.value)}
          aria-label={labels.filters.date}
          className="rounded-lg border border-aipify-border bg-white px-3 py-2 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value as CustomerHealthSortOption)}
          className="rounded-lg border border-aipify-border bg-white px-3 py-2 text-sm"
          aria-label={labels.filters.sortBy}
        >
          {Object.entries(labels.filters.sortOptions).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
