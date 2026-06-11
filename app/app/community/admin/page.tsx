import { CommunityAdminPanel } from "@/components/app/community-intelligence";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CommunityAdminPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.communityIntelligence";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.adminTitle`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.adminSubtitle`)}</p>
      </div>
      <CommunityAdminPanel
        labels={{
          loading: t(`${p}.loading`),
          backToHub: t(`${p}.backToHub`),
          adminAccessRequired: t(`${p}.adminAccessRequired`),
          healthScore: t(`${p}.healthScore`),
          contributionScore: t(`${p}.contributionScore`),
          pendingReviews: t(`${p}.pendingReviews`),
          contributionQueue: t(`${p}.contributionQueue`),
          governanceFlags: t(`${p}.governanceFlags`),
          intelligenceTrends: t(`${p}.intelligenceTrends`),
          noPending: t(`${p}.noPending`),
          noQueue: t(`${p}.noQueue`),
          governanceFlag: t(`${p}.governanceFlag`),
          publish: t(`${p}.publish`),
          escalateGovernance: t(`${p}.escalateGovernance`),
          reject: t(`${p}.reject`),
        }}
      />
    </div>
  );
}
