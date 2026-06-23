"use client";

import type { ReactNode } from "react";

import { CommandBriefActivityRow } from "@/components/shared/command-center/CommandBriefActivityRow";
import { CommandBriefAlertRow } from "@/components/shared/command-center/CommandBriefAlertRow";
import { CommandBriefAttentionRow } from "@/components/shared/command-center/CommandBriefAttentionRow";
import { CommandBriefCompactEmpty } from "@/components/shared/command-center/CommandBriefCompactEmpty";
import { CommandBriefIntegrationRow } from "@/components/shared/command-center/CommandBriefIntegrationRow";
import { CommandBriefItemRow } from "@/components/shared/command-center/CommandBriefItemRow";
import { CommandBriefListGroup } from "@/components/shared/command-center/CommandBriefListGroup";
import { CommandBriefPremiumRow } from "@/components/shared/command-center/CommandBriefPremiumRow";
import { CommandBriefSectionHeader } from "@/components/shared/command-center/CommandBriefSectionHeader";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import { COMMAND_BRIEF_INTEGRATIONS_LIMIT } from "@/lib/command-center/command-brief-overview";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import { mapHealthScoreToHealthState } from "@/lib/design/semantic-status-system";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;
type OverviewLabels = Labels["commandBriefOverview"];

type CommandBriefOverviewLowerProps = {
  labels: OverviewLabels;
  locale: string;
  attentionItems: CommandBriefAttentionItem[];
  attentionTotalCount: number;
  attentionSeeAllHref: string;
  nextAction: CommandCenterItem | null;
  activityItems: SinceLastLoginEvent[];
  activityTotalCount: number;
  alertItems: CommandCenterItem[];
  alertTotalCount: number;
  approvalItems: CommandCenterItem[];
  approvalTotalCount: number;
  healthItems: CommandCenterItem[];
  healthTotalCount: number;
  healthOverallScore: number | null;
  integrationItems: CommandBriefIntegrationStatusItem[];
  integrationTotalCount: number;
  recommendationItems: CommandCenterItem[];
  recommendationTotalCount: number;
  canAccessApprovals: boolean;
  resolveLabel: (key: string) => string;
};

function OverviewSection({
  id,
  title,
  seeAllHref,
  seeAllLabel,
  empty,
  hasItems,
  children,
}: {
  id: string;
  title: string;
  seeAllHref?: string;
  seeAllLabel?: string;
  empty: { icon?: string; title: string; body?: string };
  hasItems: boolean;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-3">
      <CommandBriefSectionHeader id={id} title={title} seeAllHref={seeAllHref} seeAllLabel={seeAllLabel} />
      {hasItems ? children : <CommandBriefCompactEmpty icon={empty.icon} title={empty.title} body={empty.body} />}
    </section>
  );
}

export function CommandBriefOverviewLower({
  labels: o,
  locale,
  attentionItems,
  attentionTotalCount,
  attentionSeeAllHref,
  nextAction,
  activityItems,
  activityTotalCount,
  alertItems,
  alertTotalCount,
  approvalItems,
  approvalTotalCount,
  healthItems,
  healthTotalCount,
  healthOverallScore,
  integrationItems,
  integrationTotalCount,
  recommendationItems,
  recommendationTotalCount,
  canAccessApprovals,
  resolveLabel,
}: CommandBriefOverviewLowerProps) {
  const visibleIntegrations = integrationItems.slice(0, COMMAND_BRIEF_INTEGRATIONS_LIMIT);
  const activityLabels = {
    activityCategories: o.activityCategories,
    activitySource: o.activitySource,
    activityAction: o.activityAction,
  };
  const integrationLabels = {
    integrationLatestActivity: o.integrationLatestActivity,
    integrationLastSync: o.integrationLastSync,
    integrationAccessMode: o.integrationAccessMode,
    integrationEventsCount: o.integrationEventsCount,
    integrationAlertsCount: o.integrationAlertsCount,
  };

  const healthState =
    healthOverallScore != null ? mapHealthScoreToHealthState(healthOverallScore) : null;
  const healthHasContent = healthItems.length > 0 || healthOverallScore != null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
      <div className="min-w-0 space-y-6">
        <OverviewSection
          id="ecc-attention-title"
          title={o.attentionTitle}
          seeAllHref={attentionTotalCount > attentionItems.length ? attentionSeeAllHref : undefined}
          seeAllLabel={o.attentionViewAll}
          hasItems={attentionItems.length > 0}
          empty={{
            icon: "✅",
            title: o.attentionEmptyTitleCompact ?? o.attentionEmptyTitle,
            body: o.attentionEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-attention-title">
            {attentionItems.map((item) => (
              <CommandBriefAttentionRow
                key={item.dedupeKey}
                item={item}
                locale={locale}
                labels={{
                  moduleArea: o.attentionModuleArea,
                  responsible: o.attentionResponsible,
                  updated: o.attentionUpdated,
                  viewDetails: o.attentionViewDetails,
                }}
                resolveLabel={resolveLabel}
                canAccessApprovals={canAccessApprovals}
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>

        <OverviewSection
          id="ecc-next-action-title"
          title={o.nextActionTitle}
          hasItems={nextAction != null}
          empty={{
            icon: "✅",
            title: o.nextActionEmptyTitle,
            body: o.nextActionEmptyBody,
          }}
        >
          {nextAction ? (
            <CommandBriefListGroup labelledBy="ecc-next-action-title">
              <CommandBriefItemRow
                item={nextAction}
                locale={locale}
                icon={EccTabIcons.action}
                iconTone="brand"
                sourcePrefix={o.nextActionArea}
                resolveLabel={resolveLabel}
              />
            </CommandBriefListGroup>
          ) : null}
        </OverviewSection>

        <OverviewSection
          id="ecc-activity-title"
          title={o.sinceLastLoginTitle}
          seeAllHref={
            activityTotalCount > activityItems.length ? "/app/command-center/since-last-login" : undefined
          }
          seeAllLabel={o.viewAllActivity}
          hasItems={activityItems.length > 0}
          empty={{
            icon: "ℹ️",
            title: o.activityEmptyTitleCompact ?? o.activityEmptyTitle,
            body: o.activityEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-activity-title">
            {activityItems.map((event) => (
              <CommandBriefActivityRow
                key={event.dedupeKey}
                event={event}
                locale={locale}
                labels={activityLabels}
                resolveLabel={resolveLabel}
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>

        <OverviewSection
          id="ecc-alerts-summary"
          title={o.alertsSummaryTitle}
          seeAllHref={alertTotalCount > alertItems.length ? "/app/command-center/alerts" : undefined}
          seeAllLabel={o.viewAllAlerts}
          hasItems={alertItems.length > 0}
          empty={{
            icon: "✅",
            title: o.alertsEmptyTitle,
            body: o.alertsEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-alerts-summary">
            {alertItems.map((item) => (
              <CommandBriefAlertRow
                key={item.dedupeKey}
                item={item}
                locale={locale}
                labels={{
                  alertImpact: o.alertImpact,
                  activityAction: o.activityAction,
                }}
                resolveLabel={resolveLabel}
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>
      </div>

      <div className="min-w-0 space-y-6">
        <OverviewSection
          id="ecc-approvals-summary"
          title={o.approvalsSummaryTitle}
          seeAllHref={
            approvalTotalCount > approvalItems.length ? "/app/command-center/approvals" : undefined
          }
          seeAllLabel={o.viewAllApprovals}
          hasItems={approvalItems.length > 0}
          empty={{
            icon: "✅",
            title: o.approvalsEmptyTitle,
            body: o.approvalsEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-approvals-summary">
            {approvalItems.map((item) => (
              <CommandBriefItemRow
                key={item.dedupeKey}
                item={item}
                locale={locale}
                icon={EccTabIcons.approvals}
                sourcePrefix={o.activitySource}
                resolveLabel={resolveLabel}
                asLink
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>

        <OverviewSection
          id="ecc-health-summary"
          title={o.organizationHealthTitle}
          seeAllHref={
            healthTotalCount > healthItems.length ? "/app/command-center/performance" : undefined
          }
          seeAllLabel={o.viewAllHealth}
          hasItems={healthHasContent}
          empty={{
            icon: "ℹ️",
            title: o.organizationHealthEmptyTitle,
            body: o.organizationHealthEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-health-summary">
            {healthOverallScore != null && healthItems.length === 0 ? (
              <CommandBriefPremiumRow
                icon={EccTabIcons.health}
                iconTone={healthState === "healthy" || healthState === "good" ? "verified" : "attention"}
                title={o.organizationHealthOverallLabel.replace("{score}", String(healthOverallScore))}
                description={o.kpiHealthDesc}
                primaryBadge={{
                  type: "health",
                  value: healthState ?? "moderate",
                  labelKey: `common.status.semantic.health.${healthState ?? "moderate"}`,
                }}
                actionHref="/app/command-center/performance"
                actionLabel={resolveLabel(
                  "customerApp.executiveCommandCenter.tabs.performance.actions.viewHealth",
                )}
                resolveLabel={resolveLabel}
              />
            ) : null}
            {healthItems.map((item) => (
              <CommandBriefItemRow
                key={item.dedupeKey}
                item={item}
                locale={locale}
                icon={EccTabIcons.health}
                sourcePrefix={o.activitySource}
                resolveLabel={resolveLabel}
                asLink
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>

        <OverviewSection
          id="ecc-integrations-summary"
          title={o.integrationsSummaryTitle}
          seeAllHref={
            integrationTotalCount > visibleIntegrations.length ? "/app/platform/integrations" : undefined
          }
          seeAllLabel={o.viewAllIntegrations}
          hasItems={visibleIntegrations.length > 0}
          empty={{
            icon: "ℹ️",
            title: o.integrationsEmptyTitle,
            body: o.integrationsEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-integrations-summary">
            {visibleIntegrations.map((item) => (
              <CommandBriefIntegrationRow
                key={item.id}
                item={item}
                locale={locale}
                labels={integrationLabels}
                resolveLabel={resolveLabel}
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>

        <OverviewSection
          id="ecc-recommendations-summary"
          title={o.recommendationsNowTitle}
          seeAllHref={
            recommendationTotalCount > recommendationItems.length
              ? "/app/command-center/opportunities"
              : undefined
          }
          seeAllLabel={o.viewAllRecommendations}
          hasItems={recommendationItems.length > 0}
          empty={{
            icon: "ℹ️",
            title: o.recommendationsEmptyTitle,
            body: o.recommendationsEmptyBody,
          }}
        >
          <CommandBriefListGroup labelledBy="ecc-recommendations-summary">
            {recommendationItems.map((item) => (
              <CommandBriefItemRow
                key={item.dedupeKey}
                item={item}
                locale={locale}
                icon={EccTabIcons.companionBriefing}
                iconTone="brand"
                sourcePrefix={o.activitySource}
                resolveLabel={resolveLabel}
                asLink
              />
            ))}
          </CommandBriefListGroup>
        </OverviewSection>
      </div>
    </div>
  );
}
