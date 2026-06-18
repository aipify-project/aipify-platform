import { AcademyStudioPanel } from "@/components/academy-studio";
import { buildAcademyStudioLabels } from "@/lib/academy-studio";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function GrowthPartnerAcademyPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["growthPartners"]);
  const t = createTranslator(dict);

  return (
    <AcademyStudioPanel
      surface="partner"
      backHref="/app/growth-partner-operations"
      labels={buildAcademyStudioLabels(t, "customerApp.growthPartnerAcademy")}
    />
  );
}
