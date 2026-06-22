"use client";

import Link from "next/link";
import { useState } from "react";
import { useOptionalCompanionExperience } from "@/components/app/companion-experience/CompanionExperienceProvider";
import { CompanionIcon } from "@/components/app/companion-experience/CompanionIcon";
import { ExecutiveMetricCard, PriorityRecommendationCard } from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  getEccHealthMetricBadge,
  mapHealthScoreToHealthState,
} from "@/lib/design/semantic-status-system";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import type {
  CommandBriefIntegrationSignal,
  CommandBriefKpiCounts,
} from "@/lib/command-center/command-brief-overview";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { EccTabIcons } from "./ecc-tab-icons";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;
type OverviewLabels = Labels["commandBriefOverview"];

function CompactSummaryList({
  items,
  resolveLabel,
  emptyLabel,
}: {
  items: CommandCenterItem[];
  resolveLabel: (key: string) => string;
  emptyLabel?: string;
}) {
  if (items.length === 0) {
    return emptyLabel ? (
      <p className={`${AppPremiumShell.commandBriefBody} text-aipify-text-muted`}>{emptyLabel}</p>
    ) : null;
  }

  return (
    <ul className="divide-y divide-aipify-border rounded-xl border border-aipify-border bg-aipify-surface">
      {items.map((item) => (
        <li key={item.dedupeKey}>
          <Link
            href={item.href}
            className={`flex flex-col gap-2 px-4 py-4 transition hover:bg-aipify-surface-muted sm:flex-row sm:items-center sm:justify-between ${AppPremiumShell.focusRing}`}
          >
            <div className="min-w-0 flex-1">
              <p className="text-base font-medium text-aipify-text">{item.title}</p>
              {item.description ? (
                <p className={`mt-1 line-clamp-2 ${AppPremiumShell.commandBriefBody}`}>{item.description}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <SemanticBadge
                type={item.primaryBadge.type}
                value={item.primaryBadge.value}
                label={resolveLabel(item.primaryBadge.labelKey)}
              />
              {item.secondaryBadge ? (
                <SemanticBadge
                  type={item.secondaryBadge.type}
                  value={item.secondaryBadge.value}
                  label={resolveLabel(item.secondaryBadge.labelKey)}
                />
              ) : null}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

type CommandBriefCompanionCardProps = {
  labels: OverviewLabels;
};

export function CommandBriefCompanionCard({ labels }: CommandBriefCompanionCardProps) {
  const companion = useOptionalCompanionExperience();
  const profile = useOptionalDashboardProfile();
  const [query, setQuery] = useState("");
  const orgName = profile?.profile?.company.name ?? labels.orgNameUnavailable;

  const suggestions = [
    labels.companionSuggestions.prioritizeToday,
    labels.companionSuggestions.sinceLastVisit,
    labels.companionSuggestions.connected,
    labels.companionSuggestions.explainHealth,
  ];

  function openWith(text: string) {
    companion?.openDrawerWithQuery(text);
  }

  function handleAsk() {
    const trimmed = query.trim();
    if (!trimmed || !companion) return;
    companion.openDrawerWithQuery(trimmed);
  }

  return (
    <article
      className={`${AppPremiumShell.elevatedCard} relative overflow-hidden border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 sm:p-6`}
    >
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-violet-100/60" aria-hidden="true" />
      <div className="relative flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-violet-100">
          <CompanionIcon className="h-8 w-8" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={AppPremiumShell.commandBriefSectionTitle}>{labels.companionTitle}</h2>
          <p className={`mt-2 ${AppPremiumShell.commandBriefBody}`}>{labels.companionIntro}</p>
          <p className={`mt-3 ${AppPremiumShell.commandBriefMeta}`}>
            {labels.companionActiveOrg}: <span className="font-medium text-aipify-text">{orgName}</span>
          </p>
        </div>
      </div>

      <div className="relative mt-5 space-y-3">
        <label className="block">
          <span className="sr-only">{labels.companionInputLabel}</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAsk();
            }}
            placeholder={labels.companionInputPlaceholder}
            className={`min-h-12 w-full rounded-xl border border-aipify-border bg-white px-4 py-3 text-base text-aipify-text shadow-sm placeholder:text-aipify-text-muted ${AppPremiumShell.focusRing}`}
          />
        </label>
        <ul className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => openWith(suggestion)}
                className={`min-h-11 rounded-full border border-violet-200 bg-white px-3 py-2 text-left text-sm font-medium text-violet-800 transition hover:border-violet-300 hover:bg-violet-50 ${AppPremiumShell.focusRing}`}
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleAsk}
          disabled={!query.trim()}
          className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-aipify-companion px-4 py-2.5 text-base font-semibold text-white transition hover:bg-aipify-companion-hover disabled:cursor-not-allowed disabled:opacity-50 ${AppPremiumShell.focusRing}`}
        >
          {labels.companionAsk}
        </button>
      </div>
    </article>
  );
}

function activityCategoryLabel(labels: OverviewLabels, event: SinceLastLoginEvent): string {
  const type = event.eventType.toLowerCase();
  if (type.includes("integration")) return labels.activityCategories.integration;
  if (type.includes("support")) return labels.activityCategories.support;
  if (event.workflowState === "awaiting_approval") return labels.activityCategories.awaiting_review;
  return labels.activityCategories[event.category] ?? labels.activityCategories.information;
}

function activityIcon(event: SinceLastLoginEvent) {
  if (event.category === "completed_by_aipify" || event.category === "observed_by_aipify") {
    return EccTabIcons.action;
  }
  if (event.category === "requires_attention") return EccTabIcons.alerts;
  return EccTabIcons.history;
}

function healthMetricLabel(labels: Labels, score: number): string {
  const state = mapHealthScoreToHealthState(score);
  if (state === "healthy" || state === "good") return labels.premium.metrics.healthStatusGood;
  if (state === "moderate") return labels.premium.metrics.healthStatusModerate;
  return labels.premium.metrics.healthStatusLow;
}

type CommandBriefOverviewProps = {
  labels: Labels;
  kpis: CommandBriefKpiCounts;
  attentionItems: CommandCenterItem[];
  activityFeed: SinceLastLoginEvent[];
  nextAction: CommandCenterItem | null;
  alertSummary: CommandCenterItem[];
  approvalSummary: CommandCenterItem[];
  integrationSignals: CommandBriefIntegrationSignal[];
  resolveLabel: (key: string) => string;
};

export function CommandBriefOverview({
  labels,
  kpis,
  attentionItems,
  activityFeed,
  nextAction,
  alertSummary,
  approvalSummary,
  integrationSignals,
  resolveLabel,
}: CommandBriefOverviewProps) {
  const o = labels.commandBriefOverview;
  const healthScore = kpis.organizationHealth;

  const healthBadge =
    healthScore != null
      ? (() => {
          const config = getEccHealthMetricBadge(healthScore);
          return {
            semanticType: config.type,
            semanticValue: config.value,
            statusLabel: healthMetricLabel(labels, healthScore),
            a11yLabel: `${o.kpiHealth}: ${healthMetricLabel(labels, healthScore)}`,
          };
        })()
      : {
          semanticType: "access" as const,
          semanticValue: "restricted",
          statusLabel: o.kpiHealthUnavailable,
          a11yLabel: o.kpiHealthUnavailable,
        };

  return (
    <div className={`${AppPremiumShell.commandBriefGrid} w-full min-w-0`}>
      {/* KPI row — 4 × col-3 on xl */}
      <section aria-label={o.title} className="col-span-12 grid grid-cols-12 gap-4 lg:gap-6">
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ExecutiveMetricCard
            icon={EccTabIcons.history}
            label={o.kpiSinceLastLogin}
            value={kpis.sinceLastLogin}
            description={o.kpiSinceLastLoginDesc}
            semanticType="severity"
            semanticValue="info"
            statusLabel={kpis.sinceLastLogin > 0 ? o.kpiActive : o.kpiNone}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ExecutiveMetricCard
            icon={EccTabIcons.action}
            label={o.kpiPrepared}
            value={kpis.preparedByAipify}
            description={o.kpiPreparedDesc}
            semanticType="workflow"
            semanticValue="completed"
            statusLabel={kpis.preparedByAipify > 0 ? o.kpiActive : o.kpiNone}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ExecutiveMetricCard
            icon={EccTabIcons.alerts}
            label={o.kpiAttention}
            value={kpis.requiresAttention}
            description={o.kpiAttentionDesc}
            semanticType="severity"
            semanticValue={kpis.requiresAttention > 0 ? "high" : "info"}
            statusLabel={kpis.requiresAttention > 0 ? o.kpiActive : o.kpiNone}
          />
        </div>
        <div className="col-span-12 sm:col-span-6 xl:col-span-3">
          <ExecutiveMetricCard
            icon={EccTabIcons.health}
            label={o.kpiHealth}
            value={healthScore ?? "—"}
            description={o.kpiHealthDesc}
            {...healthBadge}
          />
        </div>
      </section>

      {/* Main 8 + sidebar 4 */}
      <div className="col-span-12 grid grid-cols-12 gap-6 lg:gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-8 lg:space-y-8">
          <section id="ecc-attention" aria-labelledby="ecc-attention-title" className="space-y-4">
            <h2 id="ecc-attention-title" className={AppPremiumShell.commandBriefSectionTitle}>
              {o.attentionTitle}
            </h2>
            {attentionItems.length === 0 ? (
              <div className={`${AppPremiumShell.elevatedCard} p-5 sm:p-6`}>
                <p className="text-base font-medium text-aipify-text">{o.attentionEmptyTitle}</p>
                <p className={`mt-2 ${AppPremiumShell.commandBriefBody}`}>{o.attentionEmptyBody}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {attentionItems.map((item) => (
                  <PriorityRecommendationCard
                    key={item.dedupeKey}
                    category={item.source ?? item.itemType ?? labels.premium.recommendationCategory}
                    title={item.title}
                    description={item.description}
                    severityValue={item.primaryBadge.value}
                    severityLabel={resolveLabel(item.primaryBadge.labelKey)}
                    workflowValue={item.secondaryBadge?.value}
                    workflowLabel={
                      item.secondaryBadge ? resolveLabel(item.secondaryBadge.labelKey) : undefined
                    }
                    actionHref={item.href}
                    actionLabel={resolveLabel(item.actionLabelKey)}
                  />
                ))}
              </div>
            )}
          </section>

          <section aria-labelledby="ecc-activity-title" className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <h2 id="ecc-activity-title" className={AppPremiumShell.commandBriefSectionTitle}>
                {o.sinceLastLoginTitle}
              </h2>
              <Link
                href="/app/command-center?tab=since-last-login"
                className={`text-base font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
              >
                {o.viewAllActivity} →
              </Link>
            </div>
            {activityFeed.length === 0 ? (
              <div className={`${AppPremiumShell.elevatedCard} p-5 ${AppPremiumShell.commandBriefBody}`}>
                {labels.premium.emptySection}
              </div>
            ) : (
              <ul className="space-y-3">
                {activityFeed.map((event) => (
                  <li key={event.dedupeKey}>
                    <article className={`${AppPremiumShell.elevatedCard} flex gap-4 p-4 sm:p-5`}>
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-aipify-accent-soft text-aipify-companion">
                        {activityIcon(event)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-aipify-text">{event.title}</h3>
                          <SemanticBadge
                            type="severity"
                            value={event.severity ?? "info"}
                            label={activityCategoryLabel(o, event)}
                          />
                        </div>
                        {event.explanation ? (
                          <p className={`mt-1.5 ${AppPremiumShell.commandBriefBody}`}>{event.explanation}</p>
                        ) : null}
                        <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 ${AppPremiumShell.commandBriefMeta}`}>
                          <span>{event.eventType}</span>
                          {event.occurredAt ? (
                            <time dateTime={event.occurredAt}>{event.occurredAt}</time>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {(alertSummary.length > 0 || approvalSummary.length > 0) && (
            <div className="grid grid-cols-12 gap-6">
              {alertSummary.length > 0 ? (
                <section aria-labelledby="ecc-alerts-summary" className="col-span-12 space-y-3 md:col-span-6">
                  <div className="flex items-end justify-between gap-3">
                    <h2 id="ecc-alerts-summary" className="text-lg font-semibold text-aipify-text">
                      {o.alertsSummaryTitle}
                    </h2>
                    <Link
                      href="/app/command-center/alerts"
                      className={`text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
                    >
                      {o.viewAllAlerts} →
                    </Link>
                  </div>
                  <CompactSummaryList items={alertSummary} resolveLabel={resolveLabel} />
                </section>
              ) : null}
              {approvalSummary.length > 0 ? (
                <section aria-labelledby="ecc-approvals-summary" className="col-span-12 space-y-3 md:col-span-6">
                  <div className="flex items-end justify-between gap-3">
                    <h2 id="ecc-approvals-summary" className="text-lg font-semibold text-aipify-text">
                      {o.approvalsSummaryTitle}
                    </h2>
                    <Link
                      href="/app/command-center/approvals"
                      className={`text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
                    >
                      {o.viewAllApprovals} →
                    </Link>
                  </div>
                  <CompactSummaryList items={approvalSummary} resolveLabel={resolveLabel} />
                </section>
              ) : null}
            </div>
          )}

          {integrationSignals.length > 0 ? (
            <section aria-labelledby="ecc-integrations-summary" className="space-y-3">
              <div className="flex items-end justify-between gap-3">
                <h2 id="ecc-integrations-summary" className="text-lg font-semibold text-aipify-text">
                  {o.integrationsSummaryTitle}
                </h2>
                <Link
                  href="/app/platform/integrations"
                  className={`text-sm font-medium text-aipify-companion hover:text-aipify-companion-hover ${AppPremiumShell.focusRing}`}
                >
                  {o.viewAllIntegrations} →
                </Link>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {integrationSignals.map((signal) => (
                  <li key={signal.id}>
                    <article className={`${AppPremiumShell.elevatedCard} h-full p-4 sm:p-5`}>
                      <h3 className="text-base font-semibold text-aipify-text">{signal.title}</h3>
                      {signal.summary ? (
                        <p className={`mt-2 ${AppPremiumShell.commandBriefBody}`}>{signal.summary}</p>
                      ) : null}
                      <p className={`mt-3 ${AppPremiumShell.commandBriefMeta}`}>
                        {o.integrationSignalMeta
                          .replace("{events}", String(signal.eventsCount))
                          .replace("{alerts}", String(signal.alertsCount))}
                      </p>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="lg:hidden">
            <CommandBriefCompanionCard labels={o} />
          </div>
        </div>

        <aside className="col-span-12 space-y-6 lg:col-span-4">
          <div className="hidden lg:block">
            <CommandBriefCompanionCard labels={o} />
          </div>

          <section aria-labelledby="ecc-next-action-title" className="space-y-3">
            <h2 id="ecc-next-action-title" className="text-lg font-semibold text-aipify-text">
              {o.nextActionTitle}
            </h2>
            {nextAction ? (
              <article className={`${AppPremiumShell.elevatedCard} space-y-3 p-5 sm:p-6`}>
                <h3 className="text-base font-semibold text-aipify-text">{nextAction.title}</h3>
                <p className={AppPremiumShell.commandBriefBody}>{nextAction.description}</p>
                {nextAction.valueLabel ? (
                  <p className={AppPremiumShell.commandBriefMeta}>
                    <span className="font-medium text-aipify-text-secondary">{o.nextActionValue}:</span>{" "}
                    {nextAction.valueLabel}
                  </p>
                ) : null}
                {nextAction.source ? (
                  <p className={AppPremiumShell.commandBriefMeta}>
                    <span className="font-medium text-aipify-text-secondary">{o.nextActionArea}:</span>{" "}
                    {nextAction.source}
                  </p>
                ) : null}
                <Link
                  href={nextAction.href}
                  className={`inline-flex min-h-11 items-center rounded-lg bg-aipify-companion px-4 py-2 text-base font-medium text-white hover:bg-aipify-companion-hover ${AppPremiumShell.focusRing}`}
                >
                  {resolveLabel(nextAction.actionLabelKey)}
                </Link>
              </article>
            ) : (
              <div className={`${AppPremiumShell.elevatedCard} p-5 sm:p-6`}>
                <p className="text-base font-medium text-aipify-text">{o.nextActionEmptyTitle}</p>
                <p className={`mt-2 ${AppPremiumShell.commandBriefBody}`}>{o.nextActionEmptyBody}</p>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
