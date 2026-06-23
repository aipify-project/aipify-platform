"use client";

import { useState } from "react";
import { useOptionalCompanionExperience } from "@/components/app/companion-experience/CompanionExperienceProvider";
import { CompanionIcon } from "@/components/app/companion-experience/CompanionIcon";
import { SemanticBadge } from "@/components/ui/semantic-badge";
import { AppPremiumShell } from "@/lib/design/app-premium-shell";
import type { CommandBriefAttentionItem } from "@/lib/command-center/command-brief-attention";
import type { CommandCenterItem } from "@/lib/command-center/ecc-tab-datasets";
import type { CommandBriefIntegrationStatusItem } from "@/lib/command-center/command-brief-integration-status";
import type { SinceLastLoginEvent } from "@/lib/command-center/since-last-login";
import type { buildExecutiveCommandCenterLabels } from "@/lib/executive-command-center-engine/labels";
import { mapUserRoleToOrganizationRole, roleHasPermission } from "@/lib/core/organization";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { CommandBriefOverviewLower } from "./CommandBriefOverviewLower";

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
      className={`${AppPremiumShell.elevatedCard} relative overflow-hidden border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 shadow-md ring-1 ring-violet-100/80 sm:p-6 ${className}`}
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
          <p className={`mt-3 text-[13px] leading-relaxed text-aipify-text-secondary sm:text-sm`}>
            {labels.companionIntro}
          </p>
          <p className={`mt-2 text-[13px] leading-snug text-aipify-text-muted`}>
            {labels.companionActiveOrg}: <span className="font-medium text-aipify-text">{orgName}</span>
          </p>
        </div>
      </div>

      <div className="relative mt-5 space-y-4">
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
            className={`min-h-12 w-full rounded-xl border border-aipify-border bg-white px-4 py-3 text-[13px] text-aipify-text shadow-sm placeholder:text-aipify-text-muted sm:text-sm ${AppPremiumShell.focusRing}`}
          />
        </label>
        <ul className="grid gap-2 sm:grid-cols-2">
          {suggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => openWith(suggestion)}
                className={`min-h-11 w-full rounded-xl border border-violet-200 bg-white px-3 py-2 text-left text-[13px] font-medium text-violet-800 transition hover:border-violet-300 hover:bg-violet-50 sm:text-sm ${AppPremiumShell.focusRing}`}
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
          className={`inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-aipify-companion px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-aipify-companion-hover disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm ${AppPremiumShell.focusRing}`}
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
  healthItems: CommandCenterItem[];
  healthTotalCount: number;
  healthOverallScore: number | null;
  integrationItems: CommandBriefIntegrationStatusItem[];
  integrationTotalCount: number;
  recommendationItems: CommandCenterItem[];
  recommendationTotalCount: number;
  resolveLabel: (key: string) => string;
};

export function CommandBriefOverview({
  labels,
  locale,
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
  healthItems,
  healthTotalCount,
  healthOverallScore,
  integrationItems,
  integrationTotalCount,
  recommendationItems,
  recommendationTotalCount,
  resolveLabel,
}: CommandBriefOverviewProps) {
  const profile = useOptionalDashboardProfile();
  const o = labels.commandBriefOverview;

  const userRole = profile?.profile?.user.role;
  const canAccessApprovals =
    userRole != null &&
    roleHasPermission(mapUserRoleToOrganizationRole(userRole), "approve_ai_actions");

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <CommandBriefOverviewLower
        labels={o}
        locale={locale}
        attentionItems={attentionItems}
        attentionTotalCount={attentionTotalCount}
        attentionSeeAllHref={attentionSeeAllHref}
        nextAction={nextAction}
        activityItems={activityItems}
        activityTotalCount={activityTotalCount}
        alertItems={alertItems}
        alertTotalCount={alertTotalCount}
        approvalItems={approvalItems}
        approvalTotalCount={approvalTotalCount}
        healthItems={healthItems}
        healthTotalCount={healthTotalCount}
        healthOverallScore={healthOverallScore}
        integrationItems={integrationItems}
        integrationTotalCount={integrationTotalCount}
        recommendationItems={recommendationItems}
        recommendationTotalCount={recommendationTotalCount}
        canAccessApprovals={canAccessApprovals}
        resolveLabel={resolveLabel}
      />

      <CommandBriefCompanionCard labels={o} />
    </div>
  );
}
