import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildUnonightAipifyConnectionLabels } from "@/lib/unonight-platform";
import { AipifyConnectionTokensPanel } from "@/components/unonight-admin/AipifyConnectionTokensPanel";

export default async function UnonightAipifyIntegrationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["unonightAdmin"]);
  const t = createTranslator(dict);
  const labels = buildUnonightAipifyConnectionLabels(t);

  return <AipifyConnectionTokensPanel labels={labels} />;
}
