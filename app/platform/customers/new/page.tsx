import { PlatformPortalCustomerCreationPanel } from "@/components/platform/platform-portal/PlatformPortalCustomerCreationPanel";
import { buildPlatformPortalCustomerCreationLabels } from "@/lib/platform-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomerCreationPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalCustomerCreationLabels(t);

  return <PlatformPortalCustomerCreationPanel labels={labels} locale={locale} />;
}
