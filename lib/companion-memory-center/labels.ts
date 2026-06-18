import type { Translator } from "@/lib/i18n/translate";

export function buildCompanionMemoryCenterLabels(t: Translator) {
  const p = "customerApp.companionMemoryCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    philosophy: t(`${p}.philosophy`),
    privacyNote: t(`${p}.privacyNote`),
    refresh: t(`${p}.refresh`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    detectPlaceholder: t(`${p}.detectPlaceholder`),
    detectButton: t(`${p}.detectButton`),
    detectFound: t(`${p}.detectFound`),
    detectNotFound: t(`${p}.detectNotFound`),
    saveCommitment: t(`${p}.saveCommitment`),
    sections: {
      personalReminders: t(`${p}.sections.personalReminders`),
      businessReminders: t(`${p}.sections.businessReminders`),
      followUps: t(`${p}.sections.followUps`),
      scheduledActions: t(`${p}.sections.scheduledActions`),
      archivedMemories: t(`${p}.sections.archivedMemories`),
    },
    governance: {
      source: t(`${p}.governance.source`),
      created: t(`${p}.governance.created`),
      owner: t(`${p}.governance.owner`),
      status: t(`${p}.governance.status`),
      lastActivity: t(`${p}.governance.lastActivity`),
      dueDate: t(`${p}.governance.dueDate`),
    },
    suggestions: {
      title: t(`${p}.suggestions.title`),
      suggestedAction: t(`${p}.suggestions.suggestedAction`),
      companionPrompt: t(`${p}.suggestions.companionPrompt`),
      empty: t(`${p}.suggestions.empty`),
    },
    executive: {
      title: t(`${p}.executive.title`),
      overdueCommitments: t(`${p}.executive.overdueCommitments`),
      openFollowUps: t(`${p}.executive.openFollowUps`),
      missedActions: t(`${p}.executive.missedActions`),
      outstandingApprovals: t(`${p}.executive.outstandingApprovals`),
      empty: t(`${p}.executive.empty`),
    },
    statistics: {
      personal: t(`${p}.statistics.personal`),
      business: t(`${p}.statistics.business`),
      followUps: t(`${p}.statistics.followUps`),
      scheduled: t(`${p}.statistics.scheduled`),
      archived: t(`${p}.statistics.archived`),
    },
    actions: {
      complete: t(`${p}.actions.complete`),
      snooze: t(`${p}.actions.snooze`),
      archive: t(`${p}.actions.archive`),
      delete: t(`${p}.actions.delete`),
      edit: t(`${p}.actions.edit`),
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
    categories: {
      personal: t(`${p}.categories.personal`),
      business: t(`${p}.categories.business`),
      customer: t(`${p}.categories.customer`),
      finance: t(`${p}.categories.finance`),
      projects: t(`${p}.categories.projects`),
      legal: t(`${p}.categories.legal`),
      operations: t(`${p}.categories.operations`),
    },
    itemTypes: {
      commitment: t(`${p}.itemTypes.commitment`),
      personal_memory: t(`${p}.itemTypes.personalMemory`),
      follow_up: t(`${p}.itemTypes.followUp`),
      scheduled_action: t(`${p}.itemTypes.scheduledAction`),
    },
    links: {
      followUps: t(`${p}.links.followUps`),
      memoryEngine: t(`${p}.links.memoryEngine`),
    },
  };
}

export type CompanionMemoryCenterLabels = ReturnType<typeof buildCompanionMemoryCenterLabels>;
