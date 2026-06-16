import { StrategyExecutionDetailPanel } from "@/components/app/app-portal/StrategyExecutionDetailPanel";
import { buildStrategyExecutionLabels } from "@/lib/app-portal/strategy-execution";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function StrategyExecutionDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <StrategyExecutionDetailPanel initiativeId={id} labels={buildStrategyExecutionLabels(t)} />
    </div>
  );
}
