import { PartnerCertificationDashboardPanel } from "@/components/app/partner-certification";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PartnerCertificationPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.partnerCertification";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <PartnerCertificationDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          ecosystemScore: t(`${p}.ecosystemScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          activePartners: t(`${p}.activePartners`),
          certifiedPartners: t(`${p}.certifiedPartners`),
          openLeads: t(`${p}.openLeads`),
          compliancePct: t(`${p}.compliancePct`),
          partnerDirectory: t(`${p}.partnerDirectory`),
          filterAll: t(`${p}.filterAll`),
          languages: t(`${p}.languages`),
          certificationTracks: t(`${p}.certificationTracks`),
          certificationProgress: t(`${p}.certificationProgress`),
          credentialVerification: t(`${p}.credentialVerification`),
          credentialCodePlaceholder: t(`${p}.credentialCodePlaceholder`),
          verifyCredential: t(`${p}.verifyCredential`),
          validUntil: t(`${p}.validUntil`),
          noExpiry: t(`${p}.noExpiry`),
          invalidCredential: t(`${p}.invalidCredential`),
          digitalCredentials: t(`${p}.digitalCredentials`),
          partnerScorecard: t(`${p}.partnerScorecard`),
          leadReferrals: t(`${p}.leadReferrals`),
          resourceCenter: t(`${p}.resourceCenter`),
          complianceRequirements: t(`${p}.complianceRequirements`),
          acceptCompliance: t(`${p}.acceptCompliance`),
          communityEngagement: t(`${p}.communityEngagement`),
        }}
      />
    </div>
  );
}
