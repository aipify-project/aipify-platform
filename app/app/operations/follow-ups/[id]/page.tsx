import { FollowUpDetailPanel } from "@/components/app/app-portal/FollowUpDetailPanel";
import { buildFollowUpsLabels } from "@/lib/app-portal/follow-ups";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

type PageProps = { params: Promise<{ id: string }> };

export default async function FollowUpDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  return (
    <div className="mx-auto max-w-4xl p-6">
      <FollowUpDetailPanel followUpId={id} labels={buildFollowUpsLabels(t)} />
    </div>
  );
}
