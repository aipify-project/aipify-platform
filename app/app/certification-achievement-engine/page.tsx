import { CertificationAchievementEngineDashboardPanel } from "@/components/app/certification-achievement-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CertificationAchievementEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.certificationAchievementEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <CertificationAchievementEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          learningTraining: t(`${p}.learningTraining`),
          team: t(`${p}.team`),
          onboarding: t(`${p}.onboarding`),
          activeCertifications: t(`${p}.activeCertifications`),
          expiredCertifications: t(`${p}.expiredCertifications`),
          badgesAwarded: t(`${p}.badgesAwarded`),
          definitionsCount: t(`${p}.definitionsCount`),
          myCertifications: t(`${p}.myCertifications`),
          certificationDefinitions: t(`${p}.certificationDefinitions`),
          teamReadiness: t(`${p}.teamReadiness`),
          teamReadinessRestricted: t(`${p}.teamReadinessRestricted`),
          userBadges: t(`${p}.userBadges`),
          noBadges: t(`${p}.noBadges`),
          trainingIntegration: t(`${p}.trainingIntegration`),
          openLearningTraining: t(`${p}.openLearningTraining`),
          issued: t(`${p}.issued`),
          expires: t(`${p}.expires`),
          exportCertificate: t(`${p}.exportCertificate`),
          checkEligibility: t(`${p}.checkEligibility`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
        }}
      />
    </div>
  );
}
