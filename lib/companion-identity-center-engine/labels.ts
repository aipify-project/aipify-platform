import type { Translator } from "@/lib/i18n/translate";

export function buildCompanionIdentityCenterLabels(t: Translator) {
  const p = "customerApp.companionIdentityCenter";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    principle: t(`${p}.principle`),
    privacyNote: t(`${p}.privacyNote`),
    loading: t(`${p}.loading`),
    empty: t(`${p}.empty`),
    refresh: t(`${p}.refresh`),
    companionRecommendations: t(`${p}.companionRecommendations`),
    noRecords: t(`${p}.noRecords`),
    coreIdentity: t(`${p}.coreIdentity`),
    personalityTraits: t(`${p}.personalityTraits`),
    adaptiveCommunication: t(`${p}.adaptiveCommunication`),
    humorAdaptation: t(`${p}.humorAdaptation`),
    styleProfiles: t(`${p}.styleProfiles`),
    introductionEngine: t(`${p}.introductionEngine`),
    relationshipDevelopment: t(`${p}.relationshipDevelopment`),
    wellbeingPrinciple: t(`${p}.wellbeingPrinciple`),
    toneGovernance: t(`${p}.toneGovernance`),
    orgPersonalityProfiles: t(`${p}.orgPersonalityProfiles`),
    businessPackIntegration: t(`${p}.businessPackIntegration`),
    executiveCompanionMode: t(`${p}.executiveCompanionMode`),
    identityAdvisor: t(`${p}.identityAdvisor`),
    mobileAccess: t(`${p}.mobileAccess`),
    sections: {
      overview: t(`${p}.sections.overview`),
      identity: t(`${p}.sections.identity`),
      personality: t(`${p}.sections.personality`),
      communication: t(`${p}.sections.communication`),
      preferences: t(`${p}.sections.preferences`),
      themes: t(`${p}.sections.themes`),
      behavior: t(`${p}.sections.behavior`),
      reports: t(`${p}.sections.reports`),
    },
    stats: {
      personalityTraits: t(`${p}.stats.personalityTraits`),
      communicationProfiles: t(`${p}.stats.communicationProfiles`),
      preferences: t(`${p}.stats.preferences`),
      themes: t(`${p}.stats.themes`),
      behaviorRules: t(`${p}.stats.behaviorRules`),
      orgProfiles: t(`${p}.stats.orgProfiles`),
    },
    identity: {
      name: t(`${p}.identity.name`),
      role: t(`${p}.identity.role`),
      mission: t(`${p}.identity.mission`),
      values: t(`${p}.identity.values`),
    },
  };
}
