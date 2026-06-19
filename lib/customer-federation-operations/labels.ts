import type { Translator } from "@/lib/i18n/translate";
import type { FederationLabels, FederationTab } from "./types";
import { FEDERATION_TABS } from "./constants";

export function buildFederationLabels(t: Translator): FederationLabels {
  const p = "federationOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    workspacesTitle: t(`${p}.workspacesTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      FEDERATION_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<FederationTab, string>,
    overview: {
      activeFederations: t(`${p}.overview.activeFederations`),
      federationNetworks: t(`${p}.overview.federationNetworks`),
      trustRelationships: t(`${p}.overview.trustRelationships`),
      sharedIntelligence: t(`${p}.overview.sharedIntelligence`),
      federatedWorkspaces: t(`${p}.overview.federatedWorkspaces`),
      trustReviewsRequired: t(`${p}.overview.trustReviewsRequired`),
    },
    actions: {
      refreshFederation: t(`${p}.actions.refreshFederation`),
      joinFederation: t(`${p}.actions.joinFederation`),
      approveTrust: t(`${p}.actions.approveTrust`),
      createWorkspace: t(`${p}.actions.createWorkspace`),
      shareIntelligence: t(`${p}.actions.shareIntelligence`),
      publishRiskSignal: t(`${p}.actions.publishRiskSignal`),
      startResearch: t(`${p}.actions.startResearch`),
      openWorkspaces: t(`${p}.actions.openWorkspaces`),
      openNetwork: t(`${p}.actions.openNetwork`),
      openTrustCenter: t(`${p}.actions.openTrustCenter`),
    },
    sections: {
      trustFramework: t(`${p}.sections.trustFramework`),
      sharedIntelligence: t(`${p}.sections.sharedIntelligence`),
      federationAdvisor: t(`${p}.sections.federationAdvisor`),
      benchmarking: t(`${p}.sections.benchmarking`),
      industryObservatory: t(`${p}.sections.industryObservatory`),
      riskNetwork: t(`${p}.sections.riskNetwork`),
      knowledgeFederation: t(`${p}.sections.knowledgeFederation`),
      governanceRules: t(`${p}.sections.governanceRules`),
      audit: t(`${p}.sections.audit`),
    },
    federationStatuses: {
      pending: t(`${p}.federationStatuses.pending`),
      verified: t(`${p}.federationStatuses.verified`),
      active: t(`${p}.federationStatuses.active`),
      review_required: t(`${p}.federationStatuses.review_required`),
      suspended: t(`${p}.federationStatuses.suspended`),
    },
    trustStatuses: {
      pending: t(`${p}.trustStatuses.pending`),
      verified: t(`${p}.trustStatuses.verified`),
      active: t(`${p}.trustStatuses.active`),
      review_required: t(`${p}.trustStatuses.review_required`),
      suspended: t(`${p}.trustStatuses.suspended`),
    },
  };
}
