import { PlatformDeveloperPortalPanel } from "@/components/platform/platform-developer-ecosystem";
import { buildDeveloperPortalLabels } from "@/lib/platform-developer-ecosystem";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformDevelopersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  return (
    <PlatformDeveloperPortalPanel
      backHref="/platform"
      labels={buildDeveloperPortalLabels(createTranslator(dict))}
    />
  );
}
