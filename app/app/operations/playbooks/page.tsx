import { PlaybooksPanel } from "@/components/app/app-portal/PlaybooksPanel";
import { buildPlaybooksLabels } from "@/lib/app-portal/playbooks";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlaybooksPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <PlaybooksPanel labels={buildPlaybooksLabels(t)} />
    </div>
  );
}
