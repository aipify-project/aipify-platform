"use client";

import { CommandBriefActivityRow } from "@/components/shared/command-center/CommandBriefActivityRow";
import { CommandBriefAlertRow } from "@/components/shared/command-center/CommandBriefAlertRow";
import { CommandBriefAttentionRow } from "@/components/shared/command-center/CommandBriefAttentionRow";
import { CommandBriefCompactEmpty } from "@/components/shared/command-center/CommandBriefCompactEmpty";
import { CommandBriefIntegrationCard } from "@/components/shared/command-center/CommandBriefIntegrationCard";
import { CommandBriefSectionHeader } from "@/components/shared/command-center/CommandBriefSectionHeader";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import { COMMAND_BRIEF_INTEGRATIONS_LIMIT } from "@/lib/command-center/command-brief-overview";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
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
  activityItems: SinceLastLoginEvent[];
  activityTotalCount: number;
  alertItems: CommandCenterItem[];
  alertTotalCount: number;
  integrationItems: CommandBriefIntegrationStatusItem[];
  integrationTotalCount: number;
  canAccessApprovals: boolean;
  resolveLabel: (key: string) => string;
};

export function CommandBriefOverviewLower({
  labels: o,
  locale,
  attentionItems,
  attentionTotalCount,
  attentionSeeAllHref,
  activityItems,
  activityTotalCount,
  alertItems,
  alertTotalCount,
  integrationItems,
  integrationTotalCount,
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

  return (
    <div className="space-y-5 lg:space-y-6">
      <section id="ecc-attention" aria-labelledby="ecc-attention-title" className="space-y-3">
        <CommandBriefSectionHeader
          id="ecc-attention-title"
          title={o.attentionTitle}
          seeAllHref={attentionTotalCount > attentionItems.length ? attentionSeeAllHref : undefined}
          seeAllLabel={o.attentionViewAll}
        />
        {attentionItems.length === 0 ? (
          <CommandBriefCompactEmpty
            icon="✅"
            title={o.attentionEmptyTitleCompact ?? o.attentionEmptyTitle}
            body={o.attentionEmptyBody}
          />
        ) : (
          <ul className="divide-y divide-aipify-border overflow-hidden rounded-xl border border-aipify-border bg-aipify-surface shadow-sm">
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
          </ul>
        )}
      </section>

      <section aria-labelledby="ecc-activity-title" className="space-y-3">
        <CommandBriefSectionHeader
          id="ecc-activity-title"
          title={o.sinceLastLoginTitle}
          seeAllHref={
            activityTotalCount > activityItems.length ? "/app/command-center/since-last-login" : undefined
          }
          seeAllLabel={o.viewAllActivity}
        />
        {activityItems.length === 0 ? (
          <CommandBriefCompactEmpty
            icon="ℹ️"
            title={o.activityEmptyTitleCompact ?? o.activityEmptyTitle}
            body={o.activityEmptyBody}
          />
        ) : (
          <ul className="divide-y divide-aipify-border overflow-hidden rounded-xl border border-aipify-border bg-aipify-surface shadow-sm">
            {activityItems.map((event) => (
              <CommandBriefActivityRow
                key={event.dedupeKey}
                event={event}
                locale={locale}
                labels={activityLabels}
                resolveLabel={resolveLabel}
              />
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="ecc-alerts-summary" className="space-y-3">
        <CommandBriefSectionHeader
          id="ecc-alerts-summary"
          title={o.alertsSummaryTitle}
          seeAllHref={alertTotalCount > alertItems.length ? "/app/command-center/alerts" : undefined}
          seeAllLabel={o.viewAllAlerts}
        />
        {alertItems.length === 0 ? (
          <CommandBriefCompactEmpty icon="✅" title={o.alertsEmptyTitle} body={o.alertsEmptyBody} />
        ) : (
          <ul className="divide-y divide-aipify-border overflow-hidden rounded-xl border border-aipify-border bg-aipify-surface shadow-sm">
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
          </ul>
        )}
      </section>

      <section aria-labelledby="ecc-integrations-summary" className="space-y-3">
        <CommandBriefSectionHeader
          id="ecc-integrations-summary"
          title={o.integrationsSummaryTitle}
          seeAllHref={
            integrationTotalCount > visibleIntegrations.length ? "/app/platform/integrations" : undefined
          }
          seeAllLabel={o.viewAllIntegrations}
        />
        {visibleIntegrations.length === 0 ? (
          <CommandBriefCompactEmpty
            icon="ℹ️"
            title={o.integrationsEmptyTitle}
            body={o.integrationsEmptyBody}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3">
            {visibleIntegrations.map((item) => (
              <CommandBriefIntegrationCard
                key={item.id}
                item={item}
                locale={locale}
                labels={integrationLabels}
                resolveLabel={resolveLabel}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
