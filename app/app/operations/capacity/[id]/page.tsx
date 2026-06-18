import { CapacityWorkloadDetailPanel } from "@/components/app/app-portal/CapacityWorkloadDetailPanel";
import { buildCapacityWorkloadLabels } from "@/lib/app-portal/capacity-workload";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function CapacityDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CapacityWorkloadDetailPanel recordId={id} labels={buildCapacityWorkloadLabels(t)} />
    </div>
  );
}
