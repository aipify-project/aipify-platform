import { PlatformPortalCustomersPanel } from "@/components/platform/platform-portal/PlatformPortalCustomersPanel";
import { buildPlatformPortalCustomersLabels } from "@/lib/platform-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformCustomersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalCustomersLabels(t);

  return <PlatformPortalCustomersPanel labels={labels} locale={locale} />;
}
