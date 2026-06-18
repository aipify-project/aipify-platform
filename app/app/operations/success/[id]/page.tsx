import { SuccessValueDetailPanel } from "@/components/app/app-portal/SuccessValueDetailPanel";
import { buildSuccessValueLabels } from "@/lib/app-portal/success-value";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function SuccessValueDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <SuccessValueDetailPanel initiativeId={id} labels={buildSuccessValueLabels(t)} />
    </div>
  );
}
