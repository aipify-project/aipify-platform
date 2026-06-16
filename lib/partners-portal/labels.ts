import type { Translator } from "@/lib/i18n/translate";
import { PARTNERS_PORTAL_NAV_GROUPS } from "./nav-config";
import type { PartnersPortalLabels } from "./types";

export function buildPartnersPortalLabels(t: Translator): PartnersPortalLabels {
  const d = "partnersPortal.dashboard";
  const f = "partnersPortal.foundation";
  const s = "partnersPortal.shell";

  return {
    dashboard: {
      title: t(`${d}.title`),
      subtitle: t(`${d}.subtitle`),
      loading: t(`${d}.loading`),
      principle: t(`${d}.principle`),
      privacyNote: t(`${d}.privacyNote`),
      leadsAssigned: t(`${d}.leadsAssigned`),
      conversionMetrics: t(`${d}.conversionMetrics`),
      conversionRate: t(`${d}.conversionRate`),
      pipelineOverview: t(`${d}.pipelineOverview`),
      upcomingFollowUps: t(`${d}.upcomingFollowUps`),
      partnerRankings: t(`${d}.partnerRankings`),
      monthlyPerformance: t(`${d}.monthlyPerformance`),
      referralStatistics: t(`${d}.referralStatistics`),
      certificationProgress: t(`${d}.certificationProgress`),
      activeReferrals: t(`${d}.activeReferrals`),
      convertedReferrals: t(`${d}.convertedReferrals`),
      invitedReferrals: t(`${d}.invitedReferrals`),
      leadsThisMonth: t(`${d}.leadsThisMonth`),
      convertedCustomers: t(`${d}.convertedCustomers`),
      noFollowUps: t(`${d}.noFollowUps`),
      portalModules: t(`${d}.portalModules`),
      openModule: t(`${d}.openModule`),
    },
    foundation: {
      back: t(`${f}.back`),
      structureNote: t(`${f}.structureNote`),
    },
    shell: {
      portalBadge: t(`${s}.portalBadge`),
      portalTitle: t(`${s}.portalTitle`),
      portalSubtitle: t(`${s}.portalSubtitle`),
      governanceNote: t(`${s}.governanceNote`),
      accessDenied: t(`${s}.accessDenied`),
      loading: t(`${s}.loading`),
    },
  };
}

export function buildPartnersPortalNavLabels(t: Translator): Record<string, string> {
  const entries: Array<[string, string]> = [];
  for (const group of PARTNERS_PORTAL_NAV_GROUPS) {
    entries.push([group.id, t(group.labelKey)]);
    for (const item of group.items) {
      entries.push([item.id, t(item.labelKey)]);
    }
  }
  return Object.fromEntries(entries);
}

export function buildPartnersPortalGroupLabels(
  t: Translator
): Record<string, { title: string }> {
  return Object.fromEntries(
    PARTNERS_PORTAL_NAV_GROUPS.map((group) => [
      group.id,
      { title: t(group.labelKey) },
    ])
  );
}
