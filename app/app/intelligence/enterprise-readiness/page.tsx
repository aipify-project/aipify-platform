import { EnterpriseReadinessPanel } from "@/components/app/app-portal/EnterpriseReadinessPanel";
import { buildEnterpriseReadinessLabels } from "@/lib/app-portal/enterprise-readiness";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseReadinessPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <EnterpriseReadinessPanel labels={buildEnterpriseReadinessLabels(t)} />
    </div>
  );
}
