"use client";

import { useState } from "react";
import { useOptionalCompanionExperience } from "@/components/app/companion-experience/CompanionExperienceProvider";
import { CompanionIcon } from "@/components/app/companion-experience/CompanionIcon";
import { ExecutiveMetricCard } from "@/components/app/design";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import {
  resolveAttentionKpiStatus,
  resolveAwaitingApprovalKpiStatus,
  resolveHealthKpiStatus,
  resolveNextActionKpiStatus,
  resolvePreparedKpiStatus,
  resolveSinceLastLoginKpiStatus,
} from "@/lib/command-center/command-brief-kpi-status";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import type { CommandBriefKpiCounts } from "@/lib/command-center/command-brief-overview";
import { resolveCommandBriefRecordTitle } from "@/lib/command-center/command-brief-record-title-labels";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { mapUserRoleToOrganizationRole, roleHasPermission } from "@/lib/core/organization";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { CommandBriefOverviewLower } from "./CommandBriefOverviewLower";
import { EccTabIcons } from "./ecc-tab-icons";

type Labels = ReturnType<typeof buildExecutiveCommandCenterLabels>;
type OverviewLabels = Labels["commandBriefOverview"];

type CommandBriefCompanionCardProps = {
  labels: OverviewLabels;
  className?: string;
};

export function CommandBriefCompanionCard({ labels, className = "" }: CommandBriefCompanionCardProps) {
  const companion = useOptionalCompanionExperience();
  const profile = useOptionalDashboardProfile();
  const [query, setQuery] = useState("");
  const orgName =
    profile?.loading === true
      ? null
      : profile?.profile?.company.name?.trim() || null;

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
      className={`${AppPremiumShell.elevatedCard} relative flex h-full min-h-0 flex-col overflow-hidden border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 shadow-md ring-1 ring-violet-100/80 sm:p-6 lg:p-7 ${className}`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-100/60" aria-hidden="true" />
      <div className="relative flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-violet-100">
          <CompanionIcon className="h-9 w-9" withRing />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className={AppPremiumShell.commandBriefSectionTitle}>{labels.companionTitle}</h2>
          <div className="mt-2">
            <SemanticBadge type="workflow" value="completed" label={labels.companionStatusReady} />
          </div>
          <p className={`mt-3 ${AppPremiumShell.commandBriefBody}`}>{labels.companionIntro}</p>
          <p className={`mt-3 ${AppPremiumShell.commandBriefMeta}`}>
            {labels.companionActiveOrg}:{" "}
            <span className="font-medium text-aipify-text">
              {orgName ?? labels.orgNameUnavailable}
            </span>
          </p>
        </div>
      </div>

      <div className="relative mt-5 flex min-h-0 flex-1 flex-col space-y-4 overflow-y-auto">
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
            className={`min-h-14 w-full rounded-xl border border-aipify-border bg-white px-4 py-3.5 text-base text-aipify-text shadow-sm placeholder:text-aipify-text-muted ${AppPremiumShell.focusRing}`}
          />
        </label>
        <ul className="flex flex-col gap-2.5">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => openWith(suggestion)}
                className={`min-h-12 w-full rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-left text-base font-medium text-violet-800 transition hover:border-violet-300 hover:bg-violet-50 ${AppPremiumShell.focusRing}`}
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
          className={`inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-aipify-companion px-4 py-3 text-base font-semibold text-white transition hover:bg-aipify-companion-hover disabled:cursor-not-allowed disabled:opacity-50 ${AppPremiumShell.focusRing}`}
        >
          {labels.companionAsk}
        </button>
      </div>
    </article>
  );
}

type CommandBriefOverviewProps = {
  labels: Labels;
  locale: string;
  kpis: CommandBriefKpiCounts;
  attentionItems: CommandBriefAttentionItem[];
  attentionTotalCount: number;
  attentionSeeAllHref: string;
  activityItems: SinceLastLoginEvent[];
  activityTotalCount: number;
  nextAction: CommandCenterItem | null;
  alertItems: CommandCenterItem[];
  alertTotalCount: number;
  approvalItems: CommandCenterItem[];
  approvalTotalCount: number;
  integrationItems: CommandBriefIntegrationStatusItem[];
  integrationTotalCount: number;
  resolveLabel: (key: string) => string;
};

export function CommandBriefOverview({
  labels,
  locale,
  kpis,
  attentionItems,
  attentionTotalCount,
  attentionSeeAllHref,
  activityItems,
  activityTotalCount,
  nextAction,
  alertItems,
  alertTotalCount,
  approvalItems,
  approvalTotalCount,
  integrationItems,
  integrationTotalCount,
  resolveLabel,
}: CommandBriefOverviewProps) {
  const profile = useOptionalDashboardProfile();
  const o = labels.commandBriefOverview;
  const healthScore = kpis.organizationHealth;
  const kpiStatus = o.kpiStatus;
  const metricLabelClass = AppPremiumShell.commandBriefMetricLabel;
  const metricValueClass = AppPremiumShell.commandBriefMetricValue;
  const metricDescriptionClass = AppPremiumShell.commandBriefMetricDescription;

  const userRole = profile?.profile?.user.role;
  const canAccessApprovals =
    userRole != null &&
    roleHasPermission(mapUserRoleToOrganizationRole(userRole), "approve_ai_actions");
  const approvalsHref = canAccessApprovals ? "/app/approvals" : undefined;

  const sinceLastLoginStatus = resolveSinceLastLoginKpiStatus(kpis.sinceLastLogin, kpiStatus);
  const preparedStatus = resolvePreparedKpiStatus(kpis.preparedByAipify, kpiStatus);
  const attentionStatus = resolveAttentionKpiStatus(kpis.requiresAttention, kpiStatus);
  const approvalStatus = resolveAwaitingApprovalKpiStatus(kpis.awaitingApproval, kpiStatus);
  const healthStatus = resolveHealthKpiStatus(healthScore, kpiStatus);
  const nextActionStatus = resolveNextActionKpiStatus(nextAction != null, kpiStatus);
  const nextActionValue = nextAction
    ? resolveCommandBriefRecordTitle(nextAction.title, resolveLabel)
    : o.nextActionEmptyTitle;
  const nextActionDescription = nextAction
    ? nextAction.description?.trim() || o.kpiNextActionDesc
    : o.nextActionEmptyBody;
  const nextActionHref = nextAction?.href;

  const landingKpiCards = [
    {
      key: "since-last-login",
      card: (
        <ExecutiveMetricCard
          icon={EccTabIcons.history}
          label={o.kpiSinceLastLogin}
          value={kpis.sinceLastLogin}
          description={o.kpiSinceLastLoginDesc}
          labelClassName={metricLabelClass}
          valueClassName={metricValueClass}
          descriptionClassName={metricDescriptionClass}
          {...sinceLastLoginStatus}
        />
      ),
    },
    {
      key: "prepared",
      card: (
        <ExecutiveMetricCard
          icon={EccTabIcons.action}
          label={o.kpiPrepared}
          value={kpis.preparedByAipify}
          description={o.kpiPreparedDesc}
          labelClassName={metricLabelClass}
          valueClassName={metricValueClass}
          descriptionClassName={metricDescriptionClass}
          {...preparedStatus}
        />
      ),
    },
    {
      key: "attention",
      card: (
        <ExecutiveMetricCard
          icon={EccTabIcons.alerts}
          label={o.kpiAttention}
          value={kpis.requiresAttention}
          description={o.kpiAttentionDesc}
          labelClassName={metricLabelClass}
          valueClassName={metricValueClass}
          descriptionClassName={metricDescriptionClass}
          {...attentionStatus}
        />
      ),
    },
    {
      key: "approval",
      card: (
        <ExecutiveMetricCard
          icon={EccTabIcons.approvals}
          label={o.kpiApproval}
          value={kpis.awaitingApproval}
          description={o.kpiApprovalDesc}
          labelClassName={metricLabelClass}
          valueClassName={metricValueClass}
          descriptionClassName={metricDescriptionClass}
          href={approvalsHref}
          {...approvalStatus}
        />
      ),
    },
    {
      key: "health",
      card: (
        <ExecutiveMetricCard
          icon={EccTabIcons.health}
          label={o.kpiHealth}
          value={healthScore ?? "—"}
          description={o.kpiHealthDesc}
          labelClassName={metricLabelClass}
          valueClassName={metricValueClass}
          descriptionClassName={metricDescriptionClass}
          {...healthStatus}
        />
      ),
    },
    {
      key: "next-action",
      card: (
        <ExecutiveMetricCard
          icon={EccTabIcons.action}
          label={o.nextActionTitle}
          value={nextActionValue}
          description={nextActionDescription}
          labelClassName={metricLabelClass}
          valueClassName={metricValueClass}
          descriptionClassName={metricDescriptionClass}
          href={nextActionHref}
          {...nextActionStatus}
        />
      ),
    },
  ] as const;

  return (
    <div className={`${AppPremiumShell.commandBriefGrid} w-full min-w-0`}>
      <section
        aria-label={o.title}
        className="col-span-12 lg:grid lg:grid-cols-12 lg:items-stretch lg:gap-4"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-3 lg:auto-rows-fr">
          {landingKpiCards.slice(0, 3).map((item) => (
            <div key={item.key} className="min-h-0">
              {item.card}
            </div>
          ))}

          <div className="lg:hidden">
            <CommandBriefCompanionCard labels={o} className="min-h-[320px] max-h-[min(70vh,640px)]" />
          </div>

          {landingKpiCards.slice(3).map((item) => (
            <div key={item.key} className="min-h-0">
              {item.card}
            </div>
          ))}
        </div>

        <aside
          aria-label={o.companionTitle}
          className="pointer-coarse:static hidden lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:flex lg:min-h-0 lg:flex-col xl:sticky xl:top-24 xl:max-h-[calc(100vh-6rem)] xl:self-start [@media(max-height:720px)]:static [@media(max-height:720px)]:max-h-none"
        >
          <CommandBriefCompanionCard labels={o} className="min-h-[320px] max-h-[inherit] flex-1" />
        </aside>
      </section>

      <div className="col-span-12">
        <CommandBriefOverviewLower
          labels={o}
          locale={locale}
          attentionItems={attentionItems}
          attentionTotalCount={attentionTotalCount}
          attentionSeeAllHref={attentionSeeAllHref}
          activityItems={activityItems}
          activityTotalCount={activityTotalCount}
          alertItems={alertItems}
          alertTotalCount={alertTotalCount}
          approvalItems={approvalItems}
          approvalTotalCount={approvalTotalCount}
          integrationItems={integrationItems}
          integrationTotalCount={integrationTotalCount}
          canAccessApprovals={canAccessApprovals}
          resolveLabel={resolveLabel}
        />
      </div>
    </div>
  );
}
