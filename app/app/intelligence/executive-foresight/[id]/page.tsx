import { ExecutiveForesightDetailPanel } from "@/components/app/app-portal/ExecutiveForesightDetailPanel";
import { buildExecutiveForesightLabels } from "@/lib/app-portal/executive-foresight";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function ExecutiveForesightDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <ExecutiveForesightDetailPanel observationId={id} labels={buildExecutiveForesightLabels(t)} />
    </div>
  );
}
