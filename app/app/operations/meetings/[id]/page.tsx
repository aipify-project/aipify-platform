import { MeetingDetailPanel } from "@/components/app/app-portal/MeetingDetailPanel";
import { buildMeetingsLabels } from "@/lib/app-portal/meetings";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function MeetingDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <MeetingDetailPanel meetingId={id} labels={buildMeetingsLabels(t)} />
    </div>
  );
}
