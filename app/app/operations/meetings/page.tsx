import { MeetingsPanel } from "@/components/app/app-portal/MeetingsPanel";
import { buildMeetingsLabels } from "@/lib/app-portal/meetings";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MeetingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <MeetingsPanel labels={buildMeetingsLabels(t)} />
    </div>
  );
}
