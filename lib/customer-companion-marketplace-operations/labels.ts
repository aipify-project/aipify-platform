import type { Translator } from "@/lib/i18n/translate";
import type { CompanionMarketplaceLabels, CompanionMarketplaceTab } from "./types";
import { MARKETPLACE_TABS } from "./constants";

export function buildCompanionMarketplaceLabels(t: Translator): CompanionMarketplaceLabels {
  const p = "companionMarketplaceOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    extensionsTitle: t(`${p}.extensionsTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      MARKETPLACE_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<CompanionMarketplaceTab, string>,
    overview: {
      catalogExtensions: t(`${p}.overview.catalogExtensions`),
      installedExtensions: t(`${p}.overview.installedExtensions`),
      updatesAvailable: t(`${p}.overview.updatesAvailable`),
      pendingGovernance: t(`${p}.overview.pendingGovernance`),
      verifiedPublishers: t(`${p}.overview.verifiedPublishers`),
      averageRating: t(`${p}.overview.averageRating`),
    },
    actions: {
      refreshMarketplace: t(`${p}.actions.refreshMarketplace`),
      installExtension: t(`${p}.actions.installExtension`),
      removeExtension: t(`${p}.actions.removeExtension`),
      updateExtension: t(`${p}.actions.updateExtension`),
      approveGovernance: t(`${p}.actions.approveGovernance`),
      openExtensions: t(`${p}.actions.openExtensions`),
      openDevelopers: t(`${p}.actions.openDevelopers`),
      openGovernance: t(`${p}.actions.openGovernance`),
    },
    sections: {
      installationWorkflow: t(`${p}.sections.installationWorkflow`),
      permissionFramework: t(`${p}.sections.permissionFramework`),
      extensionAdvisor: t(`${p}.sections.extensionAdvisor`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      growthPartnerPublishing: t(`${p}.sections.growthPartnerPublishing`),
      audit: t(`${p}.sections.audit`),
    },
    extensionStatuses: {
      active: t(`${p}.extensionStatuses.active`),
      installing: t(`${p}.extensionStatuses.installing`),
      update_available: t(`${p}.extensionStatuses.update_available`),
      permission_required: t(`${p}.extensionStatuses.permission_required`),
      disabled: t(`${p}.extensionStatuses.disabled`),
    },
    certificationStatuses: {
      pending: t(`${p}.certificationStatuses.pending`),
      review: t(`${p}.certificationStatuses.review`),
      certified: t(`${p}.certificationStatuses.certified`),
      published: t(`${p}.certificationStatuses.published`),
    },
  };
}
