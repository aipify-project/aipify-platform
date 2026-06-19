import type { Translator } from "@/lib/i18n/translate";
import type { VerifiedProviderLabels, VerifiedProviderTab } from "./types";
import { PROVIDER_TABS } from "./constants";

export function buildVerifiedProviderLabels(t: Translator): VerifiedProviderLabels {
  const p = "platform.verifiedProviders";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      PROVIDER_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<VerifiedProviderTab, string>,
    overview: {
      verifiedProviders: t(`${p}.overview.verifiedProviders`),
      pendingProviders: t(`${p}.overview.pendingProviders`),
      reviewRequired: t(`${p}.overview.reviewRequired`),
      suspendedProviders: t(`${p}.overview.suspendedProviders`),
      totalServices: t(`${p}.overview.totalServices`),
      activeContracts: t(`${p}.overview.activeContracts`),
    },
    actions: {
      verifyProvider: t(`${p}.actions.verifyProvider`),
      suspendProvider: t(`${p}.actions.suspendProvider`),
      refreshPerformance: t(`${p}.actions.refreshPerformance`),
    },
    verificationStatuses: {
      pending: t(`${p}.verificationStatuses.pending`),
      verified: t(`${p}.verificationStatuses.verified`),
      review_required: t(`${p}.verificationStatuses.review_required`),
      suspended: t(`${p}.verificationStatuses.suspended`),
    },
    performanceLabels: {
      excellent: t(`${p}.performanceLabels.excellent`),
      healthy: t(`${p}.performanceLabels.healthy`),
      review_required: t(`${p}.performanceLabels.review_required`),
    },
  };
}
