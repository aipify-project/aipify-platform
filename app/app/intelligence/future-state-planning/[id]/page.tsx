import { FutureStatePlanningDetailPanel } from "@/components/app/app-portal/FutureStatePlanningDetailPanel";
import { buildFutureStatePlanningLabels } from "@/lib/app-portal/future-state-planning";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function FutureStatePlanningDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <FutureStatePlanningDetailPanel planId={id} labels={buildFutureStatePlanningLabels(t)} />
    </div>
  );
}
