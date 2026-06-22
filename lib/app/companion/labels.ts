import {
  COMPANION_CAPABILITY_IDS,
  COMPANION_QUICK_ACTION_IDS,
} from "./constants";
import type { CompanionExperienceLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildCompanionExperienceLabels(t: Translator): CompanionExperienceLabels {
  const p = "customerApp.companionExperience";
  const qa = `${p}.quickActions`;
  const cap = `${p}.capabilities`;
  const ctx = `${p}.contextPages`;
  const sug = `${p}.contextSuggestions`;

  const quickActions = Object.fromEntries(
    COMPANION_QUICK_ACTION_IDS.map((id) => [
      id,
      {
        title: t(`${qa}.${id}.title`),
        description: t(`${qa}.${id}.description`),
      },
    ])
  ) as CompanionExperienceLabels["quickActions"];

  const capabilities = Object.fromEntries(
    COMPANION_CAPABILITY_IDS.map((id) => [id, t(`${cap}.${id}`)])
  ) as CompanionExperienceLabels["capabilities"];

  const contextPages = Object.fromEntries(
    [
      "default",
      "commandCenter",
      "sinceLastLogin",
      "notifications",
      "support",
      "businessPacks",
      "integrations",
      "integrationSetup",
      "organization",
      "billing",
      "operations",
    ].map((key) => [key, t(`${ctx}.${key}`)])
  ) as CompanionExperienceLabels["contextPages"];

  const contextSuggestions = Object.fromEntries(
    [
      "commandBriefSummary",
      "pendingApprovals",
      "sinceLastLoginPriorities",
      "sinceLastLoginActions",
      "notificationsPriority",
      "notificationsNext",
      "supportOpenCases",
      "supportKnowledge",
      "businessPackStatus",
      "businessPackValue",
      "integrationStatus",
      "integrationSecurity",
      "whereFindKey",
      "whichProject",
      "isAccessSafe",
      "whyConnectionFails",
      "checkMySetup",
      "organizationHealth",
      "organizationTeam",
      "billingStatus",
      "billingUpgrade",
      "operationsPriority",
      "operationsEvents",
      "defaultOrgStatus",
      "defaultWhatNow",
    ].map((key) => [key, t(`${sug}.${key}`)])
  ) as CompanionExperienceLabels["contextSuggestions"];

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    openCompanion: t(`${p}.openCompanion`),
    askAipify: t(`${p}.askAipify`),
    askAipifyButton: t(`${p}.askAipifyButton`),
    newConversation: t(`${p}.newConversation`),
    viewSuggestions: t(`${p}.viewSuggestions`),
    secondarySectionsToggle: t(`${p}.secondarySectionsToggle`),
    secondarySectionsHide: t(`${p}.secondarySectionsHide`),
    inputPlaceholder: t(`${p}.inputPlaceholder`),
    activePage: t(`${p}.activePage`),
    activeOrganization: t(`${p}.activeOrganization`),
    verifiedContext: t(`${p}.verifiedContext`),
    contextPending: t(`${p}.contextPending`),
    orgNameFallback: t(`${p}.orgNameFallback`),
    roleLabel: t(`${p}.roleLabel`),
    roleFallback: t(`${p}.roleFallback`),
    languageLabel: t(`${p}.languageLabel`),
    modeLabel: t(`${p}.modeLabel`),
    modeAssisted: t(`${p}.modeAssisted`),
    capabilitiesTitle: t(`${p}.capabilitiesTitle`),
    recentConversationsTitle: t(`${p}.recentConversationsTitle`),
    suggestedQuestionsTitle: t(`${p}.suggestedQuestionsTitle`),
    pinnedLabel: t(`${p}.pinnedLabel`),
    emptyWelcomeTitle: t(`${p}.emptyWelcomeTitle`),
    emptyWelcomeBody: t(`${p}.emptyWelcomeBody`),
    errorTitle: t(`${p}.errorTitle`),
    errorBody: t(`${p}.errorBody`),
    retry: t(`${p}.retry`),
    noResults: t(`${p}.noResults`),
    stillNeedHelp: t(`${p}.stillNeedHelp`),
    createSupportRequest: t(`${p}.createSupportRequest`),
    closeDrawer: t(`${p}.closeDrawer`),
    fullPageLink: t(`${p}.fullPageLink`),
    quickActions,
    capabilities,
    contextPages,
    contextSuggestions,
    ariaCompanionPanel: t(`${p}.ariaCompanionPanel`),
    ariaOpenCompanion: t(`${p}.ariaOpenCompanion`),
    ariaFloatingButton: t(`${p}.ariaFloatingButton`),
    feedbackHelpful: t(`${p}.feedbackHelpful`),
    feedbackNotHelpful: t(`${p}.feedbackNotHelpful`),
    feedbackOrgConfirm: t(`${p}.feedbackOrgConfirm`),
    feedbackThanks: t(`${p}.feedbackThanks`),
    feedbackReasonTitle: t(`${p}.feedbackReasonTitle`),
    feedbackReasonWrongInfo: t(`${p}.feedbackReasonWrongInfo`),
    feedbackReasonOutdated: t(`${p}.feedbackReasonOutdated`),
    feedbackReasonMisunderstood: t(`${p}.feedbackReasonMisunderstood`),
    feedbackReasonWrongLink: t(`${p}.feedbackReasonWrongLink`),
    feedbackReasonTooVague: t(`${p}.feedbackReasonTooVague`),
    feedbackReasonOther: t(`${p}.feedbackReasonOther`),
    feedbackSubmitReason: t(`${p}.feedbackSubmitReason`),
    feedbackOrgConfirmThanks: t(`${p}.feedbackOrgConfirmThanks`),
    sourcesTitle: t(`${p}.sourcesTitle`),
    sourcesShow: t(`${p}.sourcesShow`),
    sourcesHide: t(`${p}.sourcesHide`),
    sourcePlatformCorpus: t(`${p}.sourcePlatformCorpus`),
    sourceRouteRegistry: t(`${p}.sourceRouteRegistry`),
    sourceKnowledgeCenter: t(`${p}.sourceKnowledgeCenter`),
    sourceCustomerContext: t(`${p}.sourceCustomerContext`),
    sourceOrgKnowledge: t(`${p}.sourceOrgKnowledge`),
    recentDelete: t(`${p}.recentDelete`),
    recentActive: t(`${p}.recentActive`),
    supportEscalationHint: t(`${p}.supportEscalationHint`),
  };
}
