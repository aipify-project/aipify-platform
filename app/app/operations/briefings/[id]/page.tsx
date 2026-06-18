import { IntelligenceBriefingDetailPanel } from "@/components/app/app-portal/IntelligenceBriefingDetailPanel";
import { buildIntelligenceBriefingsLabels } from "@/lib/app-portal/intelligence-briefings";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function IntelligenceBriefingDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <IntelligenceBriefingDetailPanel briefingId={id} labels={buildIntelligenceBriefingsLabels(t)} />
    </div>
  );
}
