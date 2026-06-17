import { OrgForecastingDetailPanel } from "@/components/app/app-portal/OrgForecastingDetailPanel";
import { buildOrgForecastingLabels } from "@/lib/app-portal/organizational-forecasting";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function OrgForecastingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <OrgForecastingDetailPanel forecastId={id} labels={buildOrgForecastingLabels(t)} />
    </div>
  );
}
