import { GlobalAnnouncementCenterPanel } from "@/components/platform/global-announcements";
import { buildGlobalAnnouncementLabels } from "@/lib/global-announcements";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAnnouncementCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <GlobalAnnouncementCenterPanel
      backHref="/platform"
      labels={buildGlobalAnnouncementLabels(t)}
    />
  );
}
