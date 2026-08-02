import { BillingAdminPanel } from "@/components/app/settings/BillingAdminPanel";
import {
  buildBillingPresentationMaps,
  buildBillingReferenceLabels,
} from "@/lib/commercial-packages";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BillingSettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings", "portalStructure"]);
  const t = createTranslator(dict);

  return (
    <BillingAdminPanel
      labels={buildBillingReferenceLabels(t)}
      locale={locale}
      presentation={buildBillingPresentationMaps(dict)}
    />
  );
}
