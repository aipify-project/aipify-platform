import { PlaybookDetailPanel } from "@/components/app/app-portal/PlaybookDetailPanel";
import { buildPlaybooksLabels } from "@/lib/app-portal/playbooks";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type Props = { params: Promise<{ id: string }> };

export default async function PlaybookDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="p-6">
      <PlaybookDetailPanel playbookId={id} labels={buildPlaybooksLabels(t)} />
    </div>
  );
}
