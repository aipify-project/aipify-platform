"use client";

import Link from "next/link";
import {
  Clock3,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Target,
  TrendingUp,
  Users,
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
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  getSeverityPresentation,
  getWorkflowStatePresentation,
} from "@/lib/design/semantic-status-system";
import { formatDateTime } from "@/lib/i18n/format-date";
import {
  GROWTH_OPPORTUNITY_LINKS,
  SUCCESS_CENTER_SUPPORT_HREF,
  parseSuccessCenter,
  partitionRecommendations,
  resolveOverviewHealthState,
  resolvePurposeSummaryKey,
  resolveRecommendationHref,
  mapRiskLevelToSeverity,
  mapRecommendationPriorityToSeverity,
  growthOpportunityAccent,
  type SuccessCenterLabels,
  type SuccessCenterResponse,
} from "@/lib/app-portal/success-center";

type Props = {
  labels: SuccessCenterLabels;
  locale: string;
  methodologyHref?: string | null;
};

const SECTION_ICONS: Record<string, LucideIcon> = {
  overview: LayoutDashboard,
  recommendations: Lightbulb,
  timeline: Clock3,
  growth: TrendingUp,
  adoption: Users,
  factors: Target,
  understandingScore: GraduationCap,
};

function SectionHeading({ id, title }: { id: string; title: string }) {
  const Icon = SECTION_ICONS[id] ?? LayoutDashboard;
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

function growthCardClasses(accent: ReturnType<typeof growthOpportunityAccent>): string {
  if (accent === "teal") return "border-l-teal-400 bg-teal-50/20";
  if (accent === "blue") return "border-l-sky-400 bg-sky-50/20";
  return "border-l-violet-400 bg-violet-50/20";
}

export function SuccessCenterPanel({ labels, locale, methodologyHref }: Props) {
  const [data, setData] = useState<SuccessCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const res = await fetch("/api/aipify/success-center");
    if (res.ok) {
      setData(parseSuccessCenter(await res.json()));
    } else {
      const body = (await res.json()) as { error?: string };
      setError(body.error ?? labels.errorBody);
    }
    setLoading(false);
  }, [labels.errorBody]);

  useEffect(() => {
    void load();
  }, [load]);

  const overview = data?.overview;
  const healthState = overview
    ? resolveOverviewHealthState(overview.customer_health_score, overview.health_state)
    : "unknown";
  const purposeKey = resolvePurposeSummaryKey(healthState);
  const { open: openRecommendations, completed: completedRecommendations } = useMemo(
    () => partitionRecommendations(data?.recommendations ?? []),
    [data?.recommendations]
  );
  const topRecommendation = openRecommendations[0] ?? null;
  const visibleRecommendations = openRecommendations.slice(0, 3);
  const showEmpty = data?.found && !data?.has_activity;

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
          returnHref={SUCCESS_CENTER_SUPPORT_HREF}
          returnLabel={labels.backToSupport}
        />
      </div>
    );
  }

  const riskSeverity = overview ? mapRiskLevelToSeverity(overview.risk_level) : "info";
  const riskPresentation = getSeverityPresentation(riskSeverity);

  return (
    <div className={`${AppPremiumShell.page} ${AppPremiumShell.sectionGap}`}>
      <header className="space-y-4 border-b border-aipify-border pb-6">
        <nav className="text-sm text-aipify-text-muted" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-2">
            <li>{labels.breadcrumbSupport}</li>
            <li aria-hidden="true">→</li>
            <li className="font-medium text-aipify-text">{labels.breadcrumbSuccessCenter}</li>
          </ol>
        </nav>
        <Link
          href={SUCCESS_CENTER_SUPPORT_HREF}
          className={`inline-flex text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
        >
          ← {labels.backToSupport}
        </Link>
        <div className="space-y-2">
          <p className={AppPremiumShell.eyebrow}>{labels.eyebrow}</p>
          <h1 className={AppPremiumShell.pageTitle}>{labels.title}</h1>
          <p className={AppPremiumShell.pageDescription}>{labels.subtitle}</p>
        </div>
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
          <p className={AppPremiumShell.sectionSubtitle}>{labels.overview.organizationOverview}</p>
          <div className="grid gap-4 lg:grid-cols-3">
            <ExecutiveMetricCard
              featured
              icon={<LayoutDashboard className="h-5 w-5" aria-hidden="true" />}
              label={labels.overview.healthScore}
              value={overview.customer_health_score}
              description={overview.explanation ?? labels.overview.advisory}
              semanticType="health"
              semanticValue={healthState}
              statusLabel={labels.healthStates[healthState]}
              a11yLabel={`${labels.overview.healthStatus}: ${labels.healthStates[healthState]}`}
            />
            <ExecutiveMetricCard
              icon={<Users className="h-5 w-5" aria-hidden="true" />}
              label={labels.overview.adoptionScore}
              value={overview.adoption_score}
              description={labels.scoreExplanations.adoption}
              semanticType="health"
              semanticValue={resolveOverviewHealthState(overview.adoption_score)}
              statusLabel={labels.healthStates[resolveOverviewHealthState(overview.adoption_score)]}
            />
            <ExecutiveMetricCard
              icon={<Target className="h-5 w-5" aria-hidden="true" />}
              label={labels.overview.engagementScore}
              value={overview.team_engagement_score}
              description={labels.scoreExplanations.engagement}
              semanticType="health"
              semanticValue={resolveOverviewHealthState(overview.team_engagement_score)}
              statusLabel={labels.healthStates[resolveOverviewHealthState(overview.team_engagement_score)]}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ExecutiveMetricCard
              icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
              label={labels.overview.utilizationScore}
              value={overview.feature_utilization_score}
              description={labels.scoreExplanations.utilization}
              semanticType="health"
              semanticValue={resolveOverviewHealthState(overview.feature_utilization_score)}
              statusLabel={labels.healthStates[resolveOverviewHealthState(overview.feature_utilization_score)]}
            />
            <article className={`${AppPremiumShell.elevatedCard} border-l-4 p-5 ${riskPresentation.borderClassName} ${riskPresentation.backgroundClassName}`}>
              <p className={AppPremiumShell.metricLabel}>{labels.overview.riskLevel}</p>
              <div className="mt-3">
                <SemanticBadge
                  type="severity"
                  value={riskSeverity}
                  label={labels.riskLevels[overview.risk_level]}
                />
              </div>
              <p className={`mt-4 ${AppPremiumShell.metricDescription}`}>{labels.overview.advisory}</p>
              {overview.last_updated_at ? (
                <p className="mt-3 text-xs text-aipify-text-muted">
                  {labels.overview.lastUpdated}: {formatDateTime(overview.last_updated_at, locale)}
                </p>
              ) : null}
            </article>
          </div>
        </section>
      ) : null}

      {topRecommendation ? (
        <section className="space-y-3">
          <p className="text-sm font-medium text-aipify-text-secondary">{labels.overview.recommendedNextAction}</p>
          <PriorityRecommendationCard
            category={labels.sections.recommendations}
            title={labels.recommendations[topRecommendation.key as keyof typeof labels.recommendations]?.title ?? topRecommendation.key}
            description={labels.recommendations[topRecommendation.key as keyof typeof labels.recommendations]?.reason ?? ""}
            severityValue={mapRecommendationPriorityToSeverity(topRecommendation.priority)}
            severityLabel={labels.priorities[topRecommendation.priority] ?? topRecommendation.priority}
            workflowValue={topRecommendation.status ?? "open"}
            workflowLabel={labels.recommendationStatus[topRecommendation.status ?? "open"]}
            actionHref={resolveRecommendationHref(topRecommendation.key)}
            actionLabel={labels.recommendations[topRecommendation.key as keyof typeof labels.recommendations]?.action}
          />
        </section>
      ) : null}

      {visibleRecommendations.length > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="recommendations" title={labels.sections.recommendations} />
          <div className="grid gap-4 lg:grid-cols-2">
            {visibleRecommendations.map((rec) => {
              const copy = labels.recommendations[rec.key as keyof typeof labels.recommendations];
              return (
                <PriorityRecommendationCard
                  key={rec.id}
                  category={labels.priorities[rec.priority] ?? rec.priority}
                  title={copy?.title ?? rec.key}
                  description={[copy?.reason, copy?.benefit].filter(Boolean).join(" ")}
                  severityValue={mapRecommendationPriorityToSeverity(rec.priority)}
                  severityLabel={labels.priorities[rec.priority] ?? rec.priority}
                  workflowValue={rec.status ?? "open"}
                  workflowLabel={labels.recommendationStatus[rec.status ?? "open"]}
                  actionHref={resolveRecommendationHref(rec.key)}
                  actionLabel={copy?.action}
                />
              );
            })}
          </div>
        </section>
      ) : null}

      {completedRecommendations.length > 0 ? (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-aipify-text-secondary">{labels.sections.completedRecommendations}</h3>
          <ul className="space-y-2">
            {completedRecommendations.map((rec) => {
              const copy = labels.recommendations[rec.key as keyof typeof labels.recommendations];
              return (
                <li
                  key={rec.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-aipify-border bg-aipify-surface-muted/40 px-4 py-3 text-sm"
                >
                  <span className="text-aipify-text-secondary">{copy?.title ?? rec.key}</span>
                  <SemanticBadge type="workflow" value="completed" label={labels.recommendationStatus.completed} />
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {(data.timeline?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="timeline" title={labels.sections.timeline} />
          <ul className="space-y-3">
            {data.timeline!.map((event) => {
              const workflow = getWorkflowStatePresentation(event.status ?? "completed");
              return (
                <li
                  key={event.id}
                  className={`${AppPremiumShell.elevatedCard} border-l-4 p-4 ${workflow.borderClassName} ${workflow.backgroundClassName}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-aipify-text">{event.title}</p>
                      <p className="mt-1 text-sm text-aipify-text-secondary">{event.description}</p>
                    </div>
                    <time className="text-xs text-aipify-text-muted" dateTime={event.occurred_at}>
                      {formatDateTime(event.occurred_at, locale)}
                    </time>
                  </div>
                  {event.href ? (
                    <Link href={event.href} className="mt-3 inline-flex text-sm font-medium text-aipify-companion hover:underline">
                      {labels.overview.recommendedNextAction}
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      {(data.growth_opportunities?.filter((g) => g.available).length ?? 0) > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="growth" title={labels.sections.growth} />
          <div className="grid gap-4 sm:grid-cols-2">
            {data.growth_opportunities!
              .filter((g) => g.available)
              .map((g) => {
                const copy = labels.growth[g.key as keyof typeof labels.growth];
                const accent = growthOpportunityAccent(g.key);
                return (
                  <article
                    key={g.key}
                    className={`${AppPremiumShell.elevatedCard} border-l-4 p-5 ${growthCardClasses(accent)}`}
                  >
                    <h3 className="font-semibold text-aipify-text">{copy?.title ?? g.key}</h3>
                    <p className="mt-2 text-sm text-aipify-text-secondary">{copy?.description}</p>
                    <Link
                      href={GROWTH_OPPORTUNITY_LINKS[g.key] ?? "/app/billing/upgrade"}
                      className={`mt-4 inline-flex min-h-10 items-center rounded-lg border border-aipify-border bg-aipify-surface px-4 py-2 text-sm font-medium text-aipify-text transition hover:bg-aipify-surface-muted ${AppPremiumShell.focusRing}`}
                    >
                      {copy?.action}
                    </Link>
                  </article>
                );
              })}
          </div>
        </section>
      ) : null}

      {(data.adoption_insights?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="adoption" title={labels.sections.adoption} />
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.adoption_insights!.map((item) => (
              <div key={item.key} className={`${AppPremiumShell.elevatedCard} p-4`}>
                <dt className="text-xs font-medium text-aipify-text-muted">
                  {labels.adoption[item.label_key as keyof typeof labels.adoption] ?? item.label_key}
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-aipify-text">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      {(data.health_factors?.length ?? 0) > 0 ? (
        <section className="space-y-4">
          <SectionHeading id="factors" title={labels.sections.factors} />
          <ul className="grid gap-3 sm:grid-cols-2">
            {data.health_factors!.map((factor) => {
              const copy = labels.factors[factor.key as keyof typeof labels.factors];
              const impactPresentation = getSeverityPresentation(
                factor.impact === "negative" ? "high" : factor.impact === "positive" ? "low" : "info"
              );
              return (
                <li
                  key={factor.key}
                  className={`${AppPremiumShell.elevatedCard} flex flex-col gap-2 border-l-4 p-4 ${impactPresentation.borderClassName}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-aipify-text">{copy?.label ?? factor.key}</p>
                      <p className="mt-1 text-xs text-aipify-text-muted">{copy?.impact}</p>
                    </div>
                    <span className="text-lg font-semibold text-aipify-text">{factor.value}</span>
                  </div>
                  {factor.action_href ? (
                    <Link href={factor.action_href} className="text-sm font-medium text-aipify-companion hover:underline">
                      {labels.factorActions[factor.key as keyof typeof labels.factorActions]}
                    </Link>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="space-y-4">
        <SectionHeading id="understandingScore" title={labels.sections.understandingScore} />
        <div className="grid gap-4 lg:grid-cols-3">
          {(
            [
              ["adoptionTitle", "adoptionBody"],
              ["engagementTitle", "engagementBody"],
              ["utilizationTitle", "utilizationBody"],
            ] as const
          ).map(([titleKey, bodyKey]) => (
            <article key={titleKey} className={`${AppPremiumShell.elevatedCard} p-5`}>
              <h3 className="font-semibold text-aipify-text">{labels.understandingScore[titleKey]}</h3>
              <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">
                {labels.understandingScore[bodyKey]}
              </p>
            </article>
          ))}
        </div>
        {methodologyHref ? (
          <Link href={methodologyHref} className="inline-flex text-sm font-medium text-aipify-companion hover:underline">
            {labels.understandingScore.methodologyLink}
          </Link>
        ) : null}
      </section>
    </div>
  );
}
