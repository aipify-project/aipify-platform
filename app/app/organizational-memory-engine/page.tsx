import { OrganizationalMemoryEngineDashboardPanel } from "@/components/app/organizational-memory-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMemoryEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalMemoryEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalMemoryEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          legacyMemory: t(`${p}.legacyMemory`),
          learningEngine: t(`${p}.learningEngine`),
          personalMemory: t(`${p}.personalMemory`),
          activeRecords: t(`${p}.activeRecords`),
          archivedRecords: t(`${p}.archivedRecords`),
          activeDecisions: t(`${p}.activeDecisions`),
          pendingReviews: t(`${p}.pendingReviews`),
          recentLearnings: t(`${p}.recentLearnings`),
          recurringThemes: t(`${p}.recurringThemes`),
          frequentlyReferenced: t(`${p}.frequentlyReferenced`),
          archivedDecisions: t(`${p}.archivedDecisions`),
          recommendedReviews: t(`${p}.recommendedReviews`),
          memoryLevels: t(`${p}.memoryLevels`),
          memoryCategories: t(`${p}.memoryCategories`),
          memoryCapabilities: t(`${p}.memoryCapabilities`),
          successCriteria: t(`${p}.successCriteria`),
          trustConnection: t(`${p}.trustConnection`),
          integrationLinks: t(`${p}.integrationLinks`),
          references: t(`${p}.references`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
