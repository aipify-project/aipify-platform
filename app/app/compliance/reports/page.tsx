import { ComplianceReportsPanel } from "@/components/app/security-compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ComplianceReportsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.securityCompliance";

  return (
    <ComplianceReportsPanel
      labels={{
        title: t(`${p}.reportsTitle`),
        subtitle: t(`${p}.reportsSubtitle`),
        loading: t(`${p}.loading`),
        back: t(`${p}.backCompliance`),
        generate: t(`${p}.generate`),
        noReports: t(`${p}.noReports`),
      }}
    />
  );
}
