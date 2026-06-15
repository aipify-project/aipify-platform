import { ComplianceGovernanceCenterPanel } from "@/components/platform/compliance-governance-center";
import { buildComplianceGovernanceCenterLabels } from "@/lib/compliance-governance-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformComplianceGovernanceCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <ComplianceGovernanceCenterPanel
      backHref="/platform"
      labels={buildComplianceGovernanceCenterLabels(t)}
    />
  );
}
