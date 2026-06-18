import type { Translator } from "@/lib/i18n/translate";

export function buildOrganizationalRelationshipIntelligenceLabels(t: Translator) {
  const p = "customerApp.organizationalRelationshipIntelligence";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    governanceNote: t(`${p}.governanceNote`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    sections: {
      customerRelationships: t(`${p}.sections.customerRelationships`),
      employeeRelationships: t(`${p}.sections.employeeRelationships`),
      vendorRelationships: t(`${p}.sections.vendorRelationships`),
      partnerRelationships: t(`${p}.sections.partnerRelationships`),
      projectRelationships: t(`${p}.sections.projectRelationships`),
      dependencyMap: t(`${p}.sections.dependencyMap`),
    },
    entity: {
      owner: t(`${p}.entity.owner`),
      department: t(`${p}.entity.department`),
      lastContact: t(`${p}.entity.lastContact`),
      openTasks: t(`${p}.entity.openTasks`),
      openSupportCases: t(`${p}.entity.openSupportCases`),
      revenue: t(`${p}.entity.revenue`),
      riskLevel: t(`${p}.entity.riskLevel`),
      contractExpires: t(`${p}.entity.contractExpires`),
      blockedBy: t(`${p}.entity.blockedBy`),
      dependencies: t(`${p}.entity.dependencies`),
    },
    suggestedAction: t(`${p}.suggestedAction`),
    risks: {
      title: t(`${p}.risks.title`),
      empty: t(`${p}.risks.empty`),
    },
    timeline: {
      title: t(`${p}.timeline.title`),
      empty: t(`${p}.timeline.empty`),
    },
    recommendations: {
      title: t(`${p}.recommendations.title`),
      empty: t(`${p}.recommendations.empty`),
    },
    executive: {
      title: t(`${p}.executive.title`),
      mostImportantCustomers: t(`${p}.executive.mostImportantCustomers`),
      mostImportantVendors: t(`${p}.executive.mostImportantVendors`),
      mostImportantProjects: t(`${p}.executive.mostImportantProjects`),
      relationshipRisks: t(`${p}.executive.relationshipRisks`),
      relationshipOpportunities: t(`${p}.executive.relationshipOpportunities`),
    },
    actions: {
      acknowledge: t(`${p}.actions.acknowledge`),
      dismiss: t(`${p}.actions.dismiss`),
      resolve: t(`${p}.actions.resolve`),
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
      personalRsi: t(`${p}.links.personalRsi`),
      legacyEngine: t(`${p}.links.legacyEngine`),
    },
  };
}

export type OrganizationalRelationshipIntelligenceLabels = ReturnType<
  typeof buildOrganizationalRelationshipIntelligenceLabels
>;
