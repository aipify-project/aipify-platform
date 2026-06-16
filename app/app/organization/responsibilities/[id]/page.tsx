import { ResponsibilityDetailPanel } from "@/components/app/app-portal/ResponsibilityDetailPanel";
import { buildResponsibilitiesLabels } from "@/lib/app-portal/responsibilities";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function ResponsibilityDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ResponsibilityDetailPanel responsibilityId={id} labels={buildResponsibilitiesLabels(t)} />
    </div>
  );
}
