import { MobileApiIntegrationPanel } from "@/components/app/mobile-api-integration";
import { buildMobileApiIntegrationLabels } from "@/lib/mobile-api-integration/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MobileApiIntegrationPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings"]);
  const t = createTranslator(dict);
  const labels = buildMobileApiIntegrationLabels(t);

  return <MobileApiIntegrationPanel labels={labels} />;
}
