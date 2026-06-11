import { CompliancePrivacyRequestsPanel } from "@/components/app/security-compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function CompliancePrivacyRequestsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <CompliancePrivacyRequestsPanel
      labels={{
        title: t(`${p}.privacyTitle`),
        subtitle: t(`${p}.privacySubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.backCompliance`),
        createRequest: t(`${p}.createRequest`),
        export: t(`${p}.export`),
        delete: t(`${p}.delete`),
        anonymize: t(`${p}.anonymize`),
        emailPlaceholder: t(`${p}.emailPlaceholder`),
        submit: t(`${p}.submit`),
        noRequests: t(`${p}.noRequests`),
      }}
    />
  );
}
