import { OrganizationalBenchmarkingEngineDashboardPanel } from "@/components/app/organizational-benchmarking-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalBenchmarkingEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalBenchmarkingEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalBenchmarkingEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          distinctionNote: t(`${p}.distinctionNote`),
          summary: t(`${p}.summary`),
          executiveSummary: t(`${p}.executiveSummary`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          profiles: t(`${p}.profiles`),
          comparisons: t(`${p}.comparisons`),
          recommendations: t(`${p}.recommendations`),
          noProfiles: t(`${p}.noProfiles`),
          noComparisons: t(`${p}.noComparisons`),
          noRecommendations: t(`${p}.noRecommendations`),
          runComparison: t(`${p}.runComparison`),
          comparing: t(`${p}.comparing`),
          compareFailed: t(`${p}.compareFailed`),
          generateRecommendations: t(`${p}.generateRecommendations`),
          generatingRecs: t(`${p}.generatingRecs`),
          recommendFailed: t(`${p}.recommendFailed`),
          exportReport: t(`${p}.exportReport`),
          exporting: t(`${p}.exporting`),
          exportFailed: t(`${p}.exportFailed`),
        }} />
    </div>
  );
}
