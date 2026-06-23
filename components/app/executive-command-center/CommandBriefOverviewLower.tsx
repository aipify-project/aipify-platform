"use client";

import type { ReactNode } from "react";

import { CommandBriefActivityRow } from "@/components/shared/command-center/CommandBriefActivityRow";
import { CommandBriefAlertRow } from "@/components/shared/command-center/CommandBriefAlertRow";
import { CommandBriefAttentionRow } from "@/components/shared/command-center/CommandBriefAttentionRow";
import { CommandBriefCompactEmpty } from "@/components/shared/command-center/CommandBriefCompactEmpty";
import { CommandBriefIntegrationRow } from "@/components/shared/command-center/CommandBriefIntegrationRow";
import { CommandBriefItemRow } from "@/components/shared/command-center/CommandBriefItemRow";
import { CommandBriefListGroup } from "@/components/shared/command-center/CommandBriefListGroup";
import { CommandBriefSectionHeader } from "@/components/shared/command-center/CommandBriefSectionHeader";
import { EccTabIcons } from "@/components/app/executive-command-center/ecc-tab-icons";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";

/** Compact summary cards in the priority row right column. */
const COMPACT_INTEGRATIONS_VISIBLE = 3;

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
  approvalItems: CommandCenterItem[];
  approvalTotalCount: number;
  integrationItems: CommandBriefIntegrationStatusItem[];
  integrationTotalCount: number;
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
    <section aria-labelledby={id} className="min-w-0 space-y-2.5">
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
  activityItems,
  activityTotalCount,
  alertItems,
  alertTotalCount,
  approvalItems,
  approvalTotalCount,
  integrationItems,
  integrationTotalCount,
  canAccessApprovals,
  resolveLabel,
}: CommandBriefOverviewLowerProps) {
  const visibleIntegrations = integrationItems.slice(0, COMPACT_INTEGRATIONS_VISIBLE);
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
  const attentionRowLabels = {
    moduleArea: o.attentionModuleArea,
    responsible: o.attentionResponsible,
    updated: o.attentionUpdated,
    viewDetails: o.attentionViewDetails,
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Row 1 — priority: attention (8/12) + compact summaries (4/12) */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start lg:gap-6">
        <div className="min-w-0 lg:col-span-8">
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
                  labels={attentionRowLabels}
                  resolveLabel={resolveLabel}
                  canAccessApprovals={canAccessApprovals}
                />
              ))}
            </CommandBriefListGroup>
          </OverviewSection>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-4">
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
        </div>
      </div>

      {/* Row 2 — activity: full width, max 5 items (data layer) */}
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

      {/* Row 3 — alerts: full width, hidden when empty */}
      {alertItems.length > 0 ? (
        <OverviewSection
          id="ecc-alerts-summary"
          title={o.alertsSummaryTitle}
          seeAllHref={alertTotalCount > alertItems.length ? "/app/command-center/alerts" : undefined}
          seeAllLabel={o.viewAllAlerts}
          hasItems
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
      ) : null}
    </div>
  );
}
