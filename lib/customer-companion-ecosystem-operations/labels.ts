import type { Translator } from "@/lib/i18n/translate";
import type { CompanionEcosystemLabels, CompanionEcosystemTab } from "./types";
import { ECOSYSTEM_TABS } from "./constants";

export function buildCompanionEcosystemLabels(t: Translator): CompanionEcosystemLabels {
  const p = "companionEcosystemOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      ECOSYSTEM_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<CompanionEcosystemTab, string>,
    overview: {
      verifiedProviders: t(`${p}.overview.verifiedProviders`),
      marketplaceServices: t(`${p}.overview.marketplaceServices`),
      activeRequests: t(`${p}.overview.activeRequests`),
      pendingApprovals: t(`${p}.overview.pendingApprovals`),
      completedRequests: t(`${p}.overview.completedRequests`),
      averageRating: t(`${p}.overview.averageRating`),
      activeContracts: t(`${p}.overview.activeContracts`),
    },
    actions: {
      refreshMarketplace: t(`${p}.actions.refreshMarketplace`),
      createRequest: t(`${p}.actions.createRequest`),
      approveRequest: t(`${p}.actions.approveRequest`),
      denyRequest: t(`${p}.actions.denyRequest`),
      openServices: t(`${p}.actions.openServices`),
      openGovernance: t(`${p}.actions.openGovernance`),
      openProviderRegistry: t(`${p}.actions.openProviderRegistry`),
    },
    sections: {
      serviceAdvisor: t(`${p}.sections.serviceAdvisor`),
      serviceWorkflow: t(`${p}.sections.serviceWorkflow`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      growthPartnerIntegration: t(`${p}.sections.growthPartnerIntegration`),
      domainAwareness: t(`${p}.sections.domainAwareness`),
      companionRecommendations: t(`${p}.sections.companionRecommendations`),
      audit: t(`${p}.sections.audit`),
    },
    performanceLabels: {
      excellent: t(`${p}.performanceLabels.excellent`),
      healthy: t(`${p}.performanceLabels.healthy`),
      review_required: t(`${p}.performanceLabels.review_required`),
    },
    verificationStatuses: {
      pending: t(`${p}.verificationStatuses.pending`),
      verified: t(`${p}.verificationStatuses.verified`),
      review_required: t(`${p}.verificationStatuses.review_required`),
      suspended: t(`${p}.verificationStatuses.suspended`),
    },
  };
}
