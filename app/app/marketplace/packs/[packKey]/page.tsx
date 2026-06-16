import { BusinessPackIdentityLandingPanel } from "@/components/app/business-pack-identity-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ packKey: string }> };

export default async function BusinessPackLandingPage({ params }: PageProps) {
  const { packKey } = await params;
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.businessPackIdentity";

  const statusKeys = ["active", "beta", "coming_soon", "deprecated", "retired"] as const;
  const categoryKeys = [
    "hospitality", "commerce", "support", "executive", "operations",
    "human_resources", "marketing", "intelligence", "productivity", "governance",
  ] as const;

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    notFoundTitle: t(`${p}.notFoundTitle`),
    notFoundMessage: t(`${p}.notFoundMessage`),
    backToMarketplace: t(`${p}.backToMarketplace`),
    version: t(`${p}.version`),
    overview: t(`${p}.overview`),
    intendedAudience: t(`${p}.intendedAudience`),
    primaryUseCases: t(`${p}.primaryUseCases`),
    expectedOutcomes: t(`${p}.expectedOutcomes`),
    businessValue: t(`${p}.businessValue`),
    whyExists: t(`${p}.whyExists`),
    whoBenefits: t(`${p}.whoBenefits`),
    problemsSolved: t(`${p}.problemsSolved`),
    measurableOutcomes: t(`${p}.measurableOutcomes`),
    features: t(`${p}.features`),
    knowledgeCenter: t(`${p}.knowledgeCenter`),
    knowledgeCenterNote: t(`${p}.knowledgeCenterNote`),
    viewKnowledge: t(`${p}.viewKnowledge`),
    viewKnowledgeCenter: t(`${p}.viewKnowledgeCenter`),
    licensing: t(`${p}.licensing`),
    viewLicenseCenter: t(`${p}.viewLicenseCenter`),
    viewLanguageCenter: t(`${p}.viewLanguageCenter`),
    viewLegalCenter: t(`${p}.viewLegalCenter`),
    install: t(`${p}.install`),
    upgrade: t(`${p}.upgrade`),
    openWorkspace: t(`${p}.openWorkspace`),
    comingSoon: t(`${p}.comingSoon`),
  };

  for (const key of statusKeys) labels[`status_${key}`] = t(`${p}.statuses.${key}`);
  for (const key of categoryKeys) labels[`category_${key}`] = t(`${p}.categories.${key}`);

  return (
    <div className="mx-auto max-w-4xl p-6">
      <BusinessPackIdentityLandingPanel packKey={packKey} labels={labels} />
    </div>
  );
}
