import { EnterpriseBenchmarkingDimensionPanel } from "@/components/app/app-portal/EnterpriseBenchmarkingDimensionPanel";
import { buildEnterpriseBenchmarkingLabels } from "@/lib/app-portal/enterprise-benchmarking";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ dimension: string }> };

export default async function EnterpriseBenchmarkingDimensionPage({ params }: Props) {
  const { dimension } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <EnterpriseBenchmarkingDimensionPanel labels={buildEnterpriseBenchmarkingLabels(t)} dimensionKey={dimension} />
    </div>
  );
}
