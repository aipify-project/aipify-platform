import { SupportRequestDetailPanel } from "@/components/app/app-portal/SupportRequestDetailPanel";
import { buildSupportHistoryLabels } from "@/lib/app-portal/support-history";
import { buildSupportRequestsLabels } from "@/lib/app-portal/support-requests";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function SupportRequestDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <SupportRequestDetailPanel
        requestId={id}
        labels={buildSupportRequestsLabels(t)}
        historyLabels={buildSupportHistoryLabels(t)}
      />
    </div>
  );
}
