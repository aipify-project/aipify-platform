import type { CompanionPresenceLabels } from "@/components/app/companion-presence";
import type { CompanionExperienceLabels } from "@/lib/app/companion/types";
import { buildCompanionExperienceLabels } from "@/lib/app/companion/labels";
import type { CompanionPresenceState } from "@/lib/presence/companion-presence";
import type { CommandBarLabels } from "@/lib/command-bar";
import type { VocWidgetLabels } from "@/lib/voice-of-the-customer";
import {
  CUSTOMER_STATUSES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_TYPES,
} from "@/lib/voice-of-the-customer/constants";
import type { Translator } from "@/lib/i18n/translate";
import {
  buildUnifiedNotificationCenterLabels,
  type UnifiedNotificationCenterLabels,
} from "@/lib/presence/unified-notification-feed";

export function buildLayoutLicensePanelLabels(t: Translator) {
  const p = "shell.licenseSidebar";
  return {
    workspace: t(`${p}.workspace`),
    licensedTo: t(`${p}.licensedTo`),
    plan: t(`${p}.plan`),
    status: t(`${p}.status`),
    version: t(`${p}.version`),
    poweredBy: t(`${p}.poweredBy`),
    copyright: t(`${p}.copyright`),
    statusActive: t(`${p}.statusActive`),
    statusGrace: t(`${p}.statusGrace`),
    statusPaused: t(`${p}.statusPaused`),
    statusUnknown: t(`${p}.statusUnknown`),
    notConfigured: t(`${p}.notConfigured`),
    notAssigned: t(`${p}.notAssigned`),
    organizationMissing: t(`${p}.organizationMissing`),
    contextLoading: t(`${p}.contextLoading`),
    contextUnavailable: t(`${p}.contextUnavailable`),
    pulseLabel: t("shell.branding.pulseLabel"),
  };
}

export function buildLayoutCommandBarLabels(t: Translator): CommandBarLabels {
  return {
    placeholder: t("shell.commandBar.placeholder"),
    close: t("shell.commandBar.close"),
    noResults: t("shell.commandBar.noResults"),
    openCommandBar: t("shell.commandBar.openCommandBar"),
    sections: {
      navigation: t("shell.commandBar.sections.navigation"),
      action: t("shell.commandBar.sections.action"),
      search: t("shell.commandBar.sections.search"),
      recommendation: t("shell.commandBar.sections.recommendation"),
      recent: t("shell.commandBar.sections.recent"),
    },
    shortcuts: {
      title: t("shell.commandBar.shortcuts.title"),
      navigate: t("shell.commandBar.shortcuts.navigate"),
      select: t("shell.commandBar.shortcuts.select"),
      close: t("shell.commandBar.shortcuts.close"),
      open: t("shell.commandBar.shortcuts.open"),
    },
    recommendations: {
      pendingApprovals: t("shell.commandBar.recommendations.pendingApprovals"),
      failedAutomations: t("shell.commandBar.recommendations.failedAutomations"),
      growthPartnerApplications: t("shell.commandBar.recommendations.growthPartnerApplications"),
      executiveSummary: t("shell.commandBar.recommendations.executiveSummary"),
    },
    actions: {
      createAutomation: t("shell.commandBar.actions.createAutomation"),
      exportAuditLogs: t("shell.commandBar.actions.exportAuditLogs"),
      viewFailedWorkflows: t("shell.commandBar.actions.viewFailedWorkflows"),
      launchInstallWizard: t("shell.commandBar.actions.launchInstallWizard"),
      generateExecutiveReport: t("shell.commandBar.actions.generateExecutiveReport"),
      findGrowthPartners: t("shell.commandBar.actions.findGrowthPartners"),
      superAdminAudit: t("shell.commandBar.actions.superAdminAudit"),
      searchKnowledgeCenter: t("shell.commandBar.actions.searchKnowledgeCenter"),
      inviteGrowthPartner: t("shell.commandBar.actions.inviteGrowthPartner"),
      openCustomerProfile: t("shell.commandBar.actions.openCustomerProfile"),
      restartFailedWorkflow: t("shell.commandBar.actions.restartFailedWorkflow"),
    },
    categories: {
      customers: t("shell.commandBar.categories.customers"),
      support: t("shell.commandBar.categories.support"),
      knowledge: t("shell.commandBar.categories.knowledge"),
      skills: t("shell.commandBar.categories.skills"),
      actions: t("shell.commandBar.categories.actions"),
      growthPartners: t("shell.commandBar.categories.growthPartners"),
      automations: t("shell.commandBar.categories.automations"),
      users: t("shell.commandBar.categories.users"),
      subscriptions: t("shell.commandBar.categories.subscriptions"),
      modules: t("shell.commandBar.categories.modules"),
    },
  };
}

export function buildLayoutCompanionExperienceLabels(t: Translator): CompanionExperienceLabels {
  return buildCompanionExperienceLabels(t);
}

export function buildLayoutCompanionPresenceLabels(t: Translator): CompanionPresenceLabels {
  const p = "shell.companionPresence";
  const states = Object.fromEntries(
    (
      [
        "idle",
        "working",
        "attention_needed",
        "critical_alert",
        "disconnected",
        "quiet_mode",
      ] as CompanionPresenceState[]
    ).map((state) => [state, t(`${p}.states.${state}`)])
  ) as Record<CompanionPresenceState, string>;

  return {
    ariaIndicator: t(`${p}.ariaIndicator`),
    ariaPanel: t(`${p}.ariaPanel`),
    ariaClose: t(`${p}.ariaClose`),
    ariaCollapse: t(`${p}.ariaCollapse`),
    ariaExpand: t(`${p}.ariaExpand`),
    states,
    sinceLastLogin: t(`${p}.sinceLastLogin`),
    tasks: t(`${p}.tasks`),
    approvals: t(`${p}.approvals`),
    notifications: t(`${p}.notifications`),
    askAipify: t(`${p}.askAipify`),
    privacyNote: t(`${p}.privacyNote`),
    quietMode: t(`${p}.quietMode`),
    quietModeOff: t(`${p}.quietModeOff`),
    acknowledgeCritical: t(`${p}.acknowledgeCritical`),
    loading: t(`${p}.loading`),
    newSinceLogin: t(`${p}.newSinceLogin`),
    unresolvedApprovals: t(`${p}.unresolvedApprovals`),
  };
}

export function buildLayoutVocWidgetLabels(t: Translator): VocWidgetLabels {
  const p = "shell.voiceOfCustomer";

  return {
    trigger: t(`${p}.trigger`),
    triggerShort: t(`${p}.triggerShort`),
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    type: t(`${p}.type`),
    feedbackTitle: t(`${p}.feedbackTitle`),
    description: t(`${p}.description`),
    priority: t(`${p}.priority`),
    wantsResponse: t(`${p}.wantsResponse`),
    noResponse: t(`${p}.noResponse`),
    contactMe: t(`${p}.contactMe`),
    includeContext: t(`${p}.includeContext`),
    submit: t(`${p}.submit`),
    submitting: t(`${p}.submitting`),
    acknowledgementTitle: t(`${p}.acknowledgementTitle`),
    acknowledgementBody: t(`${p}.acknowledgementBody`),
    historyTitle: t(`${p}.historyTitle`),
    historyEmpty: t(`${p}.historyEmpty`),
    feedbackTypes: Object.fromEntries(
      FEEDBACK_TYPES.map((key) => [key, t(`${p}.feedbackTypes.${key}`)])
    ) as VocWidgetLabels["feedbackTypes"],
    priorities: Object.fromEntries(
      FEEDBACK_PRIORITIES.map((key) => [key, t(`${p}.priorities.${key}`)])
    ) as VocWidgetLabels["priorities"],
    customerStatuses: Object.fromEntries(
      CUSTOMER_STATUSES.map((key) => [key, t(`${p}.customerStatuses.${key}`)])
    ) as VocWidgetLabels["customerStatuses"],
    close: t(`${p}.close`),
    trustNote: t(`${p}.trustNote`),
    transparencyNote: t(`${p}.transparencyNote`),
    trustStatementLink: t(`${p}.trustStatementLink`),
    trustStatementLinkAria: t(`${p}.trustStatementLinkAria`),
  };
}

export function buildLayoutNotificationCenterLabels(
  t: Translator,
): UnifiedNotificationCenterLabels {
  return buildUnifiedNotificationCenterLabels(t);
}

export type LayoutKompisGlobalLabels = {
  title: string;
  openButton: string;
  closeButton: string;
  ariaOpen: string;
  ariaClose: string;
  available: string;
  contextPrefix: string;
  contexts: Record<string, string>;
  prompts: {
    dashboard: string[];
    integrations: string[];
    billing: string[];
    support: string[];
    organization: string[];
    approvals: string[];
    workspace: string[];
    generic: string[];
  };
  labelsCatalog: Record<string, string>;
};

export function buildLayoutKompisGlobalLabels(t: Translator): LayoutKompisGlobalLabels {
  const p = "customerApp.portalStructure.kompisWorkspace";
  const shell = `${p}.shell`;
  const promptKeys = [
    "dashboard",
    "integrations",
    "billing",
    "support",
    "organization",
    "approvals",
    "workspace",
    "generic",
  ] as const;

  const prompts = Object.fromEntries(
    promptKeys.map((key) => [
      key,
      [1, 2, 3].map((n) => t(`${shell}.prompts.${key}.${n}`)).filter(Boolean),
    ])
  ) as LayoutKompisGlobalLabels["prompts"];

  const contexts = Object.fromEntries(
    promptKeys.map((key) => [key, t(`${shell}.contexts.${key}`)])
  ) as Record<string, string>;

  const messageKeys = [
    `${p}.title`,
    `${p}.reassurance`,
    `${p}.emptyFallback`,
    `${p}.commercialDisabled`,
    `${p}.whyDenied`,
    `${p}.handoff.authenticatedReady`,
    `${p}.sections.knowledge`,
    `${p}.sections.suggestions`,
    `${p}.sections.actions`,
    `${p}.sections.confirmation`,
    `${p}.sections.support`,
    `${p}.states.denied`,
    `${p}.states.loading`,
    `${p}.states.empty`,
    `${p}.states.error`,
    `${p}.states.expired`,
    `${p}.states.offline`,
    `${p}.actions.confirm`,
    `${p}.actions.cancel`,
    `${p}.actions.continueLater`,
    `${p}.actions.minimize`,
    `${p}.actions.expand`,
    `${p}.actions.close`,
  ];

  const labelsCatalog: Record<string, string> = {};
  for (const key of messageKeys) {
    labelsCatalog[key] = t(key);
  }
  labelsCatalog.readAction = t(`${p}.runtime.readAction`);
  labelsCatalog.draftAction = t(`${p}.runtime.draftAction`);
  labelsCatalog.confirmPrefAction = t(`${p}.runtime.confirmPrefAction`);
  labelsCatalog.draftTitle = t(`${p}.runtime.draftTitle`);
  labelsCatalog.draftBody = t(`${p}.runtime.draftBody`);
  labelsCatalog.resultTitle = t(`${p}.runtime.resultTitle`);
  labelsCatalog.receiptOk = t(`${p}.runtime.receiptOk`);
  labelsCatalog.adminTitle = t(`${p}.admin.title`);
  labelsCatalog.adminEnable = t(`${p}.admin.enable`);
  labelsCatalog.adminDisable = t(`${p}.admin.disable`);
  labelsCatalog.adminHidden = t(`${p}.admin.hiddenForMembers`);

  return {
    title: t(`${p}.title`),
    openButton: t(`${shell}.openButton`),
    closeButton: t(`${shell}.closeButton`),
    ariaOpen: t(`${shell}.ariaOpen`),
    ariaClose: t(`${shell}.ariaClose`),
    available: t(`${shell}.available`),
    contextPrefix: t(`${shell}.contextPrefix`),
    contexts,
    prompts,
    labelsCatalog,
  };
}
