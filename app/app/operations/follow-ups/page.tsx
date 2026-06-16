import { FollowUpsCenterPanel } from "@/components/app/app-portal/FollowUpsCenterPanel";
import { buildFollowUpsLabels } from "@/lib/app-portal/follow-ups";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function FollowUpsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <FollowUpsCenterPanel labels={buildFollowUpsLabels(t)} />
    </div>
  );
}
