import { ComplianceDataGovernancePanel } from "@/components/app/security-compliance";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ComplianceDataGovernancePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "securityCompliance");
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <ComplianceDataGovernancePanel
      labels={{
        title: t(`${p}.governanceTitle`),
        subtitle: t(`${p}.governanceSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.backCompliance`),
        classifications: t(`${p}.classifications`),
        retention: t(`${p}.retention`),
        cloudSync: t(`${p}.cloudSync`),
        redaction: t(`${p}.redaction`),
        yes: t(`${p}.yes`),
        no: t(`${p}.no`),
        days: t(`${p}.days`),
      }}
    />
  );
}
