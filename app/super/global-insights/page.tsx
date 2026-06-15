import { VocGlobalInsightsPanel } from "@/components/super-admin/voice-of-the-customer";
import { buildVocGlobalInsightsLabels } from "@/lib/voice-of-the-customer";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SuperAdminGlobalInsightsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["superAdmin"]);
  const t = createTranslator(dict);

  return <VocGlobalInsightsPanel labels={buildVocGlobalInsightsLabels(t)} />;
}
