import type { Translator } from "@/lib/i18n/translate";
import type { VerificationStatus } from "./types";

export function buildGlobalBusinessNetworkCenterLabels(t: Translator) {
  const p = "customerApp.globalBusinessNetworkCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    industry: t(`${p}.industry`),
    country: t(`${p}.country`),
    languages: t(`${p}.languages`),
    services: t(`${p}.services`),
    products: t(`${p}.products`),
    businessPacks: t(`${p}.businessPacks`),
    location: t(`${p}.location`),
    confidence: t(`${p}.confidence`),
    rating: t(`${p}.rating`),
    specialties: t(`${p}.specialties`),
    territory: t(`${p}.territory`),
    prospects: t(`${p}.prospects`),
    team: t(`${p}.team`),
    performance: t(`${p}.performance`),
    sections: {
      organizations: t(`${p}.sections.organizations`),
      partners: t(`${p}.sections.partners`),
      vendors: t(`${p}.sections.vendors`),
      serviceProviders: t(`${p}.sections.serviceProviders`),
      growthPartners: t(`${p}.sections.growthPartners`),
      opportunities: t(`${p}.sections.opportunities`),
      introductions: t(`${p}.sections.introductions`),
      collaboration: t(`${p}.sections.collaboration`),
    },
    organizationProfiles: { title: t(`${p}.organizationProfiles.title`) },
    verificationSystem: { title: t(`${p}.verificationSystem.title`) },
    opportunityMarketplace: { title: t(`${p}.opportunityMarketplace.title`) },
    smartMatching: { title: t(`${p}.smartMatching.title`) },
    trustedVendorDirectory: { title: t(`${p}.trustedVendorDirectory.title`) },
    growthPartnerNetwork: { title: t(`${p}.growthPartnerNetwork.title`) },
    collaborationCenter: { title: t(`${p}.collaborationCenter.title`) },
    executiveDashboard: { title: t(`${p}.executiveDashboard.title`) },
    companionAdvisor: { title: t(`${p}.companionAdvisor.title`), reason: t(`${p}.companionAdvisor.reason`) },
    networkSettings: {
      title: t(`${p}.networkSettings.title`),
      enabled: t(`${p}.networkSettings.enabled`),
      publicProfile: t(`${p}.networkSettings.publicProfile`),
      connections: t(`${p}.networkSettings.connections`),
    },
    verification: {
      verified: t(`${p}.verification.verified`),
      pending: t(`${p}.verification.pending`),
      failed: t(`${p}.verification.failed`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      connect: t(`${p}.actions.connect`),
      escalate: t(`${p}.actions.escalate`),
    },
    status: {
      completed: t(`${p}.status.completed`),
      notAllowed: t(`${p}.status.notAllowed`),
      requiresAttention: t(`${p}.status.requiresAttention`),
      information: t(`${p}.status.information`),
      restricted: t(`${p}.status.restricted`),
      verified: t(`${p}.status.verified`),
      waiting: t(`${p}.status.waiting`),
    },
    links: {
      ecosystem: t(`${p}.links.ecosystem`),
      growthPartners: t(`${p}.links.growthPartners`),
    },
  };
}

export type GlobalBusinessNetworkCenterLabels = ReturnType<typeof buildGlobalBusinessNetworkCenterLabels>;

export function getVerificationLabel(status: VerificationStatus | string, labels: GlobalBusinessNetworkCenterLabels["verification"]): string {
  if (status === "verified") return labels.verified;
  if (status === "failed") return labels.failed;
  return labels.pending;
}
