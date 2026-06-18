import { CompanionActionMemoryPanel } from "@/components/app/companion/CompanionActionMemoryPanel";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionActionMemoryPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "companionActionMemory");
  const t = createTranslator(dict);
  const p = "customerApp.companionActionMemory";

  return (
    <CompanionActionMemoryPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        preferencesTitle: t(`${p}.preferencesTitle`),
        recentTitle: t(`${p}.recentTitle`),
        suggestionsTitle: t(`${p}.suggestionsTitle`),
        validationsTitle: t(`${p}.validationsTitle`),
        settingsTitle: t(`${p}.settingsTitle`),
        memoryEnabled: t(`${p}.memoryEnabled`),
        accept: t(`${p}.accept`),
        reject: t(`${p}.reject`),
        confirm: t(`${p}.confirm`),
        delete: t(`${p}.delete`),
        dismiss: t(`${p}.dismiss`),
        resetMemory: t(`${p}.resetMemory`),
        saveSettings: t(`${p}.saveSettings`),
        confidence: t(`${p}.confidence`),
        lastUsed: t(`${p}.lastUsed`),
        privacyNote: t(`${p}.privacyNote`),
        actionMarketplaceLink: t(`${p}.actionMarketplaceLink`),
        assistantMemoryLink: t(`${p}.assistantMemoryLink`),
        approvalsLink: t(`${p}.approvalsLink`),
        categories: {
          transportation: t(`${p}.categories.transportation`),
          flowers_gifts: t(`${p}.categories.flowers_gifts`),
          food_catering: t(`${p}.categories.food_catering`),
          travel: t(`${p}.categories.travel`),
          business_actions: t(`${p}.categories.business_actions`),
        },
        confidenceLevels: {
          learned_once: t(`${p}.confidenceLevels.learned_once`),
          emerging: t(`${p}.confidenceLevels.emerging`),
          established: t(`${p}.confidenceLevels.established`),
          strong: t(`${p}.confidenceLevels.strong`),
        },
      }}
    />
  );
}
