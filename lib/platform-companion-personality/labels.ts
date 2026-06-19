import type { Translator } from "@/lib/i18n/translate";
import type {
  PlatformCompanionPersonalityLabels,
  PlatformCompanionPersonalityTab,
} from "./types";
import { PERSONALITY_TABS } from "./constants";

export function buildPlatformCompanionPersonalityLabels(
  t: Translator
): PlatformCompanionPersonalityLabels {
  const p = "platform.companionPersonality";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      PERSONALITY_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<PlatformCompanionPersonalityTab, string>,
    overview: {
      coreTraits: t(`${p}.overview.coreTraits`),
      positiveTraits: t(`${p}.overview.positiveTraits`),
      forbiddenTraits: t(`${p}.overview.forbiddenTraits`),
      communicationStyles: t(`${p}.overview.communicationStyles`),
      roleProfiles: t(`${p}.overview.roleProfiles`),
      relationshipScore: t(`${p}.overview.relationshipScore`),
      consistencyChannels: t(`${p}.overview.consistencyChannels`),
      tenantPreferences: t(`${p}.overview.tenantPreferences`),
    },
    actions: {
      refreshScore: t(`${p}.actions.refreshScore`),
      publishUpdate: t(`${p}.actions.publishUpdate`),
      openTenantRelationship: t(`${p}.actions.openTenantRelationship`),
    },
    sections: {
      coreTraits: t(`${p}.sections.coreTraits`),
      identityRules: t(`${p}.sections.identityRules`),
      personalityLayers: t(`${p}.sections.personalityLayers`),
      roleProfiles: t(`${p}.sections.roleProfiles`),
      humorFramework: t(`${p}.sections.humorFramework`),
      selfLoveFramework: t(`${p}.sections.selfLoveFramework`),
      trustFramework: t(`${p}.sections.trustFramework`),
      emotionalAwareness: t(`${p}.sections.emotionalAwareness`),
      communicationStyles: t(`${p}.sections.communicationStyles`),
      adaptiveProfiles: t(`${p}.sections.adaptiveProfiles`),
      consistencyEngine: t(`${p}.sections.consistencyEngine`),
      memoryIntegrations: t(`${p}.sections.memoryIntegrations`),
      businessPackContributions: t(`${p}.sections.businessPackContributions`),
      adaptationRules: t(`${p}.sections.adaptationRules`),
      audit: t(`${p}.sections.audit`),
    },
  };
}
