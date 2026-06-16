import type { SupportAssistantLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildSupportAssistantLabels(t: Translator): SupportAssistantLabels {
  const p = "customerApp.portalStructure.supportAssistant";
  const s = `${p}.suggested`;
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    emptyPrompt: t(`${p}.emptyPrompt`),
    searchPlaceholder: t(`${p}.searchPlaceholder`),
    searchButton: t(`${p}.searchButton`),
    suggestedTitle: t(`${p}.suggestedTitle`),
    answerTitle: t(`${p}.answerTitle`),
    stepsTitle: t(`${p}.stepsTitle`),
    relatedTitle: t(`${p}.relatedTitle`),
    stillNeedHelp: t(`${p}.stillNeedHelp`),
    createSupportRequest: t(`${p}.createSupportRequest`),
    noResults: t(`${p}.noResults`),
    principle: t(`${p}.principle`),
    suggested: {
      "contact-support": {
        title: t(`${s}.contactSupport.title`),
        summary: t(`${s}.contactSupport.summary`),
        steps: [
          t(`${s}.contactSupport.step1`),
          t(`${s}.contactSupport.step2`),
          t(`${s}.contactSupport.step3`),
        ],
      },
      "connect-integration": {
        title: t(`${s}.connectIntegration.title`),
        summary: t(`${s}.connectIntegration.summary`),
        steps: [
          t(`${s}.connectIntegration.step1`),
          t(`${s}.connectIntegration.step2`),
          t(`${s}.connectIntegration.step3`),
        ],
      },
      "manage-subscription": {
        title: t(`${s}.manageSubscription.title`),
        summary: t(`${s}.manageSubscription.summary`),
        steps: [
          t(`${s}.manageSubscription.step1`),
          t(`${s}.manageSubscription.step2`),
          t(`${s}.manageSubscription.step3`),
        ],
      },
      "invite-team-members": {
        title: t(`${s}.inviteTeamMembers.title`),
        summary: t(`${s}.inviteTeamMembers.summary`),
        steps: [
          t(`${s}.inviteTeamMembers.step1`),
          t(`${s}.inviteTeamMembers.step2`),
          t(`${s}.inviteTeamMembers.step3`),
        ],
      },
      "install-business-pack": {
        title: t(`${s}.installBusinessPack.title`),
        summary: t(`${s}.installBusinessPack.summary`),
        steps: [
          t(`${s}.installBusinessPack.step1`),
          t(`${s}.installBusinessPack.step2`),
          t(`${s}.installBusinessPack.step3`),
        ],
      },
      "upgrade-plan": {
        title: t(`${s}.upgradePlan.title`),
        summary: t(`${s}.upgradePlan.summary`),
        steps: [
          t(`${s}.upgradePlan.step1`),
          t(`${s}.upgradePlan.step2`),
          t(`${s}.upgradePlan.step3`),
        ],
      },
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      replacesHuman: t(`${p}.faq.replacesHuman`),
      replacesHumanAnswer: t(`${p}.faq.replacesHumanAnswer`),
      canCreateRequest: t(`${p}.faq.canCreateRequest`),
      canCreateRequestAnswer: t(`${p}.faq.canCreateRequestAnswer`),
    },
  };
}
