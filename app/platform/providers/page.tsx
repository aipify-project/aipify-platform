import { PlatformVerifiedProvidersPanel } from "@/components/platform/platform-verified-providers";
import { buildVerifiedProviderLabels } from "@/lib/platform-verified-providers";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformVerifiedProvidersPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  return (
    <PlatformVerifiedProvidersPanel
      backHref="/platform"
      labels={buildVerifiedProviderLabels(createTranslator(dict))}
    />
  );
}
