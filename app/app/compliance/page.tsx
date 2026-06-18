import { ComplianceDashboardPanel } from "@/components/app/security-compliance";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompliancePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "securityCompliance");
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <ComplianceDashboardPanel
      labels={{
        title: t(`${p}.complianceTitle`),
        subtitle: t(`${p}.complianceSubtitle`),
        loading: t(`${p}.loading`),
        privacyRequests: t(`${p}.privacyRequests`),
        dataGovernance: t(`${p}.dataGovernance`),
        reports: t(`${p}.reports`),
        security: t(`${p}.securityLink`),
        privacyPending: t(`${p}.privacyPending`),
        retentionPolicies: t(`${p}.retentionPolicies`),
        deploymentMode: t(`${p}.deploymentMode`),
        generateReport: t(`${p}.generateReport`),
        applyRetention: t(`${p}.applyRetention`),
        privacy: t(`${p}.privacyNote`),
      }}
    />
  );
}
