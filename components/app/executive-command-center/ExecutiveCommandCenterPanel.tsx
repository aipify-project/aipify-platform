"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { humanizeTranslationKey } from "@/lib/i18n/humanize-key";
import {
  AppEmptyState,
  AppErrorState,
  AppLoadingState,
  AppSectionHeader,
  CompanionInsightBanner,
  ExecutiveMetricCard,
} from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import type { AipifyStatusKind } from "@/lib/design/status-system";
import {
  getEccCriticalItemsMetricBadge,
  getEccHealthMetricBadge,
  mapHealthScoreToHealthState,
} from "@/lib/design/semantic-status-system";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  buildAlertsDataset,
  buildApprovalsDataset,
  buildCompanionBriefingDataset,
  buildEccOverviewCounts,
  buildOpportunitiesDataset,
  buildPerformanceDataset,
  buildRisksDataset,
} from "@/lib/command-center/ecc-tab-datasets";
import {
  buildCommandBriefActivityFeed,
  buildCommandBriefAlertSummary,
  buildCommandBriefIntegrationStatus,
  buildCommandBriefKpiCounts,
  buildCommandBriefNextAction,
} from "@/lib/command-center/command-brief-overview";
import { buildCommandBriefAttentionItemsFromCenter } from "@/lib/command-center/command-brief-attention";
import { CommandBriefOverview } from "./CommandBriefOverview";
import {
  CommandCenterItemList,
  CommandCenterSectionBlock,
} from "@/components/shared/command-center/CommandCenterItemCard";
import {
  parseExecutiveCommandCenter,
  type ExecutiveCommandCenter,
} from "@/lib/executive-command-center-engine/parse";
import type { Ecc590Section } from "@/lib/executive-command-center-engine/config";
import { ecc590SectionToRpc } from "@/lib/executive-command-center-engine/config";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { SinceLastLoginPresentation } from "@/components/shared/since-last-login/SinceLastLoginPresentation";
import { EccTabIcons } from "./ecc-tab-icons";
import { useExecutiveCommandCenterRefresh } from "./ExecutiveCommandCenterRefreshContext";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;

function healthMetricLabel(labels: Labels, score: number): string {
  const state = mapHealthScoreToHealthState(score);
  if (state === "healthy" || state === "good") return labels.premium.metrics.healthStatusGood;
  if (state === "moderate") return labels.premium.metrics.healthStatusModerate;
  return labels.premium.metrics.healthStatusLow;
}

function resolveHealthMetricBadge(score: number, labels: Labels) {
  const config = getEccHealthMetricBadge(score);
  return {
    semanticType: config.type,
    semanticValue: config.value,
    statusLabel: healthMetricLabel(labels, score),
    a11yLabel: `${labels.overallHealthScore}: ${healthMetricLabel(labels, score)}`,
  };
}

function resolveSinceLastLoginBadge(count: number, labels: Labels) {
  if (count <= 0) return { hideBadge: true as const, statusLabel: "" };
  return {
    semanticType: "severity" as const,
    semanticValue: "info",
    statusLabel: labels.premium.metrics.sinceLastLoginUpdated,
    a11yLabel: labels.premium.metrics.sinceLastLoginUpdated,
  };
}

function resolveOpenAlertsBadge(count: number, labels: Labels) {
  if (count <= 0) {
    return {
      semanticType: "workflow" as const,
      semanticValue: "completed",
      statusLabel: labels.tabs.metrics.noOpenAlerts,
    };
  }
  return {
    semanticType: "workflow" as const,
    semanticValue: "open",
    statusLabel: labels.premium.metrics.workflowOpen,
  };
}

function resolvePendingActionsBadge(count: number, labels: Labels) {
  if (count <= 0) {
    return {
      semanticType: "workflow" as const,
      semanticValue: "completed",
      statusLabel: labels.tabs.metrics.noPendingActions,
    };
  }
  return {
    semanticType: "workflow" as const,
    semanticValue: "pending",
    statusLabel: labels.premium.metrics.workflowPending,
  };
}

function resolveCriticalItemsBadge(count: number, labels: Labels) {
  if (count <= 0) {
    return {
      semanticType: "workflow" as const,
      semanticValue: "completed",
      statusLabel: labels.tabs.metrics.noCriticalItems,
      a11yLabel: labels.tabs.metrics.noCriticalItems,
    };
  }
  const config = getEccCriticalItemsMetricBadge(count);
  return {
    semanticType: config.type,
    semanticValue: config.value,
    statusLabel: labels.premium.metrics.severityCritical,
    a11yLabel: labels.premium.metrics.severityCritical,
  };
}

function PremiumItemCard({
  title,
  summary,
  badge,
  extra,
}: {
  title: string;
  summary?: string;
  badge?: string;
  extra?: React.ReactNode;
}) {
  return (
    <article className={`${AppPremiumShell.elevatedCard} ${AppPremiumShell.elevatedCardHover} p-5`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-aipify-text">{title}</h3>
        {badge ? (
          <span className="rounded-full bg-aipify-surface-muted px-2.5 py-0.5 text-xs font-medium capitalize text-aipify-text-secondary">
            {badge.replace(/_/g, " ")}
          </span>
        ) : null}
      </div>
      {summary ? <p className="mt-2 text-sm leading-relaxed text-aipify-text-secondary">{summary}</p> : null}
      {extra}
    </article>
  );
}

function resolveAccessStateContent(
  accessState: string | undefined,
  labels: Labels
): { title: string; description: string; statusKind: AipifyStatusKind; variant: "error" | "empty" } {
  switch (accessState) {
    case "permission_missing":
    case "access_denied":
      return { ...labels.premium.access.permissionMissing, statusKind: "not_allowed", variant: "error" };
    case "entitlement_missing":
      return { ...labels.premium.access.entitlementMissing, statusKind: "restricted", variant: "error" };
    case "subscription_inactive":
    case "license_inactive":
    case "plan_required":
      return { ...labels.premium.access.planRequired, statusKind: "restricted", variant: "error" };
    case "organization_missing":
    case "membership_missing":
    case "user_not_provisioned":
    case "organization_context_missing":
      return {
        ...labels.premium.access.organizationContextMissing,
        statusKind: "needs_attention",
        variant: "error",
      };
    case "activation_in_progress":
      return { ...labels.premium.access.activationInProgress, statusKind: "waiting", variant: "empty" };
    default:
      return { ...labels.premium.access.generic, statusKind: "needs_attention", variant: "error" };
  }
}

function tabInsightForSection(labels: Labels, section: Ecc590Section): string | null {
  switch (section) {
    case "alerts":
      return labels.tabs.insights.alerts;
    case "approvals":
      return labels.tabs.insights.approvals;
    case "risks":
      return labels.tabs.insights.risks;
    case "opportunities":
      return labels.tabs.insights.opportunities;
    case "performance":
      return labels.tabs.insights.performance;
    case "companionBriefing":
      return labels.tabs.insights.companionBriefing;
    default:
      return null;
  }
}

export function ExecutiveCommandCenterPanel({
  labels,
  activeSection,
  locale,
}: {
  labels: Labels;
  activeSection: Ecc590Section;
  locale: string;
}) {
  const [center, setCenter] = useState<ExecutiveCommandCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const { registerRefreshHandler } = useExecutiveCommandCenterRefresh();
  const resolveLabel = useMemo(
    () => (key: string) => labels.labelLookup[key] ?? humanizeTranslationKey(key),
    [labels.labelLookup]
  );

  const load = useCallback(async () => {
    setLoading(true);
    const rpcSection = ecc590SectionToRpc(activeSection);
    const res = await fetch(`/api/executive-command-center/center?section=${rpcSection}`);
    const json = await res.json().catch(() => ({}));
    setCenter(parseExecutiveCommandCenter(json));
    setLoading(false);
  }, [activeSection]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    registerRefreshHandler(load);
    return () => registerRefreshHandler(null);
  }, [load, registerRefreshHandler]);

  const datasets = useMemo(() => {
    if (!center?.found) return null;
    return {
      alerts: buildAlertsDataset(center),
      approvals: buildApprovalsDataset(center),
      risks: buildRisksDataset(center),
      opportunities: buildOpportunitiesDataset(center),
      performance: buildPerformanceDataset(center),
      companionBriefing: buildCompanionBriefingDataset(center),
      counts: buildEccOverviewCounts(center),
    };
  }, [center]);

  if (loading && !center) {
    return <AppLoadingState message={labels.loading} />;
  }

  if (!center?.found) {
    const access = resolveAccessStateContent(center?.access_state, labels);
    if (access.variant === "empty") {
      return (
        <AppEmptyState
          title={access.title}
          description={access.description}
          actionHref="/app"
          actionLabel={labels.premium.returnToDashboard}
        />
      );
    }
    return (
      <AppErrorState
        title={access.title}
        description={center?.error ?? access.description}
        statusKind={access.statusKind}
        statusLabel={access.title}
        onRetry={() => void load()}
        retryLabel={labels.premium.retry}
        returnHref="/app"
        returnLabel={labels.premium.returnToDashboard}
      />
    );
  }

  const healthScore = center.overall_health_score ?? 0;
  const healthBadge = resolveHealthMetricBadge(healthScore, labels);
  const counts = datasets?.counts ?? buildEccOverviewCounts(center);
  const tabInsight = tabInsightForSection(labels, activeSection);

  if (activeSection === "overview" && center) {
    const attention = buildCommandBriefAttentionItemsFromCenter(center);
    const attentionItems = attention.items;
    const activityFeed = buildCommandBriefActivityFeed(center);
    const kpis = buildCommandBriefKpiCounts(center);
    const nextAction = buildCommandBriefNextAction(center);
    const alertSummary = buildCommandBriefAlertSummary(center, attentionItems);
    const integrationStatus = buildCommandBriefIntegrationStatus(center);

    return (
      <CommandBriefOverview
        labels={labels}
        locale={locale}
        kpis={kpis}
        attentionItems={attentionItems}
        attentionTotalCount={attention.totalCount}
        attentionSeeAllHref={attention.seeAllHref}
        activityItems={activityFeed.items}
        activityTotalCount={activityFeed.totalCount}
        nextAction={nextAction}
        alertItems={alertSummary.items}
        alertTotalCount={alertSummary.totalCount}
        integrationItems={integrationStatus.items}
        integrationTotalCount={integrationStatus.totalCount}
        resolveLabel={resolveLabel}
      />
    );
  }

  const overviewMetrics =
    activeSection === "performance" ? (
      <section
        aria-label={labels.overallHealthScore}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <ExecutiveMetricCard
          featured
          icon={EccTabIcons.health}
          label={labels.overallHealthScore}
          value={healthScore}
          description={labels.premium.metrics.healthDescription}
          {...healthBadge}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.history}
          label={labels.stats.sinceLastLoginItems}
          value={counts.sinceLastLoginItems}
          description={labels.premium.metrics.sinceLastLoginDescription}
          {...resolveSinceLastLoginBadge(counts.sinceLastLoginItems, labels)}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.alerts}
          label={labels.stats.openAlerts}
          value={counts.openAlerts}
          description={labels.premium.metrics.openAlertsDescription}
          {...resolveOpenAlertsBadge(counts.openAlerts, labels)}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.action}
          label={labels.stats.pendingActions}
          value={counts.pendingActions}
          description={labels.premium.metrics.pendingActionsDescription}
          {...resolvePendingActionsBadge(counts.pendingActions, labels)}
        />
        <ExecutiveMetricCard
          icon={EccTabIcons.critical}
          label={labels.stats.criticalItems}
          value={counts.criticalItems}
          description={labels.premium.metrics.criticalItemsDescription}
          {...resolveCriticalItemsBadge(counts.criticalItems, labels)}
        />
      </section>
    ) : null;

  return (
    <div className={AppPremiumShell.sectionGap}>
      <AppSectionHeader
        title={activeSection === "overview" ? labels.premium.todaysOverview : labels.sections[activeSection]}
        subtitle={center.privacy_note ? labels.privacyNote : undefined}
        action={
          center.privacy_note ? (
            <p className="max-w-md text-xs leading-relaxed text-aipify-text-muted">{center.privacy_note}</p>
          ) : null
        }
      />

      {activeSection !== "overview" && activeSection !== "sinceLastLogin" && tabInsight ? (
        <CompanionInsightBanner principle={tabInsight} label={labels.premium.companionInsight} />
      ) : null}

      {activeSection === "performance" ? (
        overviewMetrics
      ) : activeSection === "sinceLastLogin" ? null : (
        overviewMetrics
      )}

      {activeSection === "sinceLastLogin" && (
        <SinceLastLoginPresentation
          labels={labels.sinceLastLoginUx}
          eccItems={center.since_last_login ?? []}
          activitySinceLogin={center.activity_since_login}
          timeline={center.timeline ?? []}
          activityHistoryHref="/app/activity"
        />
      )}

      {activeSection === "alerts" && (
        <section className="grid gap-4">
          {(datasets?.alerts.length ?? 0) === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.tabs.empty.alerts} />
          ) : (
            <CommandCenterItemList items={datasets?.alerts ?? []} resolveLabel={resolveLabel} />
          )}
        </section>
      )}

      {activeSection === "approvals" && (
        <section className="grid gap-4">
          {(datasets?.approvals.length ?? 0) === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.tabs.empty.approvals} />
          ) : (
            <CommandCenterItemList items={datasets?.approvals ?? []} resolveLabel={resolveLabel} />
          )}
        </section>
      )}

      {activeSection === "risks" && (
        <section className="space-y-8">
          {(datasets?.risks.activeRisks.length ?? 0) === 0 &&
          (datasets?.risks.operationalHealth.length ?? 0) === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.tabs.empty.risks} />
          ) : (
            <>
              <CommandCenterSectionBlock
                title={labels.tabs.sections.activeRisks}
                items={datasets?.risks.activeRisks ?? []}
                resolveLabel={resolveLabel}
                emptyTitle={labels.tabs.empty.activeRisks}
                emptyDescription={labels.tabs.empty.activeRisks}
              />
              <CommandCenterSectionBlock
                title={labels.tabs.sections.operationalHealth}
                items={datasets?.risks.operationalHealth ?? []}
                resolveLabel={resolveLabel}
                emptyTitle={labels.tabs.empty.operationalHealth}
                emptyDescription={labels.tabs.empty.operationalHealth}
                variant="health"
              />
            </>
          )}
        </section>
      )}

      {activeSection === "opportunities" && (
        <section className="grid gap-4">
          {(datasets?.opportunities.length ?? 0) === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.tabs.empty.opportunities} />
          ) : (
            <CommandCenterItemList items={datasets?.opportunities ?? []} resolveLabel={resolveLabel} />
          )}
        </section>
      )}

      {activeSection === "performance" && (
        <section className="space-y-8">
          {overviewMetrics}
          <CommandCenterSectionBlock
            title={labels.tabs.sections.performanceHealth}
            items={datasets?.performance.healthItems ?? []}
            resolveLabel={resolveLabel}
            emptyTitle={labels.tabs.empty.performance}
            emptyDescription={labels.tabs.empty.performance}
            variant="health"
          />
        </section>
      )}

      {activeSection === "companionBriefing" && (
        <section className="space-y-8">
          {(datasets?.companionBriefing.executiveBriefings.length ?? 0) === 0 &&
          (datasets?.companionBriefing.dailyBriefings.length ?? 0) === 0 &&
          (datasets?.companionBriefing.boardReports.length ?? 0) === 0 ? (
            <AppEmptyState title={labels.noRecords} description={labels.tabs.empty.companionBriefing} />
          ) : (
            <>
              <CommandCenterSectionBlock
                title={labels.tabs.sections.executiveBriefing}
                items={datasets?.companionBriefing.executiveBriefings ?? []}
                resolveLabel={resolveLabel}
                emptyTitle={labels.tabs.empty.executiveBriefing}
                emptyDescription={labels.tabs.empty.executiveBriefing}
              />
              <CommandCenterSectionBlock
                title={labels.tabs.sections.dailyBriefing}
                items={datasets?.companionBriefing.dailyBriefings ?? []}
                resolveLabel={resolveLabel}
                emptyTitle={labels.tabs.empty.dailyBriefing}
                emptyDescription={labels.tabs.empty.dailyBriefing}
              />
              <CommandCenterSectionBlock
                title={labels.tabs.sections.boardReports}
                items={datasets?.companionBriefing.boardReports ?? []}
                resolveLabel={resolveLabel}
                emptyTitle={labels.tabs.empty.boardReports}
                emptyDescription={labels.tabs.empty.boardReports}
              />
            </>
          )}

          {(center.command_prompts ?? []).length > 0 && (
            <div className="space-y-4">
              <AppSectionHeader title={labels.commandMode} />
              <ul className="flex flex-wrap gap-2">
                {(center.command_prompts ?? []).map((prompt) => (
                  <li key={prompt}>
                    <SemanticBadge type="severity" value="info" label={prompt} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
