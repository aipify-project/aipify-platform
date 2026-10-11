import { WebsiteKompisFeedbackOverviewPanel } from "@/components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WebsiteKompisFeedbackPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);
  const labels = buildWebsiteKompisFeedbackLabels(t);

  return <WebsiteKompisFeedbackOverviewPanel labels={labels} />;
}
