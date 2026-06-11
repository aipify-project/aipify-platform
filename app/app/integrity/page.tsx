import { PlatformIntegrityDashboardPanel } from "@/components/app/platform-integrity";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntegrityPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.platformIntegrity";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PlatformIntegrityDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          integrityScore: t(`${p}.integrityScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          scoreComponents: t(`${p}.scoreComponents`),
          findings: t(`${p}.findings`),
          noFindings: t(`${p}.noFindings`),
          potentialImpact: t(`${p}.potentialImpact`),
          governance: t(`${p}.governance`),
          acknowledge: t(`${p}.acknowledge`),
          recommendedActions: t(`${p}.recommendedActions`),
          requiresGovernance: t(`${p}.requiresGovernance`),
          completeAction: t(`${p}.completeAction`),
          deprecatedAssets: t(`${p}.deprecatedAssets`),
          briefings: t(`${p}.briefings`),
          reviewDomains: t(`${p}.reviewDomains`),
        }}
      />
    </div>
  );
}
