import { PartnerAcademyPanel } from "@/components/partner-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPartnerAcademyLabels } from "@/lib/partner-academy/labels";

export default async function PartnerAcademyPage() {
  const dict = await getDictionary(await getLocale(), ["partnerAcademy"]);
  const t = createTranslator(dict);
  return <PartnerAcademyPanel labels={buildPartnerAcademyLabels(t)} />;
}
