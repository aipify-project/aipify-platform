import { CommunicationDetailPanel } from "@/components/app/app-portal/CommunicationDetailPanel";
import { buildCommunicationsLabels } from "@/lib/app-portal/communications";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function CommunicationDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <CommunicationDetailPanel communicationId={id} labels={buildCommunicationsLabels(t)} />
    </div>
  );
}
