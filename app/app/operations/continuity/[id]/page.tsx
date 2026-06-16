import { ContinuityDetailPanel } from "@/components/app/app-portal/ContinuityDetailPanel";
import { buildContinuityLabels } from "@/lib/app-portal/continuity";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function ContinuityDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ContinuityDetailPanel planId={id} labels={buildContinuityLabels(t)} />
    </div>
  );
}
