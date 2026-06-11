import { IndustryIntelligenceFoundationEngineDashboardPanel } from "@/components/app/industry-intelligence-foundation-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IndustryIntelligenceFoundationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.industryIntelligenceFoundationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IndustryIntelligenceFoundationEngineDashboardPanel labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          assignedProfile: t(`${p}.assignedProfile`),
          availableProfiles: t(`${p}.availableProfiles`),
          assignProfile: t(`${p}.assignProfile`),
          assigning: t(`${p}.assigning`),
          assignFailed: t(`${p}.assignFailed`),
          benchmarks: t(`${p}.benchmarks`),
          recommendedImprovements: t(`${p}.recommendedImprovements`),
          commonRisks: t(`${p}.commonRisks`),
          strategicOpportunities: t(`${p}.strategicOpportunities`),
          businessPackAlignment: t(`${p}.businessPackAlignment`),
          integrationSummaries: t(`${p}.integrationSummaries`),
          override: t(`${p}.override`),
          overriding: t(`${p}.overriding`),
          overridePrompt: t(`${p}.overridePrompt`),
          overrideFailed: t(`${p}.overrideFailed`),
        }} />
    </div>
  );
}
