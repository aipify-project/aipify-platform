import { CompanionIdentityEngineDashboardPanel } from "@/components/app/companion-identity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompanionIdentityEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.companionIdentityEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CompanionIdentityEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          modulesTracked: t(`${p}.modulesTracked`),
          modulesAligned: t(`${p}.modulesAligned`),
          coreIdentityTraits: t(`${p}.coreIdentityTraits`),
          communicationStyle: t(`${p}.communicationStyle`),
          personalityTraits: t(`${p}.personalityTraits`),
          signatureElements: t(`${p}.signatureElements`),
          foxExchange: t(`${p}.foxExchange`),
          selfLoveNote: t(`${p}.selfLoveNote`),
          learningJourneyTitle: t(`${p}.learningJourneyTitle`),
          capabilityGapExamples: t(`${p}.capabilityGapExamples`),
          capabilityGapAvoid: t(`${p}.capabilityGapAvoid`),
          capabilityGapPrefer: t(`${p}.capabilityGapPrefer`),
          growthPrinciplePhrases: t(`${p}.growthPrinciplePhrases`),
          moduleConsistency: t(`${p}.moduleConsistency`),
          aligned: t(`${p}.aligned`),
          reviewNeeded: t(`${p}.reviewNeeded`),
          identitySettings: t(`${p}.identitySettings`),
          signatureElementsEnabled: t(`${p}.signatureElementsEnabled`),
          bellMomentsEnabled: t(`${p}.bellMomentsEnabled`),
          selfLoveRefsEnabled: t(`${p}.selfLoveRefsEnabled`),
          playfulWhenAppropriate: t(`${p}.playfulWhenAppropriate`),
          saveSettings: t(`${p}.saveSettings`),
          saving: t(`${p}.saving`),
          settingsFailed: t(`${p}.settingsFailed`),
          integrationLinks: t(`${p}.integrationLinks`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
          successCriteria: t(`${p}.successCriteria`),
          companionCharacteristics: t(`${p}.companionCharacteristics`),
          communicationStandards: t(`${p}.communicationStandards`),
          playfulMoments: t(`${p}.playfulMoments`),
          playfulMomentsNote: t(`${p}.playfulMomentsNote`),
          selfLoveImplementation: t(`${p}.selfLoveImplementation`),
          companionMemory: t(`${p}.companionMemory`),
          memoryAllowed: t(`${p}.memoryAllowed`),
          memoryForbidden: t(`${p}.memoryForbidden`),
          orgConfigBoundaries: t(`${p}.orgConfigBoundaries`),
          orgConfigurable: t(`${p}.orgConfigurable`),
          orgAlwaysConsistent: t(`${p}.orgAlwaysConsistent`),
          visionPhrases: t(`${p}.visionPhrases`),
          companionNamingTitle: t("customerApp.brandIdentity.companionNaming.title"),
          companionNamingSubtitle: t("customerApp.brandIdentity.companionNaming.subtitle"),
          companionNamingReplacements: t("customerApp.brandIdentity.companionNaming.labelReplacements"),
          companionNamingSupportExamples: t("customerApp.brandIdentity.companionNaming.supportExamples"),
          companionNamingPhilosophy: t("customerApp.brandIdentity.companionNaming.philosophy"),
          companionNamingVision: t("customerApp.brandIdentity.companionNaming.vision"),
          companionNamingFaq: t("customerApp.brandIdentity.companionNaming.faq"),
          aipifyFirstLanguageTitle: t("customerApp.brandIdentity.aipifyFirstLanguage.title"),
          aipifyFirstLanguageSubtitle: t("customerApp.brandIdentity.aipifyFirstLanguage.subtitle"),
          aipifyFirstLanguageReplacements: t("customerApp.brandIdentity.aipifyFirstLanguage.labelReplacements"),
          aipifyFirstLanguageAppliesTo: t("customerApp.brandIdentity.aipifyFirstLanguage.appliesTo"),
          aipifyFirstLanguageExceptions: t("customerApp.brandIdentity.aipifyFirstLanguage.technicalExceptions"),
        }}
      />
    </div>
  );
}
