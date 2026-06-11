import { CommunityHubPanel } from "@/components/app/community-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommunityPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.communityIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CommunityHubPanel
        labels={{
          loading: t(`${p}.loading`),
          adminDashboard: t(`${p}.adminDashboard`),
          healthScore: t(`${p}.healthScore`),
          contributionScore: t(`${p}.contributionScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          scoreComponents: t(`${p}.scoreComponents`),
          featuredInsights: t(`${p}.featuredInsights`),
          bestPractices: t(`${p}.bestPractices`),
          topRated: t(`${p}.topRated`),
          recentlyValidated: t(`${p}.recentlyValidated`),
          noInsights: t(`${p}.noInsights`),
          rate: t(`${p}.rate`),
          briefings: t(`${p}.briefings`),
          approvalWorkflow: t(`${p}.approvalWorkflow`),
        }}
      />
    </div>
  );
}
