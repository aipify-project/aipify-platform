import { EnterpriseBenchmarkingPanel } from "@/components/app/app-portal/EnterpriseBenchmarkingPanel";
import { buildEnterpriseBenchmarkingLabels } from "@/lib/app-portal/enterprise-benchmarking";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseBenchmarkingPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <EnterpriseBenchmarkingPanel labels={buildEnterpriseBenchmarkingLabels(t)} />
    </div>
  );
}
