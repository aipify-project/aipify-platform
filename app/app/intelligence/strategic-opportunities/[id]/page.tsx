import { StrategicOpportunitiesDetailPanel } from "@/components/app/app-portal/StrategicOpportunitiesDetailPanel";
import { buildStrategicOpportunitiesLabels } from "@/lib/app-portal/strategic-opportunities";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function StrategicOpportunitiesDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <StrategicOpportunitiesDetailPanel opportunityId={id} labels={buildStrategicOpportunitiesLabels(t)} />
    </div>
  );
}
