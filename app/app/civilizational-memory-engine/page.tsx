import { CivilizationalMemoryEngineDashboardPanel } from "@/components/app/civilizational-memory-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CivilizationalMemoryEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "civilizationalMemoryEngine");
  const t = createTranslator(dict);
  const p = "customerApp.civilizationalMemoryEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CivilizationalMemoryEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          eraCrossLinksBanner: t(`${p}.eraCrossLinksBanner`),
          eraCrossLinksNote: t(`${p}.eraCrossLinksNote`),
          civilizationalMemoryCenter: t(`${p}.civilizationalMemoryCenter`),
          humanOversightRequired: t(`${p}.humanOversightRequired`),
          discernmentRequired: t(`${p}.discernmentRequired`),
          currentReadinessLevel: t(`${p}.currentReadinessLevel`),
          notDigitalClutter: t(`${p}.notDigitalClutter`),
          knowledgeArchives: t(`${p}.knowledgeArchives`),
          stewardshipReviews: t(`${p}.stewardshipReviews`),
          legacyEntries: t(`${p}.legacyEntries`),
          civilizationalMemoryCenterCapabilities: t(`${p}.civilizationalMemoryCenterCapabilities`),
          knowledgePreservationEngine: t(`${p}.knowledgePreservationEngine`),
          wisdomCurationFramework: t(`${p}.wisdomCurationFramework`),
          institutionalMemoryNetworks: t(`${p}.institutionalMemoryNetworks`),
          memoryCompanion: t(`${p}.memoryCompanion`),
          knowledgeStewardshipEngine: t(`${p}.knowledgeStewardshipEngine`),
          legacyLibraryEngine: t(`${p}.legacyLibraryEngine`),
          knowledgeArchivesSection: t(`${p}.knowledgeArchivesSection`),
          stewardshipReviewsSection: t(`${p}.stewardshipReviewsSection`),
          legacyEntriesSection: t(`${p}.legacyEntriesSection`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          blueprintObjectives: t(`${p}.blueprintObjectives`),
          companionLimitations: t(`${p}.companionLimitations`),
          successCriteria: t(`${p}.successCriteria`),
          criterionMet: t(`${p}.criterionMet`),
          criterionPending: t(`${p}.criterionPending`),
        }}
      />
    </div>
  );
}
