import type { Translator } from "@/lib/i18n/translate";
import type { EnterpriseNetworkLabels, EnterpriseNetworkTab } from "./types";
import { NETWORK_TABS } from "./constants";

export function buildEnterpriseNetworkLabels(t: Translator): EnterpriseNetworkLabels {
  const p = "enterpriseNetworkOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    workspacesTitle: t(`${p}.workspacesTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      NETWORK_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<EnterpriseNetworkTab, string>,
    overview: {
      connectedOrganizations: t(`${p}.overview.connectedOrganizations`),
      pendingInvitations: t(`${p}.overview.pendingInvitations`),
      activeCollaborations: t(`${p}.overview.activeCollaborations`),
      sharedWorkspaces: t(`${p}.overview.sharedWorkspaces`),
      trustReviewsRequired: t(`${p}.overview.trustReviewsRequired`),
      averageTrustScore: t(`${p}.overview.averageTrustScore`),
    },
    actions: {
      refreshNetwork: t(`${p}.actions.refreshNetwork`),
      approveInvitation: t(`${p}.actions.approveInvitation`),
      removeConnection: t(`${p}.actions.removeConnection`),
      createWorkspace: t(`${p}.actions.createWorkspace`),
      shareDocument: t(`${p}.actions.shareDocument`),
      approveDataSharing: t(`${p}.actions.approveDataSharing`),
      openWorkspaces: t(`${p}.actions.openWorkspaces`),
      openEcosystem: t(`${p}.actions.openEcosystem`),
      openMarketplace: t(`${p}.actions.openMarketplace`),
    },
    sections: {
      connectionWorkflow: t(`${p}.sections.connectionWorkflow`),
      dataSharingFramework: t(`${p}.sections.dataSharingFramework`),
      networkAdvisor: t(`${p}.sections.networkAdvisor`),
      documentExchange: t(`${p}.sections.documentExchange`),
      growthPartnerNetwork: t(`${p}.sections.growthPartnerNetwork`),
      marketplaceIntegration: t(`${p}.sections.marketplaceIntegration`),
      audit: t(`${p}.sections.audit`),
    },
    organizationStatuses: {
      pending: t(`${p}.organizationStatuses.pending`),
      verified: t(`${p}.organizationStatuses.verified`),
      connected: t(`${p}.organizationStatuses.connected`),
      review_required: t(`${p}.organizationStatuses.review_required`),
      suspended: t(`${p}.organizationStatuses.suspended`),
    },
    trustLevels: {
      trusted: t(`${p}.trustLevels.trusted`),
      verified: t(`${p}.trustLevels.verified`),
      limited_trust: t(`${p}.trustLevels.limited_trust`),
      review_required: t(`${p}.trustLevels.review_required`),
    },
  };
}
