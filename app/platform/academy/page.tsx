import { AcademyStudioPanel } from "@/components/academy-studio";
import { buildAcademyStudioLabels } from "@/lib/academy-studio";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformAcademyPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <AcademyStudioPanel
      surface="platform"
      backHref="/platform"
      labels={buildAcademyStudioLabels(t, "platform.academyStudio")}
    />
  );
}
