import { PlatformPlaybookCenterPanel } from "@/components/platform/platform-playbook-center";
import { buildPlatformPlaybookCenterLabels } from "@/lib/platform-playbook-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPlaybookCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <PlatformPlaybookCenterPanel
      backHref="/platform"
      labels={buildPlatformPlaybookCenterLabels(t)}
    />
  );
}
