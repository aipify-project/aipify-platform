import { TimeAttendancePanel } from "@/components/app/time-attendance";
import { buildTimeAttendanceLabels } from "@/lib/time-attendance-engine/labels";
import type { Ta609Section } from "@/lib/time-attendance-engine/config";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export async function TimeAttendanceSectionPage({ activeSection }: { activeSection: Ta609Section }) {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "timeAttendance");
  const t = createTranslator(dict);
  return <TimeAttendancePanel labels={buildTimeAttendanceLabels(t)} activeSection={activeSection} />;
}
